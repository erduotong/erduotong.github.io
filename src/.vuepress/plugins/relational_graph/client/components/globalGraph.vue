<script setup lang="ts">
import {computed, nextTick, Ref, ref, watch} from "vue";
import {getGlobalGraph, showGlobalGraph} from "../useGlobalGraph.js";
import {CanvasSize, MapNodeLink} from "../../types/index.js";
import RelationGraph from "./relationGraph.vue";
import {useRouter, withBase} from "vuepress/client";

declare const __VUEPRESS_DEV__: boolean;
const options = computed(() => {
  return {
    isDev: __VUEPRESS_DEV__,
  };
});
const first_loaded = ref(false);
const data: Ref<MapNodeLink | null> = ref(null);
let is_loading = false;
let resizeObserver: ResizeObserver | null = null;
const containerRef = ref<HTMLElement | null>(null);
const graphRef = ref<InstanceType<typeof RelationGraph> | null>(null);
const canvasSize = ref<CanvasSize>({
  width: 800,
  height: 600,
});
const router = useRouter();

const isLoading = computed(() => !first_loaded.value && !data.value);
const hasError = computed(() => first_loaded.value && !data.value);

/**
 * 获取全局图数据 如果已经获取过则直接返回
 */
async function getGlobalGraphData() {
  if (data.value || is_loading) return;

  try {
    is_loading = true;
    data.value = await getGlobalGraph(options.value.isDev);
  } finally {
    is_loading = false;
    first_loaded.value = true;
  }
}

/**
 * 重新加载数据
 */
const reloadData = async () => {
  first_loaded.value = false;
  data.value = null;
  await getGlobalGraphData();
};

// 更新画布尺寸的函数
const updateCanvasSize = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect();
    canvasSize.value = {
      width: Math.floor(rect.width),
      height: Math.floor(rect.height),
    };
    // 重启力导向图模拟
    nextTick(() => {
      if (graphRef.value) {
        graphRef.value.restartSimulation();
      }
    });
  }
};

// 清理资源的函数
const cleanup = () => {
  // 清理窗口事件监听器
  window.removeEventListener("resize", updateCanvasSize);
  // 清理 ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  // 停止力导向图模拟
  // @ts-ignore
  graphRef.value?.stopSimulation?.();
};

// 初始化资源的函数
const initialize = () => {
  // 加窗口大小变化监听
  window.addEventListener("resize", updateCanvasSize);

  // 初始化 ResizeObserver
  resizeObserver = new ResizeObserver(() => {
    updateCanvasSize();
  });

  // 开始观察容器元素
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }

  // 初始计算尺寸
  nextTick(() => {
    updateCanvasSize();
  });
};

watch(
    showGlobalGraph,
    async (newValue) => {
      if (newValue) {
        await getGlobalGraphData();
        initialize();
      } else {
        cleanup();
      }
    },
    {immediate: true}
);

const handleNodeClick = (path: string) => {
  router.push(withBase(path));
  showGlobalGraph.value = false;
};
</script>

<template>
  <div
      id="globalGraphMask"
      v-if="showGlobalGraph"
      @click.self="showGlobalGraph = false"
  >
    <div id="globalGraphContainer" ref="containerRef">
      <button class="fullscreen-map-button" @click="showGlobalGraph = false">
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
          <path
              d="M15 16L9 8"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
          <path
              d="M9 16L15 8"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- 加载动画 -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="hasError" class="error-container">
        <svg
            class="error-icon"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M14 11.9976C14 9.5059 11.683 7 8.85714 7C8.52241 7 7.41904 7.00001 7.14286 7.00001C4.30254 7.00001 2 9.23752 2 11.9976C2 14.376 3.70973 16.3664 6 16.8714C6.36756 16.9525 6.75006 16.9952 7.14286 16.9952"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
          <path
              d="M16.8571 6.99996C17.2499 6.99996 17.6324 7.04275 18 7.1238C20.2903 7.62881 22 9.61917 22 11.9976C22 13.4395 21.3716 14.7388 20.3664 15.651"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
          <path
              d="M10.0002 11.9976C10.0002 14.4893 12.3172 16.9952 15.1431 16.9952"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
          <path
              d="M18 22.2426L20.1213 20.1213M20.1213 20.1213L22.2426 18M20.1213 20.1213L18 18M20.1213 20.1213L22.2426 22.2426"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
        </svg>
        <p class="error-text">数据加载失败</p>
        <button class="retry-button" @click="reloadData">重新加载</button>
      </div>

      <relation-graph
          ref="graphRef"
          v-if="data"
          :data="data"
          :canvas-width="canvasSize.width"
          :canvas-height="canvasSize.height"
          :current-path="router.currentRoute.value.path"
          @node-click="handleNodeClick"
      ></relation-graph>
    </div>
  </div>
</template>

<style scoped>
.fullscreen-map-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;
  z-index: 10;
}

.fullscreen-map-button:hover {
  background: var(--vp-c-bg-soft);
  transform: scale(1.05);
}

.fullscreen-map-button svg {
  width: 16px;
  height: 16px;
  opacity: 0.75;
}

.fullscreen-map-button:hover svg {
  opacity: 1;
}

#globalGraphMask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

#globalGraphContainer {
  position: fixed;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  background-color: var(--vp-c-bg);
  z-index: 1001;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--vp-c-text-1);
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid transparent;
  border-radius: 50%;
  border-top-color: var(--vp-c-brand);
  border-right-color: var(--vp-c-brand);
  animation: loading-spin 0.8s linear infinite;
}

@keyframes loading-spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--vp-c-text-1);
}

.error-text {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.retry-button {
  padding: 8px 16px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-accent);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  background: var(--vp-c-bg-soft);
  transform: scale(1.05);
}

.error-icon {
  width: 48px;
  height: 48px;
  color: var(--vp-c-text-1);
}
</style>