import React from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { logout } from '../../store/slices/authSlice';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const statusCards = [
    { label: 'VERIFICADO', icon: 'check-circle', active: user?.paymentMethodsVerified },
    { label: 'ACTIVO', icon: 'flash', active: true }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Feather name="user" size={24} color="#000" />
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.appTitle}>SUBASTAPP</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Feather name="user" size={40} color="#000" />
          </View>
          <Text style={styles.profileName}>{user?.name || 'USUARIO'}</Text>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{user?.category || 'COMUN'}</Text>
          </View>
        </View>


        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('MyAuctions')}>
            <Feather name="activity" size={20} color="#000" />
            <Text style={styles.menuText}>Mis Subastas</Text>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Statistics')}>
            <Feather name="bar-chart-2" size={20} color="#000" />
            <Text style={styles.menuText}>Estadísticas</Text>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('PaymentMethods')}>
            <Feather name="credit-card" size={20} color="#000" />
            <Text style={styles.menuText}>Medios de Pago</Text>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('PublishedItems')}>
            <Feather name="box" size={20} color="#000" />
            <Text style={styles.menuText}>Artículos Publicados</Text>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('MisCompras')}>
            <Feather name="shopping-bag" size={20} color="#000" />
            <Text style={styles.menuText}>Mis Compras</Text>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Notificaciones')}>
            <Feather name="bell" size={20} color="#000" />
            <Text style={styles.menuText}>Notificaciones</Text>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => dispatch(logout())}>
          <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  titleRow: { marginBottom: 24 },
  appTitle: { fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  profileCard: { alignItems: 'center', padding: 24, borderWidth: 1, borderColor: '#000', borderRadius: 16, marginBottom: 24 },
  avatarWrapper: { width: 96, height: 96, borderRadius: 48, borderWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  profileName: { fontSize: 24, fontWeight: '900', marginBottom: 8 },
  categoryPill: { backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  categoryText: { color: '#fff', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statusBox: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#000', alignItems: 'center', marginHorizontal: 4 },
  statusBoxActive: { backgroundColor: '#fff' },
  statusBoxInactive: { backgroundColor: '#f5f5f5' },
  statusLabel: { marginTop: 8, fontWeight: '900', fontSize: 12 },
  statusLabelActive: { color: '#000' },
  statusLabelInactive: { color: '#555' },
  menuSection: { borderTopWidth: 1, borderTopColor: '#000' },
  menuButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#000' },
  menuText: { flex: 1, marginLeft: 16, fontSize: 16, fontWeight: '900' },
  logoutButton: { marginTop: 32, paddingVertical: 18, backgroundColor: '#F7D05C', borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 1 }
});