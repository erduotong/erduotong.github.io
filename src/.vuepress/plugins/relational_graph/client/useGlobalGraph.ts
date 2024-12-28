// noinspection ES6UnusedImports

/**
 * @fileOverview 获取全局图谱的数据
 */
import {MapNodeLink} from "../types/index.js";
import {ref} from "vue";
import {withBase} from "vuepress/client";

export const graphDataName = "globalRelationalGraph.js";
export const showGlobalGraph = ref(false);

/**
 * 获取全局图谱的数据
 */
export async function getGlobalGraph(
    isDev: boolean
): Promise<MapNodeLink | null> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        if (isDev) {
            const module = await import(/* @vite-ignore */ `/@temp/${graphDataName}`);

            return module?.default || null;
        } else {
            const module = await import(withBase(`${graphDataName}`));
            return module?.default || null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}
