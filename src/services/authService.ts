//Funciones para registro, login, signOut
import { auth } from '../config/firebase';
//para Google
import { GoogleSignin } from '../config/firebase';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

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

/** ingreso con Google */
export async function signInWithGoogle(): Promise<FirebaseAuthTypes.User | null> {
  try {
    // 1) Ask user to sign in with Google
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }); // Android
    
    // 2) Pide al usuario iniciar sesión con Google
    await GoogleSignin.signIn();

    //no garantizan que signIn() devuelva idToken (depende de la versión y de la configuración)
    //devuelve un SignInResponse/SignInSuccessResponse cuyo shape puede variar según versión; las defs oficiales a veces no incluyen idToken
    //const userInfo = await GoogleSignin.signIn();
    //const idToken = userInfo.idToken;

    // 3) Obtener los tokens (idToken, accessToken)
    const tokens = await GoogleSignin.getTokens();
    const idToken = tokens.idToken;

    if (!idToken) {
      throw new Error('No se obtuvo idToken de Google Sign-In. Verifica webClientId y huellas (SHA).');
    }

    //if (!idToken) throw new Error('No se obtuvo idToken de Google Sign-In');

    // 3) Create a Firebase credential with the token (Crea credencial Firebase)
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // 4) Sign in with credential (logue con las credenciales)
    const userCred = await auth().signInWithCredential(googleCredential);
    return userCred.user;
  } catch (error) {
    console.error('Google Sign-In error', error);
    throw error;
  }
}