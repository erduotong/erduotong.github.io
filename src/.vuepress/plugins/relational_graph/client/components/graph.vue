<script setup lang="ts">
import {ref} from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  currentPath: {
    type: String,
    required: true,
  }
})
const emit = defineEmits(['nodeClick']);
const canvasSize = ref({
  width: props.width,
  height: props.height,
});

</script>

<template>

</template>

<style scoped>

</style>