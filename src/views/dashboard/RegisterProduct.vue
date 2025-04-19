<template>
  <div>
    <h3>Registrar Producto </h3>

    <form @submit.prevent="addProduct">
      <input v-model="name" placeholder="Nombre del producto" required />
      <input v-model="brand" placeholder="Marca" required />
      <input v-model.number="price" placeholder="Precio" type="number" required />
      <button type="submit">Registrar producto</button>
    </form>
  </div>

</template>

<script setup lang="ts">
import { registerProduct } from "../../services/productService.ts";
import { useAuth } from "../../services/authUser.ts";
import type { InsertProduct } from '../../types';
import { ref } from 'vue';
const { user } = useAuth();

const name = ref<string>('');
const brand = ref<string>('');
const price = ref<number>(0);

async function addProduct() {
  if (!user.value) return alert('Debes estar autenticado');
  const product: InsertProduct = {
    name: name.value.toUpperCase(),
    brand: brand.value.toUpperCase(),
    price: price.value,
    user_id: user.value.id,
  }
  console.log(product);
  try {
    await registerProduct(product)
    alert('Producto registrado correctamente')
    name.value = ''
    brand.value = ''
    price.value = 0
  } catch (error) {
    alert('Ocurrió un error al registrar el producto');
    console.log(error);
  }

}

</script>

<style scoped></style>
