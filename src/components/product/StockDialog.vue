<template>
  <!-- Usamos v-if para montar/desmontar el diálogo -->
  <div v-if="isOpen" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-content">
      <button class="close-button" @click="closeDialog">×</button>
      <h2 v-if="product">Stock para: {{ product.name }} ({{ product.brand }})</h2>
      <div v-if="isLoadingStock" class="loading-message">Cargando stock...</div>
      <div v-if="stockError" class="error-message">Error al cargar stock: {{ stockError }}</div>

      <div v-if="!isLoadingStock && !stockError && formattedStockData?.stockByColor.length"
        class="stock-table-container">
        <table>
          <thead>
            <tr>
              <th>Colores</th>
              <!-- Generamos encabezados de talla dinámicamente -->
              <th v-for="size in formattedStockData.sizes" :key="size">{{ size }}</th>
            </tr>
          </thead>
          <tbody>
            <!-- Iteramos sobre los datos formateados por color -->
            <tr v-for="colorData in formattedStockData.stockByColor" :key="colorData.colorName">
              <td>{{ colorData.colorName }}</td>
              <!-- Para cada talla, mostramos la cantidad correspondiente o 0 -->
              <td v-for="size in formattedStockData.sizes" :key="`${colorData.colorName}-${size}`">
                {{ colorData.stockBySize[size] || 0 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!isLoadingStock && !stockError && !formattedStockData?.stockByColor.length" class="no-stock-message">
        No hay información de stock disponible para este producto.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { getProductStock } from '../../services/productService.ts';
import type { Product, DetailedStockItem, StockViewData } from '../../types';

interface Props {
  product: Product | null; // El producto seleccionado
  isOpen: boolean;         // Controla la visibilidad del diálogo
}
const props = defineProps<Props>();

// Evento para notificar al padre que cierre el diálogo
// Se usa 'update:isOpen' para poder usar v-model:isOpen en el padre
const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>();

const stockDetails = ref<DetailedStockItem[]>([]); // Stock crudo de la API
const isLoadingStock = ref<boolean>(false);
const stockError = ref<string | null>(null);

// --- Lógica para buscar el stock ---
const fetchStock = async (productId: number) => {
  isLoadingStock.value = true;
  stockError.value = null;
  stockDetails.value = []; // Limpiar datos anteriores
  try {
    const data = await getProductStock(productId);
    stockDetails.value = data || []; // Asigna los datos o un array vacío si es null
    console.log("Stock recibido en Dialog:", stockDetails.value);
  } catch (error) {
    console.error("Error en fetchStock (Dialog):", error);
    if (error instanceof Error) {
      stockError.value = error.message;
    } else {
      stockError.value = 'Error desconocido';
    }
  } finally {
    isLoadingStock.value = false;
  }

};

// --- Observador (Watcher) ---
// Observa cambios en las props 'product' e 'isOpen'.
// Solo busca stock si el diálogo está abierto (isOpen=true) y hay un producto válido.
watch(
  () => [props.product, props.isOpen],
  ([newProduct, newIsOpen]) => {
    if (newIsOpen && newProduct && typeof newProduct !== 'boolean' && 'id' in newProduct) {
      // Si se abre y hay producto, busca el stock
      fetchStock(newProduct.id);
    } else if (!newIsOpen) {
      // Si se cierra, resetea el estado
      stockDetails.value = [];
      isLoadingStock.value = false;
      stockError.value = null;
    }
  },
  { immediate: false } // No se ejecuta al montar, solo en cambios
);

// --- Datos Formateados (Computed Property) ---
// Transforma la lista plana de stock (DetailedStockItem[])
// en la estructura matricial necesaria para la tabla (StockViewData).
const formattedStockData = computed((): StockViewData | null => {
  if (!stockDetails.value || stockDetails.value.length === 0) {
    return { sizes: [], stockByColor: [] }; // Devuelve estructura vacía si no hay datos
  }

  // 1. Obtener lista única y ordenada de tallas
  const uniqueSizes = [...new Set(stockDetails.value.map(item => item.talla_name))].sort();
  // Puedes añadir lógica de ordenamiento específica si 'S', 'M', 'L' no ordenan alfabéticamente bien.


  // 2. Agrupar stock por nombre de color
  const groupedByColor: { [colorName: string]: DetailedStockItem[] } = {};
  stockDetails.value.forEach(item => {
    if (!groupedByColor[item.color_name]) {
      groupedByColor[item.color_name] = [];
    }
    groupedByColor[item.color_name].push(item);
  });

  // 3. Transformar cada grupo de color al formato deseado
  const stockByColor = Object.entries(groupedByColor).map(([colorName, items]) => {
    const stockBySize: { [tallaName: string]: number } = {};
    items.forEach(item => {
      stockBySize[item.talla_name] = item.cantidad;
    });
    return { colorName, stockBySize };
  });

  // Ordenar por nombre de color si se desea
  stockByColor.sort((a, b) => a.colorName.localeCompare(b.colorName));

  return {
    sizes: uniqueSizes,
    stockByColor: stockByColor,
  };
});

// --- Método para cerrar el diálogo ---
const closeDialog = () => {
  emit('update:isOpen', false); // Notifica al padre para cambiar isOpen a false
};

</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  /* Fondo semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* Asegura que esté por encima de otros elementos */
}

.dialog-content {
  background-color: rgb(220, 217, 217);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  min-width: 400px;
  /* Ancho mínimo */
  max-width: 90%;
  /* Ancho máximo */
  max-height: 80vh;
  /* Altura máxima con scroll interno */
  overflow-y: auto;
  /* Scroll si el contenido es muy largo */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  color: #555;
}

.close-button:hover {
  color: #000;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.4rem;
}

.loading-message,
.error-message,
.no-stock-message {
  text-align: center;
  padding: 20px;
  color: #555;
}

.error-message {
  color: red;
}

.stock-table-container {
  margin-top: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  color: #555;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px 12px;
  text-align: center;
  /* Centrado para las cantidades */
}

th {
  /* background-color: #f7f7f7; */
  font-weight: bold;
}

/* Primera columna (Colores) alineada a la izquierda */
td:first-child,
th:first-child {
  text-align: left;
  font-weight: bold;
  /* Resaltar nombre de color */
}
</style>
