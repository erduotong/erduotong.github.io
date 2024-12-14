<script setup lang="js">
import {onMounted, ref} from "vue";
import {usePageData, useRouter, withBase} from "vuepress/client";
import * as d3 from "d3";

const data = usePageData();
const map_data = data.value?.bioChainData?.localMap;

const canvasRef = ref(null);
const height = 300;
const width = 300;

const forces = {
  link: d3.forceLink().id(d => d.id),
  charge: d3.forceManyBody().strength(-300),
  center: d3.forceCenter(width / 2, height / 2),
};

const router = useRouter();
const currentPath = router.currentRoute.value.path;


onMounted(() => {
  if (map_data) {
    const canvas = canvasRef.value;
    const context = canvas.getContext("2d");
  let isDragging = false;
    const simulation = d3.forceSimulation(map_data.nodes)
        .force("link", forces.link.links(map_data.links))
        .force("charge", forces.charge)
        .force("center", forces.center)
        .on("tick", ticked);

    let draggingNode = null;
    let transform = d3.zoomIdentity;

    function isMouseOverNode(x, y) {
      return map_data.nodes.some(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 15;
      });
    }

    const zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .filter((event) => {
          const [x, y] = transform.invert(d3.pointer(event, canvas));
          return !isMouseOverNode(x, y) && !draggingNode;
        })
        .on("zoom", (event) => {
          transform = event.transform;
          ticked();
        });

    d3.select(canvas).call(zoom);

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("click", onClick); // 添加点击事件监听
    function onMouseDown(event) {
      const [x, y] = transform.invert(d3.pointer(event));
      draggingNode = simulation.find(x, y, 15);
      document.body.style.userSelect = "none";
      if (draggingNode) {
        event.stopPropagation(); // 阻止缩放事件
        draggingNode.fx = x;
        draggingNode.fy = y;
        simulation.alphaTarget(0.3).restart();
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      }
    }

    function onMouseMove(event) {
      if (draggingNode) {
        const rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        [x, y] = transform.invert([x, y]);
        draggingNode.fx = x;
        draggingNode.fy = y;
isDragging = true;
        event.preventDefault();
      }
    }

    function onMouseUp(event) {
      if (draggingNode) {
        draggingNode.fx = null;
        document.body.style.userSelect = "";
        draggingNode.fy = null;
        draggingNode = null;
        simulation.alphaTarget(0);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      }
    }

    function ticked() {
      context.clearRect(0, 0, width, height);

      context.save();
      context.translate(transform.x, transform.y);
      context.scale(transform.k, transform.k);

      context.beginPath();
      map_data.links.forEach(drawLink);
      context.strokeStyle = "#aaa";
      context.stroke();

      context.beginPath();
      map_data.nodes.forEach((node) => {
        drawNode(node);
      });
      context.fillStyle = "#69b3a2";
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();

      if (transform.k > 1) { // 设置缩放阈值，例如2
        context.fillStyle = "#fff";
        context.font = "10px Arial";
        map_data.nodes.forEach((node) => {
          const textWidth = context.measureText(node.value.title).width;
          context.fillText(node.value.title, node.x - textWidth / 2, node.y - 10); // 位于节点正上方
        });
      }

      context.restore();
    }

    function drawLink(d) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }

    function drawNode(d) {


      context.moveTo(d.x + 3, d.y);
      context.arc(d.x, d.y, 5, 0, 2 * Math.PI);
    }


    function onClick(event) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const [graphX, graphY] = transform.invert([mouseX, mouseY]);

      const clickedNode = map_data.nodes.find(node => {
        const dx = node.x - graphX;
        const dy = node.y - graphY;
        return Math.sqrt(dx * dx + dy * dy) < 15;
      });

      if (clickedNode && !isDragging) {
        router.push(withBase(clickedNode.value.path));
      }
      else{
        isDragging = false;
      }
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
