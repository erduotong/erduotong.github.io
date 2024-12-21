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
