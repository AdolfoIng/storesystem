<!-- src/views/DashboardLayout.vue -->
<template>
  <div class="flex min-h-screen bg-gray-950 text-white">
    <SidebarMenu @logout="handleLogout" />

    <!-- Mobile layout -->
    <div class="flex-1 flex flex-col w-full">
      <!-- Header (mobile only) -->
      <header class="md:hidden bg-gray-900 w-full p-4 flex justify-between items-center border-b border-gray-800">
        <h2 class="text-lg font-bold">Mi Dashboard</h2>
        <button @click="menuOpen = !menuOpen">
          <MenuIcon class="w-6 h-6 text-white" />
        </button>
      </header>

      <!-- Mobile menu -->
      <transition name="fade">
        <div v-if="menuOpen" class="md:hidden bg-gray-900 border-b border-gray-800 px-4 py-2 z-10">
          <nav class="flex flex-col space-y-3">
            <RouterLink v-for="item in menuItems" :key="item.name" :to="item.to"
              class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition"
              active-class="bg-emerald-600" @click="menuOpen = false">
              <component :is="item.icon" class="w-5 h-5" />
              {{ item.name }}
            </RouterLink>

            <div @click="handleLogout"
              class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-400 transition hover:cursor-pointer">

              <LogOutIcon class="w-6 h-6 text-white" />
              <h2>Salir</h2>
            </div>

          </nav>
        </div>
      </transition>

      <!-- Main content -->
      <main class="flex-1 p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade-main" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SidebarMenu from '@/components/SiderMenu.vue';
import { useRouter } from 'vue-router';
import { useAuth } from "../services/authUser.ts"; // Ajusta la ruta si es necesario

const menuOpen = ref(false)

const router = useRouter();
const { signOut } = useAuth();
import { HomeIcon, BoxIcon, SettingsIcon, MenuIcon, LogOutIcon } from 'lucide-vue-next'

const menuItems = [
  { name: 'Home', to: '/dashboard/home', icon: HomeIcon },
  { name: 'Ver Productos', to: '/dashboard/inventory', icon: BoxIcon },
  { name: 'Register Product', to: '/dashboard/register', icon: SettingsIcon },
  /* { name: 'Logout', to: '/logout', icon: LogOutIcon }, */
]

const handleLogout = async (): void => {
  localStorage.removeItem('user-token'); // Considera mover esto después del signOut exitoso

  try {
    const resp = await signOut();
    if (!resp) { // Asumiendo que null/undefined significa éxito
      router.push({ name: 'Login' });
    } else {
      console.error("Logout failed:", resp);
      // Podrías querer mostrar un error al usuario pero quizás igual redirigir
      router.push({ name: 'Login' });
    }
  } catch (err) {
    console.error("An error occurred during logout:", err);
    router.push({ name: 'Login' }); // Redirigir en caso de error de red/excepción
  }
};


</script>

<!-- ¡Bloque <style> eliminado! -->
