import React, { useEffect } from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { fetchMisSolicitudes } from '../../store/slices/sellerSlice';

export default function PublishedItemsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { myConsignments: consignments, status } = useSelector(state => state.seller);

  useEffect(() => {
    dispatch(fetchMisSolicitudes());
  }, [dispatch]);

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'aceptado': return '#2e7d32';
      case 'rechazado': return '#d32f2f';
      case 'devuelto': return '#555';
      default: return '#f57c00';
    }
  };

  const estadoLabel = (estado) => {
    const map = { pendiente: 'PENDIENTE', aceptado: 'ACEPTADO', rechazado: 'RECHAZADO', devuelto: 'DEVUELTO' };
    return map[estado] ?? estado?.toUpperCase() ?? '–';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>ARTÍCULOS PUBLICADOS</Text>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>FILTRAR POR ESTADO</Text>
        <Feather name="filter" size={20} color="#000" />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {status === 'loading' && <ActivityIndicator color="#000" style={{ marginVertical: 20 }} />}

        {status !== 'loading' && consignments.length === 0 && (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Feather name="inbox" size={40} color="#ccc" />
            <Text style={{ color: '#666', marginTop: 12 }}>No hay artículos enviados todavía.</Text>
          </View>
        )}

        {consignments.map(item => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => navigation.navigate('ConsignmentDetail', { itemId: item.id })}>
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={28} color="#bbb" />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.descripcion ?? `Artículo #${item.id}`}</Text>
              <Text style={styles.cardId}>ID: #{item.id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}> 
              <Text style={styles.statusText}>{estadoLabel(item.estado)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#000' },
  backButton: { marginRight: 16 },
  title: { fontSize: 22, fontWeight: '900' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#000' },
  filterLabel: { fontSize: 14, fontWeight: '900' },
  container: { flex: 1, padding: 16 },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#000', borderRadius: 16, overflow: 'hidden', marginBottom: 16, backgroundColor: '#fff' },
  imagePlaceholder: { width: 96, height: 96, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '900', marginBottom: 4 },
  cardId: { fontSize: 12, color: '#666', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginRight: 12 },
  statusText: { fontSize: 10, fontWeight: '900', color: '#fff' }
});