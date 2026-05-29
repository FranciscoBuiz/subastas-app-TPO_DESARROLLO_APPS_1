import React from 'react';
import {StyleSheet,Text,View,ScrollView,Image,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';

export default function ItemDetailScreen({ route, navigation }) {
  const { itemId } = route.params;
  const auction = useSelector((state) => state.auctions.selectedAuction);
  
  const item = auction?.items.find(i => i.id === itemId);

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Ítem no encontrado</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Ítem</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Usamos ScrollView horizontal para mostrar multiples imagenes (si hubiera) */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {item.images.map((img, index) => (
             <Image key={index} source={{ uri: img }} style={styles.coverImage} />
          ))}
        </ScrollView>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.description}</Text>
          <Text style={styles.subtitle}>Artista/Diseñador: {item.artistOrDesigner}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio Base:</Text>
            <Text style={styles.priceValue}>{auction.currency} ${item.basePrice.toLocaleString()}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Historia / Detalles</Text>
          <Text style={styles.historyText}>{item.history}</Text>
          
          <Text style={styles.ownerText}>Propietario Actual: {item.currentOwner}</Text>
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
    width: 400, // asumiendo ancho de pantalla
    height: 300,
    resizeMode: 'cover' },
  contentContainer: {
    padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
    marginBottom: 16 },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8 },
  priceLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8 },
  priceValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2e7d32' },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8 },
  historyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 16 },
  ownerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    fontStyle: 'italic' }
});