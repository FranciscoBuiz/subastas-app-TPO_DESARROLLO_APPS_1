import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ConsignmentSuccessScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SUBASTAPP</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Feather name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.iconBox}>
          <Feather name="check" size={60} color="#000" />
        </View>

        <Text style={styles.title}>Producto enviado para revisión</Text>
        <Text style={styles.subtitle}>ESTADO DEL PROCESO</Text>

        <View style={styles.statusContainer}>
          <View style={styles.statusLabelContainer}>
            <Text style={styles.statusLabel}>ESTADO DE VERIFICACIÓN</Text>
          </View>
          <View style={styles.statusValueContainer}>
            <Feather name="clock" size={16} color="#000" style={{marginRight: 4}} />
            <Text style={styles.statusValue}>EN REVISIÓN</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Estamos revisando tu producto. Recibirás una notificación por correo electrónico una vez que tu cuenta haya sido activada.
        </Text>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.primaryButtonText}>VOLVER AL INICIO</Text>
        </TouchableOpacity>
      </View>
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
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -1,
    marginBottom: 16,
    color: '#000'
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 1,
    marginBottom: 32,
  },
  statusContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#000',
    width: '100%',
    marginBottom: 32,
  },
  statusLabelContainer: {
    flex: 1,
    padding: 12,
    borderRightWidth: 2,
    borderRightColor: '#000',
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
  statusValueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '900',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    color: '#333',
    marginBottom: 40,
  },
  primaryButton: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#F7D05C',
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
  }
});
