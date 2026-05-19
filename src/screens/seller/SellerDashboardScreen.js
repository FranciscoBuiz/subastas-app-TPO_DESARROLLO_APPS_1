import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';

export default function SellerDashboardScreen({ navigation }) {
  const consignments = useSelector((state) => state.seller.myConsignments);

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACEPTADO': return '#2e7d32';
      case 'RECHAZADO': return '#d32f2f';
      default: return '#f57c00';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Consignaciones</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Gestiona los artículos que has propuesto para subastar.</Text>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('NewConsignment')}
        >
          <Feather name="plus-circle" size={24} color="#000" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>NUEVO ARTÍCULO</Text>
        </TouchableOpacity>

        {consignments.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.card}
            onPress={() => navigation.navigate('ConsignmentDetail', { itemId: item.id })}
          >
            <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.description}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#000' },
  headerTitle: { fontSize: 24, fontWeight: '900' },
  container: { flex: 1, padding: 16 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#F7D05C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 24,
  },
  addButtonText: { fontSize: 16, fontWeight: '900', color: '#000' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  cardImage: { width: 60, height: 60, borderRadius: 4, marginRight: 12 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: { fontSize: 10, fontWeight: '800', color: '#fff' },
});
