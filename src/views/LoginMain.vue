<template>
  <div>
    <h2>Login !!!</h2>

    <br>
    <button @click="goDashboard">
      Go Main =>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goDashboard = () => router.push({ name: 'DashboardLayout' });

</script>

<style></style>
