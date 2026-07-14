<script setup lang="ts">
import {Moon, Sun} from '@lucide/vue'
import {Button} from "@/components/ui/button";
import {useDark, useToggle} from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <Button @click="toggleDark()" variant="ghost" size="icon-lg">
    <Moon v-if="isDark"></Moon>
    <Sun v-else />
  </Button>
</template>
