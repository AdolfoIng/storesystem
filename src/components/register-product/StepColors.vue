<template>
  <div>
    <div v-for="(color, index) in colors" :key="index">
      <select :value="color.id_color" @change="updateColor(index, $event)">
        <option disabled value="">Seleccione un color</option>
        <option v-for="option in colorOptions" :key="option.id" :value="option.id">
          {{ option.name_color }}
        </option>
      </select>
      <button @click="removeColor(index)">Eliminar</button>
    </div>
    <button @click="addColor">Agregar Color</button>
  </div>
</template>

<script setup lang="ts">
import type { ProductoColorConTallas, Color } from '@/types/product'

const props = defineProps<{
  colors: ProductoColorConTallas[]
  colorOptions: Color[]
}>()

const emit = defineEmits<{
  (e: 'update:colors', colors: ProductoColorConTallas[]): void
}>()

function updateColor(index: number, e: Event) {
  const target = e.target as HTMLSelectElement | null
  if (!target) return

  const newColors = [...props.colors]
  newColors[index] = {
    ...newColors[index],
    id_color: Number(target.value),
    tallas: newColors[index].tallas ?? [], // ✅ asegurar tallas
  }
  emit('update:colors', newColors)
}

function addColor() {
  const newColor: ProductoColorConTallas = {
    id: 0,
    id_producto: 0,
    id_color: 0,
    tallas: [], // ✅ asegurar tallas vacías
  }

  emit('update:colors', [...props.colors, newColor])
}

function removeColor(index: number) {
  const newColors = props.colors.filter((_, i) => i !== index)
  emit('update:colors', newColors)
}
</script>
