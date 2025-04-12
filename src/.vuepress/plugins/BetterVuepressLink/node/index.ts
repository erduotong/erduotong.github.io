import { App, PluginObject } from "vuepress";
import { resolve, dirname, join, parse } from "path";
import { existsSync } from "fs";
import {getDirname, path} from "vuepress/utils";
/**
 * VuePress插件：检测网站内部链接有效性
 * 对于目标不存在的内部链接，添加特殊class标记
 */
const __dirname = getDirname(import.meta.url);
const BetterVuepressLink = (): PluginObject => {
    return {
        name: "vuepress-plugin-better-vuepress-link",

        extendsMarkdown: (md) => {
            // 保存原始的链接渲染器
            const defaultRender =
                md.renderer.rules.link_open ||
                function (tokens, idx, options, env, self) {
                    return self.renderToken(tokens, idx, options);
                };

            // 重写链接渲染器
            md.renderer.rules.link_open = function (
                tokens,
                idx,
                options,
                env,
                self
            ) {
                const token = tokens[idx];
                const hrefIndex = token.attrIndex("href");
                if (hrefIndex < 0)
                    return defaultRender(tokens, idx, options, env, self);

                const href = token.attrs[hrefIndex][1];
                const sourceFilePath = env.filePath;

                // 跳过外部链接和锚点链接
                if (
                    !sourceFilePath ||
                    href.startsWith("http://") ||
                    href.startsWith("https://") ||
                    href.startsWith("#")
                ) {
                    return defaultRender(tokens, idx, options, env, self);
                }

                // 判断是否为内部链接（相对路径、@别名或直接的文件名）
                if (
                    href.startsWith("./") ||
                    href.startsWith("../") ||
                    href.startsWith("@/") ||
                    href.startsWith("@") ||
                    (!href.includes("://") && !href.startsWith("#"))
                ) {
                    let targetPath = "";

                    // 处理@别名开头的链接
                    if (href.startsWith("@/")) {
                        // @/表示src目录
                        targetPath = resolve(
                            process.cwd(),
                            "src",
                            href.slice(2)
                        );
                    } else if (href.startsWith("@")) {
                        // @xxx.md 表示相对路径
                        const fileName = href.slice(1); // 移除@
                        targetPath = resolve(dirname(sourceFilePath), fileName);
                    } else if (
                        href.startsWith("./") ||
                        href.startsWith("../")
                    ) {
                        // 处理相对路径
                        targetPath = resolve(dirname(sourceFilePath), href);
                    } else {
                        // 处理不带./的相对路径，如"file.md"
                        targetPath = resolve(dirname(sourceFilePath), href);
                    }

                    // 处理没有扩展名的链接（可能是目录或markdown文件）
                    const parsedPath = parse(targetPath);
                    if (!parsedPath.ext) {
                        // 检查是否为目录
                        if (
                            existsSync(targetPath) &&
                            !existsSync(targetPath + ".md")
                        ) {
                            targetPath = join(targetPath, "README.md");
                        } else {
                            targetPath += ".md";
                        }
                    }

                    // 如果链接目标不存在，添加特殊class
                    if (!existsSync(targetPath)) {
                        // 检查是否存在其他常见扩展名（如.html）
                        const otherExtensions = [".html", ".htm", ".vue"];
                        let fileExists = false;

                        for (const ext of otherExtensions) {
                            const altPath =
                                parsedPath.dir + "/" + parsedPath.name + ext;
                            if (existsSync(altPath)) {
                                fileExists = true;
                                break;
                            }
                        }

                        if (!fileExists) {
                            token.attrPush(["class", "broken-link"]);
                        }
                    }
                }

                return defaultRender(tokens, idx, options, env, self);
            };
        },

        clientConfigFile: path.resolve(__dirname, "../client/config.ts"),
    };
};

export default BetterVuepressLink;
