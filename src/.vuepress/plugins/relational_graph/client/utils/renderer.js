import { STYLE_CONFIG, CANVAS_CONFIG } from '../config/graphConfig';

export class GraphRenderer {
  constructor(context, transform) {
    this.context = context;
    this.transform = transform;
  }

  drawLinks(links, hoveredNode) {
    // 绘制连接线的代码...
  }

  drawNodes(nodes, hoveredNode) {
    // 绘制节点的代码...
  }

  drawLabels(nodes, hoveredNode, transform) {
    // 绘制标签的代码...
  }

  // 其他渲染辅助方法...
} 