export interface BioChainData {
  outlink: LinkItem[];
  backlink: LinkItem[];
  localMap: MapNodeLink;
}

export interface LinkItem {
  title: string;
  link: string;
}

export interface MapNodeLink {
  nodes: Node[];
  links: Link[];
}

export interface Node {
  id: string;
  value: NodeValue;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  isCurrent?: boolean;
}

export interface NodeValue {
  title: string;
  path: string;
  outlink: string[];
  backlink: string[];
}

export interface Link {
  source: string | Node;
  target: string | Node;
}

export interface LocalMapItem {
  title: string;
  path: string;
  outlink: string[];
  backlink: string[];
}

export interface BioChainMapItem {
  title: string;
  outlink: string[];
  backlink: string[];
}

export interface QueueItem {
  path: string;
  depth: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface Page {
  filePathRelative: string;
  title: string;
  links: Array<{ relative: string }>;
  data: {
    filePathRelative: string;
    bioChainData?: BioChainData;
  };
}

export interface ThemeColors {
  accent: string;
  text: string;
}

export interface BoundedPosition {
  x: number;
  y: number;
}

export interface RelationalGraphConfig {
  localGraphDeep?: number; // 局部关系图谱的深度（以当前页面为中心） 默认为5
  foldEmptyGraph?: boolean; // 是否折叠空的关系图谱（只有一个节点） 默认为false
  graphMaxWidth?: number; // 最大宽度 单位: px 默认为 Infinity
  graphHeight?: number; // 高度 单位: px  默认为 300
  enableGlobalGraph?: boolean; // 是否启用全局关系图谱 默认为true
  enableLocalGraph?: boolean; // 是否启用局部关系图谱 默认为true
}
