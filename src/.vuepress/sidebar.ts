import {sidebar} from "vuepress-theme-hope";

export default sidebar({

    "/": [
        "",
        {
            text: "博客",
            icon: "book",
            prefix: "blogs/",
            link: "blogs/",
            children: "structure",
        },
        {
            text: "关于本站",
            icon: "circle-info",
            prefix: "about_site/",
            link: "about_site/",
            children: "structure"
        },


    ],
});
