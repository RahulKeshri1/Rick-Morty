import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';

import HomeScreen from '@/screens/HomeScreen';
import DetailScreen from '@/screens/DetailScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import { RootStackParamList } from '@/types';
import { colors } from '@/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({ 
            title: 'Rick & Morty',
            headerStyle: { backgroundColor: colors.white },
            headerShadowVisible: false,
            headerTitleStyle: { fontWeight: '800', fontSize: 24, color: colors.gray900 },
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Settings')}
                style={{ backgroundColor: colors.gray100, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}
              >
                <Text style={{ fontSize: 14, color: colors.gray900, fontWeight: '700' }}>INFO</Text>
              </TouchableOpacity>
            )
          })} 
        />
        <Stack.Screen 
          name="Details" 
          component={DetailScreen} 
          options={({ route }: any) => ({ 
            // set header title to character name if it exists
            title: route.params?.character?.name || 'Details' 
          })} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Settings & Info' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
