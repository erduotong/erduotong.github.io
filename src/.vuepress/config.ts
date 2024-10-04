import {defineUserConfig} from "vuepress";
import {getDirname, path} from "vuepress/utils"
import theme from "./theme.js";
import link_handler from './plugins/link_handler/link_handler.js'
const __dirname = getDirname(import.meta.url);
export default defineUserConfig({
    base: "/",

    lang: "zh-CN",
    title: "耳朵同的博客",
    description: "欢迎来到耳朵同的博客",

    theme,
    alias: {
        "@theme-hope/components/PageFooter": path.resolve(
            __dirname,
            "./components/websiteFooter.vue",
        ),
    },
    head: [
        ["link", {rel: "icon", href: '/logo.png'}]
    ],
    extendsMarkdown: (md) => {
        md.use(link_handler)
    }
});
