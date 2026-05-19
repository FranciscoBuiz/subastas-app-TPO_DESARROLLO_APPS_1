import React from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';

export default function ConsignmentDetailScreen({ route, navigation }) {
  const { itemId } = route.params;
  const consignment = useSelector(state => 
    state.seller.myConsignments.find(c => c.id === itemId)
  );

  if (!consignment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Artículo no encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Artículo</Text>
      </View>

      <ScrollView style={styles.container}>
        <Image source={{ uri: consignment.images[0] }} style={styles.mainImage} />
        
        <View style={styles.content}>
          <Text style={styles.title}>{consignment.description}</Text>
          <Text style={styles.history}>{consignment.history}</Text>
          
          <View style={styles.statusBox}>
            <Text style={styles.sectionTitle}>Estado de Inspección</Text>
            <Text style={[styles.statusText, { color: consignment.status === 'RECHAZADO' ? '#d32f2f' : '#000' }]}>
              {consignment.status}
            </Text>
            
            {consignment.status === 'RECHAZADO' && (
              <View style={styles.rejectionBox}>
                <Feather name="alert-triangle" size={20} color="#d32f2f" style={{marginRight: 8}}/>
                <Text style={styles.rejectionText}>{consignment.rejectionReason}</Text>
              </View>
            )}
          </View>

          {consignment.status === 'ACEPTADO' && (
            <View style={styles.acceptedBox}>
              <Text style={styles.sectionTitle}>Datos Comerciales</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Valor Base Asignado:</Text>
                <Text style={styles.value}>{consignment.currency} ${consignment.basePriceAssigned}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Comisión (Empresa):</Text>
                <Text style={styles.value}>{consignment.commissions}%</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Logística y Seguro</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Ubicación Actual:</Text>
                <Text style={styles.value}>{consignment.location}</Text>
              </View>
              <View style={styles.insuranceBox}>
                <Feather name="shield" size={24} color="#2e7d32" />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.insuranceTitle}>Póliza Activa</Text>
                  <Text style={styles.insuranceText}>{consignment.insurancePolicy}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.contactInsuranceBtn}>
                <Text style={styles.contactInsuranceText}>Contactar Aseguradora (Aumentar Póliza)</Text>
              </TouchableOpacity>
            </View>
          )}

          {consignment.status === 'PENDIENTE' && (
            <View style={styles.pendingBox}>
              <Feather name="clock" size={24} color="#f57c00" />
              <Text style={styles.pendingText}>Su artículo se encuentra bajo evaluación por nuestro equipo de expertos. Recibirá una notificación al finalizar la inspección.</Text>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#000' },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  container: { flex: 1 },
  mainImage: { width: '100%', height: 250, backgroundColor: '#eee' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '900', marginBottom: 8 },
  history: { fontSize: 14, color: '#555', marginBottom: 24, lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 12, letterSpacing: 0.5 },
  statusBox: { marginBottom: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 },
  statusText: { fontSize: 18, fontWeight: '800' },
  rejectionBox: { flexDirection: 'row', marginTop: 12, padding: 12, backgroundColor: '#ffebee', borderRadius: 8 },
  rejectionText: { flex: 1, color: '#d32f2f', fontSize: 12, fontWeight: '600' },
  acceptedBox: { padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14, color: '#666' },
  value: { fontSize: 14, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 16 },
  insuranceBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f5e9', padding: 16, borderRadius: 8, marginTop: 12 },
  insuranceTitle: { fontSize: 14, fontWeight: '800', color: '#2e7d32' },
  insuranceText: { fontSize: 12, color: '#2e7d32', marginTop: 4 },
  contactInsuranceBtn: { marginTop: 12, padding: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#000', borderRadius: 8, alignItems: 'center' },
  contactInsuranceText: { fontSize: 12, fontWeight: '800' },
  pendingBox: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff3e0', borderRadius: 8, borderWidth: 1, borderColor: '#ffe0b2' },
  pendingText: { flex: 1, marginLeft: 12, fontSize: 12, color: '#e65100', lineHeight: 18 }
});