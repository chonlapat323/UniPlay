import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import UiKitScreen from './src/screens/UiKitScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { paperTheme } from './src/paperTheme';
import { hasSeenOnboarding } from './src/lib/onboarding';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  UiKit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // null = ยังเช็คไม่เสร็จ, true/false = เช็คแล้วว่าเคยเห็น onboarding มาก่อนไหม
  const [seenOnboarding, setSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    hasSeenOnboarding().then(setSeenOnboarding);
  }, []);

  if (seenOnboarding === null) {
    return (
      <PaperProvider theme={paperTheme}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={seenOnboarding ? 'Home' : 'Onboarding'}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="UiKit" component={UiKitScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
