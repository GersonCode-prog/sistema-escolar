import { getAuth, signOut } from 'firebase/auth';

export const logout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log('Usuario ha cerrado sesión');
  } catch (error) {
    console.error('Error al cerrar sesión', error);
  }
};
