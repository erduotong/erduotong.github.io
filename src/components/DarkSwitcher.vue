<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import { useDark, useToggle } from '@vueuse/core'
import { Button } from '@/components/ui/button'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <Button @click="toggleDark()" variant="ghost" size="icon-lg">
    <!-- TODO 切换动画 -->
    <Moon class="dark:hidden"></Moon>
    <Sun class="hidden dark:block" />
  </Button>
</template>
