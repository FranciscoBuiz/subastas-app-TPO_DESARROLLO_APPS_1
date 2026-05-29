import React, { useState } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput,Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { simulateApproval } from '../../store/slices/authSlice';

export default function RegisterStep2Screen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();

  const handleFinish = () => {
    if (!password || password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden o están vacías.');
      return;
    }
    
    // Despacha acción para marcar usuario como autenticado y completar el flujo.
    dispatch(simulateApproval());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.tag}>SIMULACIÓN MAIL RECIBIDO</Text>
        <Text style={styles.title}>¡Cuenta Aprobada!</Text>
        <Text style={styles.subtitle}>Tu cuenta ha sido validada. Se te ha asignado la categoría COMÚN. Ingresa una contraseña para finalizar.</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña Nueva</Text>
          <TextInput 
            style={styles.input} 
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Repetir Contraseña</Text>
          <TextInput 
            style={styles.input} 
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleFinish}>
          <Text style={styles.primaryButtonText}>FINALIZAR REGISTRO</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  tag: { fontSize: 12, fontWeight: '800', color: '#2e7d32', marginBottom: 8, letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: '900', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 32, lineHeight: 20 },
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