import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function SellerLogisticsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SUBASTAPP</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Feather name="help-circle" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Logística</Text>
        <Text style={styles.subtitle}>RASTREO DE ENVÍO Y COBERTURA</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ESTADO DEL ENVÍO</Text>
          
          <View style={styles.timelineItem}>
            <View style={styles.timelineIconContainerActive}>
              <Feather name="truck" size={16} color="#fff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStatusActive}>EN TRÁNSITO</Text>
              <Text style={styles.timelineLocation}>Centro de Distribución Local</Text>
              <Text style={styles.timelineDate}>Ciudad de México, MX - 14 OCT 2023 - 08:45 AM</Text>
            </View>
          </View>

          <View style={styles.timelineLine} />

          <View style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <Feather name="box" size={16} color="#000" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStatus}>ALMACÉN CENTRAL</Text>
              <Text style={styles.timelineLocation}>Salida de Bodega</Text>
              <Text style={styles.timelineDate}>Querétaro, MX - 13 OCT 2023 - 14:20 PM</Text>
            </View>
          </View>

          <View style={styles.timelineLine} />

          <View style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <Feather name="package" size={16} color="#000" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStatus}>RECOLECCIÓN</Text>
              <Text style={styles.timelineLocation}>Paquete Recibido</Text>
              <Text style={styles.timelineDate}>Guadalajara, MX - 12 OCT 2023 - 11:00 AM</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PÓLIZA DE SEGURO</Text>
          
          <View style={styles.insuranceCard}>
            <View style={styles.insuranceHeader}>
              <View>
                <Text style={styles.insuranceLabel}>ASEGURADORA</Text>
                <Text style={styles.insuranceCompany}>GLOBAL SAFE CORP</Text>
              </View>
              <Feather name="shield" size={24} color="#000" />
            </View>
            
            <View style={styles.insuranceBody}>
              <View style={styles.insuranceColumn}>
                <Text style={styles.insuranceLabel}>MONTO ASEGURADO</Text>
                <Text style={styles.insuranceValue}>$125,000.00</Text>
                <Text style={styles.insuranceLabel}>MXN</Text>
              </View>
              <View style={styles.insuranceColumn}>
                <Text style={styles.insuranceLabel}>NÚMERO DE PÓLIZA</Text>
                <Text style={styles.insuranceValue}>SUB-7742-01X</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.insuranceButton}>
              <Text style={styles.insuranceButtonText}>VER CERTIFICADO COMPLETO</Text>
              <Feather name="external-link" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.transportCard}>
          <View style={styles.transportColumn}>
            <Text style={styles.insuranceLabel}>TRANSPORTISTA</Text>
            <Text style={styles.insuranceValue}>Express Logística S.A.</Text>
          </View>
          <View style={styles.transportColumn}>
            <Text style={styles.insuranceLabel}>GUÍA DE RASTREO</Text>
            <Text style={[styles.insuranceValue, { textDecorationLine: 'underline' }]}>MX-998-0021-X9</Text>
          </View>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 16, 
    borderBottomWidth: 2, 
    borderBottomColor: '#000' 
  },
  headerIcon: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  container: { flex: 1, padding: 24 },
  title: { fontSize: 40, fontWeight: '900', letterSpacing: -1, marginBottom: 4, color: '#000' },
  subtitle: { fontSize: 10, fontWeight: '800', color: '#666', letterSpacing: 1, marginBottom: 32 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 20 },
  
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start' },
  timelineIconContainerActive: { width: 32, height: 32, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  timelineIconContainer: { width: 32, height: 32, borderWidth: 2, borderColor: '#000', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  timelineContent: { flex: 1, paddingBottom: 8 },
  timelineStatusActive: { fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  timelineStatus: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: '#666', marginBottom: 4 },
  timelineLocation: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  timelineDate: { fontSize: 10, color: '#666', lineHeight: 14 },
  timelineLine: { width: 2, height: 30, backgroundColor: '#000', marginLeft: 15, marginVertical: 4 },

  insuranceCard: { borderWidth: 2, borderColor: '#000', padding: 16 },
  insuranceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 2, borderBottomColor: '#000', paddingBottom: 16, marginBottom: 16 },
  insuranceLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1, color: '#666', marginBottom: 4 },
  insuranceCompany: { fontSize: 16, fontWeight: '900' },
  insuranceBody: { flexDirection: 'row', marginBottom: 16 },
  insuranceColumn: { flex: 1 },
  insuranceValue: { fontSize: 14, fontWeight: '900' },
  insuranceButton: { backgroundColor: '#F7D05C', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  insuranceButtonText: { color: '#000', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  transportCard: { flexDirection: 'row', borderTopWidth: 2, borderTopColor: '#000', paddingTop: 16 },
  transportColumn: { flex: 1 }
});
