/**
 * @fileOverview index.ts
 * @author erduotong
 */
import {getDirname, path} from "vuepress/utils";
import {bioChainMap, buildBioChainMap, writeGlobalGraph,} from "./buildMapData.js";
import type {App} from "vuepress/core";
import {RelationalGraphConfig} from "../types/index.js";

const __dirname = getDirname(import.meta.url);
export let options: RelationalGraphConfig = {};
const relational_graph = (config: RelationalGraphConfig = {}) => {
    options = config;
    return {
        name: "vuepress-plugin-relational-graph",
        onInitialized: (app: App) => {
            Object.assign(bioChainMap, {});
            // @ts-ignore
            buildBioChainMap(app.pages);
        },
        onGenerated: async (app: App) => {
            await writeGlobalGraph(app);
        },
        clientConfigFile: path.resolve(__dirname, "../client/config.ts"),
        define: {
            __RELATIONAL_GRAPH_FOLD_EMPTY_GRAPH: options.foldEmptyGraph || false,
            __RELATIONAL_GRAPH_LOCAL_GRAPH_DEEP: options.localGraphDeep || 5,
            __RELATIONAL_GRAPH_MAX_WIDTH: options.graphMaxWidth || Infinity,
            __RELATIONAL_GRAPH_HEIGHT: options.graphHeight || 300,
            __RELATIONAL_GRAPH_ENABLE_GLOBAL_GRAPH: options.enableGlobalGraph !== undefined ? options.enableGlobalGraph : true,
            __RELATIONAL_GRAPH_ENABLE_LOCAL_GRAPH: options.enableLocalGraph !== undefined ? options.enableLocalGraph : true,
        },
    };
};

export default relational_graph;
