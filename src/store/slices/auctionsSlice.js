import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeAuctions: [
    {
      id: '1',
      title: 'Subasta Colección Motors',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400',
      currency: 'USD',
      category: 'PLATA',
      endTime: '19 OCT - 16:00HS',
      items: [
        {
          id: 'i1',
          description: 'BMW M3 Competition',
          artistOrDesigner: 'BMW',
          history: 'Vehículo de exhibición, un solo dueño anterior.',
          basePrice: 85000,
          currentOwner: 'Juan Perez',
          images: [
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400'
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Subasta Terrenos Sur',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400',
      currency: 'ARS',
      category: 'PLATINO',
      endTime: '12 OCT - 12:30HS',
      items: [
        {
          id: 'i2',
          description: 'Lote 500m2 en Barrio Privado',
          artistOrDesigner: 'N/A',
          history: 'Loteo inicial del barrio Los Pinos.',
          basePrice: 15000000,
          currentOwner: 'Inmobiliaria Sur',
          images: [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400'
          ]
        }
      ]
    },
    {
      id: '3',
      title: 'Subasta Relojes de Lujo',
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400',
      currency: 'USD',
      category: 'COMUN',
      endTime: '20 OCT - 20:00HS',
      items: [
        {
          id: 'i3',
          description: 'Rolex Submariner',
          artistOrDesigner: 'Rolex',
          history: 'Modelo 2020. Caja y papeles originales.',
          basePrice: 12000,
          currentOwner: 'Coleccionista Privado',
          images: [
            'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400'
          ]
        }
      ]
    },
  ],
  selectedAuction: null,
};

const auctionsSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    selectAuction: (state, action) => {
      state.selectedAuction = state.activeAuctions.find(a => a.id === action.payload);
    },
    clearSelectedAuction: (state) => {
      state.selectedAuction = null;
    }
  },
});

export const { selectAuction, clearSelectedAuction } = auctionsSlice.actions;

export default auctionsSlice.reducer;
