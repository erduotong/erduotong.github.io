<script setup lang="ts">
import {Layout} from "vuepress-theme-hope/client/export.js";
import Backlink from "./backlink.vue";
import LocalRelationshipMap from "./localRelationshipMap.vue";
import {computed} from "vue";
import GlobalGraph from "./globalGraph.vue";
import {showGlobalGraph} from "../useGlobalGraph.js";

declare const __RELATIONAL_GRAPH_ENABLE_LOCAL_GRAPH: boolean;
const options = computed(() => {
  return {
    enableLocalGraph: __RELATIONAL_GRAPH_ENABLE_LOCAL_GRAPH,
  };
});

</script>

<template>
  <button @click="showGlobalGraph = !showGlobalGraph">reverse</button>
  <global-graph></global-graph>
  <layout>
    <template #contentAfter>
      <backlink></backlink>
    </template>
    <template #tocBefore>
      <local-relationship-map v-if="options.enableLocalGraph"></local-relationship-map>
    </template>
  </layout>
</template>

<style scoped>

</style>