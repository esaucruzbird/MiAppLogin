//Pantalla Home que muestra nombre y correo, con botón de logout
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { signOut } from '../../services/authService';

export const HomeScreen: React.FC = () => {
  const user = auth().currentUser;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.item}>Nombre: {user?.displayName ?? '(sin nombre)'}</Text>
      <Text style={styles.item}>Correo: {user?.email ?? '(sin email)'}</Text>
      <View style={styles.spacer20} />
      {/*<View style={{ height: 20 }} />*/}
      <Button title="Cerrar sesión" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  item: { fontSize: 16, marginBottom: 6 },
  spacer20: { height: 20 },
});
