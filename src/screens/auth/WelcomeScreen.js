import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>SUBASTAPP</Text>
          <Text style={styles.subtitle}>Las mejores subastas, ahora en tu bolsillo.</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>INICIAR SESIÓN</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('RegisterStep1')}
          >
            <Text style={styles.secondaryButtonText}>REGISTRARME</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff' },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-around' },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40 },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -1 },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center' },
  buttonsContainer: {
    width: '100%' },
  primaryButton: {
    backgroundColor: '#F7D05C',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 16 },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000' },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000' },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000' } });