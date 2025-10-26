//Funciones para registro, login, signOut
import { auth } from '../config/firebase';
//para Google
import { GoogleSignin } from '../config/firebase';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
//import { Alert } from 'react-native';

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
//Registra y asegura el displayName esté actualizado
export async function loginWithEmail(email: string, password: string) {
  //Crear el usuario
  const userCred = await auth().signInWithEmailAndPassword(email, password);
  /*Cambios para que aparezca el nombre del usuario desde que se registra y entra al dashboard*/
  //Calcular displayName que se mostrará en el dashboard (antes de la arroba)
  const displayName = email.split('@')[0];
  //Actualizar perfil y esperar que se aplique, espera a que el profile se actualice en el servidor
  await userCred.user.updateProfile({ displayName });
  //Forzar recarga del usuario actual en el SDK para que todas las referencias tengan el valor
  //fuerza que el objeto currentUser se actualice localmente, onAuthStateChanged y
  //auth().currentUser ya tendrán displayName
  await auth().currentUser?.reload();
  //Retornar el usuario actualizado
  return auth().currentUser;

  //return userCred.user;
}

/** Logout */
export async function signOut() {
  await auth().signOut();
}

/** ingreso con Google
 * Si forceAccountSelection = true forzará el selector (haciendo signOut previo)
 * Si la primera tentativa falla, limpia sesión y reintenta (para permitir elegir otra cuenta) */

export async function signInWithGoogle(): Promise<FirebaseAuthTypes.User | null> {
  try {
    // Asegurar Play Services (Android)
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // --- FORZAR selector: revocar acceso y limpiar sesión local ---
    // No importa si fallan (catch), seguimos al signIn
    try {
      await GoogleSignin.revokeAccess(); // revoca tokens y permisos
    } catch (e) {
      console.warn('revokeAccess warning', e);
    }
    try {
      await GoogleSignin.signOut(); // limpia sesión local
    } catch (e) {
      console.warn('signOut warning', e);
    }

    // Inicia el flujo de selección / login de Google (ahora forzará elegir cuenta)
    await GoogleSignin.signIn();

    // Obtener tokens (idToken)
    const tokens = await GoogleSignin.getTokens();
    const idToken = tokens.idToken;
    if (!idToken) {
      throw new Error('No se obtuvo idToken de Google Sign-In. Verifica webClientId y huellas (SHA).');
    }

    // Intercambiar token por credencial Firebase
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCred = await auth().signInWithCredential(googleCredential);
    return userCred.user;
  } catch (error) {
    console.error('Google Sign-In error', error);
    throw error;
  }
}

/*export async function signInWithGoogle(): Promise<FirebaseAuthTypes.User | null> {
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
}*/