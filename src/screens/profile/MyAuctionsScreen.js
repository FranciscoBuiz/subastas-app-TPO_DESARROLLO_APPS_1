import React, { useState } from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { selectAuction } from '../../store/slices/auctionsSlice';

export default function MyAuctionsScreen({ navigation }) {
  const activeAuctions = useSelector(state => state.auctions.activeAuctions);
  const [activeTab, setActiveTab] = useState('Participadas');
  const dispatch = useDispatch();

  const wonAuctions = activeAuctions.filter((auction, index) => index === 0);
  const participatedAuctions = activeAuctions;
  const currentList = activeTab === 'Participadas' ? participatedAuctions : wonAuctions;

  const handleSelectAuction = (id) => {
    dispatch(selectAuction(id));
    navigation.navigate('AuctionDetail');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>MIS SUBASTAS</Text>
      </View>

      <View style={styles.tabRow}>
        {['Participadas', 'Ganadas'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {currentList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No hay subastas en esta categoría.</Text>
            <Text style={styles.emptyText}>Participa en una subasta desde Inicio para ver tus lotes aquí.</Text>
          </View>
        ) : (
          currentList.map(auction => (
            <TouchableOpacity key={auction.id} style={styles.card} onPress={() => handleSelectAuction(auction.id)}>
              <Image source={{ uri: auction.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardId}>ID: #{auction.id}</Text>
                <Text style={styles.cardTitle}>{auction.title}</Text>
                <Text style={styles.cardPrice}>Oferta actual</Text>
                <Text style={styles.cardAmount}>{auction.currency} ${auction.items[0].basePrice.toLocaleString()}</Text>
              </View>
              <View style={styles.badge}> 
                <Text style={styles.badgeText}>{activeTab === 'Ganadas' ? 'FINALIZADO' : 'ACTIVO'}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#000' },
  backButton: { marginRight: 16 },
  title: { fontSize: 22, fontWeight: '900' },
  tabRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 24, borderWidth: 1, borderColor: '#000', borderRadius: 10, overflow: 'hidden' },
  tabButton: { flex: 1, paddingVertical: 14, backgroundColor: '#fff', alignItems: 'center' },
  tabButtonActive: { backgroundColor: '#000' },
  tabText: { fontSize: 12, fontWeight: '900', color: '#000' },
  tabTextActive: { color: '#fff' },
  container: { flex: 1, padding: 16 },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#000', borderRadius: 12, overflow: 'hidden', marginBottom: 16, backgroundColor: '#fff' },
  cardImage: { width: 92, height: 92, resizeMode: 'cover' },
  cardContent: { flex: 1, padding: 12 },
  cardId: { fontSize: 12, color: '#666', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '900', marginBottom: 8 },
  cardPrice: { fontSize: 12, color: '#888' },
  cardAmount: { fontSize: 18, fontWeight: '900', marginTop: 4 },
  badge: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#000', borderTopRightRadius: 12, borderBottomRightRadius: 12 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  emptyBox: { padding: 24, borderWidth: 1, borderColor: '#000', borderRadius: 12, marginTop: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '900', marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center' }
});