import {sidebar} from "vuepress-theme-hope";

export default sidebar({

    "/": [
        "",
        {
            text: "站点地图",
            link: "catalog",
            icon: "sort",

        },
        {
            text: "笔记",
            link: "41 笔记/",
            prefix: "41 笔记/",
            icon: "sticky-note",
            children: "structure",
            expanded: false,
            collapsible: true,
        },
        {
            text: "卡片笔记",
            icon: "id-card",
            prefix: "42 卡片笔记/",
            link: "42 卡片笔记/",
            children: "structure",
            expanded: false,
            collapsible: true,
        },
        {
            text: "博客",
            icon: "book",
            prefix: "43 博客/",
            link: "43 博客/",
            children: "structure",
            expanded: false,
            collapsible: true,
        },
        {
            text: "项目",
            icon: "laptop-code",
            prefix: "44 项目/",
            link: "44 项目/",
            children: "structure",
            expanded: false,
            collapsible: true,
        },
        {
            text: "关于",
            icon: "circle-info",
            prefix: "about_site/",
            link: "about_site/",
            children: "structure",
            expanded: false,
            collapsible: true,
        },


    ],
});
