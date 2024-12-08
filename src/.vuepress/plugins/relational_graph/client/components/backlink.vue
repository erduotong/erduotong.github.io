<script setup lang="js">
import {usePageData, useRouter, withBase} from "vuepress/client";
import {computed} from "vue";

const data = usePageData();
const router = useRouter();
const biodata = data.value?.bioChainData;
// console.log(data, biodata);
const hasBacklink = computed(() => {
  return biodata?.backlink && biodata?.backlink?.length > 0;
});

</script>

<template>
  <div>

    <div v-if="!hasBacklink">
      这里没有反向链接
    </div>
    <div v-else>
      <template v-for="item in biodata.backlink">
        <h3>{{ item.title }}</h3>
       <router-link :to="withBase(item.link)">{{ item.link }}</router-link>
      </template>
    </div>


  </div>
</template>

<style scoped>

</style>