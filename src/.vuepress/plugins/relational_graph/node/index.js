/**
 * @fileOverview index.js
 * @author erduotong
 */
import {getDirname, path} from "vuepress/utils";

const bioChainMap = {};
const max_deep = 5;


function generateLocalMap(root) {
    const localMap = {};
    const queue = [{
        path: root,
        depth: 0,
    }];
    const visited = new Set();

    while (queue.length > 0) {
        const {
            path,
            depth,
        } = queue.shift();

        if (depth > max_deep || visited.has(path)) {
            continue;
        }

        visited.add(path);
        localMap[path] = {
            title: bioChainMap[path].title,
            path: path,
            outlink: [],
            backlink: [],
        };

        const outlinks = bioChainMap[path].outlink;
        const backlinks = bioChainMap[path].backlink;

        outlinks.forEach((link) => {
            if (!visited.has(link) && depth + 1 <= max_deep) {
                queue.push({
                    path: link,
                    depth: depth + 1,
                });
                localMap[path].outlink.push(link);
            }
        });

        backlinks.forEach((link) => {
            if (!visited.has(link) && depth + 1 <= max_deep) {
                queue.push({
                    path: link,
                    depth: depth + 1,
                });
                localMap[path].backlink.push(link);
            }
        });
    }
    // 转成node-link的格式
    const localMapNodeLink = {
        nodes: [],
        links: [],
    };
    for (const key of Object.keys(localMap)) {
        localMapNodeLink.nodes.push({
            id: key,
            value: {
                ...localMap[key],
            },
        });
        localMap[key].outlink.forEach((link) => {
            localMapNodeLink.links.push({
                source: key,
                target: link,
            });
        });
        localMap[key].backlink.forEach((link) => {
            localMapNodeLink.links.push({
                source: link,
                target: key,
            });
        });


    }
    return localMapNodeLink;
}

function buildBioChainMap(pages) {

    // 生成双链
    for (const page of pages) {
        if (!page.filePathRelative) {
            continue;
        }
        bioChainMap[page.filePathRelative] = {
            title: page.title,
            outlink: [],
            backlink: [],
        };
    }
    // 第二次遍历，判断出链
    for (const page of pages) {
        const links = [];
        for (const link of page.links) {
            links.push(decodeURIComponent(link.relative));
        }
        links.forEach((link) => {
            if (bioChainMap[link]) {
                bioChainMap[link].backlink.push(page.filePathRelative);
                bioChainMap[page.filePathRelative].outlink.push(link);
            }
        });
    }

    for (const page of pages) {
        write_to_frontmatter(page);
    }
}

function write_to_frontmatter(page) {
    // 第三次遍历 写入到页面中

    // noinspection JSUnresolvedReference
    const bioChain = bioChainMap[page.data.filePathRelative];

    if (!bioChain) {
        return;
    }
    //去个重
    bioChain.outlink = [...new Set(bioChain.outlink)];
    bioChain.backlink = [...new Set(bioChain.backlink)];

    const outlink_array = JSON.parse(JSON.stringify(bioChain.outlink));
    const backlink_array = JSON.parse(JSON.stringify(bioChain.backlink));

    const outlink_result = [];
    for (let i = 0; i < outlink_array.length; i++) {
        let link = outlink_array[i];
        if (link.endsWith(".md")) {
            link = link.replace(/\.md$/, ".html");
        }
        outlink_result.push({
            title: bioChainMap[outlink_array[i]].title,
            link: link,
        });
    }

    const backlink_result = [];
    for (let i = 0; i < backlink_array.length; i++) {
        let link = backlink_array[i];
        if (link.endsWith(".md")) {
            link = link.replace(/\.md$/, ".html");
        }
        backlink_result.push({
            title: bioChainMap[backlink_array[i]].title,
            link: link,
        });
    }
    const localMap = generateLocalMap(page.filePathRelative);
    page.data.bioChainData = {
        outlink: outlink_result,
        backlink: backlink_result,
        localMap: localMap,
    };


}


const __dirname = getDirname(import.meta.url);

const relational_graph = () => {
    return {
        name: "vuepress-plugin-relational-graph",
        onInitialized: (app) => {
            Object.assign(bioChainMap, {});
            buildBioChainMap(app.pages);
        },

        clientConfigFile: path.resolve(__dirname, "../client/config.js"),

    };
};
export default relational_graph;