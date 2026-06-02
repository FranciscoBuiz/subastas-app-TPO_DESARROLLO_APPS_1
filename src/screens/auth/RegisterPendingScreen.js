import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function RegisterPendingScreen({ navigation }) {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('RegisterStep2');
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

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
        <View style={styles.contentBox}>
          
          {/* Reloj Minimalista en lugar del cuadro con la X */}
          <View style={styles.clockContainer}>
            <Feather name="clock" size={56} color="#000" />
          </View>

          <Text style={styles.title}>Datos{'\n'}enviados{'\n'}para{'\n'}validación</Text>
          
          <Text style={styles.subtitle}>ESTADO DEL PROCESO</Text>
          
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>ESTADO DE{'\n'}VERIFICACIÓN</Text>
            <Feather name="more-horizontal" size={20} color="#E67E22" style={{marginHorizontal: 16}} />
            <Text style={styles.statusValue}>EN{'\n'}REVISIÓN</Text>
          </View>

          <Text style={styles.paragraph}>
            Estamos revisando tu documentación.{'\n'}
            Recibirás una notificación por correo electrónico una vez que tu cuenta haya sido activada.
          </Text>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('Welcome')}
          >
            <Text style={styles.backButtonText}>VOLVER AL LOGIN</Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.footerText}>© 2026 SUBASTAPP</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerIcon: {
    width: 24,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fafafa', // Fondo ligeramente gris para que resalte la caja blanca
  },
  contentBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff', // Caja blanca
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5, // Sombra dura estilo neo-brutalismo
  },
  clockContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F7D05C', // Color principal de la app
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#000',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 46,
    marginBottom: 24,
    letterSpacing: -1,
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E67E22', // Naranja/Ambar para indicar que está pendiente
    letterSpacing: 1,
    marginBottom: 24,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E67E22', // Borde naranja
    backgroundColor: '#FFF8F0', // Fondo apenas naranja muy claro
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 40,
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'right',
    color: '#555',
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'left',
    color: '#E67E22', // Naranja para resaltar el estado
  },
  paragraph: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#eee',
    marginBottom: 32,
  },
  backButton: {
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#000', // Invertimos el botón para darle peso
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#fff',
  },
  footerText: {
    fontSize: 9,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 1,
  }
});
