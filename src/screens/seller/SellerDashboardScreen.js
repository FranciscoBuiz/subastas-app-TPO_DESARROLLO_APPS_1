import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { fetchMisSolicitudes } from '../../store/slices/sellerSlice';

export default function SellerDashboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const { myConsignments: consignments, status } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(fetchMisSolicitudes());
  }, [dispatch]);

  const getStatusBadgeStyle = (estado) => {
    switch(estado) {
      case 'aceptado': return { backgroundColor: '#000', color: '#fff' };
      case 'rechazado': return { backgroundColor: '#d32f2f', color: '#fff' };
      case 'devuelto': return { backgroundColor: '#fff', color: '#000', borderWidth: 1, borderColor: '#000' };
      default: return { backgroundColor: '#F7D05C', color: '#000' }; // pendiente
    }
  };

  const estadoLabel = (estado) => {
    const map = { pendiente: 'EN EVALUACIÓN', aceptado: 'ACEPTADO', rechazado: 'RECHAZADO', devuelto: 'DEVUELTO' };
    return map[estado] ?? estado?.toUpperCase() ?? 'PENDIENTE';
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
        <Text style={styles.sectionOverline}>REGISTRO DE CONSIGNACIÓN</Text>
        <Text style={styles.title}>ARTICULOS PUBLICADOS</Text>
        <Text style={styles.subtitle}>
          Seguimiento técnico de artículos enviados a revisión. El proceso de evaluación puede demorar hasta 48 horas hábiles.
        </Text>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('NewConsignment')}
        >
          <Feather name="plus-square" size={20} color="#000" style={{ marginRight: 12 }} />
          <Text style={styles.addButtonText}>VENDER NUEVO ARTÍCULO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>FILTRAR POR ESTADO</Text>
          <Feather name="filter" size={16} color="#000" />
        </TouchableOpacity>

        {status === 'loading' && <ActivityIndicator color="#000" style={{ marginVertical: 20 }} />}

        {status !== 'loading' && consignments.length === 0 && (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Feather name="inbox" size={40} color="#ccc" />
            <Text style={{ color: '#666', marginTop: 12, textAlign: 'center' }}>No hay artículos enviados todavía.</Text>
          </View>
        )}

        {consignments.map((item, index) => {
          const badgeStyle = getStatusBadgeStyle(item.estado);
          const showContractButton = item.estado === 'aceptado';
          
          return (
            <TouchableOpacity 
              key={item.id || index} 
              style={styles.card}
              onPress={() => navigation.navigate('ConsignmentDetail', { itemId: item.id })}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{(item.descripcion ?? `Artículo #${item.id}`).toUpperCase()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: badgeStyle.backgroundColor, borderWidth: badgeStyle.borderWidth || 0, borderColor: badgeStyle.borderColor }]}>
                  <Text style={[styles.statusText, { color: badgeStyle.color }]}>
                    {estadoLabel(item.estado)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.cardId}>ID: #ENV-{String(item.id).slice(0,5).toUpperCase()}</Text>
              
              <View style={styles.cardBody}>
                <View style={styles.imagePlaceholder}>
                  <View style={styles.xContainer}>
                    <View style={styles.xLine1} />
                    <View style={styles.xLine2} />
                  </View>
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.dateLabel}>PRODUCTO ID</Text>
                  <Text style={styles.dateValue}>{item.productoId ?? '-'}</Text>
                </View>
              </View>

              {showContractButton && (
                <View style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>VER CONTRATO DE SUBASTA</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: '#f5f5f5', marginTop: 8 }]}
          onPress={() => navigation.navigate('Cuentas')}
        >
          <Feather name="credit-card" size={20} color="#000" style={{ marginRight: 12 }} />
          <Text style={styles.addButtonText}>MIS CUENTAS PARA COBRO</Text>
        </TouchableOpacity>

        <View style={styles.bottomBlocks}>
          <TouchableOpacity style={styles.supportBlock}>
            <Text style={styles.blockTitle}>24h</Text>
            <Text style={styles.blockSub}>SOPORTE TÉCNICO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logBlock}>
            <Text style={styles.blockTitle}>LOG</Text>
            <Text style={styles.blockSub}>GUÍAS DE ENVÍO</Text>
          </TouchableOpacity>
        </View>
        
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
  container: { flex: 1, padding: 16 },
  
  sectionOverline: { fontSize: 8, fontWeight: '900', letterSpacing: 1, color: '#666', marginBottom: 4 },
  title: { fontSize: 36, fontWeight: '900', letterSpacing: -1, marginBottom: 12, color: '#000', lineHeight: 36 },
  subtitle: { fontSize: 11, color: '#555', lineHeight: 16, marginBottom: 24 },
  
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7D05C',
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 16,
  },
  addButtonText: { fontSize: 12, fontWeight: '900', letterSpacing: 1, color: '#000' },

  filterButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    padding: 12,
    marginBottom: 24,
  },
  filterText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  card: {
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { flex: 1, fontSize: 14, fontWeight: '900', marginRight: 12 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 4 },
  statusText: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  cardId: { fontSize: 10, color: '#666', fontWeight: '700', marginTop: 4, marginBottom: 16 },
  
  cardBody: { flexDirection: 'row', alignItems: 'center' },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  xContainer: { position: 'relative', width: '100%', height: '100%' },
  xLine1: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderBottomWidth: 1, borderColor: '#aaa', transform: [{ rotate: '45deg' }] },
  xLine2: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderBottomWidth: 1, borderColor: '#aaa', transform: [{ rotate: '-45deg' }] },
  
  cardDetails: { flex: 1 },
  dateLabel: { fontSize: 10, fontWeight: '800', marginBottom: 2 },
  dateValue: { fontSize: 12, fontWeight: '900' },
  
  actionButton: {
    backgroundColor: '#F7D05C',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonText: { color: '#000', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  bottomBlocks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  supportBlock: { flex: 1, borderWidth: 2, borderColor: '#000', padding: 16, marginRight: 8 },
  logBlock: { flex: 1, borderWidth: 2, borderColor: '#000', padding: 16, marginLeft: 8 },
  blockTitle: { fontSize: 24, fontWeight: '900' },
  blockSub: { fontSize: 8, fontWeight: '900', letterSpacing: 1, color: '#666', marginTop: 4 }
});