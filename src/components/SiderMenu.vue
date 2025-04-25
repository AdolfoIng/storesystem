<template>

  <aside class="hidden md:flex w-64 flex-col p-4 bg-gray-900 border-r border-gray-800">
    <h2 class="text-xl font-bold mb-6">Mi Dashboard</h2>
    <nav class="flex flex-col space-y-3">
      <RouterLink v-for="item in menuItems" :key="item.name" :to="item.to"
        class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition" active-class="bg-emerald-600">
        <component :is="item.icon" class="w-5 h-5" />
        {{ item.name }}
      </RouterLink>
    </nav>

    <!-- <div class="p-5 border-t border-slate-700">
      <button @click="requestLogout"
        class="w-full flex items-center justify-center p-2.5 rounded-md font-bold cursor-pointer bg-transparent border border-red-500 text-red-500 transition-colors duration-200 ease-in-out hover:bg-red-500 hover:text-white">

        <span class="mr-2">🚪</span> Cerrar Sesión
      </button>
    </div> -->
    <hr class="mt-40">
    <div @click="requestLogout"
      class="flex items-center gap-2 px-3 py-2 my-2 rounded-lg hover:bg-red-400 transition hover:cursor-pointer">

      <LogOutIcon class="w-6 h-6 text-white" />
      <h2>Cerrar Sesión</h2>
    </div>
  </aside>

  <!-- <aside class="hidden md:flex w-64 flex-col p-4 bg-gray-900 border-r border-gray-800">


    <nav class="flex-1 pt-3 overflow-y-auto">
      <ul class="list-none p-0 m-0">
        <li class="mx-2 my-1.5">
          <router-link :to="{ name: 'DashboardHome' }"
            class="flex items-center py-3 px-4 rounded-md transition-colors duration-200 ease-in-out font-medium text-gray-400 hover:bg-slate-700 hover:text-white"
            active-class="exact-active-link">
            <span class="mr-3 text-lg">🏠</span> Inicio
          </router-link>
        </li>
        <li class="mx-2 my-1.5">
          <router-link :to="{ name: 'Inventory' }"
            class="flex items-center py-3 px-4 rounded-md transition-colors duration-200 ease-in-out font-medium text-gray-400 hover:bg-slate-700 hover:text-white"
            active-class="exact-active-link">
            <span class="mr-3 text-lg">🚚</span> Inventory Product
          </router-link>
        </li>
        <li class="mx-2 my-1.5">
          <router-link :to="{ name: 'Register' }"
            class="flex items-center py-3 px-4 rounded-md transition-colors duration-200 ease-in-out font-medium text-gray-400 hover:bg-slate-700 hover:text-white"
            active-class="exact-active-link">
            <span class="mr-3 text-lg">📑</span> Register Product
          </router-link>
        </li>
      </ul>
    </nav>




    <div class="p-5 border-t border-slate-700">
      <button @click="requestLogout"
        class="w-full flex items-center justify-center p-2.5 rounded-md font-bold cursor-pointer bg-transparent border border-red-500 text-red-500 transition-colors duration-200 ease-in-out hover:bg-red-500 hover:text-white">

        <span class="mr-2">🚪</span> Cerrar Sesión
      </button>
    </div>
  </aside> -->
</template>

<script setup lang="ts">
// Icons (puedes usar Heroicons, Lucide o los que prefieras)
import { HomeIcon, BoxIcon, SettingsIcon, LogOutIcon } from 'lucide-vue-next'


const menuItems = [
  { name: 'Home', to: '/dashboard/home', icon: HomeIcon },
  { name: 'Ver Productos', to: '/dashboard/inventory', icon: BoxIcon },
  { name: 'Register Product', to: '/dashboard/register', icon: SettingsIcon },
  /* { name: 'Logout', to: '/logout', icon: LogOutIcon }, */
]


// Define the event 'logout' that the parent component will listen for
const emit = defineEmits<{
  (e: 'logout'): void
}>();

// Function that emits the event
const requestLogout = (): void => {
  emit('logout');
};
</script>

<!-- No scoped style block needed anymore -->

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
