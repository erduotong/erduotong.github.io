/**
 * @fileOverview clientConfig.ts
 * @author erduotong
 */
import { defineClientConfig } from "vuepress/client";
import Layout from "./components/Layout.vue";
import type { ClientConfig } from "vuepress/client";

export default defineClientConfig({
  enhance({ app, router, siteData }) {},
  setup() {},
  layouts: {
    Layout,
  },
  rootComponents: [],
}) as ClientConfig;
