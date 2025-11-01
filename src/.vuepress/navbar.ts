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
                text: "博客",
                link: "/40 Archive/博客/",
                icon: "blog",
            },
            {
                text: "卡片笔记",
                link: "/60 卡片笔记/",
                icon: "note-sticky",
            },
            {
                text: "项目",
                link: "/10 Project/",
                icon: "laptop-code"
            },
            {
                text: "领域",
                link: "/20 Area/",
                icon: "layer-group"
            },
            {
                text: "资源",
                link: "/30 Resource/",
                icon: "boxes-stacked"
            },
            {
                text: "归档",
                link: "/40 Archive/",
                icon: "box-archive"
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
