import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './src/store';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { logout } from './src/store/slices/authSlice';

// Pantallas del Catalogo y Subastas
import CatalogScreen from './src/screens/CatalogScreen';
import AuctionDetailScreen from './src/screens/AuctionDetailScreen';
import ItemDetailScreen from './src/screens/ItemDetailScreen';
import LiveAuctionRoomScreen from './src/screens/LiveAuctionRoomScreen';

// Pantallas de Auth
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterStep1Screen from './src/screens/auth/RegisterStep1Screen';
import RegisterStep2Screen from './src/screens/auth/RegisterStep2Screen';

// Pantallas del Vendedor
import SellerDashboardScreen from './src/screens/seller/SellerDashboardScreen';
import NewConsignmentScreen from './src/screens/seller/NewConsignmentScreen';
import ConsignmentDetailScreen from './src/screens/seller/ConsignmentDetailScreen';

// Pantallas de Perfil / Pagos
import PaymentMethodsScreen from './src/screens/profile/PaymentMethodsScreen';
import AddPaymentMethodScreen from './src/screens/profile/AddPaymentMethodScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import MyAuctionsScreen from './src/screens/profile/MyAuctionsScreen';
import StatisticsScreen from './src/screens/profile/StatisticsScreen';
import PublishedItemsScreen from './src/screens/profile/PublishedItemsScreen';

const Stack = createNativeStackNavigator();
const ProfileNav = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder Screen
const PlaceholderScreen = ({ name }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name}</Text>
  </View>
);

function ProfileStack() {
  return (
    <ProfileNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileNav.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileNav.Screen name="MyAuctions" component={MyAuctionsScreen} />
      <ProfileNav.Screen name="Statistics" component={StatisticsScreen} />
      <ProfileNav.Screen name="PublishedItems" component={PublishedItemsScreen} />
      <ProfileNav.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <ProfileNav.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
    </ProfileNav.Navigator>
  );
}

// Pantalla de Perfil con el boton de Logout y Métodos de Pago
const ProfilePlaceholder = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  return (
    <SafeAreaView style={{ flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Text style={{ fontSize: 32, fontWeight: '900', marginBottom: 8 }}>{user?.name}</Text>
        <Text style={{ fontSize: 16, color: '#666' }}>Categoría: <Text style={{fontWeight: '900', color:'#000'}}>{user?.category}</Text></Text>
      </View>
      
      <TouchableOpacity 
        style={{ padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#ddd' }} 
        onPress={() => navigation.navigate('PaymentMethods')}
      >
        <Feather name="credit-card" size={24} color="#000" />
        <Text style={{ marginLeft: 16, fontSize: 16, fontWeight: '800', flex: 1 }}>Métodos de Pago y Garantías</Text>
        <Feather name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ padding: 16, backgroundColor: '#000', borderRadius: 8, alignItems: 'center', marginTop: 24 }} 
        onPress={() => dispatch(logout())}
      >
        <Text style={{ color: '#fff', fontWeight: '800' }}>CERRAR SESIÓN</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Navegador del App Principal (Logueado)
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="AuctionDetail" component={AuctionDetailScreen} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
      <Stack.Screen name="LiveAuctionRoom" component={LiveAuctionRoomScreen} />
      <Stack.Screen name="NewConsignment" component={NewConsignmentScreen} />
      <Stack.Screen name="ConsignmentDetail" component={ConsignmentDetailScreen} />
    </Stack.Navigator>
  );
}

// Navegador de Autenticación (No Logueado)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterStep1" component={RegisterStep1Screen} />
      <Stack.Screen name="RegisterStep2" component={RegisterStep2Screen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        tabBarActiveBackgroundColor: '#F7D05C',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '800' },
        tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5 },
        tabBarIcon: ({ color }) => {
          if (route.name === 'Inicio') {
            return <Feather name="home" size={24} color={color} />;
          } else if (route.name === 'Subasta') {
            return <MaterialCommunityIcons name="gavel" size={24} color={color} />;
          } else if (route.name === 'Vender') {
            return <Feather name="plus-square" size={24} color={color} />;
          } else if (route.name === 'Perfil') {
            return <Feather name="user" size={24} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Inicio" component={CatalogScreen} />
      <Tab.Screen name="Subasta" children={() => <PlaceholderScreen name="Mis Subastas" />} />
      <Tab.Screen name="Vender" component={SellerDashboardScreen} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
