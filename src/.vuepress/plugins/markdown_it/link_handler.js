export default (md) => {
    // 保存原始的 render 方法
    const originalRender = md.render;

    // 重写 render 方法
    md.render = function (src, env) {
        // 在渲染之前对文本进行预处理
        const processedSrc = src.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, p1, p2) => {
            // 替换链接中的空格为 %20
            const newLink = p2.replace(/ /g, "%20");
            return `[${p1}](${newLink})`;
        });

        // 调用原始的 render 方法
        return originalRender.call(md, processedSrc, env);
    };
};