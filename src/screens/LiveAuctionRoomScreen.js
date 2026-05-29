import React, { useState, useEffect } from 'react';
import {StyleSheet,Text,View,TouchableOpacity,TextInput,ActivityIndicator,Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { canEnterAuction } from '../utils/category';
import { Feather } from '@expo/vector-icons';
import { placeBid, resetStatus, receiveNewBid } from '../store/slices/liveAuctionSlice';

export default function LiveAuctionRoomScreen({ navigation }) {
  const dispatch = useDispatch();
  const { 
    currentItem, 
    currentHighestBid, 
    highestBidder, 
    status, 
    errorMessage 
  } = useSelector((state) => state.liveAuction);
  const selectedAuction = useSelector((state) => state.auctions.selectedAuction);
  const user = useSelector((state) => state.auth.user);
  const [canBid, setCanBid] = useState(true);
  const [shownCategoryAlert, setShownCategoryAlert] = useState(false);

  const [bidInput, setBidInput] = useState('');

  const minIncrement = currentItem.basePrice * 0.01;
  const recommendedBid = currentHighestBid + minIncrement;

  // Simulación de WebSocket: Recibir pujas de otros usuarios aleatoriamente
  useEffect(() => {
    // Verificar categoría al entrar a la sala y deshabilitar puja si corresponde
    const userCat = user?.category ?? 'COMUN';
    const auctionCat = selectedAuction?.category ?? 'COMUN';
    const allowed = canEnterAuction(userCat, auctionCat);
    setCanBid(allowed);
    if (!allowed && !shownCategoryAlert) {
      Alert.alert('Atención', `Podés ver la subasta pero no podés pujar. Tu categoría (${userCat}) es inferior a la requerida (${auctionCat}).`, [
        { text: 'OK', onPress: () => setShownCategoryAlert(true) }
      ]);
    }
    const interval = setInterval(() => {
      // Simular que otro usuario puja si nosotros no somos el mejor postor, de vez en cuando
      if (highestBidder !== 'Tú' && status !== 'bidding') {
        const randomChance = Math.random();
        if (randomChance > 0.7) {
          const newBid = currentHighestBid + (currentItem.basePrice * 0.05); // Aumenta 5% base
          dispatch(receiveNewBid({ amount: newBid, bidder: `Usuario_${Math.floor(Math.random() * 1000)}` }));
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentHighestBid, highestBidder, status, dispatch, currentItem, user, selectedAuction, shownCategoryAlert]);

  // Manejo de errores
  useEffect(() => {
    if (status === 'error') {
      Alert.alert('Error al pujar', errorMessage, [{ text: 'OK', onPress: () => dispatch(resetStatus()) }]);
    }
  }, [status, errorMessage, dispatch]);

  const handlePlaceBid = (overrideAmount) => {
    if (!canBid) {
      Alert.alert('No permitido', 'No podés pujar en esta subasta.');
      return;
    }

    const minAmount = recommendedBid;
    let amount;
    if (overrideAmount !== undefined) {
      amount = Number(overrideAmount);
    } else if (!bidInput || bidInput.toString().trim() === '') {
      amount = Number(minAmount);
    } else {
      amount = Number(bidInput);
    }

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Inválido', 'Por favor ingresa un monto válido.');
      return;
    }

    if (amount < minAmount) {
      Alert.alert('Oferta insuficiente', `La puja mínima es USD ${minAmount.toLocaleString()}`);
      return;
    }

    dispatch(placeBid(amount));
    setBidInput('');
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sala EN VIVO</Text>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      { !canBid && (
        <View style={{ backgroundColor: '#fff3cd', padding: 12, marginHorizontal: 16, borderRadius: 8, borderWidth:1, borderColor:'#ffeeba' }}>
          <Text style={{ fontWeight: '800', color:'#856404', textAlign:'center' }}>Sólo observador: tu categoría no permite pujar en esta subasta.</Text>
        </View>
      )}

      {/* Reproductor de Video (Placeholder) */}
      <View style={styles.videoPlaceholder}>
        <Feather name="video" size={48} color="#fff" style={{ opacity: 0.5 }} />
        <Text style={styles.videoText}>Transmisión en Vivo</Text>
        <Text style={styles.videoSubText}>(Servicio de Streaming)</Text>
      </View>

      <View style={styles.body}>
        {/* Info del Ítem */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{currentItem.description}</Text>
          <Text style={styles.itemBase}>Valor Base: USD ${currentItem.basePrice.toLocaleString()}</Text>
        </View>

        {/* Estado de la Puja */}
        <View style={styles.bidStatusContainer}>
          <Text style={styles.bidTitle}>Mayor Oferta Actual</Text>
          <Text style={styles.currentBid}>USD ${currentHighestBid.toLocaleString()}</Text>
          <Text style={styles.bidderName}>Postor: <Text style={{ fontWeight: '900' }}>{highestBidder}</Text></Text>
        </View>

        {/* Controles de Puja */}
        <View style={styles.controlsContainer}>
          <Text style={styles.instruction}>
            El incremento mínimo es del 1% (USD ${minIncrement.toLocaleString()})
          </Text>
          
          <View style={styles.inputRow}>
            <Text style={styles.currencyPrefix}>USD</Text>
            <TextInput
              style={styles.bidInput}
              keyboardType="numeric"
              placeholder={recommendedBid.toString()}
              value={bidInput}
              onChangeText={setBidInput}
              editable={status !== 'bidding' && canBid}
            />
          </View>

          <TouchableOpacity 
            style={[styles.bidButton, status === 'bidding' && styles.bidButtonDisabled]} 
            onPress={handlePlaceBid}
            disabled={status === 'bidding' || !canBid}
          >
            {status === 'bidding' ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.bidButtonText}>{canBid ? 'PUJAR AHORA' : 'NO PERMITIDO'}</Text>
            )}
          </TouchableOpacity>

          {/* Botones Rapidos */}
          <View style={styles.quickBidRow}>
            <TouchableOpacity 
              style={[styles.quickBidBtn, !canBid && styles.quickBidBtnDisabled]}
              onPress={() => { handlePlaceBid(recommendedBid); }}
            >
              <Text style={styles.quickBidText}>PUJA MÍNIMA</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickBidBtn}
              onPress={() => { if (canBid) setBidInput((currentHighestBid + (currentItem.basePrice * 0.05)).toString()); }}
            >
              <Text style={styles.quickBidText}>+5% Base</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4 },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4 },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1 },
  videoPlaceholder: {
    width: '100%',
    height: 220,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center' },
  videoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8 },
  videoSubText: {
    color: '#aaa',
    fontSize: 12 },
  body: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between' },
  itemInfo: {
    marginBottom: 20 },
  itemTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000' },
  itemBase: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginTop: 4 },
  bidStatusContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd' },
  bidTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#555',
    letterSpacing: 1,
    marginBottom: 4 },
  currentBid: {
    fontSize: 36,
    fontWeight: '900',
    color: '#2e7d32' },
  bidderName: {
    fontSize: 14,
    color: '#333',
    marginTop: 8 },
  controlsContainer: {
    marginTop: 20 },
  instruction: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 60 },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '800',
    marginRight: 12 },
  bidInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
    height: '100%' },
  bidButton: {
    backgroundColor: '#F7D05C',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000' },
  bidButtonDisabled: {
    opacity: 0.7 },
  bidButtonText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1 },
  quickBidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16 },
  quickBidBtn: {
    flex: 1,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
    marginHorizontal: 4 },
  quickBidBtnDisabled: {
    opacity: 0.5,
    backgroundColor: '#f8f9fa'
  },
  quickBidText: {
    fontSize: 14,
    fontWeight: '800' }
});