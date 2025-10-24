//Pantalla de login
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { loginWithEmail } from '../../services/authService';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
//para google
import { signInWithGoogle } from '../../services/authService';


type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Introduce email y contraseña.');
      return;
    }
    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      // onAuthStateChanged redirigirá a Home
    } catch (err: any) {
      console.error(err);
      Alert.alert('Login fallido', err.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Button title="Entrar" onPress={onLogin} />
          <View style={styles.spacer12} />
          {/*<View style={{ height: 12 }} />*/}
          <Button title="Crear cuenta" onPress={() => navigation.navigate('Register')} />
          {/*para Google*/}
          <Button title="Entrar con Google" onPress={async () => {
            try {
              await signInWithGoogle();
              // onAuthStateChanged en navigation redirigirá a Home
            } catch (err: any) {
              Alert.alert('Error Google Sign-In', err.message ?? String(err));
            }
          }} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 },
  spacer12: { height: 12 },
});
