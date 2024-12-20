<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import * as d3 from "d3";
import { FORCE_CONFIG, STYLE_CONFIG, CANVAS_CONFIG } from "../graph_config.js";
import { PropType } from "vue";

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

const props = defineProps({
  data: {
    type: Object as PropType<GraphData>,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  currentPath: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "nodeClick", node: Node): void;
  (e: "tick"): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const hoveredNode = ref<Node | null>(null);
const transform = ref(d3.zoomIdentity);
const mouseDownTime = ref(0);
const mouseDownPosition = ref({
  x: 0,
  y: 0,
});

let isDragging = ref(false);
let draggingNode = ref<Node | null>(null);
let simulation = ref<d3.Simulation<Node, Link> | null>(null);

// 初始化力导向图
function initializeSimulation() {
  // 创建一个 center force
  const centerForce = d3
    .forceCenter(props.width / 2, props.height / 2)
    .strength(0.01);

  // 处理节点和连接的引用关系
  const nodes = props.data.nodes;
  const links = props.data.links.map((link) => ({
    source:
      typeof link.source === "string"
        ? nodes.find((n) => n.id === link.source)
        : link.source,
    target:
      typeof link.target === "string"
        ? nodes.find((n) => n.id === link.target)
        : link.target,
  }));

  // 初始化节点位置（如果没有位置信息）
  nodes.forEach((node) => {
    if (typeof node.x === "undefined") {
      node.x = props.width / 2 + (Math.random() - 0.5) * 100;
    }
    if (typeof node.y === "undefined") {
      node.y = props.height / 2 + (Math.random() - 0.5) * 100;
    }
  });

  const sim = d3
    .forceSimulation(nodes)
    .force("link", FORCE_CONFIG.link.links(links))
    .force("charge", FORCE_CONFIG.charge)
    .force("center", centerForce)
    .on("tick", () => {
      render();
    });

  return sim;
}

onMounted(() => {
  if (!props.data || !props.data.nodes || !props.data.links) {
    console.warn("Invalid graph data", props.data);
    return;
  }

  console.log("Initializing graph with data:", props.data);

  nextTick(() => {
    // 初始化力导向图
    simulation.value = initializeSimulation();
    console.log("Simulation initialized:", simulation.value);

    // 设置事件监听
    setupEventListeners();

    // 添加 CSS 变量观察器
    const observer = new MutationObserver(() => {
      render();
    });

    // 观察 html 元素的 style 属性变化
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class", "data-theme"],
    });

    // 立即进行首次渲染
    render();

    // 在组件卸载时清理
    onUnmounted(() => {
      if (simulation.value) {
        simulation.value.stop();
      }
      observer.disconnect();
    });
  });
});

// 获取主题颜色函数
function getThemeColors() {
  const root = getComputedStyle(document.documentElement);
  return {
    accent: root.getPropertyValue("--vp-c-accent").trim(),
    text: root.getPropertyValue("--vp-c-text").trim(),
  };
}

// 绘制连接线函数
function drawLink(d: { source: Node; target: Node }) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.moveTo(d.source.x, d.source.y);
  context.lineTo(d.target.x, d.target.y);
}

// 绘制节点函数
function drawNode(d: Node, radius: number) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.moveTo(d.x + radius, d.y);
  context.arc(d.x, d.y, radius, 0, 2 * Math.PI);
}

// 绘制所有连接线
function drawLinks() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  const { accent } = getThemeColors();
  const currentNode = props.data.nodes.find((d) => d.isCurrent);

  props.data.links.forEach((link) => {
    context.beginPath();
    const sourceNode =
      typeof link.source === "object"
        ? link.source
        : props.data.nodes.find((n) => n.id === link.source);
    const targetNode =
      typeof link.target === "object"
        ? link.target
        : props.data.nodes.find((n) => n.id === link.target);

    if (!sourceNode || !targetNode) return;

    drawLink({
      source: sourceNode,
      target: targetNode,
    });

    // 判断是否与当前节点相连
    const isConnectedToCurrent =
      currentNode && (sourceNode === currentNode || targetNode === currentNode);
    // 判断是否与悬停节点相连
    const isConnectedToHovered =
      hoveredNode.value &&
      (sourceNode === hoveredNode.value || targetNode === hoveredNode.value);

    if (isConnectedToCurrent || isConnectedToHovered) {
      context.strokeStyle = accent;
      context.globalAlpha = STYLE_CONFIG.link.highlightOpacity;
    } else {
      context.strokeStyle = STYLE_CONFIG.link.color;
      context.globalAlpha = hoveredNode.value
        ? STYLE_CONFIG.link.normalOpacity
        : STYLE_CONFIG.link.highlightOpacity;
    }

    context.stroke();
  });
  context.globalAlpha = 1;
}

// 绘制所有节点
function drawNodes() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  const { accent, text } = getThemeColors();
  const currentNode = props.data.nodes.find((d) => d.isCurrent);

  // 获取与悬停点相连的点
  const connectedNodes = new Set<Node>();
  if (hoveredNode.value) {
    props.data.links.forEach((link) => {
      if (link.source === hoveredNode.value) {
        connectedNodes.add(
          typeof link.target === "object"
            ? link.target
            : props.data.nodes.find((n) => n.id === link.target)
        );
      }
      if (link.target === hoveredNode.value) {
        connectedNodes.add(
          typeof link.source === "object"
            ? link.source
            : props.data.nodes.find((n) => n.id === link.source)
        );
      }
    });
  }

  // 获取与当前节点相连的点
  const connectedToCurrent = new Set<Node>();
  if (currentNode) {
    props.data.links.forEach((link) => {
      if (typeof link.source === "object" && link.source === currentNode) {
        connectedToCurrent.add(
          typeof link.target === "object"
            ? link.target
            : props.data.nodes.find((n) => n.id === link.target)
        );
      }
      if (typeof link.target === "object" && link.target === currentNode) {
        connectedToCurrent.add(
          typeof link.source === "object"
            ? link.source
            : props.data.nodes.find((n) => n.id === link.source)
        );
      }
    });
  }

  // 先绘制普通节点
  context.beginPath();
  props.data.nodes
    .filter(
      (d) =>
        !d.isCurrent && d !== hoveredNode.value && !connectedToCurrent.has(d)
    )
    .forEach((d) => {
      drawNode(d, CANVAS_CONFIG.nodeRadius);
    });
  context.fillStyle = text;
  context.globalAlpha = hoveredNode.value
    ? STYLE_CONFIG.node.normalOpacity
    : STYLE_CONFIG.node.highlightOpacity;
  context.fill();

  // 绘制与当前节点相连的节点
  if (connectedToCurrent.size > 0) {
    context.beginPath();
    Array.from(connectedToCurrent).forEach((d) => {
      if (d !== hoveredNode.value) {
        drawNode(d, CANVAS_CONFIG.nodeRadius);
      }
    });
    context.fillStyle = text;
    context.globalAlpha = STYLE_CONFIG.node.highlightOpacity;
    context.fill();
  }

  // 如果有悬停节点，绘制与其相连的节点
  if (hoveredNode.value) {
    context.beginPath();
    Array.from(connectedNodes).forEach((d) => {
      if (!d.isCurrent) {
        drawNode(d, CANVAS_CONFIG.nodeRadius);
      }
    });
    context.fillStyle = text;
    context.globalAlpha = STYLE_CONFIG.node.highlightOpacity;
    context.fill();
  }

  // 绘制悬停节点
  if (hoveredNode.value && !hoveredNode.value.isCurrent) {
    context.beginPath();
    drawNode(hoveredNode.value, CANVAS_CONFIG.hoverNodeRadius);
    context.fillStyle = accent;
    context.globalAlpha = STYLE_CONFIG.node.highlightOpacity;
    context.fill();
  }

  // 绘制当前节点
  if (currentNode) {
    context.beginPath();
    drawNode(
      currentNode,
      currentNode === hoveredNode.value
        ? CANVAS_CONFIG.hoverNodeRadius
        : CANVAS_CONFIG.nodeRadius
    );
    context.fillStyle = accent;
    context.globalAlpha = STYLE_CONFIG.node.highlightOpacity;
    context.fill();
  }

  // 恢复默认透明度
  context.globalAlpha = 1;
}

// 绘制标签
function drawLabels() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.font = STYLE_CONFIG.text.font;
  const { text } = getThemeColors();

  props.data.nodes.forEach((node) => {
    let shouldDrawText = false;
    let opacity = 1;

    // 如果是悬浮节点，始终显示文字
    if (node === hoveredNode.value) {
      shouldDrawText = true;
      opacity = 1;
    }
    // 其他节点根据缩放比例显示
    else if (transform.value.k > STYLE_CONFIG.text.minScale) {
      shouldDrawText = true;
      opacity = Math.min(
        (transform.value.k - STYLE_CONFIG.text.minScale) /
          (STYLE_CONFIG.text.maxScale - STYLE_CONFIG.text.minScale),
        1
      );
    }

    if (shouldDrawText || node === hoveredNode.value) {
      // 确保悬浮节点的文字始终显示
      const textWidth = context.measureText(node.value.title).width;
      const [r, g, b] = text.match(/\d+/g).map(Number);
      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      context.fillText(
        node.value.title,
        node.x - textWidth / 2,
        node.y + STYLE_CONFIG.text.offset
      );
    }
  });
}

// 事件监听器设置
function setupEventListeners() {
  const canvas = canvasRef.value;

  const zoom = d3
    .zoom()
    .scaleExtent(CANVAS_CONFIG.zoomExtent)
    .filter((event) => filterZoomEvent(event))
    .touchable(true)
    .on("zoom", (event) => {
      transform.value = event.transform;
      render();
    });

  const touchOptions = {
    passive: false,
    capture: false,
  };

  d3.select(canvas).on("touchstart touchmove", null).call(zoom);

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("touchstart", onMouseDown, touchOptions);
  canvas.addEventListener("click", onClick);
  canvas.addEventListener("touchend", onClick);
  canvas.addEventListener("mousemove", onCanvasMouseMove);
  canvas.addEventListener("touchmove", onCanvasMouseMove, touchOptions);
  canvas.addEventListener("mouseleave", onCanvasMouseLeave);
  canvas.addEventListener("touchend", onCanvasMouseLeave);
}

// 事件处理函数
function filterZoomEvent(event) {
  if (event.type === "touchstart") {
    const touch = event.touches[0];
    const rect = canvasRef.value.getBoundingClientRect();
    const x =
      (touch.clientX - rect.left - transform.value.x) / transform.value.k;
    const y =
      (touch.clientY - rect.top - transform.value.y) / transform.value.k;
    const node = simulation.value.find(x, y, CANVAS_CONFIG.nodeClickRadius);
    return !node;
  }
  if (event.type === "mousedown") {
    const [x, y] = transform.value.invert(d3.pointer(event, canvasRef.value));
    return !isMouseOverNode(x, y) && !draggingNode.value;
  }
  return true;
}

function onMouseDown(event) {
  if (event.type === "touchstart") {
    event.preventDefault();
  }

  const point = event.touches ? event.touches[0] : event;
  const [x, y] = transform.value.invert(d3.pointer(point, canvasRef.value));
  draggingNode.value = simulation.value.find(
    x,
    y,
    CANVAS_CONFIG.nodeClickRadius
  );

  mouseDownTime.value = Date.now();
  mouseDownPosition.value = {
    x: point.clientX,
    y: point.clientY,
  };

  if (draggingNode.value) {
    hoveredNode.value = draggingNode.value;

    event.stopPropagation();
    document.body.style.userSelect = "none";
    draggingNode.value.fx = x;
    draggingNode.value.fy = y;
    simulation.value.alphaTarget(0.3).restart();

    const touchOptions = { passive: false, capture: false };

    if (event.touches) {
      window.addEventListener("touchmove", onMouseMove, touchOptions);
      window.addEventListener("touchend", onMouseUp);
    } else {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
  }
}

function onMouseMove(event) {
  if (draggingNode.value) {
    const point = event.touches ? event.touches[0] : event;
    const moveDistance = Math.sqrt(
      Math.pow(point.clientX - mouseDownPosition.value.x, 2) +
        Math.pow(point.clientY - mouseDownPosition.value.y, 2)
    );

    if (moveDistance > 5) {
      isDragging.value = true;
      const rect = canvasRef.value.getBoundingClientRect();
      const x =
        (point.clientX - rect.left - transform.value.x) / transform.value.k;
      const y =
        (point.clientY - rect.top - transform.value.y) / transform.value.k;

      const boundedPosition = getBoundedPosition(x, y);
      updateDraggingNodePosition(boundedPosition);
      simulation.value.alphaTarget(0.3);
    }
    event.preventDefault();
  }
}

function onMouseUp() {
  if (draggingNode.value) {
    draggingNode.value.fx = null;
    draggingNode.value.fy = null;
    document.body.style.userSelect = "";
    hoveredNode.value = null;
    draggingNode.value = null;
    simulation.value.alphaTarget(0).alpha(0.3);

    if (event.type === "touchend") {
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("touchend", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
  }
}

function onClick(event) {
  const point = event.changedTouches ? event.changedTouches[0] : event;

  const clickDuration = Date.now() - mouseDownTime.value;
  const moveDistance = Math.sqrt(
    Math.pow(point.clientX - mouseDownPosition.value.x, 2) +
      Math.pow(point.clientY - mouseDownPosition.value.y, 2)
  );

  if (clickDuration < 300 && moveDistance < 5) {
    const rect = canvasRef.value.getBoundingClientRect();
    const x =
      (point.clientX - rect.left - transform.value.x) / transform.value.k;
    const y =
      (point.clientY - rect.top - transform.value.y) / transform.value.k;
    const clickedNode = simulation.value.find(
      x,
      y,
      CANVAS_CONFIG.nodeClickRadius
    );

    if (clickedNode && !isDragging.value) {
      emit("nodeClick", clickedNode);
    }
  }

  isDragging.value = false;
}

function onCanvasMouseMove(event) {
  if (draggingNode.value) {
    return;
  }

  const point = event.touches ? event.touches[0] : event;
  const rect = canvasRef.value.getBoundingClientRect();
  const x = (point.clientX - rect.left - transform.value.x) / transform.value.k;
  const y = (point.clientY - rect.top - transform.value.y) / transform.value.k;
  const node = simulation.value.find(x, y, CANVAS_CONFIG.nodeClickRadius);

  if (node !== hoveredNode.value) {
    hoveredNode.value = node;
    render();
  }
}

function onCanvasMouseLeave() {
  if (hoveredNode.value) {
    hoveredNode.value = null;
    render();
  }
}

// 辅助函数
function getBoundedPosition(x: number, y: number) {
  const bounds = {
    left: -transform.value.x / transform.value.k,
    top: -transform.value.y / transform.value.k,
    right: (props.width - transform.value.x) / transform.value.k,
    bottom: (props.height - transform.value.y) / transform.value.k,
  };

  return {
    x: Math.max(
      bounds.left + CANVAS_CONFIG.nodePadding,
      Math.min(bounds.right - CANVAS_CONFIG.nodePadding, x)
    ),
    y: Math.max(
      bounds.top + CANVAS_CONFIG.nodePadding,
      Math.min(bounds.bottom - CANVAS_CONFIG.nodePadding, y)
    ),
  };
}

function updateDraggingNodePosition({ x, y }: { x: number; y: number }) {
  draggingNode.value.x = x;
  draggingNode.value.y = y;
  draggingNode.value.fx = x;
  draggingNode.value.fy = y;
}

function isMouseOverNode(x: number, y: number) {
  return props.data.nodes.some((node) => {
    const dx = node.x - x;
    const dy = node.y - y;
    return Math.sqrt(dx * dx + dy * dy) < CANVAS_CONFIG.nodeClickRadius;
  });
}

// 渲染函数
function render() {
  const canvas = canvasRef.value;
  if (!canvas) {
    console.warn("Canvas not found");
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    console.warn("Could not get canvas context");
    return;
  }

  // 清除画布
  context.clearRect(0, 0, props.width, props.height);
  context.save();

  // 应用变换
  context.translate(transform.value.x, transform.value.y);
  context.scale(transform.value.k, transform.value.k);

  // 绘制图形
  drawLinks();
  drawNodes();
  drawLabels();

  context.restore();
}

// 监听 tick 事件
watch(
  () => simulation.value?.tick(),
  () => {
    render();
  }
);

// 监听画布尺寸变化
watch(
  [() => props.width, () => props.height],
  ([newWidth, newHeight], [oldWidth, oldHeight]) => {
    if (newWidth !== oldWidth || newHeight !== oldHeight) {
      // 更新力导向图的中心点
      if (simulation.value) {
        const centerForce = d3
          .forceCenter(newWidth / 2, newHeight / 2)
          .strength(0.01);
        simulation.value.force("center", centerForce);
        simulation.value.alpha(0.3).restart();
      }
      // 重新渲染
      nextTick(() => {
        render();
      });
    }
  },
  { immediate: true }
);

defineExpose({
  hoveredNode,
  transform,
  simulation,
});
</script>

<template>
  <canvas
    ref="canvasRef"
    :width="width"
    :height="height"
    :style="{
      width: width + 'px',
      height: height + 'px',
      border: '1px solid rgb(60, 60, 67)',
      borderRadius: '5px',
    }"
  ></canvas>
</template>
