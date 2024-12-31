import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",
    {
        text: "总览",
        icon: "server",
        children: [
            {
                text: "站点地图",
                link: "/catalog.html",
                icon: "sort",
            },
            {
                text: "笔记",
                link: "/41 笔记/",
                icon: "sticky-note"
            },
            {
                text: "卡片笔记",
                link: "/42 卡片笔记/",
                icon: "id-card"
            },
            {
                text: "博客",
                link: "/43 博客/",
                icon: "book"
            },
            {
                text: "项目",
                link: "/44 项目/",
                icon: "laptop-code"
            },
        ]
    },
    {
        text: "分类",
        icon: "database",
        children: [
            {
                text: "全部",
                link: "/article/",
                icon: "file-text"
            },

            {
                text: "时间线",
                link: "/timeline/",
                icon: "clock"
            },
            {
                text: "标签",
                link: "/tag/",
                icon: "tag"
            },
            {
                text: "分类",
                link: "/category/",
                icon: "folder"
            },
        ]
    },
    {
        text: "关于",
        icon: "info-circle",
        children: [
            {
                text: "关于本站",
                link: "/about_site/关于本站.md",
                icon: "info-circle"
            },
            {
                text: "关于我",
                link: "/about_site/intro.md",
                icon: "user"
            },
            {
                text: "友链",
                link: "/about_site/friend.md",
                icon: "link"
            }
        ]
    },

]);
