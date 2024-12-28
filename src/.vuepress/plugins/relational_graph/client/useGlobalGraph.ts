// noinspection ES6UnusedImports

/**
 * @fileOverview 获取全局图谱的数据
 */
import { withBase } from "vuepress/client";
import { MapNodeLink } from "../types/index.js";
import { ref } from "vue";

export const graphDataName = "globalRelationalGraph.json";
export const showGlobalGraph = ref(false);
/**
 * 获取全局图谱的数据
 */
export async function getGlobalGraph(
  isDev: boolean,
  withBaseFunc: Function
): Promise<MapNodeLink | null> {
  try {
    if (isDev) {
      const module = await import(/* @vite-ignore */ `/@temp/${graphDataName}`);
      return module?.default || null;
    } else {
      const response = await fetch(withBaseFunc(`${graphDataName}`));
      if (!response.ok) {
        return null;
      }
      return (await response.json()) || null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
