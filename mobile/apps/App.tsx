import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import UiKitScreen from './src/screens/UiKitScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { paperTheme } from './src/paperTheme';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  UiKit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ชั่วคราว: บังคับให้เปิดแอปแล้วเจอ Onboarding ทุกครั้ง (ไม่เช็ค AsyncStorage ว่าเคยเห็นหรือยัง)
// เพราะตอนนี้กำลัง focus สอน/เดโมหน้านี้อยู่ สะดวกเวลาต้องโชว์ซ้ำหลายรอบ
// พอโฟกัสส่วนนี้เสร็จแล้ว ให้กลับไปใช้ logic เดิมใน src/lib/onboarding.ts (hasSeenOnboarding) ตามที่สอนไว้ใน MOBILE_UX_GUIDE.md หัวข้อ 9.3
export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
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
