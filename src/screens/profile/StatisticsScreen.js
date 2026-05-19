import React from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';

export default function StatisticsScreen({ navigation }) {
  const auctions = useSelector(state => state.auctions.activeAuctions);
  const consignments = useSelector(state => state.seller.myConsignments);
  const paymentMethods = useSelector(state => state.payment.methods);

  const participatedCount = auctions.length;
  const wonCount = consignments.filter(item => item.status === 'ACEPTADO').length;
  const totalOffered = auctions.reduce((sum, auction) => sum + auction.items.reduce((itemSum, item) => itemSum + item.basePrice, 0), 0);
  const totalPaid = consignments.filter(item => item.status === 'ACEPTADO').reduce((sum, item) => sum + (item.basePriceAssigned || 0), 0);

  const chartBars = [0.8, 0.6, 0.9, 0.5, 0.7, 0.85, 0.65, 0.6, 0.75, 0.4, 0.55, 0.7];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>ESTADÍSTICAS</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.gridRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{participatedCount}</Text>
            <Text style={styles.statLabel}>Subastas Participadas</Text>
          </View>
          <View style={styles.statCardDark}>
            <Text style={styles.statNumberLight}>{wonCount}</Text>
            <Text style={styles.statLabelLight}>Subastas Ganadas</Text>
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.statCardDarkLarge}>
            <Text style={styles.statNumberLight}>{totalOffered.toLocaleString()}</Text>
            <Text style={styles.statLabelLight}>Monto Total Ofertado</Text>
          </View>
          <View style={styles.statCardDarkLarge}>
            <Text style={styles.statNumberLight}>{totalPaid.toLocaleString()}</Text>
            <Text style={styles.statLabelLight}>Monto Total Pagado</Text>
          </View>
        </View>

        <Text style={styles.chartTitle}>Actividad del Año</Text>
        <View style={styles.chartContainer}>
          {chartBars.map((bar, index) => (
            <View key={index} style={[styles.chartBar, { height: 120 * bar }]} />
          ))}
        </View>
        <View style={styles.chartLabels}>
          <Text style={styles.chartLabel}>JAN_24</Text>
          <Text style={styles.chartLabel}>DEC_24</Text>
        </View>

        <View style={styles.userBox}>
          <View style={styles.userIconBox}>
            <Feather name="user" size={20} color="#000" />
          </View>
          <View>
            <Text style={styles.userTitle}>Usuario</Text>
            <Text style={styles.userSubtitle}>{paymentMethods.length} métodos de pago registrados</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#000' },
  backButton: { marginRight: 16 },
  title: { fontSize: 22, fontWeight: '900' },
  container: { flex: 1, padding: 16 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { flex: 1, borderWidth: 1, borderColor: '#000', borderRadius: 16, padding: 20, marginRight: 8, backgroundColor: '#fff' },
  statCardDark: { flex: 1, borderRadius: 16, padding: 20, backgroundColor: '#000', marginLeft: 8 },
  statCardDarkLarge: { flex: 1, borderRadius: 16, padding: 20, backgroundColor: '#000', marginHorizontal: 4 },
  statNumber: { fontSize: 28, fontWeight: '900', marginBottom: 8 },
  statNumberLight: { fontSize: 28, fontWeight: '900', color: '#F7D05C', marginBottom: 8 },
  statLabel: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  statLabelLight: { fontSize: 12, fontWeight: '900', letterSpacing: 1, color: '#fff' },
  chartTitle: { marginTop: 8, marginBottom: 16, fontSize: 14, fontWeight: '900' },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 20, borderWidth: 1, borderColor: '#000', borderRadius: 16, marginBottom: 12 },
  chartBar: { width: 16, backgroundColor: '#000', borderRadius: 8 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 24 },
  chartLabel: { fontSize: 12, color: '#666' },
  userBox: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: '#000', borderRadius: 16 },
  userIconBox: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  userTitle: { fontSize: 16, fontWeight: '900' },
  userSubtitle: { fontSize: 12, color: '#666', marginTop: 4 }
});