import { supabase } from '../supabaseClient'
import type { Color, Talla, ProductFormData } from '../../types/typesInsertProduct'

export async function fetchColors(): Promise<Color[]> {
  const { data, error } = await supabase.from('color').select('id, name_color').order('name_color')

  if (error) {
    console.error('Error fetching colors:', error)
    throw error
  }
  return data || []
}

export async function fetchTallas(): Promise<Talla[]> {
  const { data, error } = await supabase.from('talla').select('id, name_talla').order('name_talla') // O algún orden lógico

  if (error) {
    console.error('Error fetching tallas:', error)
    throw error
  }
  return data || []
}

// --- Función de Guardado ---

export async function saveProduct(formData: ProductFormData): Promise<void> {
  // 1. Obtener el usuario autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error('Error getting user:', userError)
    throw new Error('User not authenticated')
  }
  const userId = user.id

  // 2. Insertar el producto base
  const { data: productData, error: productError } = await supabase
    .from('producto')
    .insert({
      name: formData.name,
      brand: formData.brand,
      price: formData.price,
      user_id: userId,
    })
    .select('id')
    .single<{ id: number }>() // Especifica el tipo esperado

  if (productError || !productData) {
    console.error('Error inserting product:', productError)
    throw new Error(`Failed to save product details: ${productError?.message || 'Unknown error'}`)
  }
  const newProductId = productData.id

  // 3. Insertar colores y sus tallas (iterativamente)
  //    Idealmente, esto debería ser una transacción (usando RPC/Edge Function)
  //    Por simplicidad, lo hacemos secuencial con manejo de errores básico.

  for (const selectedColor of formData.selectedColors) {
    if (!selectedColor.color_id) continue // Omitir si no se seleccionó color

    // 3.1. Insertar en productocolor
    const { data: prodColorData, error: prodColorError } = await supabase
      .from('productocolor')
      .insert({
        id_producto: newProductId,
        id_color: selectedColor.color_id,
      })
      .select('id')
      .single<{ id: number }>()

    if (prodColorError || !prodColorData) {
      console.error(
        `Error inserting productocolor for color ${selectedColor.color_id}:`,
        prodColorError,
      )
      // Aquí podrías intentar eliminar el producto ya creado para rollback manual, pero es complejo
      throw new Error(
        `Failed to link color ${selectedColor.color_id}: ${prodColorError?.message || 'Unknown error'}`,
      )
    }
    const newProdColorId = prodColorData.id

    // 3.2. Insertar en colortalla para este color
    const tallaInserts = selectedColor.tallas
      .filter((t) => t.talla_id && t.cantidad && t.cantidad > 0) // Filtrar tallas válidas
      .map((talla) => ({
        id_prodcolor: newProdColorId,
        id_talla: talla.talla_id!, // Sabemos que no es null por el filtro
        cantidad: talla.cantidad!, // Sabemos que no es null por el filtro
      }))

    if (tallaInserts.length > 0) {
      const { error: colorTallaError } = await supabase.from('colortalla').insert(tallaInserts)

      if (colorTallaError) {
        console.error(
          `Error inserting colortalla for prodcolor ${newProdColorId}:`,
          colorTallaError,
        )
        // Rollback manual sería aún más complejo aquí
        throw new Error(
          `Failed to save sizes/quantities for color ${selectedColor.color_id}: ${colorTallaError.message}`,
        )
      }
    }
  }

  // Si todo fue bien
  console.log('Product saved successfully with ID:', newProductId)
}
