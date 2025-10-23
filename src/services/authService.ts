//Funciones para registro, login, signOut
import { auth } from '../config/firebase';

/**
 * Registra con email y password.
 * Retorna el user o lanza error.
 */
export async function registerWithEmail(email: string, password: string) {
  const userCred = await auth().createUserWithEmailAndPassword(email, password);
  // Opcional: establecer displayName a partir del email
  const displayName = email.split('@')[0];
  await userCred.user.updateProfile({ displayName });
  return userCred.user;
}

/** Login */
export async function loginWithEmail(email: string, password: string) {
  const userCred = await auth().signInWithEmailAndPassword(email, password);
  return userCred.user;
}

/** Logout */
export async function signOut() {
  await auth().signOut();
}
