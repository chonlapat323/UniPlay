import { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { markOnboardingSeen } from '../lib/onboarding';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const SLIDES: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
}[] = [
  {
    icon: 'calendar-check-outline',
    title: 'จองสนามกีฬาได้ทุกที่',
    description: 'เช็คตารางว่างและจองสนามกีฬาในมหาวิทยาลัยได้ในไม่กี่ขั้นตอน ไม่ต้องเดินไปถามเจ้าหน้าที่',
  },
  {
    icon: 'bell-ring-outline',
    title: 'ไม่พลาดทุกการแจ้งเตือน',
    description: 'รับแจ้งเตือนทันทีเมื่อการจองได้รับการอนุมัติ หรือมีการเปลี่ยนแปลงตารางเวลา',
  },
  {
    icon: 'shield-account-outline',
    title: 'ปลอดภัยด้วยระบบสมาชิก',
    description: 'ข้อมูลของคุณปลอดภัยด้วยระบบยืนยันตัวตน เข้าใช้งานได้เฉพาะนักศึกษาและบุคลากรเท่านั้น',
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [pageIndex, setPageIndex] = useState(0);

  async function finishOnboarding() {
    await markOnboardingSeen();
    navigation.replace('Home');
  }

  function goToNextSlide() {
    if (pageIndex === SLIDES.length - 1) {
      finishOnboarding();
      return;
    }
    scrollRef.current?.scrollTo({ x: width * (pageIndex + 1), animated: true });
  }

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setPageIndex(index);
  }

  const isLastSlide = pageIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <Button mode="text" onPress={finishOnboarding} style={styles.skipButton}>
        ข้าม
      </Button>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide, index) => (
          <View key={slide.title} style={styles.slide}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name={slide.icon} size={72} color="#4F46E5" />
            </View>
            <Text variant="headlineSmall" style={styles.title}>
              {slide.title}
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              {slide.description}
            </Text>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.dotsRow}>
        {SLIDES.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return <Animated.View key={index} style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]} />;
        })}
      </View>

      <Button mode="contained" onPress={goToNextSlide} style={styles.nextButton}>
        {isLastSlide ? 'เริ่มใช้งาน' : 'ถัดไป'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  skipButton: { alignSelf: 'flex-end', marginTop: 8, marginRight: 8 },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#1C1B1F',
  },
  description: {
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
  nextButton: {
    marginHorizontal: 32,
    marginBottom: 32,
    paddingVertical: 4,
  },
});
