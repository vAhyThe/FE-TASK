<template>
  <div class="app-container">
    <transition name="page" mode="out-in">
      <RouterView />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore'
const themeStore = useThemeStore()
</script>

<style>
.app-container {
  margin: 0 auto;
  height: 100%;
}
</style>
