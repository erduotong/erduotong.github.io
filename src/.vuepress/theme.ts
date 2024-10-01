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
    logo: "/logo.png",
    docsDir: "src",
    navbar, // 导航栏设置
    sidebar, // 侧边栏设置
    displayFooter: true,
    fullscreen: true,
    // repo
    repo: "https://github.com/erduotong/erduotong.github.io",
    repoLabel: "Github",
    repoDisplay: true,
    // 博客相关
    blog: {
        description: "欢迎来到耳朵同的博客，请随处逛逛吧",
        intro: "about_site/intro",
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
        comment: {
            provider: "Giscus",
            repo: "erduotong/erduotong.github.io",
            repoID: "R_kgDOM1B4zA",
            category: "Announcements",
            categoryId: "DIC_kwDOM1B4zM4Ci9HB"
        }
    },
}, {
    custom: true,
});
