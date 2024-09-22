import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
    hostname: "https://erduotong.github.io",

    author: {
        name: "耳朵同",
        url: "https://erduotong.github.io",
    },

    iconAssets: "fontawesome-with-brands",

    editLink: false,
    logo: "https://theme-hope-assets.vuejs.press/logo.svg",


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
        description: "欢迎~",
        intro: "/about_site/intro",
    },

    // 加密配置
    encrypt: {
        config: {},
    },

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
