import { supabase } from './supabaseClient'
import type { User } from '@supabase/supabase-js'
import { ref } from 'vue'
import type { AuthError } from '@supabase/supabase-js'

const user = ref<User | null>(null) // ✅ Inicializamos como User | null

// Al cargar, obtenemos la sesión activa
supabase.auth.getSession().then(({ data }) => {
  user.value = data.session?.user ?? null
})

// Escuchamos cambios en la autenticación
supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null
})

export const useAuth = () => {
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    user.value = data.user // ✅ Actualizamos el estado del usuario
    return data
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        const typedError = error as AuthError
        console.error('Logout error:', typedError.message)
        throw new Error(typedError.message)
      }

      console.log('Logout successful')
    } catch (err) {
      console.error('Unexpected error during logout:', (err as Error).message)
      throw err
    }
  }

  /* const signOut = async () => {
    await supabase.auth.signOut()
    user.value = null
  } */

  return { user, signIn, signOut }
}
