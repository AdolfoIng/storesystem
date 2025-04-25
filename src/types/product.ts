export interface Product {
  id?: number
  name: string
  brand: string
  price: number
}

export interface Color {
  id: number
  name_color: string
}

export interface Talla {
  id: number
  name_talla: string
}

export interface ProductoColor {
  id: number
  id_producto: number
  id_color: number
}

export interface ColorTalla {
  id_talla: number
  cantidad: number
}

export interface ProductoColorConTallas extends ProductoColor {
  tallas: ColorTalla[]
}
