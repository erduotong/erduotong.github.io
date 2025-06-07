import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

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

        docsearch: {
            apiKey: "15a9f03171fcf4ace1777c109ae50ba2",
            indexName: "blog.erduotong.com",
            appId: "VQ59113T2I",
            placeholder: "搜索文档",
            translations: {
                button: {
                    buttonText: '搜索文档',
                    buttonAriaLabel: '搜索文档',
                },
                modal: {
                    searchBox: {
                        resetButtonTitle: '清除查询条件',
                        resetButtonAriaLabel: '清除查询条件',
                        cancelButtonText: '取消',
                        cancelButtonAriaLabel: '取消',
                    },
                    startScreen: {
                        recentSearchesTitle: '搜索历史',
                        noRecentSearchesText: '没有搜索历史',
                        saveRecentSearchButtonTitle: '保存至搜索历史',
                        removeRecentSearchButtonTitle: '从搜索历史中移除',
                        favoriteSearchesTitle: '收藏',
                        removeFavoriteSearchButtonTitle: '从收藏中移除',
                    },
                    errorScreen: {
                        titleText: '无法获取结果',
                        helpText: '你可能需要检查你的网络连接',
                    },
                    footer: {
                        selectText: '选择',
                        navigateText: '切换',
                        closeText: '关闭',
                        searchByText: '搜索提供者',
                    },
                    noResultsScreen: {
                        noResultsText: '无法找到相关结果',
                        suggestedQueryText: '你可以尝试查询',
                        reportMissingResultsText: '你认为该查询应该有结果？',
                        reportMissingResultsLinkText: '点击反馈',
                    },
                }
            },
            maxResultsPerGroup: 5,
            indexBase: "https://blog.erduotong.com",

        },
        icon: {
            assets: "fontawesome-with-brands"
        }
    },
}, {
    custom: true,
});
