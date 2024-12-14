<script setup lang="js">
import {usePageData} from "vuepress/client";
import * as d3 from "d3";

const data = usePageData();

const map_data = data.value?.bioChainData?.localMap;
console.log(map_data);
const root = d3.hierarchy(map_data);
const nodes = root.descendants();
const links = root.links();
const width = 200;
const height = 200;
const  transform = d3.zoomIdentity;



</script>

<template>
  <canvas id="local-relation-map-canvas" :height="height" :width="width"></canvas>
</template>

<style scoped>

</style>