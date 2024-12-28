// noinspection ES6UnusedImports

/**
 * @fileOverview 获取全局图谱的数据
 */
import {MapNodeLink} from "../types/index.js";
import {ref} from "vue";

export const graphDataName = "globalRelationalGraph.js";
export const showGlobalGraph = ref(false);
/**
 * 获取全局图谱的数据
 */
export async function useGlobalGraph(
    isDev: boolean
): Promise<MapNodeLink | null> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
        nodes: [
            {
                id: "catalog.md",
                value: {
                    title: "站点地图",
                    path: "catalog.md",
                    outlink: [],
                    backlink: [],
                },
            },
            {
                id: "README.md",
                value: {
                    title: "博客主页",
                    path: "README.md",
                    outlink: [],
                    backlink: [],
                },
            },
            {
                id: "42 博客/README.md",
                value: {
                    title: "博客目录",
                    path: "42 博客/README.md",
                    outlink: [],
                    backlink: [],
                },
            },
            {
                id: "41 笔记/README.md",
                value: {
                    title: "笔记",
                    path: "41 笔记/README.md",
                    outlink: [],
                    backlink: [],
                },
            },
            {
                id: "43 项目/README.md",
                value: {
                    title: "项目",
                    path: "43 项目/README.md",
                    outlink: [],
                    backlink: [],
                },
            },
            {
                id: "about_site/friend.md",
                value: {
                    title: "友情链接",
                    path: "about_site/friend.md",
                    outlink: [],
                    backlink: ["43 项目/vuepress搭建自己的博客/project.md"],
                },
            },
            {
                id: "about_site/intro.md",
                value: {
                    title: "个人介绍",
                    path: "about_site/intro.md",
                    outlink: [],
                    backlink: [],
                },
            },
            {
                id: "about_site/README.md",
                value: {
                    title: "关于",
                    path: "about_site/README.md",
                    outlink: [],
                    backlink: [],
                },
            },
            {
                id: "about_site/关于本站.md",
                value: {
                    title: "关于本站",
                    path: "about_site/关于本站.md",
                    outlink: [],
                    backlink: [],
                },
            },
            {
                id: "43 项目/vuepress搭建自己的博客/1. 与Obsidian相结合 （一）.md",
                value: {
                    title: "1. 与Obsidian相结合 （一）",
                    path: "43 项目/vuepress搭建自己的博客/1. 与Obsidian相结合 （一）.md",
                    outlink: [
                        "43 项目/vuepress搭建自己的博客/project.md",
                        "43 项目/vuepress搭建自己的博客/2.md",
                    ],
                    backlink: [],
                },
            },
            {
                id: "43 项目/vuepress搭建自己的博客/2.md",
                value: {
                    title: "test2",
                    path: "43 项目/vuepress搭建自己的博客/2.md",
                    outlink: [],
                    backlink: [
                        "43 项目/vuepress搭建自己的博客/1. 与Obsidian相结合 （一）.md",
                    ],
                },
            },
            {
                id: "43 项目/vuepress搭建自己的博客/project.md",
                value: {
                    title: "vuepress搭建自己的博客",
                    path: "43 项目/vuepress搭建自己的博客/project.md",
                    outlink: ["about_site/friend.md"],
                    backlink: [
                        "43 项目/vuepress搭建自己的博客/1. 与Obsidian相结合 （一）.md",
                    ],
                },
            },
        ],
        links: [
            {
                source: "43 项目/vuepress搭建自己的博客/project.md",
                target: "about_site/friend.md",
            },
            {
                source: "43 项目/vuepress搭建自己的博客/1. 与Obsidian相结合 （一）.md",
                target: "43 项目/vuepress搭建自己的博客/project.md",
            },
            {
                source: "43 项目/vuepress搭建自己的博客/1. 与Obsidian相结合 （一）.md",
                target: "43 项目/vuepress搭建自己的博客/2.md",
            },
            {
                source: "43 项目/vuepress搭建自己的博客/1. 与Obsidian相结合 （一）.md",
                target: "43 项目/vuepress搭建自己的博客/2.md",
            },
            {
                source: "43 项目/vuepress搭建自己的博客/1. 与Obsidian相结合 （一）.md",
                target: "43 项目/vuepress搭建自己的博客/project.md",
            },
            {
                source: "43 项目/vuepress搭建自己的博客/project.md",
                target: "about_site/friend.md",
            },
        ],
    };
    // try {
    //   if (isDev) {
    //     const module = await import(/* @vite-ignore */ `/@temp/${graphDataName}`);
    //     return module?.default || null;
    //   } else {
    //     return null;
    //   }
    // } catch (e) {
    //   console.error(e);
    //   return null;
    // }
}
