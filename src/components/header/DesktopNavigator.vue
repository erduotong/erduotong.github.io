<script setup lang="ts">
import {
	NavigationMenu,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
</script>

<template>
  <div class="w-full flex justify-center ">
    <NavigationMenu :viewport="false">
      <NavigationMenuLink as-child :class="navigationMenuTriggerStyle()">
        <a href="/blog/">博客</a>
      </NavigationMenuLink>
    </NavigationMenu>
  </div>
</template>