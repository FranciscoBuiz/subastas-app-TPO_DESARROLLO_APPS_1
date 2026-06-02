import React from 'react';
import {StyleSheet,Text,View,ScrollView,Image,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { selectAuction } from '../store/slices/auctionsSlice';

const Header = ({ navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Feather name="arrow-left" size={24} color="black" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>SUBASTAPP</Text>
    <TouchableOpacity>
      <Feather name="bell" size={24} color="black" />
    </TouchableOpacity>
  </View>
);

const AuctionCard = ({ item, onPress }) => (
  <View style={styles.card}>
    <View style={styles.cardInner}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.currencyBadge}>
            <Text style={styles.currencyText}>{item.currency}</Text>
          </View>
        </View>
        <Text style={styles.cardCategory}>CATEGORIA: {item.category}</Text>
        <Text style={styles.cardEndTime}>FINALIZA: {item.endTime}</Text>
        <TouchableOpacity style={styles.cardButton} activeOpacity={0.8} onPress={onPress}>
          <Text style={styles.cardButtonText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function CatalogScreen({ navigation }) {
  const dispatch = useDispatch();
  const activeAuctions = useSelector((state) => state.auctions.activeAuctions);

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
              <Text style={styles.subTitleRight}>FECHA ACTUAL</Text>
            </View>
            
            <View style={styles.divider} />

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