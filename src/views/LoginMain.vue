<template>
  <div class="login-form-container">
    <h2>Iniciar Sesión</h2>

    <!-- Mensaje de Feedback -->
    <p v-if="feedbackMessage" :class="['feedback', { 'error': isError }]">
      {{ feedbackMessage }}
    </p>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Usuario:</label>
        <!--
          v-model establece un enlace bidireccional entre el input
          y nuestra variable reactiva 'username'.
          TypeScript asegura que 'username' es un string.
        -->
        <input id="username" v-model="username" type="text" required placeholder="Tu nombre de usuario o email" />
      </div>

      <div class="form-group">
        <label for="password">Contraseña:</label>
        <!-- v-model enlaza con la variable reactiva 'password' -->
        <input id="password" v-model="password" type="password" required placeholder="Tu contraseña" />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>
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
  console.log('Iniciando Session :', username.value);

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

<style scoped>
/* 'scoped' asegura que estos estilos solo apliquen a este componente */
.login-form-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #d5d4d4;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  /* Asegura que padding no aumente el tamaño total */
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.feedback {
  text-align: center;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: #e2f0ff;
  /* Azul claro para mensajes generales */
  color: #004085;
  border: 1px solid #b8daff;
}

.feedback.error {
  background-color: #f8d7da;
  /* Rojo claro para errores */
  color: #721c24;
  border-color: #f5c6cb;
}
</style>
