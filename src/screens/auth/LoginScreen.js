import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
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
    dispatch(loginSuccess({
      name: 'Usuario Logueado',
      email: email,
      category: 'COMUN',
      paymentMethodsVerified: true 
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSpacer} />
          
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>ACCESO A LA PLATAFORMA DE SUBASTAS</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput 
              style={styles.input} 
              placeholder="ejemplo@dominio.com"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>INICIAR SESIÓN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>RECUPERAR CONTRASEÑA</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => navigation.navigate('RegisterStep1')}
          >
            <Text style={styles.linkText}>CREAR CUENTA</Text>
          </TouchableOpacity>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40, justifyContent: 'center' },
  headerSpacer: { height: 40 }, 
  title: { fontSize: 48, fontWeight: '900', marginBottom: 8, letterSpacing: -1, color: '#000' },
  subtitle: { fontSize: 10, fontWeight: '800', color: '#666', letterSpacing: 1, marginBottom: 40 },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 10, fontWeight: '900', marginBottom: 8, color: '#000', letterSpacing: 1 },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    height: 54,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#000'
  },
  primaryButton: {
    backgroundColor: '#F7D05C', // Color amarillo como fue pedido
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    marginTop: 8,
    marginBottom: 32
  },
  primaryButtonText: { fontSize: 12, fontWeight: '900', color: '#000', letterSpacing: 1 },
  linkButton: { alignItems: 'center', paddingVertical: 12 },
  linkText: { fontSize: 11, fontWeight: '900', color: '#000', letterSpacing: 1, textDecorationLine: 'underline' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#eee' },
  dividerText: { marginHorizontal: 16, fontSize: 12, fontWeight: '800', color: '#aaa' }
});