<script setup lang="ts">
</script>

<template>
  <!-- Muestra el Login, con efecto transition -->
  <router-view v-slot="{ Component }">
    <transition name="fade-main" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

</template>

<style scoped></style>
