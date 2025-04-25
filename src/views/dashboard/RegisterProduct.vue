<template>
  <div>
    <StepProductInfo v-if="step === 0" :product="product" @update:product="(val) => (product = val)" />

    <StepColors v-else-if="step === 1" :colors="colors" :colorOptions="colorOptions"
      @update:colors="(val) => (colors = val)" />

    <StepSizes v-else-if="step === 2" :colors="colors" :tallaOptions="tallaOptions"
      @update:colors="(val) => (colors = val)" />

    <div class="mt-4">
      <button @click="prevStep" :disabled="step === 0">Atrás</button>
      <button @click="nextStep" :disabled="step === steps.length - 1">Siguiente</button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../services/supabaseClient'
import StepProductInfo from '@/components/register-product/StepProductInfo.vue'
import StepColors from '@/components/register-product/StepColors.vue'
import StepSizes from '@/components/register-product/StepSizes.vue'
import type {
  Product,
  ProductoColorConTallas,
  Color,
  Talla,
} from '@/types/product'

const step = ref(0)
const steps = [StepProductInfo, StepColors, StepSizes]
//const currentStepComponent = computed(() => steps[step.value])

const product = ref<Product>({
  name: '',
  brand: '',
  price: 0,
})

const colors = ref<ProductoColorConTallas[]>([])
const colorOptions = ref<Color[]>([])
const tallaOptions = ref<Talla[]>([])


function nextStep() {
  if (step.value < steps.length - 1) step.value++
}

function prevStep() {
  if (step.value > 0) step.value--
}

onMounted(async () => {
  const { data: colorsData, error: colorError } = await supabase.from('color').select('*')
  if (!colorError && colorsData) colorOptions.value = colorsData

  const { data: tallasData, error: tallaError } = await supabase.from('talla').select('*')
  if (!tallaError && tallasData) tallaOptions.value = tallasData
})
</script>

<style scoped>
button {
  margin: 0 5px;
  padding: 8px 16px;
}
</style>
