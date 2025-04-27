<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-gray-900 rounded-2xl shadow-xl p-6">
      <h1 class="text-2xl font-semibold text-white mb-6 text-center">
        Iniciar Sesión
      </h1>
      <!-- Mensaje de Feedback -->
      <p v-if="feedbackMessage" :class="['feedback', { 'error': isError }]">
        {{ feedbackMessage }}
      </p>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-gray-400 mb-1" for="username">Usuario</label>
          <input v-model="username" type="username" id="username"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required placeholder="Tu nombre de usuario o email" />
        </div>
        <div>
          <label class="block text-gray-400 mb-1" for="password">Contraseña</label>
          <input v-model="password" type="password" id="password"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required placeholder="Tu contraseña" />
        </div>
        <button type="submit"
          class="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition duration-300"
          :disabled="isLoading">
          {{ isLoading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from "../services/authUser.ts";


const router = useRouter();
const username = ref<string>('');
const password = ref<string>('');
const isLoading = ref<boolean>(false); // Para feedback visual durante el envío
const feedbackMessage = ref<string | null>(null); // Mensaje para el usuario (puede ser string o null)
const isError = ref<boolean>(false);
const { signIn } = useAuth()


async function handleLogin(): Promise<void> {
  // Resetear feedback anterior
  isLoading.value = true;
  feedbackMessage.value = null;
  isError.value = false;

  if (!username.value || !password.value) {
    feedbackMessage.value = 'Por favor, completa ambos campos.';
    isError.value = true;
    isLoading.value = false;
    return;
  }

  try {

    const response = await signIn(username.value, password.value);

    if (response) {
      feedbackMessage.value = `¡Bienvenido, ${username.value}! Login exitoso (simulado).`;
      isError.value = false;
      router.push({ name: 'DashboardLayout' });
    } else {
      throw new Error('Credenciales inválidas (simulado)');
    }

  } catch (error) {
    console.error('Error en el login:', error);
    // Mostramos un mensaje genérico por seguridad
    feedbackMessage.value = 'Error al iniciar sesión. Verifica tus credenciales.';
    isError.value = true;
  } finally {
    // Asegurarnos de que el estado de carga siempre se desactive
    isLoading.value = false;
  }
}

</script>

<style scoped></style>
