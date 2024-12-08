<script setup lang="js">
import {usePageFrontmatter} from "vuepress/client";
import {computed} from "vue";

const data = usePageFrontmatter();
console.log(data.value.bioChainData);
const hasBacklink = computed(() => {

})

</script>

<template>
  <div>

    <div v-if="!hasBacklink">
      这里没有双链！
    </div>


  </div>
</template>

<style scoped>

</style>