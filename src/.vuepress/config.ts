import {defineUserConfig} from "vuepress";
import {getDirname, path} from "vuepress/utils"
import theme from "./theme.js";

const __dirname = getDirname(import.meta.url);
export default defineUserConfig({
    base: "/",

    lang: "zh-CN",
    title: "耳朵同的博客",
    description: "欢迎来到耳朵同的博客",

    theme,
    alias: {

    }
});
