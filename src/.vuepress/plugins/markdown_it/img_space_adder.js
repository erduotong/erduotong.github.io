const imageTypes = [
    "png", "jpg", "jpeg", "gif", "svg", "bmp", "tiff", "webp", "ico", "heic",
    "heif", "jfif", "pjpeg", "pjp", "apng", "avif", "tga", "dds", "ai", "eps",
    "psd", "raw", "cr2", "nef", "orf", "sr2", "svgz", "dng", "arw", "rw2",
];
export default (md) => {

    const originalRender = md.render;

    md.render = function (src, env) {

        const imageTypesPattern = imageTypes.join("|");
        const regex = new RegExp(`!\\[([^\\]]+)\\]\\(([^)]+\\.(?:${imageTypesPattern}))\\)`, "g");


        const processedSrc = src.replace(regex, (match) => {

            return `\n\n${match}\n\n`;
        });


        return originalRender.call(md, processedSrc, env);
    };
};