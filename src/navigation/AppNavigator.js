import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerStyle: { backgroundColor: '#2b580c' }, headerTintColor: '#fff' }}>
      <Tab.Screen name="Beranda" component={HomeScreen} options={{ title: 'E-Learning Beranda' }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ title: 'Profil Saya' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ title: 'Detail Matkul', headerStyle: { backgroundColor: '#2b580c' }, headerTintColor: '#fff' }} />
    </Stack.Navigator>
  );
}