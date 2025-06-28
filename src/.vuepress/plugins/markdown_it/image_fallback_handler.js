// Vite 插件：处理不存在的文件导入
import fs from "fs";
import path from "path";

const VIRTUAL_ID_PREFIX = "\0virtual:import-fallback:";

export default function imagePathFallbackPlugin(options = {}) {
    // 默认使用 /404_image.png 作为备用图片
    const fallbackImagePath = options.fallback || "/404_image.png";

    return {
        name: "vite-plugin-import-fallback",

        async resolveId(source, importer, { isEntry }) {
            // 跳过入口文件
            if (isEntry) return null;

            try {
                // 尝试使用 Vite 的默认解析
                const resolved = await this.resolve(source, importer, {
                    skipSelf: true,
                });

                // 如果解析成功，返回 null 让 Vite 继续处理
                if (resolved) return null;

                // 如果解析失败，返回我们的虚拟模块 ID
                console.log(
                    `[ImportFallback] 无法解析导入: ${source}，使用备用图片: ${fallbackImagePath}`
                );
                return VIRTUAL_ID_PREFIX + source;
            } catch (error) {
                // 出错时也使用备用图片
                console.error(`[ImportFallback] 解析错误:`, error);
                return VIRTUAL_ID_PREFIX + source;
            }
        },

        load(id) {
            // 检查是否是我们的虚拟模块 ID
            if (id.startsWith(VIRTUAL_ID_PREFIX)) {
                // 返回导出备用图片路径的代码
                return `export default "${fallbackImagePath}";`;
            }

            return null;
        },
    };
}
