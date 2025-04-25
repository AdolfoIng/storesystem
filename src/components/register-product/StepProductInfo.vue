<template>
  <div>
    <label>Nombre:</label>
    <input :value="product.name" @input="onInputString('name', $event)" type="text" />

    <label>Marca:</label>
    <input :value="product.brand" @input="onInputString('brand', $event)" type="text" />

    <label>Precio:</label>
    <input :value="product.price" @input="onInputNumber('price', $event)" type="number" />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types/product'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  (e: 'update:product', product: Product): void
}>()

function onInputString(field: 'name' | 'brand', e: Event) {
  const target = e.target as HTMLInputElement | null
  if (target) {
    const updated = { ...props.product, [field]: target.value }
    emit('update:product', updated)
  }
}

function onInputNumber(field: 'price', e: Event) {
  const target = e.target as HTMLInputElement | null
  if (target) {
    const value = parseFloat(target.value)
    const updated = { ...props.product, [field]: isNaN(value) ? 0 : value }
    emit('update:product', updated)
  }
}
</script>
