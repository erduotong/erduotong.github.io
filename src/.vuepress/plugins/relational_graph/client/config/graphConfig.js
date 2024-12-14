// 常量配置
export const CANVAS_CONFIG = {
  height: 300,
  width: 300,
  nodeRadius: 5,
  hoverNodeRadius: 8,
  nodePadding: 5,
  zoomExtent: [0.1, 10],
  nodeClickRadius: 15,
};

// 力导向图配置
export const FORCE_CONFIG = {
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
export const STYLE_CONFIG = {
  link: { color: "#aaa" },
  node: {
    fill: "#69b3a2",
    stroke: "#fff",
  },
  text: {
    color: "#fff",
    font: "12px 'Microsoft YaHei', 'Heiti SC', 'SimHei', -apple-system, sans-serif",
    offset: 25,
    hoverOffset: 30,
    minScale: 1,
    maxScale: 1.5,
  },
  currentNode: {
    fill: "#ff7675",
    stroke: "#d63031",
    strokeWidth: 2,
  },
  hover: {
    node: {
      fill: "#74b9ff",
      stroke: "#0984e3",
      strokeWidth: 2,
    },
    link: {
      color: "#74b9ff",
      width: 2,
    }
  },
  inactive: {
    opacity: 0.2,
  },
}; 