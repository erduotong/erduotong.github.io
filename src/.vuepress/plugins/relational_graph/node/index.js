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

    return localMap;
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


}

function write_to_frontmatter(page) {
    // 第三次遍历 写入到页面中

    const bioChain = bioChainMap[page.data.filePathRelative];

    if (!bioChain) {
        console.log("notable to find", page.data.filePathRelative);
        return;
    }
    //去个重
    bioChain.outlink = [...new Set(bioChain.outlink)];
    bioChain.backlink = [...new Set(bioChain.backlink)];

    const outlink_array = JSON.parse(JSON.stringify(bioChain.outlink));
    const backlink_array = JSON.parse(JSON.stringify(bioChain.backlink));
    outlink_array.map((link) => {
        return {
            title: bioChainMap[link].title,
            link: link,
        };
    });
    backlink_array.map((link) => {
        return {
            title: bioChainMap[link].title,
            link: link,
        };
    });
    const localMap = generateLocalMap(page.filePathRelative);
    page.data.bioChainData = {
        outlink: outlink_array,
        backlink: backlink_array,
        localMap: localMap,
    };


}


const __dirname = getDirname(import.meta.url);

const relational_graph = () => {
    return {
        name: "vuepress-plugin-relational-graph",
        onInitialized: (app) => {
            console.log('we are waiting')
            Object.assign(bioChainMap, {});
            buildBioChainMap(app.pages);
            initPromiseResolve().then();
        },
        extendsPage: async (page) => {
            write_to_frontmatter(page);
        },
        clientConfigFile: path.resolve(__dirname, "../client/config.js"),

    };
};
export default relational_graph;