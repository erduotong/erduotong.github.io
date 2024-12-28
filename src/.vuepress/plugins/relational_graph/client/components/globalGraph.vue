<script setup lang="ts">
import {computed, Ref, ref, watch} from "vue";
import {getGlobalGraph, showGlobalGraph} from "../useGlobalGraph.js";
import {MapNodeLink} from "../../types/index.js";

declare const __VUEPRESS_DEV__: boolean;
const options = computed(() => {
  return {
    isDev: __VUEPRESS_DEV__,
  };
});
const data: Ref<MapNodeLink | null> = ref(null);
let is_loading = false

/**
 * 获取全局图数据 如果已经获取过则直接返回
 */
async function getGlobalGraphData() {
  if (data.value || is_loading) return;

  try {
    is_loading = true;
    data.value = await getGlobalGraph(options.value.isDev);
  } finally {
    is_loading = false;
  }

}

watch(showGlobalGraph, async () => {
  if (showGlobalGraph.value) {
    await getGlobalGraphData();

  }

}, {immediate: true});
</script>

<template>
  <div id="globalGraphMask">
    <div id="globalGraphContainer">
      <button class="fullscreen-map-button">
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
        </svg>
      </button>
      <!--<relation-graph data="" canvas-width="" canvas-height=""></relation-graph>-->
    </div>
  </div>
</template>

<style scoped>
.fullscreen-map-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;
  z-index: 10;
}
</style>
