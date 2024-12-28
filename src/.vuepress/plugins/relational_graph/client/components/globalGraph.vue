<script setup lang="ts">
import {computed, nextTick, Ref, ref, watch,} from "vue";
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
  }
}

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
  // 添加窗口大小变化监听
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
</style>
