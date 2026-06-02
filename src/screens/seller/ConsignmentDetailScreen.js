import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { fetchMisSolicitudes } from '../../store/slices/sellerSlice';
import { apiClient } from '../../api/client';

export default function ConsignmentDetailScreen({ route, navigation }) {
  const { itemId } = route.params;
  const dispatch = useDispatch();
  const { myConsignments, status } = useSelector(state => state.seller);
  const item = myConsignments.find(c => String(c.id) === String(itemId));
  const [rechazando, setRechazando] = useState(false);

  useEffect(() => {
    if (!item) dispatch(fetchMisSolicitudes());
  }, []);

  const handleRechazarCondiciones = () => {
    Alert.alert(
      'Rechazar condiciones',
      '¿Confirmás que querés rechazar las condiciones? El bien será devuelto con cargo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            setRechazando(true);
            try {
              await apiClient.post(`/articulos/solicitudes/${item.id}/rechazar-condiciones`);
              Alert.alert('Listo', 'Rechazaste las condiciones. La empresa procederá con la devolución del bien.');
              dispatch(fetchMisSolicitudes());
              navigation.goBack();
            } catch (e) {
              Alert.alert('Error', e.message);
            } finally {
              setRechazando(false);
            }
          },
        },
      ],
    );
  };

  if (status === 'loading' && !item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Artículo no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderStatusBadge = () => {
    switch (item.estado) {
      case 'aceptado':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#000' }]}>
            <Text style={[styles.statusText, { color: '#fff' }]}>APROBADO PARA SUBASTA</Text>
          </View>
        );
      case 'rechazado':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#d32f2f' }]}>
            <Text style={[styles.statusText, { color: '#fff' }]}>RECHAZADO</Text>
          </View>
        );
      case 'devuelto':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#000' }]}>
            <Text style={[styles.statusText, { color: '#000' }]}>DEVUELTO</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#F7D05C' }]}>
            <Text style={[styles.statusText, { color: '#000' }]}>EN EVALUACIÓN</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SUBASTAPP</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Feather name="help-circle" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionOverline}>ESTADO DEL ARTÍCULO</Text>
        <Text style={styles.title}>{(item.descripcion ?? `Artículo #${item.id}`).toUpperCase()}</Text>
        {renderStatusBadge()}

        {item.estado === 'aceptado' && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>CONTRATO DE SUBASTA</Text>
            <View style={styles.contractBox}>
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>PRODUCTO ID</Text>
                <Text style={styles.contractValue}>{item.productoId ?? '–'}</Text>
              </View>
              <View style={[styles.contractRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                <Text style={styles.contractLabel}>DUEÑO ID</Text>
                <Text style={styles.contractValue}>{item.duenioId ?? '–'}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => Alert.alert('Información', 'Contacte a la casa de subastas para los términos finales.')}
            >
              <Text style={styles.primaryButtonText}>CONSULTAR TÉRMINOS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: '#ffebee', borderColor: '#c62828', marginTop: 8 }]}
              onPress={handleRechazarCondiciones}
              disabled={rechazando}
            >
              {rechazando
                ? <ActivityIndicator color="#c62828" />
                : <Text style={[styles.primaryButtonText, { color: '#c62828' }]}>RECHAZAR CONDICIONES</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {item.estado === 'rechazado' && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>MOTIVO DE RECHAZO</Text>
            <View style={styles.contractBox}>
              <Text style={styles.itemDetailText}>{item.motivoRechazo ?? 'Sin detalle disponible.'}</Text>
            </View>
          </View>
        )}

        {(item.estado === 'pendiente' || item.estado == null) && (
          <View style={styles.contentSection}>
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={32} color="#aaa" />
            </View>
            <Text style={[styles.sectionTitle, {marginTop: 16}]}>DETALLES DEL ARTÍCULO</Text>
            <Text style={styles.itemDetailText}>{item.descripcion ?? 'Sin descripción.'}</Text>
          </View>
        )}

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 16, 
    borderBottomWidth: 2, 
    borderBottomColor: '#000' 
  },
  headerIcon: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  container: { flex: 1, padding: 24 },
  
  sectionOverline: { fontSize: 10, fontWeight: '900', letterSpacing: 1, color: '#666', marginBottom: 4 },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -1, marginBottom: 12, color: '#000', lineHeight: 34 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, marginBottom: 32 },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  contentSection: { marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '900', letterSpacing: 1, marginBottom: 16 },

  contractBox: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 16,
    marginBottom: 32
  },
  contractRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contractLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: '#666' },
  contractValue: { fontSize: 14, fontWeight: '900' },

  primaryButton: {
    backgroundColor: '#F7D05C',
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 16
  },
  primaryButtonText: { color: '#000', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  
  secondaryButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000'
  },
  secondaryButtonText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },

  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  itemDetailText: { fontSize: 14, lineHeight: 22, color: '#333' }
});