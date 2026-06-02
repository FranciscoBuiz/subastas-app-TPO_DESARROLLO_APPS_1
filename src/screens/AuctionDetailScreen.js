import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { fetchCatalogo } from '../store/slices/auctionsSlice';

export default function AuctionDetailScreen({ navigation }) {
  const dispatch = useDispatch();
  const auction = useSelector((state) => state.auctions.selectedAuction);
  const catalogoItems = useSelector((state) => state.auctions.catalogoItems);
  const status = useSelector((state) => state.auctions.status);

  useEffect(() => {
    if (auction?.id) {
      dispatch(fetchCatalogo(auction.id));
    }
  }, [auction?.id, dispatch]);

  if (!auction) {
    return (
      <View style={styles.center}>
        <Text>No hay subasta seleccionada</Text>
      </View>
    );
  }

  const items = catalogoItems.length > 0 ? catalogoItems : (auction.items ?? []);

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
          <Text style={styles.seasonText}>CATÁLOGO</Text>
          <Text style={styles.title}>{auction.title}</Text>
          <Text style={styles.seasonText}>{auction.fecha} {auction.hora} — {auction.ubicacion}</Text>
          
          <View style={styles.mainDivider} />
          <View style={styles.listDivider} />

          {status === 'loading' && <ActivityIndicator style={{ marginVertical: 20 }} color="#000" />}

          {items.map((item) => (
            <View key={item.id}>
              <View style={styles.itemRow}>
                <View style={[styles.itemImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                  <Feather name="package" size={24} color="#aaa" />
                </View>
                <View style={styles.itemInfo}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.itemRef}>PIEZA #{item.id}</Text>
                    {item.precioBase != null && (
                      <Text style={styles.itemPrice}>
                        {auction.currency === 'USD' ? 'US$' : '$'}{Number(item.precioBase).toLocaleString()}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.itemDescription} numberOfLines={3}>
                    {item.descripcionCatalogo || item.description || 'Sin descripción'}
                  </Text>
                  {item.duenio && <Text style={styles.ownerText}>Dueño: {item.duenio}</Text>}
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

          {status !== 'loading' && items.length === 0 && (
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>No hay items en el catálogo.</Text>
          )}

          <View style={{ height: 20 }} />
        </View>
      </ScrollView>

      {auction.estado === 'abierta' && (
        <View style={styles.liveButtonContainer}>
          <TouchableOpacity
            style={styles.liveButton}
            onPress={() => navigation.navigate('LiveAuctionRoom')}
          >
            <View style={styles.liveDot} />
            <Text style={styles.liveButtonText}>ENTRAR EN VIVO</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 4,
  },
  ownerText: {
    fontSize: 10,
    color: '#888',
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
  liveButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  liveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7D05C',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginRight: 10,
  },
  liveButtonText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#000',
  },
});