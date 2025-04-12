import { App, PluginObject } from "vuepress";
import { getDirname, path } from "vuepress/utils";
import { extendMarkdown } from './markdownExtension.js';
/**
 * VuePress插件：检测网站内部链接有效性
 * 对于目标不存在的内部链接，添加特殊class标记
 */
const __dirname = getDirname(import.meta.url);
const BetterVuepressLink = (): PluginObject => {
    return {
        name: "vuepress-plugin-better-vuepress-link",

        extendsMarkdown: extendMarkdown,

        clientConfigFile: path.resolve(__dirname, "../client/config.ts"),
    };
};

export default BetterVuepressLink;
