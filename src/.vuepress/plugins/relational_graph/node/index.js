/**
 * @fileOverview index.js
 * @author erduotong
 */
import {getDirname, path} from "vuepress/utils";
import {bioChainMap, buildBioChainMap} from "./buildMapData.js";


const __dirname = getDirname(import.meta.url);

const relational_graph = () => {
    return {
        name: "vuepress-plugin-relational-graph",
        onInitialized: (app) => {
            Object.assign(bioChainMap, {});
            buildBioChainMap(app.pages);
        },

        clientConfigFile: path.resolve(__dirname, "../client/config.js"),

    };
};
export default relational_graph;