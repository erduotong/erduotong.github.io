<script setup lang="ts">
import { Menu, X } from '@lucide/vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Sidebar, SidebarGroup, SidebarProvider } from '@/components/ui/sidebar'
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
        class="fixed inset-x-0 top-header bottom-0 z-40 flex flex-col items-center
        overflow-y-auto overscroll-contain bg-background p-4 "
    >
      <div class="w-full max-w-80">
        <template v-for="(value,index) in items" :id="index">
            <Collapsible v-if="value.type==='menu'">
              <CollapsibleTrigger>
                {{value.title}}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <template v-for="(child,idx) in value.children" :id="idx">
                  <a :href="child.href">{{child.title}}</a>
                </template>
              </CollapsibleContent>
            </Collapsible>
            <div v-else>
              <a :href="value.href">{{value.title}}</a>
            </div>
        </template>
      </div>


    </div>

  </Teleport>
</template>


