import { supabase } from './supabaseClient';

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;

    return data;

  } catch (error) {
    console.error('Error signing in:', error);
    return null;
  }

}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  } else {
    console.log('Sesion cerrada !!!');
  }
}


