<script setup lang="ts">
import { Menu, X } from '@lucide/vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import type { NavItem } from '@/types/nav.ts'

defineProps<{
	items: NavItem[]
}>()

const open = ref(false)

async function toggleMenu() {
	open.value = !open.value
}

function closeMenu() {
	if (!open.value) {
		return
	}
	open.value = false
}

watch(open, (value) => {
	document.body.style.overflow = value ? 'hidden' : ''
})

let mediaQuery: MediaQueryList | null = null

function onMediaChange(event: MediaQueryListEvent) {
	if (event.matches) closeMenu()
}
const mounted = ref(false)
onMounted(() => {
	mounted.value = true
	mediaQuery = window.matchMedia('(min-width: 1024px)')
	mediaQuery.addEventListener('change', onMediaChange)
})

onBeforeUnmount(() => {
	mediaQuery?.removeEventListener('change', onMediaChange)
	document.body.style.overflow = ''
})
</script>

<template>
  <Button
      ref="triggerRef"
      variant="ghost"
      size="icon-lg"
      type="button"
      :aria-expanded="open"
      :aria-label="open ? '关闭菜单' : '打开菜单'"
      @click="toggleMenu"
  >

    <X v-if="open" />
    <Menu v-else />

  </Button>

  <Teleport v-if="mounted" to="#mobile-menu-container">

    <div
        v-if="open"
        tabindex="-1"
        aria-label="站点导航"
        class="fixed inset-x-0 top-header bottom-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-background/90 "
    >
        <div class="p-3">
          <Button>一些测试内容</Button>
          <Button>嗯对</Button>
        </div>
    </div>

  </Teleport>
</template>


