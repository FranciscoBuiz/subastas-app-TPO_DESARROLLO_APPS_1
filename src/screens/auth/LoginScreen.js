import React, { useState } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput,Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { loginSuccess } from '../../store/slices/authSlice';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completar email y contraseña');
      return;
    }
    // Simulación de validación de backend
    dispatch(loginSuccess({
      name: 'Usuario Logueado',
      email: email,
      category: 'COMUN',
      paymentMethodsVerified: true }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido de vuelta</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput 
            style={styles.input} 
            placeholder="ejemplo@correo.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            style={styles.input} 
            placeholder="********"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>INGRESAR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16 },
  container: { flex: 1, padding: 24 },
  title: { fontSize: 32, fontWeight: '900', marginBottom: 32 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16 },
  primaryButton: {
    backgroundColor: '#F7D05C',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    marginTop: 20 },
  primaryButtonText: { fontSize: 16, fontWeight: '900', color: '#000' } });