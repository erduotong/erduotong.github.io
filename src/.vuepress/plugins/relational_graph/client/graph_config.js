import * as d3 from "d3";
// 常量配置
export const CANVAS_CONFIG = {
    defaultWidth: 300,
    defaultHeight: 300,
    nodeRadius: 5,
    nodePadding: 5,
    zoomExtent: [0.1, 10],
    nodeClickRadius: 15,
    hoverNodeRadius: 8,
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
};
// 样式配置
export const STYLE_CONFIG = {
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