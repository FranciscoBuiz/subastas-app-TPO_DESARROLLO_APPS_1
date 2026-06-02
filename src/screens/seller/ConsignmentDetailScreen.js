import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';

export default function ConsignmentDetailScreen({ route, navigation }) {
  const { itemId } = route.params;
  const dispatch = useDispatch();
  const item = useSelector(state => 
    state.seller.myConsignments.find(c => c.id === itemId)
  );

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Artículo no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderStatusBadge = () => {
    switch (item.status) {
      case 'ACEPTADO':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#000' }]}>
            <Text style={[styles.statusText, { color: '#fff' }]}>APROBADO PARA SUBASTA</Text>
          </View>
        );
      case 'VENDIDO':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#000' }]}>
            <Text style={[styles.statusText, { color: '#000' }]}>ARTÍCULO VENDIDO</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#F7D05C' }]}>
            <Text style={[styles.statusText, { color: '#000' }]}>EN EVALUACIÓN</Text>
          </View>
        );
    }
  };

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
        <Text style={styles.sectionOverline}>ESTADO DEL ARTÍCULO</Text>
        <Text style={styles.title}>{item.description.toUpperCase()}</Text>
        {renderStatusBadge()}

        {item.status === 'ACEPTADO' && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>CONTRATO DE SUBASTA</Text>
            
            <View style={styles.contractBox}>
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>VALORACIÓN ESTIMADA</Text>
                <Text style={styles.contractValue}>$45,000 - $60,000 USD</Text>
              </View>
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>PRECIO DE RESERVA</Text>
                <Text style={styles.contractValue}>$40,000 USD</Text>
              </View>
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>COMISIÓN DE LA CASA</Text>
                <Text style={styles.contractValue}>12% DEL PRECIO FINAL</Text>
              </View>
              <View style={[styles.contractRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                <Text style={styles.contractLabel}>FECHA DE SUBASTA</Text>
                <Text style={styles.contractValue}>15 NOV 2023</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => Alert.alert('Términos aceptados', 'El contrato ha sido firmado.')}
            >
              <Text style={styles.primaryButtonText}>ACEPTAR TÉRMINOS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>RECHAZAR OFERTA</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === 'VENDIDO' && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>RESUMEN DE VENTA</Text>
            
            <View style={styles.contractBox}>
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>PRECIO MARTILLO</Text>
                <Text style={styles.contractValue}>$58,000 USD</Text>
              </View>
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>COMISIÓN (12%)</Text>
                <Text style={styles.contractValue}>-$6,960 USD</Text>
              </View>
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>SEGURO Y GASTOS</Text>
                <Text style={styles.contractValue}>-$450 USD</Text>
              </View>
              <View style={[styles.contractRow, { borderBottomWidth: 0, paddingBottom: 0, paddingTop: 16 }]}>
                <Text style={styles.contractLabel}>TOTAL A RECIBIR</Text>
                <Text style={[styles.contractValue, { fontSize: 24 }]}>$50,590</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('SellerLogistics')}
            >
              <Text style={styles.primaryButtonText}>VER ESTADO DE LOGÍSTICA</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === 'PENDIENTE' && (
          <View style={styles.contentSection}>
             <View style={styles.imagePlaceholder}>
                {item.images && item.images.length > 0 ? (
                  <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
                ) : (
                  <Feather name="image" size={32} color="#aaa" />
                )}
             </View>
             <Text style={[styles.sectionTitle, {marginTop: 16}]}>DETALLES DEL ARTÍCULO</Text>
             <Text style={styles.itemDetailText}>{item.history || 'Sin historia detallada.'}</Text>
          </View>
        )}

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
  
  sectionOverline: { fontSize: 10, fontWeight: '900', letterSpacing: 1, color: '#666', marginBottom: 4 },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -1, marginBottom: 12, color: '#000', lineHeight: 34 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, marginBottom: 32 },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  contentSection: { marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '900', letterSpacing: 1, marginBottom: 16 },

  contractBox: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 16,
    marginBottom: 32
  },
  contractRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contractLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: '#666' },
  contractValue: { fontSize: 14, fontWeight: '900' },

  primaryButton: {
    backgroundColor: '#F7D05C',
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 16
  },
  primaryButtonText: { color: '#000', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  
  secondaryButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000'
  },
  secondaryButtonText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },

  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  itemDetailText: { fontSize: 14, lineHeight: 22, color: '#333' }
});