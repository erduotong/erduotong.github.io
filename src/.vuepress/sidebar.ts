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
            link: "/40 Archive/博客",
            icon: "book",
            children: "structure",
            expanded: false,
            collapsible: true,
        },
        {
            text: "项目",
            icon: "laptop-code",
            prefix: "10 Project/",
            link: "10 Project/",
            children: "structure",
            expanded: false,
            collapsible: true,
        },
        {
            text: "领域",
            icon: "layer-group",
            prefix: "20 Area/",
            link: "20 Area/",
            children: "structure",
            expanded: false,
            collapsible: true,
        },
        {
            text: "资源",
            icon: "boxes-stacked",
            prefix: "30 Resource/",
            link: "30 Resource/",
            children: "structure",
            expanded: false,
            collapsible: true,
        },
        {
            text: "归档",
            icon: "box-archive",
            prefix: "40 Archive/",
            link: "40 Archive/",
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
