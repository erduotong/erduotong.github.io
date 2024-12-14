<script setup lang="js">
import {onMounted, ref, onUnmounted} from "vue";
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
  center: d3.forceCenter(CANVAS_CONFIG.width / 2, CANVAS_CONFIG.height / 2)
      .strength(0.01),
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
    minScale: 1,
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
  const cleanRoutePath = decodedRoutePath.replace(/\.[^/.]+$/, '');
  const cleanNodePath = nodePath.replace(/\.[^/.]+$/, '');

  // 3. 移除开头的斜杠
  const normalizedRoutePath = cleanRoutePath.replace(/^\//, '');
  const normalizedNodePath = cleanNodePath.replace(/^\//, '');

  return normalizedRoutePath === normalizedNodePath;
}

// 基础数据设置
const data = usePageData();
const map_data = data.value?.bioChainData?.localMap;
const canvasRef = ref(null);
const router = useRouter();
const mouseDownTime = ref(0);
const mouseDownPosition = ref({ x: 0, y: 0 });

onMounted(() => {
  if (!map_data) {
    return;
  }

  // 找到当前节点
  const currentNode = map_data.nodes.find(node =>
    isPathMatch(router.currentRoute.value.path, node.value.path)
  );

  if (currentNode) {
    currentNode.isCurrent = true;
    currentNode.fx = CANVAS_CONFIG.width / 2;
    currentNode.fy = CANVAS_CONFIG.height / 2;
    setTimeout(() => {
      currentNode.fx = null;
      currentNode.fy = null;
    }, 1000);
  }

  // 初始化变量
  const canvas = canvasRef.value;
  const context = canvas.getContext("2d");
  let isDragging = false;
  let draggingNode = null;
  let transform = d3.zoomIdentity;
  let hoveredNode = null;

  // 初始化力导向图
  const simulation = initializeSimulation();

  // 设置事件监听
  setupEventListeners();

  // 力导图初始化
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
    canvas.addEventListener("mousemove", onCanvasMouseMove);
    canvas.addEventListener("mouseleave", onCanvasMouseLeave);
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

    // 记录按下时的时间和位置
    mouseDownTime.value = Date.now();
    mouseDownPosition.value = { x: event.clientX, y: event.clientY };

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
    if (draggingNode) {
      const moveDistance = Math.sqrt(
        Math.pow(event.clientX - mouseDownPosition.value.x, 2) +
        Math.pow(event.clientY - mouseDownPosition.value.y, 2)
      );
      
      // 只有当移动距离大于5像素时才开始拖拽
      if (moveDistance > 5) {
        isDragging = true;
        const [x, y] = getTransformedMousePosition(event);
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
    // 获取高亮颜色
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--vp-c-accent').trim();

    map_data.links.forEach(link => {
      context.beginPath();
      drawLink(link);

      if (hoveredNode && (link.source === hoveredNode || link.target === hoveredNode)) {
        context.strokeStyle = accentColor;
        context.globalAlpha = STYLE_CONFIG.link.highlightOpacity;
      } else {
        context.strokeStyle = STYLE_CONFIG.link.color;
        context.globalAlpha = hoveredNode ? STYLE_CONFIG.link.normalOpacity : STYLE_CONFIG.link.highlightOpacity;
      }

      context.stroke();
    });
    context.globalAlpha = 1;
  }

  function drawNodes() {
    // 获取高亮颜色和文字颜色
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--vp-c-accent').trim();
    const textColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--vp-c-text').trim();

    // 获取与悬停节点相连的节点
    const connectedNodes = new Set();
    if (hoveredNode) {
      map_data.links.forEach(link => {
        if (link.source === hoveredNode) connectedNodes.add(link.target);
        if (link.target === hoveredNode) connectedNodes.add(link.source);
      });
    }

    // 绘制普通节点
    context.beginPath();
    map_data.nodes.filter(d => !d.isCurrent && d !== hoveredNode).forEach(d => {
      drawNode(d, CANVAS_CONFIG.nodeRadius);
    });
    context.fillStyle = textColor;
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
      context.fillStyle = textColor;
      context.globalAlpha = STYLE_CONFIG.node.highlightOpacity;
      context.fill();
    }

    // 绘制悬停节点
    if (hoveredNode && !hoveredNode.isCurrent) {
      context.beginPath();
      drawNode(hoveredNode, CANVAS_CONFIG.hoverNodeRadius);
      context.fillStyle = accentColor;
      context.globalAlpha = STYLE_CONFIG.node.highlightOpacity;
      context.fill();
    }

    // 绘制当前节点
    const currentNode = map_data.nodes.find(d => d.isCurrent);
    if (currentNode) {
      context.beginPath();
      drawNode(currentNode, currentNode === hoveredNode ?
        CANVAS_CONFIG.hoverNodeRadius : CANVAS_CONFIG.nodeRadius);
      context.fillStyle = accentColor;
      context.globalAlpha = hoveredNode && currentNode !== hoveredNode && !connectedNodes.has(currentNode)
        ? STYLE_CONFIG.node.normalOpacity
        : STYLE_CONFIG.node.highlightOpacity;
      context.fill();
    }

    // 恢复默认透明度
    context.globalAlpha = 1;
  }

  function drawLabels() {
    context.font = STYLE_CONFIG.text.font;

    // 获取 CSS 变量颜色
    const textColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--vp-c-text').trim();

    map_data.nodes.forEach(node => {
      let shouldDrawText = false;
      let opacity = 1;

      if (node === hoveredNode) {
        shouldDrawText = true;
      }
      else if (transform.k > STYLE_CONFIG.text.minScale) {
        shouldDrawText = true;
        opacity = Math.min(
          (transform.k - STYLE_CONFIG.text.minScale) /
          (STYLE_CONFIG.text.maxScale - STYLE_CONFIG.text.minScale),
          1
        );
      }

      if (shouldDrawText) {
        const textWidth = context.measureText(node.value.title).width;
        // 使用 CSS 变量颜色
        const [r, g, b] = textColor.match(/\d+/g).map(Number);
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        context.fillText(
          node.value.title,
          node.x - textWidth / 2,
          node.y + STYLE_CONFIG.text.offset
        );
      }
    });
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
    // 计算点击持续时间和移动距离
    const clickDuration = Date.now() - mouseDownTime.value;
    const moveDistance = Math.sqrt(
      Math.pow(event.clientX - mouseDownPosition.value.x, 2) +
      Math.pow(event.clientY - mouseDownPosition.value.y, 2)
    );

    // 如果点击时间小于300ms且移动距离小于5像素，才认为是有效点击
    if (clickDuration < 300 && moveDistance < 5) {
      const [graphX, graphY] = getTransformedMousePosition(event);
      const clickedNode = findClickedNode(graphX, graphY);

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
    if (draggingNode) return;

    const [x, y] = getTransformedMousePosition(event);
    const node = findClickedNode(x, y);

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

  // 添加 CSS 变量观察器
  const observer = new MutationObserver(() => {
    // CSS 变量发生变化时重新渲染
    ticked();
  });

  // 观察 html 元素的 style 属性变化
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style', 'class', 'data-theme']
  });

  // 获取主题颜色函数
  function getThemeColors() {
    const root = getComputedStyle(document.documentElement);
    return {
      accent: root.getPropertyValue('--vp-c-accent').trim(),
      text: root.getPropertyValue('--vp-c-text').trim()
    };
  }

  // 修改 drawLinks 函数
  function drawLinks() {
    const { accent } = getThemeColors();
    
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
    const { accent, text } = getThemeColors();
    
    // 获取与悬停节点相连的节点
    const connectedNodes = new Set();
    if (hoveredNode) {
      map_data.links.forEach(link => {
        if (link.source === hoveredNode) connectedNodes.add(link.target);
        if (link.target === hoveredNode) connectedNodes.add(link.source);
      });
    }

    // 先绘制普通节点
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

    // 绘制当前节点
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
    const { text } = getThemeColors();
    
    map_data.nodes.forEach(node => {
      let shouldDrawText = false;
      let opacity = 1;
      
      if (node === hoveredNode) {
        shouldDrawText = true;
      }
      else if (transform.k > STYLE_CONFIG.text.minScale) {
        shouldDrawText = true;
        opacity = Math.min(
          (transform.k - STYLE_CONFIG.text.minScale) / 
          (STYLE_CONFIG.text.maxScale - STYLE_CONFIG.text.minScale),
          1
        );
      }
      
      if (shouldDrawText) {
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

  // 在组件卸载时清理观察器
  onUnmounted(() => {
    observer.disconnect();
  });
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
