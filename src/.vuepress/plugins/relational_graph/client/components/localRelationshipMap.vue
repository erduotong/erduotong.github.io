<script setup lang="js">
import {onMounted, ref, onUnmounted, nextTick} from "vue";
import {usePageData, useRouter, withBase} from "vuepress/client";
import * as d3 from "d3";

// 常量配置
const CANVAS_CONFIG = {
  defaultWidth: 300,
  defaultHeight: 300,
  nodeRadius: 5,
  nodePadding: 5,
  zoomExtent: [0.1, 10],
  nodeClickRadius: 15,
  hoverNodeRadius: 8,
};

// 力导向图配置
const FORCE_CONFIG = {
  link: d3.forceLink().id(d => d.id)
      .distance(70)
      .strength(0.2),
  charge: d3.forceManyBody()
      .strength(-80)
      .distanceMin(20)
      .distanceMax(120),
};

// 样式配置
const STYLE_CONFIG = {
  link: {
    color: "#aaa",
    normalOpacity: 0.3,
    highlightOpacity: 1,
  },
  node: {
    normalOpacity: 0.3,
    highlightOpacity: 0.8,
  },
  text: {
    font: "12px 'Microsoft YaHei', 'Heiti SC', 'SimHei', -apple-system, sans-serif",
    offset: 25,
    minScale: 0.5,
    maxScale: 1.5,
  },
  currentNode: {
    strokeWidth: 2,
  },
};

// 添加路径匹配工具函数
function isPathMatch(routePath, nodePath) {
  // 1. 解码 URL 编码的字符
  const decodedRoutePath = decodeURIComponent(routePath);

  // 2. 移除两个路径的后缀（.html 和 .md 等）
  const cleanRoutePath = decodedRoutePath.replace(/\.[^/.]+$/, "");
  const cleanNodePath = nodePath.replace(/\.[^/.]+$/, "");

  // 3. 移除开头的斜杠
  const normalizedRoutePath = cleanRoutePath.replace(/^\//, "");
  const normalizedNodePath = cleanNodePath.replace(/^\//, "");

  return normalizedRoutePath === normalizedNodePath;
}

// 基础数据设置
const data = usePageData();
const map_data = data.value?.bioChainData?.localMap;
const canvasRef = ref(null);
const router = useRouter();
const mouseDownTime = ref(0);
const mouseDownPosition = ref({
  x: 0,
  y: 0,
});
const containerRef = ref(null);
const canvasSize = ref({
  width: CANVAS_CONFIG.defaultWidth,
  height: CANVAS_CONFIG.defaultHeight,
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
      height: CANVAS_CONFIG.defaultHeight,
    };

    // 如果 simulation 存在，更新力导向图的中心点
    if (window.simulation) {
      const centerForce = d3.forceCenter(canvasSize.value.width / 2, canvasSize.value.height / 2)
          .strength(0.01);
      window.simulation.force("center", centerForce);
      window.simulation.alpha(0.3).restart();
    }
  }
}

// 添加切换折叠状态的方法
function toggleExpand() {
  isExpanded.value = !isExpanded.value;
  // 展开时需要重新计算和更新画布
  if (isExpanded.value) {
    nextTick(() => {
      updateContainerWidth();
      if (window.simulation) {
        window.simulation.alpha(0.3).restart();
      }
    });
  }
}

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
  let hoveredNode = null;
  let simulation = null;

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
  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      updateContainerWidth(); // 这里会同时处理画大小和力导向图的更新
    }
  });

  // 开始观察容器元素
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }

  // 找到当前节点
  const currentNode = map_data.nodes.find(node =>
      isPathMatch(router.currentRoute.value.path, node.value.path),
  );

  if (currentNode) {
    currentNode.isCurrent = true;
    currentNode.fx = canvasSize.value.width / 2;
    currentNode.fy = canvasSize.value.height / 2;
    setTimeout(() => {
      currentNode.fx = null;
      currentNode.fy = null;
    }, 1000);
  }

  // 初始化力导向图
  simulation = initializeSimulation();

  // 设置事件监听
  setupEventListeners();

  // 力导图初始化
  function initializeSimulation() {
    // 创建一个 center force
    const centerForce = d3.forceCenter(canvasSize.value.width / 2, canvasSize.value.height / 2)
        .strength(0.01);

    window.simulation = d3.forceSimulation(map_data.nodes)
        .force("link", FORCE_CONFIG.link.links(map_data.links))
        .force("charge", FORCE_CONFIG.charge)
        .force("center", centerForce)
        .on("tick", ticked);

    return window.simulation;
  }

  // 事件监听器设置
  function setupEventListeners() {
    const zoom = d3.zoom()
        .scaleExtent(CANVAS_CONFIG.zoomExtent)
        .filter(event => filterZoomEvent(event))
        .touchable(true)
        .on("zoom", event => {
          transform = event.transform;
          ticked();
        });

    const touchOptions = {
      passive: false,
      capture: false
    };

    d3.select(canvas)
      .on("touchstart touchmove", null)
      .call(zoom);

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
    // 如果是触摸事件，需要检查触摸点是否在节点上
    if (event.type === "touchstart") {
      const touch = event.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = (touch.clientX - rect.left - transform.x) / transform.k;
      const y = (touch.clientY - rect.top - transform.y) / transform.k;
      const node = simulation.find(x, y, CANVAS_CONFIG.nodeClickRadius);
      return !node; // 如果触摸点在节点上，阻止缩放
    }
    // 对于鼠标事件保持原有逻辑
    if (event.type === "mousedown") {
      const [x, y] = transform.invert(d3.pointer(event, canvas));
      return !isMouseOverNode(x, y) && !draggingNode;
    }
    return true;
  }

  function onMouseDown(event) {
    if (event.type === "touchstart") {
      event.preventDefault();
    }

    const point = event.touches ? event.touches[0] : event;
    const [x, y] = transform.invert(d3.pointer(point, canvas));
    draggingNode = simulation.find(x, y, CANVAS_CONFIG.nodeClickRadius);

    // 记录按下时的时间和位置
    mouseDownTime.value = Date.now();
    mouseDownPosition.value = {
      x: point.clientX,
      y: point.clientY,
    };

    if (draggingNode) {
      // 设置当前拖拽的节点为悬停节点
      hoveredNode = draggingNode;
      
      event.stopPropagation();
      document.body.style.userSelect = "none";
      draggingNode.fx = x;
      draggingNode.fy = y;
      simulation.alphaTarget(0.3).restart();

      const touchOptions = { passive: false, capture: false };

      // 根据事件类型绑定对应的事件监听器
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
    if (draggingNode) {
      const point = event.touches ? event.touches[0] : event;
      const moveDistance = Math.sqrt(
        Math.pow(point.clientX - mouseDownPosition.value.x, 2) +
        Math.pow(point.clientY - mouseDownPosition.value.y, 2)
      );

      // 只有当移动距离大于5像素时才开始拖拽
      if (moveDistance > 5) {
        isDragging = true;
        const rect = canvas.getBoundingClientRect();
        const x = (point.clientX - rect.left - transform.x) / transform.k;
        const y = (point.clientY - rect.top - transform.y) / transform.k;

        const boundedPosition = getBoundedPosition(x, y);
        updateDraggingNodePosition(boundedPosition);
        simulation.alphaTarget(0.3);
      }
      event.preventDefault();
    }
  }

  function onMouseUp() {
    if (draggingNode) {
      draggingNode.fx = null;
      draggingNode.fy = null;
      document.body.style.userSelect = "";
      // 清除悬停节点
      hoveredNode = null;
      draggingNode = null;
      simulation.alphaTarget(0).alpha(0.3);

      if (event.type === 'touchend') {
        window.removeEventListener("touchmove", onMouseMove);
        window.removeEventListener("touchend", onMouseUp);
      } else {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      }
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
      right: (canvasSize.value.width - transform.x) / transform.k,
      bottom: (canvasSize.value.height - transform.y) / transform.k,
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
    context.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height);
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


  function drawLink(d) {
    context.moveTo(d.source.x, d.source.y);
    context.lineTo(d.target.x, d.target.y);
  }

  function drawNode(d, radius) {
    context.moveTo(d.x + radius, d.y);
    context.arc(d.x, d.y, radius, 0, 2 * Math.PI);
  }

  function isMouseOverNode(x, y) {
    return map_data.nodes.some(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < CANVAS_CONFIG.nodeClickRadius;
    });
  }

  function onClick(event) {
    // 如果是触摸事件，使用 changedTouches
    const point = event.changedTouches ? event.changedTouches[0] : event;
    
    // 计算点击持续时间和移动距离
    const clickDuration = Date.now() - mouseDownTime.value;
    const moveDistance = Math.sqrt(
      Math.pow(point.clientX - mouseDownPosition.value.x, 2) +
      Math.pow(point.clientY - mouseDownPosition.value.y, 2),
    );

    // 如果点击时间小于300ms且移动距离小于5像素，才认为是有效点击
    if (clickDuration < 300 && moveDistance < 5) {
      const rect = canvas.getBoundingClientRect();
      const x = (point.clientX - rect.left - transform.x) / transform.k;
      const y = (point.clientY - rect.top - transform.y) / transform.k;
      const clickedNode = simulation.find(x, y, CANVAS_CONFIG.nodeClickRadius);

      if (clickedNode && !isDragging) {
        if (!clickedNode.isCurrent) {
          router.push(withBase(clickedNode.value.path));
        }
      }
    }

    isDragging = false;
  }

  function findClickedNode(x, y) {
    return map_data.nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < CANVAS_CONFIG.nodeClickRadius;
    });
  }

  function onCanvasMouseMove(event) {
    if (draggingNode) {
      return;
    }

    const point = event.touches ? event.touches[0] : event;
    const rect = canvas.getBoundingClientRect();
    const x = (point.clientX - rect.left - transform.x) / transform.k;
    const y = (point.clientY - rect.top - transform.y) / transform.k;
    const node = simulation.find(x, y, CANVAS_CONFIG.nodeClickRadius);

    if (node !== hoveredNode) {
      hoveredNode = node;
      ticked(); // 重新渲染
    }
  }

  function onCanvasMouseLeave() {
    if (hoveredNode) {
      hoveredNode = null;
      ticked(); // 重新渲染
    }
  }

  // 添加 CSS 变量察器
  const observer = new MutationObserver(() => {
    // CSS 变量发生变化时重新渲染
    ticked();
  });

  // 观察 html 元素的 style 属性变化
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style", "class", "data-theme"],
  });

  // 获取主题颜色函数
  function getThemeColors() {
    const root = getComputedStyle(document.documentElement);
    return {
      accent: root.getPropertyValue("--vp-c-accent").trim(),
      text: root.getPropertyValue("--vp-c-text").trim(),
    };
  }

  // 修改 drawLinks 函数
  function drawLinks() {
    const {accent} = getThemeColors();

    map_data.links.forEach(link => {
      context.beginPath();
      drawLink(link);

      if (hoveredNode && (link.source === hoveredNode || link.target === hoveredNode)) {
        context.strokeStyle = accent;
        context.globalAlpha = STYLE_CONFIG.link.highlightOpacity;
      } else {
        context.strokeStyle = STYLE_CONFIG.link.color;
        context.globalAlpha = hoveredNode ? STYLE_CONFIG.link.normalOpacity : STYLE_CONFIG.link.highlightOpacity;
      }

      context.stroke();
    });
    context.globalAlpha = 1;
  }

  // 修改 drawNodes 函数
  function drawNodes() {
    const {
      accent,
      text,
    } = getThemeColors();

    // 获取与悬停点相连的点
    const connectedNodes = new Set();
    if (hoveredNode) {
      map_data.links.forEach(link => {
        if (link.source === hoveredNode) {
          connectedNodes.add(link.target);
        }
        if (link.target === hoveredNode) {
          connectedNodes.add(link.source);
        }
      });
    }

    // 先绘普通节点
    context.beginPath();
    map_data.nodes.filter(d => !d.isCurrent && d !== hoveredNode).forEach(d => {
      drawNode(d, CANVAS_CONFIG.nodeRadius);
    });
    context.fillStyle = text;
    context.globalAlpha = hoveredNode ? STYLE_CONFIG.node.normalOpacity : STYLE_CONFIG.node.highlightOpacity;
    context.fill();

    // 如果有悬停节点，绘制与其相连的节点
    if (hoveredNode) {
      context.beginPath();
      Array.from(connectedNodes).forEach(d => {
        if (!d.isCurrent) {
          drawNode(d, CANVAS_CONFIG.nodeRadius);
        }
      });
      context.fillStyle = text;
      context.globalAlpha = STYLE_CONFIG.node.highlightOpacity;
      context.fill();
    }

    // 绘制悬停节点
    if (hoveredNode && !hoveredNode.isCurrent) {
      context.beginPath();
      drawNode(hoveredNode, CANVAS_CONFIG.hoverNodeRadius);
      context.fillStyle = accent;
      context.globalAlpha = STYLE_CONFIG.node.highlightOpacity;
      context.fill();
    }

    // 绘制前节点
    const currentNode = map_data.nodes.find(d => d.isCurrent);
    if (currentNode) {
      context.beginPath();
      drawNode(currentNode, currentNode === hoveredNode ?
          CANVAS_CONFIG.hoverNodeRadius : CANVAS_CONFIG.nodeRadius);
      context.fillStyle = accent;
      context.globalAlpha = hoveredNode && currentNode !== hoveredNode && !connectedNodes.has(currentNode)
          ? STYLE_CONFIG.node.normalOpacity
          : STYLE_CONFIG.node.highlightOpacity;
      context.fill();
    }

    // 恢复默认透明度
    context.globalAlpha = 1;
  }

  // 修改 drawLabels 函数
  function drawLabels() {
    context.font = STYLE_CONFIG.text.font;
    const {text} = getThemeColors();

    map_data.nodes.forEach(node => {
      let shouldDrawText = false;
      let opacity = 1;

      if (node === hoveredNode) {
        shouldDrawText = true;
      } else if (transform.k > STYLE_CONFIG.text.minScale) {
        shouldDrawText = true;
        opacity = Math.min(
            (transform.k - STYLE_CONFIG.text.minScale) /
            (STYLE_CONFIG.text.maxScale - STYLE_CONFIG.text.minScale),
            1,
        );
      }

      if (shouldDrawText) {
        const textWidth = context.measureText(node.value.title).width;
        const [r, g, b] = text.match(/\d+/g).map(Number);
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        context.fillText(
            node.value.title,
            node.x - textWidth / 2,
            node.y + STYLE_CONFIG.text.offset,
        );
      }
    });
  }

  // 在组件卸载时清理观察器
  onUnmounted(() => {
    window.removeEventListener("resize", updateContainerWidth);
    mediaQuery.removeEventListener("change", updateScreenSize);
    observer.disconnect();
  });

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
      <canvas
        ref="canvasRef"
        :width="canvasSize.width"
        :height="canvasSize.height"
        :style="{
          width: canvasSize.width + 'px',
          height: canvasSize.height + 'px',
        }"
      ></canvas>
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
