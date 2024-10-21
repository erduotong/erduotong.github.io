/**
 * @fileOverview 允许多个 h1 标题 通过统一的处理方式
 * 用的是很暴力的正则，但是管用
 */

// 逻辑: 在第一个 h1 标题前面加上 ---，这样就可以正常显示了
export default (md) => {
    const originalRender = md.render;

    md.render = function (src, env) {

        const regex = /^(# .+)/m;

        const processedSrc = src.replace(regex, (match) => {
            return `\n***\n${match}`;
        });

        return originalRender.call(md, processedSrc, env);
    };
};