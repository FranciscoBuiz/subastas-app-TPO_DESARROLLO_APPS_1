import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
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
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SUBASTAPP</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Feather name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.seasonText}>CATÁLOGO DE VERANO</Text>
          <Text style={styles.title}>{auction.title}</Text>
          
          <View style={styles.mainDivider} />
          <View style={styles.listDivider} />

          {auction.items.map((item, index) => (
            <View key={item.id}>
              <View style={styles.itemRow}>
                <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.itemRef}>PIEZA #{String(item.id).substring(0,3).toUpperCase() || '082'}</Text>
                    <Text style={styles.itemPrice}>{auction.currency === 'USD' ? 'US$' : '$'}{item.basePrice.toLocaleString()}</Text>
                  </View>
                  <Text style={styles.itemDescription} numberOfLines={3}>{item.description}</Text>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity 
                      style={styles.detailButton}
                      onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
                    >
                      <Text style={styles.detailButtonText}>VER DETALLE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.listDivider} />
            </View>
          ))}
          
          {/* Pagination Mock */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity style={styles.pageButton}>
              <Feather name="chevron-left" size={14} color="black" />
              <Text style={styles.pageButtonText}>ANTERIOR</Text>
            </TouchableOpacity>
            
            <View style={styles.pageNumbers}>
              <Text style={[styles.pageNumber, styles.pageNumberActive]}>01</Text>
              <Text style={styles.pageNumber}>02</Text>
              <Text style={styles.pageNumber}>03</Text>
            </View>

            <TouchableOpacity style={styles.pageButton}>
              <Text style={styles.pageButtonText}>SIGUIENTE</Text>
              <Feather name="chevron-right" size={14} color="black" />
            </TouchableOpacity>
          </View>
          
          <View style={{height: 40}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#000'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerIcon: {
    width: 24,
    alignItems: 'center',
  },
  body: { flex: 1 },
  contentContainer: {
    padding: 20,
  },
  seasonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  mainDivider: {
    height: 1,
    backgroundColor: '#000',
    marginBottom: 20,
  },
  listDivider: {
    height: 1,
    backgroundColor: '#000',
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 16,
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemRef: {
    fontSize: 9,
    fontWeight: '800',
    color: '#888',
    letterSpacing: 0.5,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
  },
  itemDescription: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    lineHeight: 18,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  detailButton: {
    backgroundColor: '#ffd766',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  detailButtonText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pageButtonText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.5,
    marginHorizontal: 4,
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ccc',
    marginHorizontal: 6,
  },
  pageNumberActive: {
    color: '#000',
  },
});