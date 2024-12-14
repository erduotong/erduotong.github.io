<script setup lang="ts">
import {Layout} from "vuepress-theme-hope/client/export.js";
import Backlink from "./backlink.vue";
import LocalRelationshipMap from "./localRelationshipMap.vue";
</script>

<template>
  <layout>
    <template #contentAfter>
      <backlink></backlink>
    </template>
    <template #tocBefore>
      <local-relationship-map></local-relationship-map>
    </template>
  </layout>
</template>

<style scoped>

</style>