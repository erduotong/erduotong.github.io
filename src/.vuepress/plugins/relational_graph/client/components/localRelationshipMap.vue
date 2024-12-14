<script setup>
import { onMounted, ref } from "vue";
import { usePageData, useRouter } from "vuepress/client";
import * as d3 from "d3";
import { CANVAS_CONFIG } from '../config/graphConfig';
import { EventHandler } from '../utils/eventHandlers';
import { GraphRenderer } from '../utils/renderer';
import { isPathMatch } from '../utils/helpers';

const data = usePageData();
const map_data = data.value?.bioChainData?.localMap;
const canvasRef = ref(null);
const router = useRouter();

onMounted(() => {
  if (!map_data) return;

  const canvas = canvasRef.value;
  const context = canvas.getContext("2d");
  const transform = d3.zoomIdentity;
  
  // 初始化渲染器
  const renderer = new GraphRenderer(context, transform);
  
  // 初始化事件处理器
  const eventHandler = new EventHandler(canvas, simulation, transform, router);
  
  // 设置事件监听和初始化力导向图
  // 简化后的主要逻辑...
});
</script>

<template>
  <canvas
    ref="canvasRef"
    :width="CANVAS_CONFIG.width"
    :height="CANVAS_CONFIG.height"
  ></canvas>
</template>

<style scoped>
canvas {
  border: 1px solid white;
  margin: 10px;
  border-radius: 5px;
}
</style>
