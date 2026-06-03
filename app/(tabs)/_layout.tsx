import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '../../constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.lexyPurple,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.backgroundCard,
          borderTopColor: Colors.border,
          height: 72,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          letterSpacing: 0.4,
          fontFamily: 'OpenDyslexic',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Juegos',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🎮</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Mi Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>⭐</Text>,
        }}
      />
    </Tabs>
  );
}
