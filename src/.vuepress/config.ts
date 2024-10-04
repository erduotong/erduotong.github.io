// noinspection JSConstantReassignment

import {defineUserConfig} from "vuepress";
import {getDirname, path} from "vuepress/utils"
import theme from "./theme.js";
import link_handler from './plugins/link_handler/link_handler.js'
import ab_mdit from "any-block-converter-markdown-it" // +
import jsdom from "jsdom"
const { JSDOM } = jsdom
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
    url: 'http://localhost/', // @warn 若缺少该行，则在mdit+build环境下，编译报错
});
// 一些markdown it插件所需的 以及，我把禁用了给他们
global.window = dom.window
global.history = dom.window.history
global.document = dom.window.document
global.NodeList = dom.window.NodeList
global.HTMLElement = dom.window.HTMLElement
global.HTMLDivElement = dom.window.HTMLDivElement
global.HTMLPreElement = dom.window.HTMLPreElement
global.HTMLQuoteElement = dom.window.HTMLQuoteElement
global.HTMLTableElement = dom.window.HTMLTableElement
global.HTMLUListElement = dom.window.HTMLUListElement
global.HTMLScriptElement = dom.window.HTMLScriptElement
dom.window.scrollTo = ()=>{}
// ==========================
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
        md.use(ab_mdit)
    },
    markdown: {
        headers: {
            level: [1, 2, 3, 4, 5, 6] // 不然的话toc会受限
        },
    },
});
