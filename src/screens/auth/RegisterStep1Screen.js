import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { preRegistroThunk } from '../../store/slices/authSlice';

// Mapa simple de países al número de la tabla `paises`
const PAISES = { argentina: 54, 'estados unidos': 1, uruguay: 598, brasil: 55 };

function parsePais(texto) {
  const clave = texto.trim().toLowerCase();
  return PAISES[clave] ?? 54; // Por defecto Argentina
}

export default function RegisterStep1Screen({ navigation }) {
  const [form, setForm] = useState({ name: '', surname: '', documento: '', address: '', country: 'Argentina' });
  const [photoFront, setPhotoFront] = useState(null);
  const [photoBack, setPhotoBack] = useState(null);
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const isLoading = status === 'loading';

  const takePhoto = async (side) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara para tomar fotos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8
    });

    if (!result.canceled) {
      if (side === 'front') {
        setPhotoFront(result.assets[0]);
      } else {
        setPhotoBack(result.assets[0]);
      }
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.surname || !form.documento || !form.address || !form.country) {
      Alert.alert('Incompleto', 'Por favor complete todos los datos personales.');
      return;
    }
    
    if (!photoFront || !photoBack) {
      Alert.alert('Incompleto', 'Por favor tome las fotos del DNI solicitadas.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', form.name);
    formData.append('apellido', form.surname);
    formData.append('documento', form.documento);
    formData.append('domicilio', form.address);
    formData.append('pais', String(parsePais(form.country)));
    formData.append('fotoDocumentoFrente', {
      uri: photoFront.uri,
      name: 'dni_frente.jpg',
      type: 'image/jpeg',
    });
    formData.append('fotoDocumentoDorso', {
      uri: photoBack.uri,
      name: 'dni_dorso.jpg',
      type: 'image/jpeg',
    });

    const result = await dispatch(preRegistroThunk(formData));
    if (preRegistroThunk.fulfilled.match(result)) {
      navigation.navigate('RegisterPending');
    } else {
      Alert.alert('Error en el registro', result.payload || 'No se pudo completar el pre-registro');
    }
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
          <Text style={styles.label}>NOMBRE</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej. Juan"
            placeholderTextColor="#aaa"
            value={form.name} 
            onChangeText={t => setForm({...form, name: t})} 
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>APELLIDO</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej. Pérez"
            placeholderTextColor="#aaa"
            value={form.surname} 
            onChangeText={t => setForm({...form, surname: t})} 
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>DOCUMENTO (DNI / Pasaporte)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej. 30123456"
            placeholderTextColor="#aaa"
            keyboardType="default"
            value={form.documento} 
            onChangeText={t => setForm({...form, documento: t})} 
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>DOMICILIO</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Calle"
            placeholderTextColor="#aaa"
            value={form.address} 
            onChangeText={t => setForm({...form, address: t})} 
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>PAÍS</Text>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={[styles.input, { paddingRight: 40 }]} 
              placeholder="Seleccionar país"
              placeholderTextColor="#aaa"
              value={form.country} 
              onChangeText={t => setForm({...form, country: t})} 
            />
            <Feather name="chevron-down" size={20} color="#000" style={styles.inputIcon} />
          </View>
        </View>

        <Text style={[styles.label, { marginTop: 8 }]}>VERIFICACIÓN DE IDENTIDAD (DNI)</Text>
        
        <TouchableOpacity style={styles.photoBox} onPress={() => takePhoto('front')}>
          {photoFront ? (
            <Image source={{ uri: photoFront.uri }} style={styles.previewImage} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Feather name="camera" size={24} color="#000" />
              <Text style={styles.photoText}>Subir DNI frente</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.photoBox} onPress={() => takePhoto('back')}>
          {photoBack ? (
            <Image source={{ uri: photoBack.uri }} style={styles.previewImage} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Feather name="camera" size={24} color="#000" />
              <Text style={styles.photoText}>Subir DNI dorso</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.primaryButton, isLoading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>ENVIAR DATOS</Text>
              <Feather name="arrow-right" size={16} color="#000" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>VOLVER A INICIO DE SESIÓN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.cancelButtonText}>CANCELAR REGISTRO</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Al enviar tus datos, aceptas nuestros <Text style={styles.footerTextBold}>Términos y Condiciones</Text>{'\n'}de verificación para subastas de alta gama.
        </Text>
        
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
  photoBox: {
    borderWidth: 1,
    borderColor: '#000',
    height: 140,
    marginBottom: 16,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  previewImage: { width: '100%', height: '100%' },
  photoText: { marginTop: 12, fontSize: 12, fontWeight: '800', color: '#000' },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#F7D05C',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
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
  footerText: { fontSize: 10, color: '#555', textAlign: 'center', lineHeight: 16 },
  footerTextBold: { fontWeight: '800', color: '#000', textDecorationLine: 'underline' }
});