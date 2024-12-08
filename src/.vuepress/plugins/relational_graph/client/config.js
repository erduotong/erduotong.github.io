/**
 * @fileOverview clientConfig.js
 * @author erduotong
 */
import {defineClientConfig} from "vuepress/client";
import Layout from "./components/Layout.vue";


export default defineClientConfig({
    enhance({
                app,
                router,
                siteData,
            }) {

    },
    setup() {
    },
    layouts: {
        Layout: Layout,
    },
    rootComponents: [],
});