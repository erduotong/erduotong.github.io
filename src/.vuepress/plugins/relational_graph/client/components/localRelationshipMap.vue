<script setup lang="js">
import {onMounted, ref, onUnmounted, nextTick} from "vue";
import {usePageData, useRouter, withBase} from "vuepress/client";
import RelationGraph from "./relationGraph.vue";


// 基础数据设置
const data = usePageData();
const map_data = data.value?.bioChainData?.localMap;

const router = useRouter();
const graphRef = ref(null);

// 处理节点点击事件
const handleNodeClick = (path) => {
  router.push(withBase(path));
};

const containerRef = ref(null);
const canvasSize = ref({
  width: 300,
  height: 300,
});
const containerWidth = ref(0);
const isLargeScreen = ref(false);
const isExpanded = ref(false);

// 添加媒体查询监听函数
function updateScreenSize() {
  isLargeScreen.value = window.matchMedia("(min-width: 1440px)").matches;
}

// 修改 updateContainerWidth 函数
function updateContainerWidth() {
  if (containerRef.value) {
    const parentElement = containerRef.value.parentElement;
    const parentRect = parentElement.getBoundingClientRect();

    if (isLargeScreen.value) {
      // 大屏幕时使用距离屏幕边距的算方式
      containerWidth.value = document.documentElement.clientWidth - parentRect.left - 40;
    } else {
      // 小屏幕时直接使用父元素宽度减40
      containerWidth.value = parentRect.width - 40;
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
  // 展开时需要重新计算和更新画布
  if (isExpanded.value) { // todo
    nextTick(() => {
      updateContainerWidth();
      if (window.simulation) {
        window.simulation.alpha(0.3).restart();
      }
    });
  }
}

let mediaQuery = null;
let resizeObserver = null;

onMounted(() => {
  // 初始化屏幕尺寸状态
  updateScreenSize();

  // 添加媒体查询监听器
  mediaQuery = window.matchMedia("(min-width: 1440px)");
  mediaQuery.addEventListener("change", updateScreenSize);

  // 初始化容器宽度
  updateContainerWidth();

  // 监听窗口大小变化
  window.addEventListener("resize", updateContainerWidth);

  // 修改 ResizeObserver
  resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      updateContainerWidth(); // 这里会同时处理画大小和力导向图的更新
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

  // 清理媒体查询监听器
  if (mediaQuery) {
    mediaQuery.removeEventListener("change", updateScreenSize);
  }

  // 清理 ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect();
  }

  // 停止力导向图模拟
  if (window.simulation) {
    window.simulation.stop();
  }
});
</script>

<template>
  <div class="graph-wrapper">
    <button v-if="!isLargeScreen" class="toggle-button" @click="toggleExpand">
      View Local Graph

      {{ isExpanded ? "▼" : "▶" }}
    </button>
    <div
      ref="containerRef"
      class="graph-container"
      :class="{ expanded: isExpanded || isLargeScreen }"
      :style="isLargeScreen ? { width: containerWidth + 'px' } : ''"
    >
      <relation-graph
        ref="graphRef"
        :canvas-height="canvasSize.height"
        :canvas-width="canvasSize.width"
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
</style>
