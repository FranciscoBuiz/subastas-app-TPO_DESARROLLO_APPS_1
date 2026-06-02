import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Alert, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ventasApi from '../../api/ventasApi';
import * as mediosPagoApi from '../../api/mediosPagoApi';

export default function MisComprasScreen({ navigation }) {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [mediosPago, setMediosPago] = useState([]);
  const [pagando, setPagando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const data = await ventasApi.getMisVentas();
      setVentas(data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const abrirPago = async (venta) => {
    setVentaSeleccionada(venta);
    try {
      const medios = await mediosPagoApi.getMediosPago();
      setMediosPago(medios.filter(m => m.verificado === 'si' && m.moneda === venta.moneda));
    } catch (e) {
      Alert.alert('Error', e.message);
      return;
    }
    setModalVisible(true);
  };

  const handlePagar = async (medioPagoId) => {
    if (!ventaSeleccionada) return;
    setPagando(true);
    try {
      await ventasApi.pagar(ventaSeleccionada.ventaId, medioPagoId);
      setModalVisible(false);
      Alert.alert('¡Listo!', 'Pago registrado correctamente.');
      cargar();
    } catch (e) {
      Alert.alert('Error al pagar', e.message);
    } finally {
      setPagando(false);
    }
  };

  const renderItem = ({ item }) => {
    const color = item.pagada === 'si' ? '#2e7d32' : '#c62828';
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.producto ?? `Venta #${item.ventaId}`}</Text>
          <Text style={[styles.badge, { backgroundColor: color + '20', color }]}>
            {item.pagada === 'si' ? 'PAGADA' : 'PENDIENTE'}
          </Text>
        </View>
        <Text style={styles.montoLabel}>Importe ofertado</Text>
        <Text style={styles.monto}>{item.moneda} {item.importeOfertado?.toLocaleString()}</Text>
        <View style={styles.row}>
          <Text style={styles.detalle}>Comisión: {item.moneda} {item.importeComision?.toFixed(2)}</Text>
          <Text style={styles.detalle}>Envío: {item.moneda} {item.importeEnvio?.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalMonto}>{item.moneda} {item.total?.toLocaleString()}</Text>
        </View>
        {item.pagada === 'no' && (
          <TouchableOpacity style={styles.btnPagar} onPress={() => abrirPago(item)}>
            <Text style={styles.btnPagarText}>PAGAR</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>Mis Compras</Text>
      </View>

      {ventas.length === 0 ? (
        <View style={styles.center}>
          <Feather name="shopping-bag" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Todavía no tenés compras</Text>
        </View>
      ) : (
        <FlatList
          data={ventas}
          keyExtractor={item => String(item.ventaId)}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); cargar(); }} />}
          contentContainerStyle={{ padding: 16, gap: 14 }}
        />
      )}

      {/* Modal para elegir medio de pago */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Elegí un medio de pago</Text>
            <Text style={styles.modalSubtitle}>
              Total a pagar: {ventaSeleccionada?.moneda} {ventaSeleccionada?.total?.toLocaleString()}
            </Text>
            {mediosPago.length === 0 ? (
              <Text style={styles.noMedios}>No tenés medios de pago verificados en {ventaSeleccionada?.moneda}</Text>
            ) : (
              mediosPago.map(m => (
                <TouchableOpacity
                  key={m.id}
                  style={styles.medioItem}
                  onPress={() => handlePagar(m.id)}
                  disabled={pagando}
                >
                  <Feather name="credit-card" size={18} color="#000" />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.medioDesc}>{m.descripcion}</Text>
                    <Text style={styles.medioTipo}>{m.tipo} · {m.moneda}</Text>
                  </View>
                  {pagando && <ActivityIndicator size="small" color="#000" />}
                </TouchableOpacity>
              ))
            )}
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  back:           { padding: 4 },
  headerTitle:    { fontSize: 18, fontWeight: '900', marginLeft: 8 },
  emptyText:      { marginTop: 12, fontSize: 16, color: '#aaa' },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle:      { fontSize: 15, fontWeight: '900', flex: 1, marginRight: 8 },
  badge:          { fontSize: 10, fontWeight: '900', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  montoLabel:     { fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 },
  monto:          { fontSize: 24, fontWeight: '900', color: '#000', marginBottom: 8 },
  row:            { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detalle:        { fontSize: 13, color: '#555' },
  totalRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8, marginTop: 4, marginBottom: 12 },
  totalLabel:     { fontSize: 12, fontWeight: '900', color: '#555', letterSpacing: 1 },
  totalMonto:     { fontSize: 18, fontWeight: '900', color: '#000' },
  btnPagar: {
    backgroundColor: '#F7D05C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  btnPagarText:   { fontSize: 15, fontWeight: '900' },
  modalOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle:     { fontSize: 18, fontWeight: '900', marginBottom: 4 },
  modalSubtitle:  { fontSize: 14, color: '#666', marginBottom: 20 },
  noMedios:       { color: '#c62828', textAlign: 'center', marginVertical: 16 },
  medioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  medioDesc:      { fontSize: 14, fontWeight: '700' },
  medioTipo:      { fontSize: 12, color: '#777', marginTop: 2 },
  btnCancelar:    { marginTop: 12, alignItems: 'center', paddingVertical: 14 },
  btnCancelarText:{ fontSize: 15, color: '#888', fontWeight: '700' },
});
