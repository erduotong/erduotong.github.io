import {defineClientConfig} from "vuepress/client";
import websiteFooter from "./components/websiteFooter.vue"


export default defineClientConfig({
    enhance({app, router, siteData}) {
        app.component("website-footer", websiteFooter)
    },
    setup() {
    },
    rootComponents: [],
});