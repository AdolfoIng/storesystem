<template>
  <div class="product-search-container">
    <h1>Buscar Producto</h1>
    <div class="search-bar">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search"
        viewBox="0 0 16 16">
        <path
          d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
      </svg>
      <!-- Usamos v-model para enlazar el input con la variable reactiva searchTerm -->
      <input type="text" placeholder="buscar producto .." v-model="searchTerm" />
    </div>

    <!-- Mostramos mensaje de error si existe -->
    <p v-if="error" class="error-message">Error: {{ error }}</p>

    <!-- Componente tabla: pasamos productos y estado de carga como props -->
    <!-- Escuchamos el evento 'view-stock' y llamamos a handleViewStock -->
    <ProductTable :products="products" :is-loading="isLoading" @view-stock="handleViewStock" />

    <!-- Componente Dialog: -->
    <!-- :product pasa el producto seleccionado -->
    <!-- v-model:isOpen enlaza la visibilidad con la variable isStockDialogOpen -->
    <!-- Esto permite que el diálogo se cierre desde dentro usando emit('update:isOpen', false) -->
    <StockDialog :product="selectedProduct" v-model:isOpen="isStockDialogOpen" />

  </div>
</template>

<script setup lang="ts">
// Importaciones de Vue y otras utilidades
import { ref, watch, onMounted } from 'vue';
import { debounce } from 'lodash-es';

// Importaciones de componentes y servicios
import ProductTable from '../../components/product/ProductTable.vue';
import StockDialog from '../../components/product/StockDialog.vue';
import { searchProducts } from '../../services/productService.ts';
import type { Product } from '../../types';

// --- Estado Reactivo ---
// ref() crea variables reactivas. Vue rastreará sus cambios y actualizará el DOM.
const searchTerm = ref<string>(''); // Término de búsqueda en el input
const products = ref<Product[]>([]); // Lista de productos mostrados en la tabla
const isLoading = ref<boolean>(false); // Indica si se están cargando productos
const error = ref<string | null>(null); // Mensaje de error, si lo hay
const selectedProduct = ref<Product | null>(null); // Producto seleccionado para ver stock
const isStockDialogOpen = ref<boolean>(false);

// Función asíncrona para buscar productos usando el servicio
const findProducts = async (term: string) => {
  isLoading.value = true; // Activa el indicador de carga
  error.value = null;     // Limpia errores anteriores
  try {
    const result = await searchProducts(term); // Llama al servicio
    products.value = result || []; // Actualiza la lista de productos (o array vacío si es null)
  } catch (err) {
    console.error('Error al buscar productos:', err);
    error.value = err.message || 'Ocurrió un error al buscar.'; // Muestra el error
    products.value = []; // Limpia la tabla en caso de error
  } finally {
    isLoading.value = false; // Desactiva el indicador de carga
  }
};

// Función para manejar el clic en "Ver Stock" emitida por ProductTable
const handleViewStock = (product: Product) => {
  console.log('Ver stock para:', product);
  selectedProduct.value = product;   // Guarda el producto seleccionado
  isStockDialogOpen.value = true; // Abre el diálogo
};

// --- Lógica de Búsqueda con Debounce ---

// Creamos una versión "debounced" de findProducts.
// Solo se ejecutará 500ms después de que el usuario deje de escribir.
const debouncedSearch = debounce((term: string) => {
  findProducts(term);
}, 500);

// --- Observadores (Watchers) ---
// watch() reacciona a cambios en una variable reactiva (searchTerm).
watch(searchTerm, (newSearchTerm) => {
  // Cada vez que searchTerm cambie, llamamos a la versión debounced.
  debouncedSearch(newSearchTerm);
});

// --- Ciclo de Vida ---
// onMounted() se ejecuta una vez que el componente está montado en el DOM.
onMounted(() => {
  findProducts(''); // Realiza una búsqueda inicial para mostrar todos los productos al cargar.
});



</script>

<style scoped>
/* Estilos específicos para esta vista/página */
.product-search-container {
  padding: 25px;
  max-width: 800px;
  /* Limita el ancho máximo */
  margin: 20px auto;
  /* Centra el contenedor */
  font-family: sans-serif;
  /* background-color: #fff; */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  /* color: #333; */
  margin-bottom: 25px;
}

.search-bar {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 25px;
  /* Bordes redondeados */
  padding: 8px 15px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.search-bar svg {
  margin-right: 10px;
  color: #777;
  flex-shrink: 0;
  /* Evita que el icono se encoja */
}

.search-bar input {
  border: none;
  outline: none;
  flex-grow: 1;
  font-size: 1rem;
  background-color: transparent;
  /* Hereda el fondo del contenedor */
  color: #333;
}

.search-bar input::placeholder {
  color: #999;
}

.error-message {
  color: red;
  text-align: center;
  margin-bottom: 15px;
}
</style>
