import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { addPaymentMethod } from '../../store/slices/paymentSlice';

export default function AddPaymentMethodScreen({ navigation }) {
  const dispatch = useDispatch();
  const [bank, setBank] = useState('');
  const [number, setNumber] = useState('');
  const [isInternational, setIsInternational] = useState(false);

  const handleSave = () => {
    if (!bank || number.length < 4) {
      Alert.alert('Error', 'Por favor complete todos los campos válidos.');
      return;
    }

    dispatch(addPaymentMethod({
      type: 'CARD',
      bank,
      last4: number.slice(-4),
      isInternational
    }));

    navigation.goBack();
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
        <Text style={styles.subtitle}>Las tarjetas internacionales otorgan un límite de puja mayor.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Banco / Entidad</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej. Santander"
            value={bank}
            onChangeText={setBank}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número de Tarjeta / Cuenta</Text>
          <TextInput 
            style={styles.input} 
            placeholder="XXXX-XXXX-XXXX-1234"
            keyboardType="numeric"
            maxLength={16}
            value={number}
            onChangeText={setNumber}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Es una tarjeta internacional</Text>
          <Switch value={isInternational} onValueChange={setIsInternational} />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
          <Text style={styles.primaryButtonText}>GUARDAR MÉTODO</Text>
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
  },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  switchLabel: { fontSize: 14, fontWeight: '700' },
  primaryButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});
