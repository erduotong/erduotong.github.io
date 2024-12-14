<script setup lang="js">
import {onMounted, ref} from "vue";
import {usePageData} from "vuepress/client";
import * as d3 from "d3";

const data = usePageData();
const map_data = data.value?.bioChainData?.localMap;

const canvasRef = ref(null);
const height = 600;
const width = 600;

const forces = {
  link: d3.forceLink().id(d => d.id).strength(1),
  charge: d3.forceManyBody().strength(-500),
  center: d3.forceCenter(width / 2, height / 2),
};

onMounted(() => {
  if (map_data) {
    const canvas = canvasRef.value;
    const context = canvas.getContext("2d");

    const simulation = d3.forceSimulation(map_data.nodes)
        .force("link", forces.link.links(map_data.links))
        .force("charge", forces.charge)
        .force("center", forces.center)
        .on("tick", ticked);

    let draggingNode = null;

    canvas.addEventListener("mousedown", onMouseDown);

    function onMouseDown(event) {
      event.preventDefault(); // 防止文本选择
      const [x, y] = d3.pointer(event);
      draggingNode = simulation.find(x, y, 5);
      if (draggingNode) {
        draggingNode.fx = draggingNode.x;
        draggingNode.fy = draggingNode.y;
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      }
    }

function onMouseMove(event) {
  if (draggingNode) {
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    x = Math.max(0, Math.min(width, x));
    y = Math.max(0, Math.min(height, y));
    draggingNode.fx = x;
    draggingNode.fy = y;

    // 重新启动力模拟
    simulation.alpha(1).restart();

    event.preventDefault(); // 防止文本选择
  }
}

    function onMouseUp(event) {
      event.preventDefault(); // 防止文本选择
      if (draggingNode) {
        draggingNode.fx = null;
        draggingNode.fy = null;
        draggingNode = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      }
    }

    function ticked() {
      context.clearRect(0, 0, width, height);

      context.beginPath();
      map_data.links.forEach(drawLink);
      context.strokeStyle = "#aaa";
      context.stroke();

      context.beginPath();
      map_data.nodes.forEach(drawNode);
      context.fillStyle = "#69b3a2";
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();
    }

    function drawLink(d) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }

    function drawNode(d) {
      context.moveTo(d.x + 3, d.y);
      context.arc(d.x, d.y, 5, 0, 2 * Math.PI);
    }
  }
});
</script>

<template>
  <canvas ref="canvasRef" :width="width" :height="height"></canvas>
</template>

<style scoped>
canvas {
  border: 1px solid white;
  margin: 10px;
  border-radius: 5px;
}
</style>
