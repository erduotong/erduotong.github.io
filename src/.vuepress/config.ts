import {defineUserConfig} from "vuepress";
import {getDirname, path} from "vuepress/utils"
import theme from "./theme.js";
import link_handler from './plugins/markdown_it/link_handler.js'
import img_space_adder from './plugins/markdown_it/img_space_adder.js'
import enable_multi_h1 from './plugins/markdown_it/enable_multi_h1.js'
import mdItObsidianCallouts from 'markdown-it-obsidian-callouts'
import ab_mdit from "./plugins/ABConvertManager/src/index_mdit.js";
import BiGraph from "./plugins/BiGraph/node/index.js";
import viteBundler from "@vuepress/bundler-vite";
import minipic from "vite-plugin-minipic"


const __dirname = getDirname(import.meta.url);
export default defineUserConfig({
    base: "/",

    lang: "zh-CN",
    title: "耳朵同的博客",
    description: "欢迎来到耳朵同的博客",
    plugins: [BiGraph({
        localGraphDeep: 20,
        foldEmptyGraph: false,
        graphMaxWidth: 300,
        graphHeight: 300,
    })],
    theme,
    bundler: viteBundler({
        viteOptions: {
            plugins: [minipic({
                    cache: false
                }
            )]
        }
    }),
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
        md.use(img_space_adder)
        md.use(enable_multi_h1)
        md.use(mdItObsidianCallouts)

        md.use(ab_mdit)

    },
    markdown: {
        headers: {
            level: [1, 2, 3, 4, 5, 6] // 不然的话toc会受限
        },
    },
});
