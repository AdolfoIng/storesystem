<template>
  <div v-for="(color, index) in colors" :key="index">
    <h3>Color {{ color.id_color }}</h3>
    <div v-for="(size, i) in color.tallas" :key="i">
      <select :value="size.id_talla" @change="updateSize(index, i, $event)">
        <option disabled value="">Seleccione una talla</option>
        <option v-for="option in tallaOptions" :key="option.id" :value="option.id">
          {{ option.name_talla }}
        </option>
      </select>
      <input type="number" :value="size.cantidad" @input="updateCantidad(index, i, $event)" min="0" />
      <button @click="removeTalla(index, i)">Eliminar</button>
    </div>
    <button @click="addTalla(index)">Agregar Talla</button>
  </div>
</template>

<script setup lang="ts">
import type { ProductoColorConTallas, Talla } from '@/types/product'

const props = defineProps<{
  colors: ProductoColorConTallas[]
  tallaOptions: Talla[]
}>()

const emit = defineEmits<{
  (e: 'update:colors', colors: ProductoColorConTallas[]): void
}>()

function updateSize(colorIndex: number, sizeIndex: number, e: Event) {
  const target = e.target as HTMLSelectElement | null
  if (!target) return
  const updatedColors = [...props.colors]
  updatedColors[colorIndex].tallas[sizeIndex].id_talla = Number(target.value)
  emit('update:colors', updatedColors)
}

function updateCantidad(colorIndex: number, sizeIndex: number, e: Event) {
  const target = e.target as HTMLInputElement | null
  if (!target) return
  const cantidad = parseInt(target.value) || 0
  const updatedColors = [...props.colors]
  updatedColors[colorIndex].tallas[sizeIndex].cantidad = cantidad
  emit('update:colors', updatedColors)
}

function addTalla(colorIndex: number) {
  const updatedColors = [...props.colors]
  updatedColors[colorIndex].tallas.push({ id_talla: 0, cantidad: 0 })
  emit('update:colors', updatedColors)
}

function removeTalla(colorIndex: number, tallaIndex: number) {
  const updatedColors = [...props.colors]
  updatedColors[colorIndex].tallas.splice(tallaIndex, 1)
  emit('update:colors', updatedColors)
}
</script>
