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
            link: "/41 笔记/",
            icon: "sticky-note"
        },
        {
            text: "博客",
            icon: "book",
            prefix: "42 博客/",
            link: "42 博客/",
            children: "structure",
        },
        {
            text: "项目",
            icon: "laptop-code",
            prefix: "43 项目/",
            link: "43 项目/",
            children: "structure",
        },
        {
            text: "关于",
            icon: "circle-info",
            prefix: "about_site/",
            link: "about_site/",
            children: "structure",
        },


    ],
});
