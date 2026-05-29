import React from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { removePaymentMethod } from '../../store/slices/paymentSlice';

export default function PaymentMethodsScreen({ navigation }) {
  const { methods, totalLimit } = useSelector(state => state.payment);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    Alert.alert(
      'Eliminar',
      '¿Desea eliminar este método de pago?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => dispatch(removePaymentMethod(id)) }
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
          <Text style={styles.limitTitle}>LÍMITE DE PUJA DISPONIBLE</Text>
          <Text style={styles.limitAmount}>USD ${totalLimit.toLocaleString()}</Text>
          <Text style={styles.limitSubtitle}>
            Este valor determina hasta cuánto puede ofertar en una subasta en vivo. Añada garantías o tarjetas internacionales para aumentarlo.
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddPaymentMethod')}>
          <Feather name="plus" size={24} color="#000" />
          <Text style={styles.addButtonText}>AGREGAR MÉTODO DE PAGO</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Tus Métodos Activos</Text>
        
        {methods.length === 0 ? (
          <View style={styles.emptyBox}>
            <Feather name="credit-card" size={40} color="#ccc" />
            <Text style={styles.emptyText}>No tienes métodos registrados. Tu límite actual es 0.</Text>
          </View>
        ) : (
          methods.map(method => (
            <View key={method.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Feather 
                  name={method.type === 'CARD' ? 'credit-card' : 'briefcase'} 
                  size={24} 
                  color="#000" 
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardBank}>{method.bank}</Text>
                  <Text style={styles.cardDetail}>**** {method.last4}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemove(method.id)}>
                  <Feather name="trash-2" size={20} color="#d32f2f" />
                </TouchableOpacity>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardBadge}>{method.isInternational ? 'INTERNACIONAL' : 'NACIONAL'}</Text>
                <Text style={styles.cardLimit}>Límite Aportado: +${method.limitAssigned.toLocaleString()}</Text>
              </View>
            </View>
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
  cardBadge: { fontSize: 10, fontWeight: '800', color: '#fff', backgroundColor: '#333', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  cardLimit: { fontSize: 12, fontWeight: '700', color: '#2e7d32' }
});