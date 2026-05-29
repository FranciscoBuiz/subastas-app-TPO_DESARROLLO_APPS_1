import React, { useState } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput,ScrollView,Alert,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function RegisterStep1Screen({ navigation }) {
  const [form, setForm] = useState({ name: '', surname: '', address: '', country: '' });
  const [photoFront, setPhotoFront] = useState(null);
  const [photoBack, setPhotoBack] = useState(null);

  const takePhoto = async (side) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara para tomar fotos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8 });

    if (!result.canceled) {
      if (side === 'front') {
        setPhotoFront(result.assets[0].uri);
      } else {
        setPhotoBack(result.assets[0].uri);
      }
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.surname || !form.address || !form.country) {
      Alert.alert('Incompleto', 'Por favor complete todos los datos personales.');
      return;
    }
    
    if (!photoFront || !photoBack) {
      Alert.alert('Incompleto', 'Por favor tome las fotos del DNI solicitadas.');
      return;
    }
    
    // Aquí iría la carga de imágenes del DNI...
    Alert.alert(
      'Solicitud Enviada', 
      'Tus datos serán verificados. Recibirás un correo electrónico cuando tu cuenta sea aprobada para continuar.',
      [{ text: 'ENTENDIDO', onPress: () => navigation.navigate('RegisterStep2') }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Registro (Etapa 1)</Text>
        <Text style={styles.subtitle}>Comencemos con tus datos legales para poder validar tu identidad.</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombres</Text>
          <TextInput style={styles.input} value={form.name} onChangeText={t => setForm({...form, name: t})} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellidos</Text>
          <TextInput style={styles.input} value={form.surname} onChangeText={t => setForm({...form, surname: t})} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Domicilio Legal</Text>
          <TextInput style={styles.input} value={form.address} onChangeText={t => setForm({...form, address: t})} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>País de Origen</Text>
          <TextInput style={styles.input} value={form.country} onChangeText={t => setForm({...form, country: t})} />
        </View>

        <TouchableOpacity style={styles.photoBox} onPress={() => takePhoto('front')}>
          {photoFront ? (
            <Image source={{ uri: photoFront }} style={styles.previewImage} />
          ) : (
            <>
              <Feather name="camera" size={32} color="#666" />
              <Text style={styles.photoText}>Tomar Foto DNI (Frente)</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.photoBox} onPress={() => takePhoto('back')}>
          {photoBack ? (
            <Image source={{ uri: photoBack }} style={styles.previewImage} />
          ) : (
            <>
              <Feather name="camera" size={32} color="#666" />
              <Text style={styles.photoText}>Tomar Foto DNI (Dorso)</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>ENVIAR A VERIFICACIÓN</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16 },
  container: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 32, fontWeight: '900', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16 },
  photoBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 8,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fafafa',
    overflow: 'hidden'
  },
  previewImage: { width: '100%', height: '100%', borderRadius: 8 },
  photoText: { marginTop: 8, fontSize: 12, fontWeight: '700', color: '#666' },
  primaryButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20 },
  primaryButtonText: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 1 } });