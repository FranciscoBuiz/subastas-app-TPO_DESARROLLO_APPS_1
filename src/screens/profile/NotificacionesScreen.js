import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as notificacionesApi from '../../api/notificacionesApi';

const TIPO_ICONOS = {
  ganador_subasta: { icon: 'award',       color: '#2e7d32' },
  multa:           { icon: 'alert-circle', color: '#c62828' },
  solicitud:       { icon: 'package',      color: '#1565c0' },
};

export default function NotificacionesScreen({ navigation }) {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const data = await notificacionesApi.getNotificaciones();
      setNotifs(data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleMarcarLeida = async (id) => {
    try {
      await notificacionesApi.marcarLeida(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, leida: 'si' } : n));
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handleMarcarTodas = async () => {
    try {
      await notificacionesApi.marcarTodasLeidas();
      setNotifs(prev => prev.map(n => ({ ...n, leida: 'si' })));
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const noLeidas = notifs.filter(n => n.leida === 'no').length;

  const renderItem = ({ item }) => {
    const config = TIPO_ICONOS[item.tipo] ?? { icon: 'bell', color: '#555' };
    return (
      <TouchableOpacity
        style={[styles.card, item.leida === 'no' && styles.cardUnread]}
        onPress={() => item.leida === 'no' && handleMarcarLeida(item.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
          <Feather name={config.icon} size={22} color={config.color} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.cuerpo}>{item.cuerpo}</Text>
          <Text style={styles.fecha}>{new Date(item.fechaCreacion).toLocaleString()}</Text>
        </View>
        {item.leida === 'no' && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Notificaciones{noLeidas > 0 ? ` (${noLeidas})` : ''}
        </Text>
        {noLeidas > 0 && (
          <TouchableOpacity onPress={handleMarcarTodas}>
            <Text style={styles.marcarTodas}>Leer todas</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifs.length === 0 ? (
        <View style={styles.center}>
          <Feather name="bell-off" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Sin notificaciones</Text>
        </View>
      ) : (
        <FlatList
          data={notifs}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); cargar(); }} />}
          contentContainerStyle={{ padding: 16, gap: 12 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:     { flex: 1, backgroundColor: '#fff' },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  back:         { padding: 4 },
  headerTitle:  { fontSize: 18, fontWeight: '900', flex: 1, marginLeft: 8 },
  marcarTodas:  { fontSize: 13, fontWeight: '700', color: '#555', textDecorationLine: 'underline' },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardUnread:   { backgroundColor: '#fffde7', borderColor: '#f9a825' },
  iconContainer:{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardContent:  { flex: 1 },
  titulo:       { fontSize: 14, fontWeight: '900', color: '#000', marginBottom: 4 },
  cuerpo:       { fontSize: 13, color: '#333', lineHeight: 18, marginBottom: 4 },
  fecha:        { fontSize: 11, color: '#999' },
  unreadDot:    { width: 10, height: 10, borderRadius: 5, backgroundColor: '#f9a825', alignSelf: 'center', marginLeft: 8 },
  emptyText:    { marginTop: 12, fontSize: 16, color: '#aaa' },
});
