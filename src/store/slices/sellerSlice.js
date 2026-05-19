import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  myConsignments: [
    {
      id: 'c1',
      description: 'Sillón Luis XV Restaurado',
      history: 'Perteneció a la familia durante 3 generaciones.',
      status: 'ACEPTADO', // PENDIENTE | ACEPTADO | RECHAZADO
      rejectionReason: null,
      basePriceAssigned: 1200,
      currency: 'USD',
      commissions: 15,
      location: 'Depósito Central Norte',
      insurancePolicy: 'POL-123456-SURA (Cobertura: $1500 USD)',
      images: ['https://images.unsplash.com/photo-1506898667547-42e22a46e125?auto=format&fit=crop&q=80&w=400']
    },
    {
      id: 'c2',
      description: 'Juego de Té 18 Piezas',
      history: 'Cerámica importada de Inglaterra de 1920.',
      status: 'RECHAZADO',
      rejectionReason: 'Piezas incompletas y restauraciones no declaradas que disminuyen el valor de subasta.',
      basePriceAssigned: null,
      currency: null,
      commissions: null,
      location: 'En tránsito de devolución',
      insurancePolicy: null,
      images: ['https://images.unsplash.com/photo-1544645224-ec5d774a3f4c?auto=format&fit=crop&q=80&w=400']
    },
    {
      id: 'c3',
      description: 'Reloj de Bolsillo Antiguo',
      history: 'Mecanismo original suizo.',
      status: 'PENDIENTE',
      rejectionReason: null,
      basePriceAssigned: null,
      currency: null,
      commissions: null,
      location: 'En evaluación',
      insurancePolicy: null,
      images: ['https://images.unsplash.com/photo-1501166222995-bb049e79435b?auto=format&fit=crop&q=80&w=400']
    }
  ],
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    addConsignment: (state, action) => {
      // Agregar un nuevo item a consignación
      state.myConsignments.push({
        id: `c${Date.now()}`,
        description: action.payload.description,
        history: action.payload.history,
        status: 'PENDIENTE',
        rejectionReason: null,
        basePriceAssigned: null,
        currency: null,
        commissions: null,
        location: 'Pendiente de envío a inspección',
        insurancePolicy: null,
        images: action.payload.images || []
      });
    }
  },
});

export const { addConsignment } = sellerSlice.actions;
export default sellerSlice.reducer;
