<script setup lang="ts">
import { ChevronDown, Menu, X } from '@lucide/vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Button, buttonVariants } from '@/components/ui/button'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils.ts'
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
const navItemClass = cn(
	buttonVariants({ variant: 'ghost' }),
	'w-full h-auto justify-start rounded-md px-3 py-2.5 text-left text-sm font-medium',
)

const navSubItemClass = cn(
	buttonVariants({ variant: 'ghost', size: 'sm' }),
	'w-full h-auto justify-start rounded-md px-2 py-1.5 text-sm',
)
</script>

<template>
  <Button
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
        overflow-y-auto overscroll-contain bg-background p-4"
    >
      <nav class="flex w-full max-w-80 flex-col gap-1">
        <template v-for="item in items" :key="item.title">
          <a
              v-if="item.type === 'link'"
              :href="item.href"
              :class="navItemClass"
          >
            {{ item.title }}
          </a>
          <Collapsible v-else>
            <CollapsibleTrigger
                :class="cn(navItemClass, 'group justify-between')"
            >
              <span>{{ item.title }}</span>
              <ChevronDown
                  aria-hidden="true"
                  class="pointer-events-none size-4 shrink-0 text-muted-foreground
                  transition-transform duration-200
                  group-data-[state=closed]:-rotate-90 group-data-[state=open]:rotate-0"
              />
            </CollapsibleTrigger>
            <CollapsibleContent
                class="overflow-hidden"
            >
              <ul class="mt-1 mb-2 ml-4 flex flex-col gap-0.5 border-l py-1 pl-2">
                <li v-for="child in item.children" :key="child.title">
                  <a :href="child.href" :class="navSubItemClass">
                    {{ child.title }}
                  </a>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </template>
      </nav>
    </div>
  </Teleport>
</template>
