import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';

export default function ItemDetailScreen({ route, navigation }) {
  const { itemId } = route.params;
  const auction = useSelector((state) => state.auctions.selectedAuction);
  
  const item = auction?.items.find(i => i.id === itemId);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Ítem no encontrado</Text>
      </View>
    );
  }

  // Si el item no tiene muchas imágenes, mockeamos un array de 4 repetidas
  // para mantener el diseño de la grilla de la imagen como en el mockup
  const displayImages = item.images.length >= 4 
    ? item.images.slice(0, 4) 
    : [item.images[0], item.images[0], item.images[0], item.images[0]];

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

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: displayImages[selectedImage] }} 
            style={styles.mainImage} 
          />
          <View style={styles.thumbnailContainer}>
            {displayImages.map((img, index) => (
               <TouchableOpacity 
                 key={index} 
                 style={styles.thumbnailTouch}
                 onPress={() => setSelectedImage(index)}>
                 <Image 
                   source={{ uri: img }} 
                   style={[
                     styles.thumbnail, 
                     selectedImage === index && styles.thumbnailSelected
                   ]} 
                 />
               </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.loteText}>LOTE #{item.id.substring(0,4).toUpperCase() || '8429'}</Text>
          <Text style={styles.title}>{item.description}</Text>
          
          <View style={styles.timeContainer}>
            <Feather name="clock" size={12} color="#000" />
            <Text style={styles.timeText}>LA SUBASTA COMIENZA EN: 02D 14H 05M</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>PRECIO BASE</Text>
              <Text style={styles.priceValue}>{auction.currency === 'USD' ? 'US$' : '$'}{item.basePrice.toLocaleString()}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>PROPIETARIO ACTUAL</Text>
              <Text style={styles.ownerText}>{item.currentOwner}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.infoLabel}>ARTISTA / DISEÑADOR</Text>
          <Text style={styles.artistText}>{item.artistOrDesigner}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>DESCRIPCIÓN</Text>
          <Text style={styles.descriptionText}>
            Una pieza magistral de la ingeniería funcionalista. Esta estructura de acero tubular cromado representa la cúspide del diseño modernista. El asiento y respaldo en cuero negro original conservan la pátina del tiempo, certificando su autenticidad.
          </Text>
          
          <View style={styles.historyBox}>
            <Text style={styles.historyTitle}>HISTORIA DEL OBJETO</Text>
            <Text style={styles.historyText}>{item.history}</Text>
          </View>
          
          <Text style={styles.sectionTitle}>ESPECIFICACIONES TÉCNICAS</Text>
          
          <View style={styles.specsContainer}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Material</Text>
              <Text style={styles.specValue}>Acero, Cuero Vacuno</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Dimensiones</Text>
              <Text style={styles.specValue}>73 x 77 x 69 cm</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Estado</Text>
              <Text style={styles.specValue}>A - Excelente conservación</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Certificado</Text>
              <Text style={styles.specValue}>Incluido</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.liveButton}
          onPress={() => navigation.navigate('LiveAuctionRoom', { auctionId: auction.id })}
        >
          <Text style={styles.liveButtonText}>IR A SUBASTA EN VIVO</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
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
  body: { flex: 1 },
  imageContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  mainImage: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  thumbnailContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 80,
  },
  thumbnailTouch: {
    flex: 1,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#fff',
  },
  thumbnailSelected: {
    borderColor: '#000',
    borderWidth: 2,
  },
  contentContainer: {
    padding: 20,
  },
  loteText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 28,
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  ownerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 20,
  },
  artistText: {
    fontSize: 18,
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
    marginBottom: 24,
  },
  historyBox: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    marginBottom: 32,
  },
  historyTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  historyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#333',
  },
  specsContainer: {
    marginBottom: 20,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  specLabel: {
    fontSize: 13,
    color: '#666',
  },
  specValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#000',
    backgroundColor: '#fff',
  },
  liveButton: {
    backgroundColor: '#ffd766',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveButtonText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
});