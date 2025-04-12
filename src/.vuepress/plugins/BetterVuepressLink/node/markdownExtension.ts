import { existsSync } from "fs";
import { resolve, dirname, join, parse } from "path";
import MarkdownIt from "markdown-it";

/**
 * 扩展Markdown处理，检测内部链接有效性
 */
export const extendMarkdown = (md: MarkdownIt): void => {
    // 保存原始的链接渲染器
    const defaultRender =
        md.renderer.rules.link_open ||
        ((tokens, idx, options, env, self) =>
            self.renderToken(tokens, idx, options));

    // 重写链接渲染器
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const hrefIndex = token.attrIndex("href");

        if (hrefIndex < 0)
            return defaultRender(tokens, idx, options, env, self);

        const href = token.attrs[hrefIndex][1];
        const sourceFilePath = env.filePath;

        // 跳过外部链接、锚点链接或无源文件路径的情况
        if (
            !sourceFilePath ||
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("#")
        ) {
            return defaultRender(tokens, idx, options, env, self);
        }

        // 处理内部链接
        if (isInternalLink(href)) {
            const targetPath = resolveTargetPath(href, sourceFilePath);

            // 检查链接是否有效
            if (!isValidLink(targetPath)) {
                token.attrPush(["class", "broken-link"]);
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};

/**
 * 判断是否为内部链接
 */
function isInternalLink(href: string): boolean {
    return (
        href.startsWith("./") ||
        href.startsWith("../") ||
        href.startsWith("@/") ||
        href.startsWith("@") ||
        (!href.includes("://") && !href.startsWith("#"))
    );
}

/**
 * 解析目标路径
 */
function resolveTargetPath(href: string, sourceFilePath: string): string {
    let targetPath: string;

    // 处理@别名开头的链接
    if (href.startsWith("@/")) {
        // @/表示src目录
        targetPath = resolve(process.cwd(), "src", href.slice(2));
    } else if (href.startsWith("@")) {
        // @xxx.md 表示相对路径
        const fileName = href.slice(1); // 移除@
        targetPath = resolve(dirname(sourceFilePath), fileName);
    } else {
        // 处理相对路径
        targetPath = resolve(dirname(sourceFilePath), href);
    }

    // 处理没有扩展名的链接
    const parsedPath = parse(targetPath);
    if (!parsedPath.ext) {
        // 检查是否为目录
        if (existsSync(targetPath) && !existsSync(targetPath + ".md")) {
            targetPath = join(targetPath, "README.md");
        } else {
            targetPath += ".md";
        }
    }

    return targetPath;
}

/**
 * 检查链接是否有效
 */
function isValidLink(targetPath: string): boolean {
    if (existsSync(targetPath)) return true;

    // 检查其他常见扩展名
    const parsedPath = parse(targetPath);
    const otherExtensions = [".html", ".htm", ".vue"];

    return otherExtensions.some((ext) =>
        existsSync(parsedPath.dir + "/" + parsedPath.name + ext)
    );
}
