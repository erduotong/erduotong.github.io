import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
import {cut} from "nodejs-jieba";

export default hopeTheme({
    hostname: "https://blog.erduotong.com",
    author: {
        name: "耳朵同",
        url: "https://blog.erduotong.com",
    },
    editLink: false,
    hotReload: true,
    logo: "/logo.png",
    docsDir: "src",
    navbar, // 导航栏设置
    sidebar, // 侧边栏设置
    displayFooter: true,
    fullscreen: true,
    contributors: false,
    // repo
    repo: "https://github.com/erduotong/erduotong.github.io",
    repoLabel: "Github",
    repoDisplay: true,
    // 博客相关
    blog: {
        name: "耳朵同",
        description: "欢迎回来",
        intro: "about_site/intro",
        medias: {
            Github: "https://github.com/erduotong",
            BiliBili: "https://space.bilibili.com/1486177608",
            Email: "erduotong@qq.com"
        },
        timeline: "所谓开拓，就是沿着前人未尽的道路，走出更遥远的距离...",
    },
    navbarLayout: {
        start: ['Brand'],
        center: [],
        end: ['Search', 'Links', 'Repo', 'Outlook'],
    },
    markdown: {

        figure: true,
        imgLazyload: true,
        imgSize: true,

        math: {
            type: "katex",

        },
        sub: true,
        sup: true,

        tasklist: true,
        include: true,
        footnote: true,
        mark: true,
        mermaid: true,
        breaks: true,
    },


    // 在这里配置主题提供的插件
    plugins: {
        blog: true,
        components: {
            components: ["Badge", "VPCard"],
        },


        feed: {
            atom: true,
            rss: true,
            json: true,
            image: "/logo.png",
            icon: "/logo.png",
            devServer: true
        },
        comment: {
            provider: "Giscus",
            repo: "erduotong/erduotong.github.io",
            repoId: "R_kgDOM1B4zA",
            category: "Announcements",
            categoryId: "DIC_kwDOM1B4zM4Ci9HB",
        },

        slimsearch: {
            indexContent: true,
            indexOptions: {
                // 使用 nodejs-jieba 进行分词
                tokenize: (text, fieldName) =>
                    fieldName === 'id' ? [text] : cut(text, true),
            },
        },
        icon: {
            assets: "fontawesome-with-brands"
        }
    },
}, {
    custom: true,
});
