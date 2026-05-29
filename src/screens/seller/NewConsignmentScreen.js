import React, { useState } from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,TextInput,Alert,Switch,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { addConsignment } from '../../store/slices/sellerSlice';
import * as ImagePicker from 'expo-image-picker';

export default function NewConsignmentScreen({ navigation }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ description: '', history: '' });
  const [agreedLegal, setAgreedLegal] = useState(false);
  const [agreedOrigin, setAgreedOrigin] = useState(false);
  const [photos, setPhotos] = useState([]);

  const takePhoto = async () => {
    if (photos.length >= 6) {
      Alert.alert('Límite alcanzado', 'Ya has tomado el máximo de 6 fotos.');
      return;
    }
    
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
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleSubmit = () => {
    if (!form.description || !form.history) {
      Alert.alert('Error', 'Complete la descripción y la historia/relevancia del artículo.');
      return;
    }
    if (!agreedLegal || !agreedOrigin) {
      Alert.alert('Atención', 'Debe aceptar todas las declaraciones juradas para continuar.');
      return;
    }
    if (photos.length < 6) {
      Alert.alert('Incompleto', 'Se requieren mínimo 6 fotografías del artículo.');
      return;
    }

    dispatch(addConsignment({
      description: form.description,
      history: form.history,
      images: photos
    }));

    Alert.alert('Éxito', 'El artículo ha sido enviado a revisión. Nuestro equipo lo contactará en breve.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Proponer Artículo</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Título del Artículo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej. Reloj Rolex Submariner 1990"
            value={form.description}
            onChangeText={t => setForm({...form, description: t})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Historia y Detalles</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Describa el estado, reparaciones, origen..."
            multiline
            numberOfLines={4}
            value={form.history}
            onChangeText={t => setForm({...form, history: t})}
          />
        </View>

        <View style={styles.photosSection}>
          <Text style={styles.label}>Fotografías ({photos.length}/6 añadidas)</Text>
          <View style={styles.photoGrid}>
            {[0,1,2,3,4,5].map((idx) => (
              <TouchableOpacity key={idx} style={styles.photoPlaceholder} onPress={takePhoto} disabled={photos[idx] !== undefined}>
                {photos[idx] ? (
                  <Image source={{ uri: photos[idx] }} style={styles.previewImageSmall} />
                ) : (
                  <Feather name="camera" size={24} color="#aaa" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>Declaraciones Juradas</Text>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Declaro que el bien es de mi propiedad y no posee impedimentos (prendas, embargos) para su venta.</Text>
            <Switch value={agreedLegal} onValueChange={setAgreedLegal} />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Declaro el origen lícito de los fondos y del artículo a consignar.</Text>
            <Switch value={agreedOrigin} onValueChange={setAgreedOrigin} />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>ENVIAR SOLICITUD</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#000' },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  container: { flex: 1, padding: 16 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    height: 50 },
  textArea: { height: 100, paddingTop: 12, textAlignVertical: 'top' },
  photosSection: { marginBottom: 24 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  photoPlaceholder: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden'
  },
  previewImageSmall: { width: '100%', height: '100%', borderRadius: 8 },
  legalSection: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 24 },
  legalTitle: { fontSize: 16, fontWeight: '800', marginBottom: 16, color: '#d32f2f' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  switchText: { flex: 1, fontSize: 12, color: '#555', marginRight: 16, lineHeight: 18 },
  submitButton: { backgroundColor: '#000', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 } });