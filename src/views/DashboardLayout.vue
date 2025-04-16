<!-- src/views/DashboardLayout.vue -->
<template>
  <div class="dashboard-layout">
    <!-- Pasamos la función de logout como prop o escuchamos evento -->
    <SidebarMenu @logout="handleLogout" />
    <main class="content-area">
      <!-- Renderiza las vistas hijas del dashboard -->
      <router-view v-slot="{ Component }">
        <transition name="fade-main" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import SidebarMenu from '@/components/SiderMenu.vue';
import { useRouter } from 'vue-router';
import { logout } from "../services/authUser.ts";

const router = useRouter();

const handleLogout = async (): void => {

  localStorage.removeItem('user-token');

  try {

    const resp = await logout();
    if (!resp) {
      router.push({ name: 'Login' });
    } else {
      console.log(resp);
    }
  } catch (err) {
    console.log(err);
  }

};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.content-area {
  flex-grow: 1;
  padding: 25px;
  background-color: #3f4040;
  color: white;
  /* Un fondo ligeramente diferente para el contenido */
  overflow-y: auto;
  /* Scroll si el contenido es muy largo */
}

/* Transición para el contenido principal del dashboard */
.fade-main-enter-active,
.fade-main-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-main-enter-from,
.fade-main-leave-to {
  opacity: 0;
}
</style>
