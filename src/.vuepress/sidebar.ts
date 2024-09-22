import {sidebar} from "vuepress-theme-hope";

export default sidebar({

    "/": [
        "",
        {
            text: "文章",
            icon: "book",
            prefix: "posts/",
            link: "posts/",
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
