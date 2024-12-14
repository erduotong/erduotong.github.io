<script setup lang="js">
import {onMounted, ref} from "vue";
import {usePageData, useRouter, withBase} from "vuepress/client";
import * as d3 from "d3";

// 常量配置
const CANVAS_CONFIG = {
  height: 300,
  width: 300,
  nodeRadius: 5,
  nodePadding: 5,
  zoomExtent: [0.1, 10],
  nodeClickRadius: 15,
};

// 力导向图配置
const FORCE_CONFIG = {
  link: d3.forceLink().id(d => d.id)
      .distance(50)
      .strength(0.5),
  charge: d3.forceManyBody()
      .strength(-150)
      .distanceMin(10)
      .distanceMax(100),
  center: d3.forceCenter(CANVAS_CONFIG.width / 2, CANVAS_CONFIG.height / 2)
      .strength(0.01),
};

// 样式配置
const STYLE_CONFIG = {
  link: {
    color: "#aaa",
  },
  node: {
    fill: "#69b3a2",
    stroke: "#fff",
  },
  text: {
    color: "#fff",
    font: "10px Arial",
    offset: -10,
  },
};

// 基础数据设置
const data = usePageData();
const map_data = data.value?.bioChainData?.localMap;
const canvasRef = ref(null);
const router = useRouter();

onMounted(() => {
  if (!map_data) {
    return;
  }

  // 初始化变量
  const canvas = canvasRef.value;
  const context = canvas.getContext("2d");
  let isDragging = false;
  let draggingNode = null;
  let transform = d3.zoomIdentity;

  // 初始化力导向图
  const simulation = initializeSimulation();

  // 设置事件监听
  setupEventListeners();

  // 力导向图初始化
  function initializeSimulation() {
    return d3.forceSimulation(map_data.nodes)
        .force("link", FORCE_CONFIG.link.links(map_data.links))
        .force("charge", FORCE_CONFIG.charge)
        .force("center", FORCE_CONFIG.center)
        .on("tick", ticked);
  }

  // 事件监听器设置
  function setupEventListeners() {
    const zoom = d3.zoom()
        .scaleExtent(CANVAS_CONFIG.zoomExtent)
        .filter(event => filterZoomEvent(event))
        .on("zoom", event => {
          transform = event.transform;
          ticked();
        });

    d3.select(canvas).call(zoom);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("click", onClick);
  }

  // 事件处理函数
  function filterZoomEvent(event) {
    if (event.type === "mousedown") {
      const [x, y] = transform.invert(d3.pointer(event, canvas));
      return !isMouseOverNode(x, y) && !draggingNode;
    }
    return true;
  }

  function onMouseDown(event) {
    const [x, y] = transform.invert(d3.pointer(event));
    draggingNode = simulation.find(x, y, CANVAS_CONFIG.nodeClickRadius);

    if (draggingNode) {
      event.stopPropagation();
      document.body.style.userSelect = "none";
      draggingNode.fx = x;
      draggingNode.fy = y;
      simulation.alphaTarget(0.3).restart();

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
  }

  function onMouseMove(event) {
    if (!draggingNode) {
      return;
    }

    const [x, y] = getTransformedMousePosition(event);
    const boundedPosition = getBoundedPosition(x, y);

    updateDraggingNodePosition(boundedPosition);
    isDragging = true;
    simulation.alphaTarget(0.3);
    event.preventDefault();
  }

  function onMouseUp() {
    if (draggingNode) {
      draggingNode.fx = null;
      draggingNode.fy = null;
      document.body.style.userSelect = "";
      draggingNode = null;
      simulation.alphaTarget(0).alpha(0.3);

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
  }

  // 辅助函数
  function getTransformedMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return transform.invert([x, y]);
  }

  function getBoundedPosition(x, y) {
    const bounds = {
      left: -transform.x / transform.k,
      top: -transform.y / transform.k,
      right: (CANVAS_CONFIG.width - transform.x) / transform.k,
      bottom: (CANVAS_CONFIG.height - transform.y) / transform.k,
    };

    return {
      x: Math.max(bounds.left + CANVAS_CONFIG.nodePadding,
          Math.min(bounds.right - CANVAS_CONFIG.nodePadding, x)),
      y: Math.max(bounds.top + CANVAS_CONFIG.nodePadding,
          Math.min(bounds.bottom - CANVAS_CONFIG.nodePadding, y)),
    };
  }

  function updateDraggingNodePosition({
                                        x,
                                        y,
                                      }) {
    draggingNode.x = x;
    draggingNode.y = y;
    draggingNode.fx = x;
    draggingNode.fy = y;
  }

  // 渲染相关函数
  function ticked() {
    context.clearRect(0, 0, CANVAS_CONFIG.width, CANVAS_CONFIG.height);
    context.save();
    applyTransform();
    drawLinks();
    drawNodes();
    drawLabels();
    context.restore();
  }

  function applyTransform() {
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);
  }

  function drawLinks() {
    context.beginPath();
    map_data.links.forEach(drawLink);
    context.strokeStyle = STYLE_CONFIG.link.color;
    context.stroke();
  }

  function drawNodes() {
    context.beginPath();
    map_data.nodes.forEach(drawNode);
    context.fillStyle = STYLE_CONFIG.node.fill;
    context.fill();
    context.strokeStyle = STYLE_CONFIG.node.stroke;
    context.stroke();
  }

  function drawLabels() {
    if (transform.k > 1) {
      context.fillStyle = STYLE_CONFIG.text.color;
      context.font = STYLE_CONFIG.text.font;
      map_data.nodes.forEach(node => {
        const textWidth = context.measureText(node.value.title).width;
        context.fillText(
            node.value.title,
            node.x - textWidth / 2,
            node.y + STYLE_CONFIG.text.offset,
        );
      });
    }
  }

  function drawLink(d) {
    context.moveTo(d.source.x, d.source.y);
    context.lineTo(d.target.x, d.target.y);
  }

  function drawNode(d) {
    context.moveTo(d.x + CANVAS_CONFIG.nodeRadius, d.y);
    context.arc(d.x, d.y, CANVAS_CONFIG.nodeRadius, 0, 2 * Math.PI);
  }

  function isMouseOverNode(x, y) {
    return map_data.nodes.some(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < CANVAS_CONFIG.nodeClickRadius;
    });
  }

  function onClick(event) {
    const [graphX, graphY] = getTransformedMousePosition(event);
    const clickedNode = findClickedNode(graphX, graphY);

    if (clickedNode && !isDragging) {
      router.push(withBase(clickedNode.value.path));
    } else {
      isDragging = false;
    }
  }

  function findClickedNode(x, y) {
    return map_data.nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < CANVAS_CONFIG.nodeClickRadius;
    });
  }
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
