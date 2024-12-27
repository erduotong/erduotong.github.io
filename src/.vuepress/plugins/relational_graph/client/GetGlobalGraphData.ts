// noinspection ES6UnusedImports

/**
 * @fileOverview 获取全局图谱的数据
 */
import { MapNodeLink } from "../types/index.js";

export const graphDataName = "globalRelationalGraph.js";

/**
 * 获取全局图谱的数据
 */
export async function getGlobalGraphData(
  isDev: boolean
): Promise<MapNodeLink | null> {
  if (isDev) {
    let module = null;
    try {
      module = await import( /* @vite-ignore */ `/@temp/${graphDataName}`);
    } catch (e) {
      console.error(e);
    }
    if (module) {
      return module.default;
    }
    return null;
  } else {

  }

}
