<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import { useDark, useToggle } from '@vueuse/core'
import { Button } from '@/components/ui/button'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <Button @click="toggleDark()" variant="ghost" size="icon-lg">
    <!-- TODO Dark Mode闪烁问题 -->
    <!-- TODO 切换动画 -->
    <Moon v-if="isDark"></Moon>
    <Sun v-else />
  </Button>
</template>
