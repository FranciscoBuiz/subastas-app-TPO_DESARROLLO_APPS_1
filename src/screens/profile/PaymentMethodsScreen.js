import React, { useEffect } from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Alert,ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { fetchMediosPago, eliminarMedioPago } from '../../store/slices/paymentSlice';

const TIPO_ICONS = {
  tarjeta: 'credit-card',
  cuenta_bancaria: 'briefcase',
  cheque_certificado: 'file-text',
};

export default function PaymentMethodsScreen({ navigation }) {
  const { methods, status } = useSelector(state => state.payment);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMediosPago());
  }, [dispatch]);

  const totalGarantia = methods
    .filter(m => m.verificado === 'si' && m.montoGarantia != null)
    .reduce((acc, m) => acc + Number(m.montoGarantia), 0);

  const handleRemove = (id) => {
    Alert.alert(
      'Eliminar',
      '¿Desea eliminar este método de pago?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => dispatch(eliminarMedioPago(id)) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Métodos y Garantías</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.limitBox}>
          <Text style={styles.limitTitle}>GARANTÍA TOTAL VERIFICADA</Text>
          <Text style={styles.limitAmount}>${totalGarantia.toLocaleString()}</Text>
          <Text style={styles.limitSubtitle}>
            Suma de garantías en medios de pago verificados. Determina tu capacidad de puja.
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddPaymentMethod')}>
          <Feather name="plus" size={24} color="#000" />
          <Text style={styles.addButtonText}>AGREGAR MÉTODO DE PAGO</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Tus Métodos Activos</Text>

        {status === 'loading' && <ActivityIndicator color="#000" style={{ marginVertical: 20 }} />}
        
        {status !== 'loading' && methods.length === 0 && (
          <View style={styles.emptyBox}>
            <Feather name="credit-card" size={40} color="#ccc" />
            <Text style={styles.emptyText}>No tenés métodos registrados.</Text>
          </View>
        )}

        {methods.map(method => (
          <View key={method.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather 
                name={TIPO_ICONS[method.tipo] ?? 'credit-card'} 
                size={24} 
                color="#000" 
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardBank}>{method.descripcion}</Text>
                <Text style={styles.cardDetail}>{method.tipo?.replace('_', ' ').toUpperCase()} — {method.moneda}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemove(method.id)}>
                <Feather name="trash-2" size={20} color="#d32f2f" />
              </TouchableOpacity>
            </View>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardBadge, method.verificado === 'si' ? styles.badgeVerified : styles.badgePending]}>
                {method.verificado === 'si' ? 'VERIFICADO' : 'PENDIENTE'}
              </Text>
              {method.montoGarantia != null && (
                <Text style={styles.cardLimit}>Garantía: ${Number(method.montoGarantia).toLocaleString()}</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#000' },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  container: { flex: 1, padding: 16 },
  limitBox: { backgroundColor: '#111', padding: 24, borderRadius: 12, marginBottom: 24, alignItems: 'center' },
  limitTitle: { color: '#ccc', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  limitAmount: { color: '#F7D05C', fontSize: 40, fontWeight: '900', marginVertical: 8 },
  limitSubtitle: { color: '#888', fontSize: 12, textAlign: 'center', lineHeight: 18 },
  addButton: { flexDirection: 'row', backgroundColor: '#F7D05C', padding: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000', marginBottom: 24 },
  addButtonText: { fontSize: 14, fontWeight: '900', marginLeft: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 16 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: '#fafafa', borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: '#ccc' },
  emptyText: { color: '#666', marginTop: 12, textAlign: 'center' },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fff' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardBank: { fontSize: 16, fontWeight: '800' },
  cardDetail: { fontSize: 14, color: '#555' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 },
  cardBadge: { fontSize: 10, fontWeight: '800', color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeVerified: { backgroundColor: '#2e7d32' },
  badgePending: { backgroundColor: '#e65100' },
  cardLimit: { fontSize: 12, fontWeight: '700', color: '#2e7d32' }
});