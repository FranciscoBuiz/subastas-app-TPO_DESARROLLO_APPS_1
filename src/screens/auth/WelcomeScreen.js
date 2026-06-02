import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {
  const loadingProgress = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animación de la barra (de 0 a 100% en 2.5 segundos)
    Animated.timing(loadingProgress, {
      toValue: 100,
      duration: 2500,
      useNativeDriver: false, // El cambio de "width" no soporta useNativeDriver en true
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, loadingProgress]);

  const widthInterpolated = loadingProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.logoContainer}>
          <View style={styles.diamondBox}>
            <View style={styles.horizontalLine} />
            <View style={styles.verticalLine} />
            <View style={styles.diamond} />
          </View>
        </View>

        <Text style={styles.logoText}>SUBASTAPP</Text>
        <Text style={styles.versionText}>EDICIÓN 1.0</Text>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingBarBg}>
            <Animated.View style={[styles.loadingBarFill, { width: widthInterpolated }]} />
          </View>
          <Text style={styles.loadingText}>CARGANDO...</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  diamondBox: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#fff'
  },
  horizontalLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#000',
    top: '50%',
    marginTop: -1,
  },
  verticalLine: {
    position: 'absolute',
    height: '100%',
    width: 2,
    backgroundColor: '#000',
    left: '50%',
    marginLeft: -1,
  },
  diamond: {
    width: 60,
    height: 60,
    backgroundColor: '#F7D05C', 
    transform: [{ rotate: '45deg' }],
    borderWidth: 2,
    borderColor: '#000',
    zIndex: 10,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -2,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 2,
    marginBottom: 80,
  },
  loadingContainer: {
    width: '60%',
    alignItems: 'center',
  },
  loadingBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: '#eee',
    flexDirection: 'row',
    marginBottom: 16,
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: '#F7D05C', // Barra animada en color amarillo
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#000',
  }
});