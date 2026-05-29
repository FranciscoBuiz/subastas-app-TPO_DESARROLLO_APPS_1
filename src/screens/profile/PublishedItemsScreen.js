import React from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';

export default function PublishedItemsScreen({ navigation }) {
  const consignments = useSelector(state => state.seller.myConsignments);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACEPTADO': return '#2e7d32';
      case 'RECHAZADO': return '#d32f2f';
      default: return '#f57c00';
    }
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
        {consignments.map(item => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => navigation.navigate('ConsignmentDetail', { itemId: item.id })}>
            <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.description}</Text>
              <Text style={styles.cardId}>ID: #{item.id}</Text>
              <Text style={styles.cardSubtitle}>{item.status === 'ACEPTADO' ? `Fecha de envío ${item.location}` : item.status === 'RECHAZADO' ? 'Motivo disponible en el detalle' : 'Fecha de envío pendiente'}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}> 
              <Text style={styles.statusText}>{item.status}</Text>
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
  cardImage: { width: 96, height: 96, resizeMode: 'cover' },
  cardBody: { flex: 1, padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '900', marginBottom: 4 },
  cardId: { fontSize: 12, color: '#666', marginBottom: 8 },
  cardSubtitle: { fontSize: 12, color: '#888' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginRight: 12 },
  statusText: { fontSize: 10, fontWeight: '900', color: '#fff' }
});