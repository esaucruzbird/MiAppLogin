/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


//import { NewAppScreen } from '@react-native/new-app-screen';
//import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
/*import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
*/

// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigation } from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigation />
    </SafeAreaProvider>
  );
}
