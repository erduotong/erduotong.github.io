//import resolve from '@rollup/plugin-node-resolve'
//import terser from '@rollup/plugin-terser'
//import { babel } from '@rollup/plugin-babel'
import {readFileSync} from "fs";

const pkg = JSON.parse(readFileSync(new URL("package.json", import.meta.url)));

function globalName(name) {
    const parts = name.split("-");
    for (let i = 2; i < parts.length; i++) {
        parts[i] = parts[i][0].toUpperCase() + parts[i].slice(1);
    }
    return parts.join("");
}

const config_umd_full = {
    input: "index_mdit.js",
    output: [
        {
            file: `dist/${pkg.name}.js`,
            format: "umd",
            name: globalName(pkg.name),
            plugins: [],
        },
        {
            file: `dist/${pkg.name}.min.js`,
            format: "umd",
            name: globalName(pkg.name),
            plugins: [],
        },
    ],
    plugins: [],
};

const config_cjs_no_deps = {
    input: "index_mdit.js",
    output: {
        file: "dist/index.cjs.js",
        format: "cjs",
    },
    external: Object.keys(pkg.dependencies || {}),
    plugins: [],
};

let config = [
    config_umd_full,
    config_cjs_no_deps,
];

if (process.env.CJS_ONLY) {
    config = [config_cjs_no_deps];
}

export default config
