import React, { useState } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput,Alert,ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { crearMedioPago } from '../../store/slices/paymentSlice';

const TIPOS = [
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'cuenta_bancaria', label: 'Cuenta Bancaria' },
  { value: 'cheque_certificado', label: 'Cheque Certificado' },
];

export default function AddPaymentMethodScreen({ navigation }) {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.payment);
  const [tipo, setTipo] = useState('tarjeta');
  const [descripcion, setDescripcion] = useState('');
  const [moneda, setMoneda] = useState('ARS');
  const [montoGarantia, setMontoGarantia] = useState('');
  const isLoading = status === 'loading';

  const handleSave = async () => {
    if (!descripcion.trim()) {
      Alert.alert('Error', 'Por favor ingresá una descripción.');
      return;
    }
    if (tipo === 'cheque_certificado' && !montoGarantia) {
      Alert.alert('Error', 'El cheque certificado requiere un monto garantizado.');
      return;
    }

    const payload = {
      tipo,
      descripcion: descripcion.trim(),
      moneda,
      ...(montoGarantia ? { montoGarantia: Number(montoGarantia) } : {}),
    };

    const result = await dispatch(crearMedioPago(payload));
    if (crearMedioPago.fulfilled.match(result)) {
      navigation.goBack();
    } else {
      Alert.alert('Error', result.payload ?? 'No se pudo agregar el método de pago');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Método</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.subtitle}>Agregá una tarjeta, cuenta bancaria o cheque certificado.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.tipoRow}>
            {TIPOS.map(t => (
              <TouchableOpacity
                key={t.value}
                style={[styles.tipoBtn, tipo === t.value && styles.tipoBtnActive]}
                onPress={() => setTipo(t.value)}
              >
                <Text style={[styles.tipoBtnText, tipo === t.value && styles.tipoBtnTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej. Visa Santander **** 1234"
            value={descripcion}
            onChangeText={setDescripcion}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Moneda</Text>
          <View style={styles.tipoRow}>
            {['ARS', 'USD'].map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.tipoBtn, moneda === m && styles.tipoBtnActive]}
                onPress={() => setMoneda(m)}
              >
                <Text style={[styles.tipoBtnText, moneda === m && styles.tipoBtnTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Monto de Garantía{tipo === 'cheque_certificado' ? ' *' : ' (opcional)'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 50000"
            keyboardType="numeric"
            value={montoGarantia}
            onChangeText={setMontoGarantia}
          />
        </View>

        <TouchableOpacity style={[styles.primaryButton, isLoading && { opacity: 0.6 }]} onPress={handleSave} disabled={isLoading}>
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.primaryButtonText}>GUARDAR MÉTODO</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#000' },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  container: { flex: 1, padding: 24 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  tipoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tipoBtn: { paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: '#aaa', borderRadius: 6 },
  tipoBtnActive: { backgroundColor: '#F7D05C', borderColor: '#000' },
  tipoBtnText: { fontSize: 12, fontWeight: '700', color: '#555' },
  tipoBtnTextActive: { color: '#000' },
  primaryButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 8,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});