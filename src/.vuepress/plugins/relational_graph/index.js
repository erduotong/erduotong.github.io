const bioChainMap = {};

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
    console.log(bioChainMap);
}

const relational_graph = () => {

    return {
        name: "vuepress-plugin-relational-graph",
        onPrepared: async (app) => {
            Object.assign(bioChainMap, {});
            buildBioChainMap(app.pages);
        },
        onGenerated: async (app) => {
            console.log("on Generated 11111111111111111\non generated!~~~~~~~~~~~");
        },
    };
};
export default relational_graph;