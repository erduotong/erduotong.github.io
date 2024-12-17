// 添加路径匹配工具函数
export function isPathMatch(routePath, nodePath) {
    // 1. 解码 URL 编码的字符
    const decodedRoutePath = decodeURIComponent(routePath);

    // 2. 移除两个路径的后缀（.html 和 .md 等）
    const cleanRoutePath = decodedRoutePath.replace(/\.[^/.]+$/, "");
    const cleanNodePath = nodePath.replace(/\.[^/.]+$/, "");

    // 3. 移除开头的斜杠
    const normalizedRoutePath = cleanRoutePath.replace(/^\//, "");
    const normalizedNodePath = cleanNodePath.replace(/^\//, "");

    return normalizedRoutePath === normalizedNodePath;
}
