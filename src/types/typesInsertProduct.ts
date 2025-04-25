// src/types/index.ts

export interface Color {
  id: number
  name_color: string
}

export interface Talla {
  // 'Talla' es 'Size' en inglés
  id: number
  name_talla: string
}

export interface ProductBase {
  name: string
  brand: string
  price: number | null // Permitir null inicialmente
}

// Representa una talla y cantidad para un color específico en el formulario
export interface SelectedTallaData {
  uiKey: string // Clave única temporal para v-for
  talla_id: number | null
  cantidad: number | null
}

// Representa un color seleccionado y sus tallas/cantidades asociadas en el formulario
export interface SelectedColorData {
  uiKey: string // Clave única temporal para v-for
  color_id: number | null
  tallas: SelectedTallaData[]
}

// Estructura completa de datos del formulario
export interface ProductFormData extends ProductBase {
  selectedColors: SelectedColorData[]
}

// Tipos para la API (pueden variar ligeramente según tu implementación)
export interface ProductRecord extends ProductBase {
  id: number
  user_id: string // Asumiendo que user_id es UUID de Supabase Auth
}

export interface ProductoColorRecord {
  id: number
  id_producto: number
  id_color: number
}

export interface ColorTallaRecord {
  id: number
  id_prodcolor: number
  id_talla: number
  cantidad: number
}
