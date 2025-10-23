//Pantalla de registro (email + password)
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { registerWithEmail } from '../../services/authService';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Introduce email y contraseña.');
      return;
    }
    setLoading(true);
    try {
      await registerWithEmail(email.trim(), password);
      Alert.alert('Registro', 'Cuenta creada correctamente.');
      // onAuthStateChanged redirigirá a Home automáticamente
    } catch (err: any) {
      console.error(err);
      Alert.alert('Registro fallido', err.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña (min 6)"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Button title="Registrar" onPress={onRegister} />
          <View style={styles.spacer12} />
          {/*<View style={{ height: 12 }} />*/}
          <Button title="Ir a Login" onPress={() => navigation.navigate('Login')} />
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

