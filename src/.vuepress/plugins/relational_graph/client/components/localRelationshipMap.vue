<script setup lang="ts">
import {usePageData} from "vuepress/client";

const data = usePageData();
// @ts-ignore
const map_data = data.value?.bioChainData?.localMap;
console.log(map_data);
</script>

<template>

</template>

<style scoped>

</style>