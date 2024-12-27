/**
 * @fileOverview 获取全局图谱的数据
 */
import {MapNodeLink} from "../types/index.js";
export const graphDataName = 'globalRelationalGraph.json'

/**
 * 获取全局图谱的数据
 */
export async function getGlobalGraphData(isDev:boolean): Promise<MapNodeLink | null> {

    if(isDev) {

    }
    else{

    }
    return {
        nodes: [],
        links: [],
    }
}
