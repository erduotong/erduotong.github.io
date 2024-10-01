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
            text: "博客",
            icon: "book",
            prefix: "blogs/",
            link: "blogs/",
            children: "structure",
        },
        {
            text: "项目",
            icon: "laptop-code",
            prefix: "projects/",
            link: "projects/",
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
