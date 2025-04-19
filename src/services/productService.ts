import { supabase } from './supabaseClient'
import type { Product, DetailedStockItem, InsertProduct } from '../types' // Importa los tipos

// searchProducts sigue igual que en la respuesta anterior
export const searchProducts = async (searchTerm: string = ''): Promise<Product[] | null> => {
  // ... (código idéntico al anterior) ...
  try {
    let query = supabase.from('producto').select('id, name, brand, price')

    if (searchTerm.trim()) {
      query = query.or(`name.ilike.%${searchTerm.trim()}%,brand.ilike.%${searchTerm.trim()}%`)
    }
    query = query.order('name', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      throw error
    }
    return (data as Product[]) || []
  } catch (error) {
    console.error('An error occurred in searchProducts:', error)
    return null
  }
}

/**
 * Obtiene el stock detallado (color, talla, cantidad) para un producto específico.
 * Realiza JOINs necesarios según el esquema de BD proporcionado.
 * @param productId - El ID del producto.
 * @returns Una promesa que resuelve a un array de DetailedStockItem o null en caso de error.
 */
export const getProductStock = async (productId: number): Promise<DetailedStockItem[] | null> => {
  console.log(`Obteniendo stock para el producto ID: ${productId}`)
  try {
    // Consulta compleja con JOINs explícitos usando la sintaxis de Supabase
    const { data, error } = await supabase
      .from('colortalla') // Empezamos desde la tabla que tiene la cantidad
      .select(
        `
        cantidad,
        talla!inner ( id, name_talla ),
        productocolor!inner (
            id_producto,
            color!inner ( id, name_color )
        )
      `,
      )
      // Filtramos para asegurar que sólo obtenemos datos del producto deseado
      // Accedemos al id_producto a través de la tabla intermedia 'productocolor'
      .eq('productocolor.id_producto', productId)

    if (error) {
      console.error('Error fetching stock details:', error)
      throw error // Propaga el error
    }

    if (!data) {
      return [] // No hay stock o producto no encontrado con esas relaciones
    }

    // Mapeamos la respuesta anidada de Supabase a nuestra estructura plana DetailedStockItem
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detailedStock: DetailedStockItem[] = data.map((item: any) => ({
      // Nota: Ajusta los nombres 'talla', 'productocolor', 'color' si los cambiaste en Supabase
      cantidad: item.cantidad,
      talla_id: item.talla.id,
      talla_name: item.talla.name_talla,
      color_id: item.productocolor.color.id,
      color_name: item.productocolor.color.name_color,
    }))

    console.log('Stock detallado obtenido:', detailedStock)
    return detailedStock
  } catch (error) {
    console.error('An error occurred in getProductStock:', error)
    return null // Retorna null para indicar un error en la operación
  }
}

export async function loadProducts() {
  try {
    console.log('Loading ...')
    const { data, error } = await supabase.from('producto').select('*')

    if (error) {
      console.error('Error fetching product:', error.message)
      throw new Error(`Failed to fetch product: ${error.message}`)
    }

    console.log('response: ', data)

    return data
  } catch (error) {
    console.error('An unexpected error occurred in getColoresPorProductoId:', error)
    return []
  }
}

export const registerProduct = async (product: InsertProduct) => {
  const { error, data } = await supabase.from('producto').insert(product)

  if (error) {
    console.error('Error al registrar producto:', error)
    throw error
  }
  return data
}
