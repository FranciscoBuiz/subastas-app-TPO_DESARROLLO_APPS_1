import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { simulateApproval } from '../../store/slices/authSlice';

export default function RegisterStep2Screen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();

  const handleFinish = () => {
    if (!password || password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden o están vacías.');
      return;
    }
    if (!acceptedTerms) {
      Alert.alert('Términos', 'Debes aceptar los términos y condiciones para continuar.');
      return;
    }
    
    dispatch(simulateApproval());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SUBASTAPP</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Feather name="help-circle" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>CREAR{'\n'}CUENTA</Text>
        <View style={styles.titleUnderline} />
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CREAR CONTRASEÑA</Text>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={[styles.input, { paddingRight: 40 }]} 
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.inputIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>MÍNIMO 8 CARACTERES, INCLUYE UN NÚMERO.</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>CONFIRMAR CONTRASEÑA</Text>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={[styles.input, { paddingRight: 40 }]} 
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Feather name="lock" size={20} color="#000" style={styles.inputIcon} />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && <Feather name="check" size={16} color="#000" />}
          </View>
          <Text style={styles.checkboxText}>
            Acepto los <Text style={styles.boldUnderline}>términos y condiciones</Text> y la política de tratamiento de datos personales de Subastapp
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleFinish}>
          <Text style={styles.primaryButtonText}>COMPLETAR REGISTRO</Text>
          <Feather name="arrow-right" size={16} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>VOLVER AL PASO 1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.cancelButtonText}>CANCELAR REGISTRO</Text>
        </TouchableOpacity>

        <View style={styles.securityBox}>
          <View style={styles.securityHeader}>
            <Feather name="shield" size={14} color="#000" />
            <Text style={styles.securityTitle}>SEGURIDAD DE CUENTA</Text>
          </View>
          <Text style={styles.securityText}>
            Tu información está protegida mediante encriptación de grado bancario. Nunca compartiremos tus credenciales de acceso con terceros.
          </Text>
          <View style={styles.securityDivider} />
          <View style={styles.securityFooter}>
            <Text style={styles.securityFooterLeft}>ESTADO DEL SERVIDOR</Text>
            <View style={styles.securityFooterRight}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>ONLINE</Text>
            </View>
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, 
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#000'
  },
  headerIcon: { width: 24, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  title: { fontSize: 42, fontWeight: '900', lineHeight: 46, letterSpacing: -1 },
  titleUnderline: { width: 60, height: 4, backgroundColor: '#000', marginTop: 16, marginBottom: 32 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: '#000', marginBottom: 8 },
  inputWrapper: { position: 'relative', justifyContent: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 16,
    height: 50,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff'
  },
  inputIcon: { position: 'absolute', right: 16 },
  helperText: { fontSize: 9, color: '#888', marginTop: 6, fontWeight: '700', letterSpacing: 0.5 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, marginTop: 16 },
  checkbox: { 
    width: 20, 
    height: 20, 
    borderWidth: 1.5, 
    borderColor: '#000', 
    marginRight: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  checkboxChecked: { backgroundColor: '#F7D05C' },
  checkboxText: { flex: 1, fontSize: 11, color: '#333', lineHeight: 16 },
  boldUnderline: { fontWeight: '800', color: '#000', textDecorationLine: 'underline' },
  primaryButton: {
    backgroundColor: '#F7D05C',
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#000'
  },
  primaryButtonText: { fontSize: 12, fontWeight: '900', color: '#000', letterSpacing: 1, marginRight: 8 },
  backButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#000'
  },
  backButtonText: { fontSize: 12, fontWeight: '900', color: '#000', letterSpacing: 1 },
  cancelButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#000'
  },
  cancelButtonText: { fontSize: 12, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  securityBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 20,
    backgroundColor: '#F7F7F7'
  },
  securityHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  securityTitle: { fontSize: 12, fontWeight: '800', marginLeft: 8, letterSpacing: 1 },
  securityText: { fontSize: 11, color: '#555', lineHeight: 18, marginBottom: 20 },
  securityDivider: { height: 1, backgroundColor: '#ddd', marginBottom: 12 },
  securityFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  securityFooterLeft: { fontSize: 9, fontWeight: '800', color: '#000', letterSpacing: 1 },
  securityFooterRight: { flexDirection: 'row', alignItems: 'center' },
  onlineDot: { width: 6, height: 6, backgroundColor: '#000', marginRight: 6 },
  onlineText: { fontSize: 9, fontWeight: '900', color: '#000', letterSpacing: 1 }
});