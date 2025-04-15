<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Marca</th>
          <th>Precio</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="4" style="text-align: center;">Cargando...</td>
        </tr>
        <tr v-else-if="!products || products.length === 0">
          <td colspan="4" style="text-align: center;">No se encontraron productos.</td>
        </tr>
        <tr v-else v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.brand }}</td>
          <td>{{ product.price }}</td>
          <td>
            <!-- Emitimos el evento 'view-stock' con el objeto producto completo -->
            <button @click="$emit('view-stock', product)">
              Ver Stock
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../../types';

// Definimos las props que el componente espera recibir
// 'products' es un array de Product o null/undefined
// 'isLoading' es un booleano
interface Props {
  products: Product[] | null;
  isLoading: boolean;
}
defineProps<Props>();

// Definimos los eventos que este componente puede emitir
// 'view-stock' emitirá un objeto de tipo Product
defineEmits<{
  (e: 'view-stock', product: Product): void
}>();
</script>

<style scoped>
/* Estilos específicos para esta tabla (iguales o similares a la versión React) */
.table-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  margin-top: 15px;
  width: 100%;
  /* Asegura que ocupe el ancho disponible */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  /* background-color: #f2f2f2; */
  position: sticky;
  top: 0;
  z-index: 1;
  /* Asegura que esté sobre el contenido al hacer scroll */
}

button {
  padding: 5px 10px;
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 4px;
}

button:hover {
  background-color: #f0f0f0;
}
</style>
