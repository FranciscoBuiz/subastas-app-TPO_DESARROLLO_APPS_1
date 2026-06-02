import React, { useEffect } from 'react';
import {StyleSheet,Text,View,ScrollView,TouchableOpacity,ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { selectAuction, fetchSubastas } from '../store/slices/auctionsSlice';

const Header = ({ navigation }) => (
  <View style={styles.header}>
    <View style={{ width: 24 }} />
    <Text style={styles.headerTitle}>SUBASTAPP</Text>
    <TouchableOpacity onPress={() => navigation.navigate('Perfil', { screen: 'Notificaciones' })}>
      <Feather name="bell" size={24} color="black" />
    </TouchableOpacity>
  </View>
);

const AuctionCard = ({ item, onPress }) => (
  <View style={styles.card}>
    <View style={styles.cardInner}>
      <View style={[styles.cardImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
        <Feather name="package" size={32} color="#aaa" />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.currencyBadge}>
            <Text style={styles.currencyText}>{item.currency}</Text>
          </View>
        </View>
        <Text style={styles.cardCategory}>CATEGORÍA: {item.category}</Text>
        <Text style={styles.cardEndTime}>FECHA: {item.endTime}</Text>
        {item.ubicacion ? <Text style={styles.cardEndTime}>LUGAR: {item.ubicacion}</Text> : null}
        <TouchableOpacity style={styles.cardButton} activeOpacity={0.8} onPress={onPress}>
          <Text style={styles.cardButtonText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function CatalogScreen({ navigation }) {
  const dispatch = useDispatch();
  const { activeAuctions, status, error } = useSelector((state) => state.auctions);

  useEffect(() => {
    dispatch(fetchSubastas('abierta'));
  }, [dispatch]);

  const handleEnterAuction = (id) => {
    dispatch(selectAuction(id));
    navigation.navigate('AuctionDetail');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header navigation={navigation} />
        
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={styles.pageTitle}>Subastas</Text>
            
            <View style={styles.subTitleRow}>
              <Text style={styles.subTitleLeft}>DISPONIBLES AHORA</Text>
            </View>
            
            <View style={styles.divider} />

            {status === 'loading' && (
              <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#000" />
            )}
            {error ? (
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
            ) : null}
            {status !== 'loading' && activeAuctions.length === 0 && !error && (
              <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>No hay subastas abiertas en este momento.</Text>
            )}

            {activeAuctions.map((item) => (
              <AuctionCard 
                key={item.id} 
                item={item} 
                onPress={() => handleEnterAuction(item.id)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff' },
  container: {
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
    fontWeight: '900',
    letterSpacing: 0.5 },
  body: {
    flex: 1 },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24 },
  pageTitle: {
    fontSize: 42,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: -1,
    color: '#000' },
  subTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8 },
  subTitleLeft: {
    fontSize: 12,
    fontWeight: '800',
    color: '#555',
    letterSpacing: 1 },
  subTitleRight: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1.5 },
  divider: {
    height: 2,
    backgroundColor: '#000',
    marginBottom: 20 },
  card: {
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 20,
    backgroundColor: '#fff' },
  cardInner: {
    padding: 12 },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ddd' },
  cardBody: {
    marginTop: 12 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8 },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000' },
  currencyBadge: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2 },
  currencyText: {
    fontSize: 10,
    fontWeight: '900' },
  cardCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
    letterSpacing: 0.5 },
  cardEndTime: {
    fontSize: 10,
    fontWeight: '800',
    color: '#333',
    marginBottom: 16,
    letterSpacing: 0.5 },
  cardButton: {
    backgroundColor: '#F7D05C',
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000' },
  cardButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1 } });