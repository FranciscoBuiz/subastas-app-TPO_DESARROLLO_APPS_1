import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Modal, TextInput, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as dueniosApi from '../../api/dueniosApi';

export default function CuentasScreen({ navigation }) {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ descripcion: '', esExterior: 'no', moneda: 'ARS' });
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const data = await dueniosApi.getCuentas();
      setCuentas(data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleGuardar = async () => {
    if (!form.descripcion.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return;
    }
    setGuardando(true);
    try {
      await dueniosApi.crearCuenta(form);
      setModalVisible(false);
      setForm({ descripcion: '', esExterior: 'no', moneda: 'ARS' });
      cargar();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = (id) => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro de que querés eliminar esta cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await dueniosApi.eliminarCuenta(id);
              cargar();
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <Feather name={item.esExterior === 'si' ? 'globe' : 'home'} size={20} color="#555" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardDesc}>{item.descripcion}</Text>
        <Text style={styles.cardMeta}>{item.moneda} · {item.esExterior === 'si' ? 'Cuenta exterior' : 'Cuenta local'}</Text>
      </View>
      <TouchableOpacity onPress={() => handleEliminar(item.id)} style={styles.deleteBtn}>
        <Feather name="trash-2" size={18} color="#c62828" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cuentas para cobro</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
          <Feather name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        Registrá las cuentas donde querés recibir el dinero de tus ventas. Deben ser declaradas antes del inicio de cada subasta.
      </Text>

      {cuentas.length === 0 ? (
        <View style={styles.center}>
          <Feather name="credit-card" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No tenés cuentas registradas</Text>
          <TouchableOpacity style={styles.btnAgregar} onPress={() => setModalVisible(true)}>
            <Text style={styles.btnAgregarText}>+ Agregar cuenta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cuentas}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); cargar(); }} />}
          contentContainerStyle={{ padding: 16, gap: 12 }}
        />
      )}

      {/* Modal para nueva cuenta */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nueva cuenta para cobro</Text>

            <Text style={styles.label}>Descripción / Datos bancarios *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Banco Nación CBU 001234..."
              value={form.descripcion}
              onChangeText={v => setForm(f => ({ ...f, descripcion: v }))}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Moneda</Text>
            <View style={styles.optionRow}>
              {['ARS', 'USD'].map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.optionBtn, form.moneda === m && styles.optionBtnActive]}
                  onPress={() => setForm(f => ({ ...f, moneda: m }))}
                >
                  <Text style={[styles.optionBtnText, form.moneda === m && styles.optionBtnTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Tipo de cuenta</Text>
            <View style={styles.optionRow}>
              <TouchableOpacity
                style={[styles.optionBtn, form.esExterior === 'no' && styles.optionBtnActive]}
                onPress={() => setForm(f => ({ ...f, esExterior: 'no' }))}
              >
                <Text style={[styles.optionBtnText, form.esExterior === 'no' && styles.optionBtnTextActive]}>Local</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionBtn, form.esExterior === 'si' && styles.optionBtnActive]}
                onPress={() => setForm(f => ({ ...f, esExterior: 'si' }))}
              >
                <Text style={[styles.optionBtnText, form.esExterior === 'si' && styles.optionBtnTextActive]}>Exterior</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar} disabled={guardando}>
              {guardando ? <ActivityIndicator color="#000" /> : <Text style={styles.btnGuardarText}>GUARDAR</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:       { flex: 1, backgroundColor: '#fff' },
  center:         { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  back:           { padding: 4 },
  addBtn:         { padding: 4 },
  headerTitle:    { fontSize: 18, fontWeight: '900', flex: 1, marginLeft: 8 },
  infoText:       { fontSize: 12, color: '#666', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#eee' },
  emptyText:      { marginTop: 12, fontSize: 16, color: '#aaa' },
  btnAgregar:     { marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#F7D05C', borderRadius: 8, borderWidth: 2, borderColor: '#000' },
  btnAgregarText: { fontSize: 14, fontWeight: '900' },
  card:           { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#eee' },
  cardIcon:       { width: 38, height: 38, borderRadius: 19, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardContent:    { flex: 1 },
  cardDesc:       { fontSize: 13, fontWeight: '700', color: '#000' },
  cardMeta:       { fontSize: 12, color: '#777', marginTop: 2 },
  deleteBtn:      { padding: 6 },
  modalOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle:     { fontSize: 18, fontWeight: '900', marginBottom: 20 },
  label:          { fontSize: 12, fontWeight: '800', color: '#555', marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' },
  input:          { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 16, textAlignVertical: 'top' },
  optionRow:      { flexDirection: 'row', gap: 10, marginBottom: 16 },
  optionBtn:      { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', backgroundColor: '#f9f9f9' },
  optionBtnActive:{ backgroundColor: '#000', borderColor: '#000' },
  optionBtnText:  { fontSize: 14, fontWeight: '700', color: '#555' },
  optionBtnTextActive: { color: '#fff' },
  btnGuardar:     { backgroundColor: '#F7D05C', paddingVertical: 14, borderRadius: 8, alignItems: 'center', borderWidth: 2, borderColor: '#000', marginBottom: 10 },
  btnGuardarText: { fontSize: 15, fontWeight: '900' },
  btnCancelar:    { alignItems: 'center', paddingVertical: 12 },
  btnCancelarText:{ fontSize: 15, color: '#888', fontWeight: '700' },
});
