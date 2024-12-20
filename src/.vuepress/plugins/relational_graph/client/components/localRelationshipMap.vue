<script setup lang="ts">
import { onMounted, ref, onUnmounted, nextTick } from "vue";
import { usePageData, useRouter, withBase } from "vuepress/client";
import * as d3 from "d3";

import { FORCE_CONFIG, STYLE_CONFIG, CANVAS_CONFIG } from "../graph_config.js";
import Graph from "./graph.vue";

interface Node {
  id: string;
  x: number;
  y: number;
  value: {
    title: string;
    path: string;
  };
  isCurrent?: boolean;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface PageData extends Record<string, unknown> {
  bioChainData?: {
    localMap?: GraphData;
  };
}

// 基础数据设置
const data = usePageData<PageData>();
const map_data = data.value?.bioChainData?.localMap;
const router = useRouter();
const containerRef = ref<HTMLDivElement | null>(null);
const graphRef = ref<typeof Graph | null>(null);

const containerWidth = ref(0);
const isLargeScreen = ref(false);
const isExpanded = ref(false);

const canvasSize = ref({
  width: 0,
  height: CANVAS_CONFIG.defaultHeight,
});

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
      containerWidth.value =
        document.documentElement.clientWidth - parentRect.left - 40;
    } else {
      containerWidth.value = parentRect.width - 40;
    }

    canvasSize.value = {
      width: containerWidth.value,
      height: CANVAS_CONFIG.defaultHeight,
    };
  }
}

// 添加切换折叠状态的方法
function toggleExpand() {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    nextTick(() => {
      updateContainerWidth();
    });
  }
}

// 处理节点点击
function handleNodeClick(node: Node) {
  if (!node.isCurrent) {
    router.push(withBase(node.value.path));
  }
}

onMounted(() => {
  if (!map_data) {
    console.warn("No map data available");
    return;
  }

  // 找到当前节点并标记
  const currentNode = map_data.nodes.find(
    (node) => node.value.path === router.currentRoute.value.path
  );

  if (currentNode) {
    currentNode.isCurrent = true;
    // 设置初始位置在中心
    currentNode.fx = canvasSize.value.width / 2;
    currentNode.fy = canvasSize.value.height / 2;
    // 1秒后释放固定位置
    setTimeout(() => {
      currentNode.fx = null;
      currentNode.fy = null;
    }, 1000);
  }

  // 初始化屏幕尺寸状态
  updateScreenSize();

  // 添加媒体查询监听器
  const mediaQuery = window.matchMedia("(min-width: 1440px)");
  mediaQuery.addEventListener("change", updateScreenSize);

  // 初始化容器宽度
  updateContainerWidth();

  // 监听窗口大小变化
  window.addEventListener("resize", updateContainerWidth);

  // 修改 ResizeObserver
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      updateContainerWidth();
    }
  });

  // 开始��察容器元素
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }

  // 在组件卸载时清理观察器
  onUnmounted(() => {
    window.removeEventListener("resize", updateContainerWidth);
    mediaQuery.removeEventListener("change", updateScreenSize);
    resizeObserver.disconnect();
  });
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
      <Graph
        ref="graphRef"
        :data="map_data"
        :width="canvasSize.width"
        :height="canvasSize.height"
        :current-path="router.currentRoute.value.path"
        @node-click="handleNodeClick"
      />
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

canvas {
  border: 1px solid rgb(60, 60, 67);
  margin: 0;
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
