// no se necesita config JS porque @react-native-firebase lee los archivos nativos
import app from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
//para autenticacion con google
import { GoogleSignin } from '@react-native-google-signin/google-signin';
//import { Platform } from 'react-native';

GoogleSignin.configure({
  webClientId: '410909323897-ghbd3dius5hlv6bkoauiq8f43fje3eq6.apps.googleusercontent.com',
  offlineAccess: false,
  forceCodeForRefreshToken: false,
});

export { app, auth, GoogleSignin };
//export { app, auth};