<script setup lang="ts">
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import type { NavItem } from '@/types/nav.ts'

defineProps<{
	items: NavItem[]
}>()
</script>

<template>
  <div class="w-full flex justify-center ">
    <NavigationMenu>
      <NavigationMenuList>
        <template v-for="item in items" :key="item.title">
          <NavigationMenuItem v-if="item.type==='link'">
            <NavigationMenuLink
                :class="navigationMenuTriggerStyle()"
                :href="item.href"
            >
              {{ item.title }}
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem v-else>
            <NavigationMenuTrigger>{{item.title}}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="grid w-50 gap-4">
                <li>
                  <NavigationMenuLink as-child v-for="child in item.children">
                    <a :href="child.href">
                      {{ child.title}}
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </template>
      </NavigationMenuList>

    </NavigationMenu>
  </div>
</template>