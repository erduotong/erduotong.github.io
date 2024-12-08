<script setup lang="ts">
import {Layout} from "vuepress-theme-hope/client/export.js";
import Backlink from "./backlink.vue";
</script>

<template>
<layout>
  <template #contentAfter>
     <backlink></backlink>
  </template>
</layout>
</template>

<style scoped>

</style>