<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {usePageData, useRouter, withBase} from "vuepress/client";
import RelationGraph from "./relationGraph.vue";
import type {CanvasSize, MapNodeLink} from "../../types";

// 基础数据设置
const data = usePageData();
// @ts-ignore
const map_data = data.value?.bioChainData?.localMap as
  | MapNodeLink
  | undefined;

const router = useRouter();
const graphRef = ref<InstanceType<typeof RelationGraph> | null>(null);
const fullscreenGraphRef = ref<InstanceType<typeof RelationGraph> | null>(null);

// 处理节点点击事件
const handleNodeClick = (path: string) => {
  router.push(withBase(path));
};

const containerRef = ref<HTMLElement | null>(null);
const fullscreenContainerRef = ref<HTMLElement | null>(null);
const canvasSize = ref<CanvasSize>({
  width: 300,
  height: 300,
});
const containerWidth = ref<number>(0);
const isLargeScreen = ref<boolean>(false);
const isExpanded = ref<boolean>(false);
const fullscreenCanvasSize = ref<CanvasSize>({
  width: 800,
  height: 600,
});

function updateScreenSize() {
  isLargeScreen.value = window.matchMedia("(min-width: 1440px)").matches;
}

function updateContainerWidth() {
  if (containerRef.value) {
    const parentElement = containerRef.value.parentElement;
    if (!parentElement) return;

    const parentRect = parentElement.getBoundingClientRect();
    const parentStyle = window.getComputedStyle(parentElement);
    const parentPadding =
      parseFloat(parentStyle.paddingLeft) +
      parseFloat(parentStyle.paddingRight);

    if (isLargeScreen.value) {
      // 大屏幕时使用距离屏幕边距的算方式
      containerWidth.value = Math.max(
        300,
        document.documentElement.clientWidth - parentRect.left - 40
      );
    } else {
      // 小屏幕时考虑父元素的内边距
      containerWidth.value = Math.max(
        300,
        parentRect.width - parentPadding - 20
      );
    }

    // 更新 canvasSize
    canvasSize.value = {
      width: containerWidth.value,
      height: 300,
    };

    // 重启模拟程序
    nextTick(() => {
      graphRef.value?.restartSimulation();
    });
  }
}

// 添加切换折叠状态的方法
function toggleExpand() {
  isExpanded.value = !isExpanded.value;
  // 展开时��要重新计算和更新画布
  if (isExpanded.value) {
    nextTick(() => {
      updateContainerWidth();
      graphRef.value?.restartSimulation();
    });
  }
}

let mediaQuery: MediaQueryList | null = null;
let resizeObserver: ResizeObserver | null = null;

const updateFullscreenSize = () => {
  if (fullscreenContainerRef.value) {
    const rect = fullscreenContainerRef.value.getBoundingClientRect();
    fullscreenCanvasSize.value = {
      width: Math.floor(rect.width),
      height: Math.floor(rect.height),
    };
    // 重启力导向图模拟
    nextTick(() => {
      if (fullscreenGraphRef.value) {
        fullscreenGraphRef.value.restartSimulation();
      }
    });
  }
};

onMounted(() => {
  // 初始化屏幕尺寸状态
  updateScreenSize();

  // 添加媒体查询监听器
  mediaQuery = window.matchMedia("(min-width: 1440px)");
  mediaQuery.addEventListener("change", updateScreenSize);

  // 初始化容器宽度并确保DOM渲染完成
  nextTick(() => {
    updateContainerWidth();
    // 重启力导向图模拟
    graphRef.value?.restartSimulation();
  });

  // 监听窗口大小变化
  window.addEventListener("resize", updateContainerWidth);

  // 修改 ResizeObserver
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === containerRef.value) {
        updateContainerWidth();
      } else if (entry.target === fullscreenContainerRef.value) {
        updateFullscreenSize();
        // 重启力导向图模拟
        nextTick(() => {
          fullscreenGraphRef.value?.restartSimulation();
        });
      }
    }
  });

  // 开始观察容器元素
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }
});

// 在组件卸载时清理所有事件监听器和观察器
onUnmounted(() => {
  // 清理窗口事件监听器
  window.removeEventListener("resize", updateContainerWidth);
  window.removeEventListener("resize", updateFullscreenSize);

  // 清理媒体查询监听器
  if (mediaQuery) {
    mediaQuery.removeEventListener("change", updateScreenSize);
  }

  // 清理 ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect();
  }

  // 停止力导向图模拟
  // @ts-ignore
  graphRef.value?.stopSimulation?.();
});
const isLocalGraphFullScreen = ref(false);

// 监听全屏状态变化
watch(isLocalGraphFullScreen, (value) => {
  if (value) {
    // 添加窗口大小变化监听
    window.addEventListener("resize", updateFullscreenSize);
    // 等待组件挂载完成后再计算尺寸
    nextTick(() => {
      if (fullscreenContainerRef.value) {
        updateFullscreenSize();
        // 然后再添加观察器
        if (resizeObserver) {
          resizeObserver.observe(fullscreenContainerRef.value);
        }
      }
    });
  } else {
    // 移除窗口大小变化监听
    window.removeEventListener("resize", updateFullscreenSize);
    if (fullscreenContainerRef.value && resizeObserver) {
      resizeObserver.unobserve(fullscreenContainerRef.value);
    }
  }
});
</script>

<template>
  <div class="graph-wrapper">
    <button v-if="!isLargeScreen" class="toggle-button" @click="toggleExpand">
      查看关系图谱
      {{ isExpanded ? "▼" : "▶" }}
    </button>
    <div
      ref="containerRef"
      class="graph-container"
      :class="{ expanded: isExpanded || isLargeScreen }"
      :style="isLargeScreen ? { width: containerWidth + 'px' } : ''"
    >
      <button
        class="fullscreen-map-button"
        @click="isLocalGraphFullScreen = true"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <relation-graph
        ref="graphRef"
        :canvas-height="canvasSize.height"
        :canvas-width="canvasSize.width"
        :current-path="router.currentRoute.value.path"
        :data="map_data"
        @node-click="handleNodeClick"
        v-if="!isLocalGraphFullScreen"
      ></relation-graph>
    </div>
  </div>

  <div
    id="fullscreen-graph-mask"
    @click.self="isLocalGraphFullScreen = false"
    v-if="isLocalGraphFullScreen"
  >
    <div id="fullscreen-graph-container" ref="fullscreenContainerRef">
      <button
        @click="isLocalGraphFullScreen = false"
        class="fullscreen-map-button"
      >
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
        ref="fullscreenGraphRef"
        :canvas-height="fullscreenCanvasSize.height"
        :canvas-width="fullscreenCanvasSize.width"
        :current-path="router.currentRoute.value.path"
        :data="map_data"
        @node-click="handleNodeClick"
      ></relation-graph>
    </div>
  </div>
</template>

<style scoped>
.toggle-button {
  display: block;
  width: 100%;
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 8px;
  text-align: left;
  padding: 8px 8px 8px 16px;
  font-weight: 600;
}

.graph-container {
  height: 300px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

@media (max-width: 1439px) {
  .graph-container {
    width: 100%;
    height: 0;
    overflow: hidden;
    opacity: 0;
    padding: 2px;
  }

  .graph-container.expanded {
    height: 300px;
    padding-top: 10px;
    opacity: 1;
  }

  canvas {
    position: relative !important;
  }
}

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
  z-index: 2;
}

@media (max-width: 1439px) {
  .fullscreen-map-button {
    top: 16px;
    right: 24px;
  }
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

#fullscreen-graph-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);

  z-index: 1000;
}

#fullscreen-graph-container {
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
