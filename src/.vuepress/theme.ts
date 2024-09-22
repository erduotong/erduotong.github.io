import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
    hostname: "https://mister-hope.github.io",

    author: {
        name: "Mr.Hope",
        url: "https://mister-hope.com",
    },

    iconAssets: "fontawesome-with-brands",

    logo: "https://theme-hope-assets.vuejs.press/logo.svg",

    repo: "vuepress-theme-hope/vuepress-theme-hope",

    docsDir: "src",

    // 导航栏
    navbar,

    // 侧边栏
    sidebar,

    // 页脚
    footer: "默认页脚",
    displayFooter: true,

    // 博客相关
    blog: {
        description: "一个前端开发者",
        intro: "/intro.html",
    },

    // 加密配置
    encrypt: {
        config: {
            "/demo/encrypt.html": ["1234"],
        },
    },

    // 多语言配置
    metaLocales: {
        editLink: "在 GitHub 上编辑此页",
    },

    // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
    // hotReload: true,

    // 在这里配置主题提供的插件
    plugins: {
        blog: true,
        components: {
            components: ["Badge", "VPCard"],
        },

        markdownImage: {
            figure: true,
            lazyload: true,
            size: true,
        },

        markdownMath: {
            type: "katex",
        },

        // 此处开启了很多功能用于演示，你应仅保留用到的功能。
        mdEnhance: {
            //角标
            sub: true,
            sup: true,

            tasklist: true,
            include: true,
            footnote: true,
            tabs: true,
            hint: true,
            mark: true,
            mermaid: true,
        },


    },
});
