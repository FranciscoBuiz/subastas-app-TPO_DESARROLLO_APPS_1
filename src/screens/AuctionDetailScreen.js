import React from 'react';
import {StyleSheet,Text,View,ScrollView,Image,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';

export default function AuctionDetailScreen({ navigation }) {
  const auction = useSelector((state) => state.auctions.selectedAuction);

  if (!auction) {
    return (
      <View style={styles.center}>
        <Text>No hay subasta seleccionada</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Subasta</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: auction.image }} style={styles.coverImage} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{auction.title}</Text>
          <Text style={styles.subtitle}>CATEGORIA: {auction.category} | MONEDA: {auction.currency}</Text>
          <Text style={styles.subtitle}>FINALIZA: {auction.endTime}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Catálogo de Ítems ({auction.items.length})</Text>

          {auction.items.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.itemCard}
              onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.itemArtist}>{item.artistOrDesigner}</Text>
                <Text style={styles.itemPrice}>Precio Base: {auction.currency} ${item.basePrice.toLocaleString()}</Text>
              </View>
              <Feather name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('LiveAuctionRoom')}>
            <Text style={styles.primaryButtonText}>INGRESAR A SALA DE SUBASTA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#000' },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900' },
  body: {
    flex: 1 },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover' },
  contentContainer: {
    padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8 },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    marginBottom: 4 },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#fafafa' },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12 },
  itemInfo: {
    flex: 1 },
  itemDescription: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4 },
  itemArtist: {
    fontSize: 12,
    color: '#666' },
  itemPrice: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
    color: '#2e7d32' },
  primaryButton: {
    backgroundColor: '#F7D05C',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000' },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000' } });