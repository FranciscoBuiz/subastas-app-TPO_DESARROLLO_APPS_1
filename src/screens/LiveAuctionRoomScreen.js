import React, { useState, useEffect, useRef, useCallback } from 'react';
import {StyleSheet,Text,View,TouchableOpacity,TextInput,ActivityIndicator,Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { canEnterAuction } from '../utils/category';
import { Feather } from '@expo/vector-icons';
import { placeBid, resetStatus, fetchEstadoActual, receiveNewBid } from '../store/slices/liveAuctionSlice';
import { ingresarSubasta } from '../store/slices/auctionsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, TOKEN_KEY } from '../api/client';

export default function LiveAuctionRoomScreen({ navigation }) {
  const dispatch = useDispatch();
  const {
    currentItem,
    currentHighestBid,
    highestBidder,
    status,
    errorMessage,
    subastaTerminada,
  } = useSelector((state) => state.liveAuction);
  const selectedAuction = useSelector((state) => state.auctions.selectedAuction);
  const asistenteId = useSelector((state) => state.auctions.asistenteId);
  const user = useSelector((state) => state.auth.user);
  const [canBid, setCanBid] = useState(false);
  const [shownCategoryAlert, setShownCategoryAlert] = useState(false);
  const [bidInput, setBidInput] = useState('');
  const xhrRef = useRef(null);
  const lastIndexRef = useRef(0);

  const basePrice = currentItem?.basePrice ?? 0;
  const minIncrement = basePrice * 0.01;
  const recommendedBid = currentHighestBid > 0 ? currentHighestBid + minIncrement : basePrice;
  const moneda = selectedAuction?.moneda === 'USD' ? 'USD' : '$';

  // Conectar SSE para recibir actualizaciones en tiempo real
  const conectarSSE = useCallback(async (subastaId) => {
    // Cerrar conexión anterior si existe
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    lastIndexRef.current = 0;

    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const url = `${API_BASE_URL}/subastas/${subastaId}/events`;

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open('GET', url, true);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Accept', 'text/event-stream');

    xhr.onprogress = () => {
      const chunk = xhr.responseText.slice(lastIndexRef.current);
      lastIndexRef.current = xhr.responseText.length;

      // Parsear eventos SSE del chunk
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const evento = JSON.parse(line.slice(6));
            procesarEvento(evento);
          } catch { /* ignorar líneas malformadas */ }
        }
      }
    };

    xhr.onerror = () => {
      // Reconectar después de 5s si hay error de red
      setTimeout(() => {
        if (xhrRef.current === xhr) conectarSSE(subastaId);
      }, 5000);
    };

    xhr.send();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const procesarEvento = useCallback((evento) => {
    if (evento.tipo === 'nueva_puja') {
      dispatch(receiveNewBid({
        amount: evento.importe,
        bidder: `Postor #${evento.asistenteId}`,
      }));
      // Refrescar estado completo para mantener item actualizado
      if (selectedAuction?.id) {
        dispatch(fetchEstadoActual(selectedAuction.id));
      }
    } else if (evento.tipo === 'subasta_cerrada') {
      dispatch({ type: 'liveAuction/subastaTerminada' });
      Alert.alert(
        'Subasta finalizada',
        'La subasta ha cerrado. Ingresá a Mis Compras para ver el resultado.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    }
  }, [dispatch, navigation, selectedAuction?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ingresar a la subasta y conectar SSE al montar
  useEffect(() => {
    if (!selectedAuction?.id) return;

    const init = async () => {
      // Verificar categoría
      const userCat = user?.category ?? 'COMUN';
      const auctionCat = selectedAuction?.category ?? 'COMUN';
      const allowed = canEnterAuction(userCat, auctionCat);
      setCanBid(allowed);
      if (!allowed && !shownCategoryAlert) {
        Alert.alert('Atención', `Podés ver la subasta pero no podés pujar. Tu categoría (${userCat}) es inferior a la requerida (${auctionCat}).`, [
          { text: 'OK', onPress: () => setShownCategoryAlert(true) }
        ]);
      }

      // Ingresar a la subasta si no tenemos asistenteId
      if (!asistenteId) {
        const ingResult = await dispatch(ingresarSubasta(selectedAuction.id));
        if (ingresarSubasta.rejected.match(ingResult)) {
          Alert.alert('No podés ingresar', ingResult.payload ?? 'Error al ingresar a la subasta');
          return;
        }
      }

      // Cargar estado inicial
      dispatch(fetchEstadoActual(selectedAuction.id));

      // Conectar SSE
      await conectarSSE(selectedAuction.id);
    };

    init();

    return () => {
      // Desconectar SSE al salir
      if (xhrRef.current) {
        xhrRef.current.abort();
        xhrRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAuction?.id]);

  // Manejo de errores de puja
  useEffect(() => {
    if (status === 'error') {
      Alert.alert('Error al pujar', errorMessage, [{ text: 'OK', onPress: () => dispatch(resetStatus()) }]);
    }
  }, [status, errorMessage, dispatch]);

  const handlePlaceBid = async (overrideAmount) => {
    if (!canBid) {
      Alert.alert('No permitido', 'No podés pujar en esta subasta.');
      return;
    }
    if (!currentItem) {
      Alert.alert('Sin ítem', 'No hay un ítem activo para pujar.');
      return;
    }
    if (!asistenteId) {
      Alert.alert('Error', 'No estás registrado como asistente de esta subasta.');
      return;
    }

    let amount;
    if (overrideAmount !== undefined) {
      amount = Number(overrideAmount);
    } else if (!bidInput || bidInput.toString().trim() === '') {
      amount = Number(recommendedBid.toFixed(2));
    } else {
      amount = Number(bidInput);
    }

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Inválido', 'Por favor ingresá un monto válido.');
      return;
    }

    const result = await dispatch(placeBid({ itemId: currentItem.id, importe: amount }));
    if (placeBid.fulfilled.match(result)) {
      setBidInput('');
    }
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
          <Text style={styles.itemTitle}>{currentItem?.description ?? 'Cargando...'}</Text>
          <Text style={styles.itemBase}>Valor Base: {moneda} {basePrice.toLocaleString()}</Text>
        </View>

        {/* Estado de la Puja */}
        <View style={styles.bidStatusContainer}>
          <Text style={styles.bidTitle}>Mayor Oferta Actual</Text>
          {status === 'loading'
            ? <ActivityIndicator color="#000" style={{ marginVertical: 8 }} />
            : <Text style={styles.currentBid}>{moneda} {currentHighestBid.toLocaleString()}</Text>
          }
          {highestBidder && <Text style={styles.bidderName}>Postor: <Text style={{ fontWeight: '900' }}>{highestBidder}</Text></Text>}
        </View>

        {/* Controles de Puja */}
        <View style={styles.controlsContainer}>
          <Text style={styles.instruction}>
            Incremento mínimo 1%: {moneda} {minIncrement.toLocaleString()}
          </Text>

          <View style={styles.inputRow}>
            <Text style={styles.currencyPrefix}>{moneda}</Text>
            <TextInput
              style={styles.bidInput}
              keyboardType="numeric"
              placeholder={recommendedBid.toFixed(2)}
              value={bidInput}
              onChangeText={setBidInput}
              editable={status !== 'bidding' && canBid}
            />
          </View>

          <TouchableOpacity
            style={[styles.bidButton, (status === 'bidding' || !currentItem) && styles.bidButtonDisabled]}
            onPress={() => handlePlaceBid()}
            disabled={status === 'bidding' || !canBid || !currentItem}
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
              style={[styles.quickBidBtn, (!canBid || !currentItem) && styles.quickBidBtnDisabled]}
              onPress={() => handlePlaceBid(recommendedBid)}
              disabled={!canBid || !currentItem}
            >
              <Text style={styles.quickBidText}>PUJA MÍNIMA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickBidBtn, (!canBid || !currentItem) && styles.quickBidBtnDisabled]}
              onPress={() => { if (canBid && currentItem) setBidInput((currentHighestBid + (basePrice * 0.05)).toFixed(2)); }}
              disabled={!canBid || !currentItem}
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
