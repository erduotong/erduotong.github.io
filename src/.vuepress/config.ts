import {defineUserConfig} from "vuepress";
import {getDirname, path} from "vuepress/utils"
import theme from "./theme.js";
import link_handler from './plugins/markdown_it/link_handler.js'
import img_space_adder from './plugins/markdown_it/img_space_adder.js'
import enable_multi_h1 from './plugins/markdown_it/enable_multi_h1.js'
import mdItObsidianCallouts from 'markdown-it-obsidian-callouts'
import ab_mdit from "any-block-converter-markdown-it" // +
// + 这里需要自 pnpm install jsdom，不知道为什么这部分不能在模块里依赖，会有bug......
import jsdom from "jsdom"

const {JSDOM} = jsdom
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
    url: 'http://localhost/', // @warn 若缺少该行，则在mdit+build环境下，编译报错
});
// @ts-ignore 不能将类型“DOMWindow”分配给类型“Window & typeof globalThis”
global.window = dom.window
global.history = dom.window.history // @warn 若缺少该行，则在mdit+build环境下，编译报错：ReferenceError: history is not defined
global.document = dom.window.document
global.NodeList = dom.window.NodeList
global.HTMLElement = dom.window.HTMLElement
global.HTMLDivElement = dom.window.HTMLDivElement
global.HTMLPreElement = dom.window.HTMLPreElement
global.HTMLQuoteElement = dom.window.HTMLQuoteElement
global.HTMLTableElement = dom.window.HTMLTableElement
global.HTMLUListElement = dom.window.HTMLUListElement
global.HTMLScriptElement = dom.window.HTMLScriptElement
dom.window.scrollTo = () => {
} // @warn 若缺少该行，编译警告：Error: Not implemented: window.scrollTo*/

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
        md.use(mdItObsidianCallouts)
        md.use(img_space_adder)
        md.use(enable_multi_h1)
        md.use(ab_mdit)

    },
    markdown: {
        headers: {
            level: [1, 2, 3, 4, 5, 6] // 不然的话toc会受限
        },
    },
});
