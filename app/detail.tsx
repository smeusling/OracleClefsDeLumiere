import { theme } from '@/constants/theme';
import cards from '@/data/cards.json';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_FADE_DURATION = 700;
const SCREEN_FADE_DURATION = 400;

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const navOpacity = useRef(new Animated.Value(0)).current;
  const isShowing = useRef(false);
  const titleThreshold = useRef(80);

  const handleTitleLayout = (event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    titleThreshold.current = y + height - 25;
  };

  useEffect(() => {
    Animated.timing(screenOpacity, { toValue: 1, duration: SCREEN_FADE_DURATION, useNativeDriver: true }).start();
  }, []);

  const card = cards.find(c => String(c.id).padStart(2, '0') === id);
  if (!card) return null;

  const cardNum = String(card.id);

  const handleBack = () => {
    Animated.timing(screenOpacity, { toValue: 0, duration: SCREEN_FADE_DURATION, useNativeDriver: true }).start();
    setTimeout(() => router.back(), SCREEN_FADE_DURATION);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y > titleThreshold.current && !isShowing.current) {
      isShowing.current = true;
      Animated.timing(navOpacity, { toValue: 1, duration: NAV_FADE_DURATION, useNativeDriver: true }).start();
    } else if (y <= titleThreshold.current && isShowing.current) {
      isShowing.current = false;
      Animated.timing(navOpacity, { toValue: 0, duration: NAV_FADE_DURATION, useNativeDriver: true }).start();
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'none' }} />

      <View style={styles.screen}>

        {/* ── Navbar fixe ── */}
        <View style={[styles.navbar, { paddingTop: insets.top }]}>
          <View style={styles.navRow}>
            <Pressable
              style={styles.navButton}
              onPress={handleBack}
              hitSlop={12}
            >
              <Text style={styles.navButtonText}>←</Text>
            </Pressable>

            <Animated.View style={[styles.navCenter, { opacity: navOpacity }]}>
              <View style={styles.navCenterRow}>
                <Text style={styles.navCenterNumber}>{cardNum}</Text>
                <Text style={styles.navCenterDot}>·</Text>
                <Text style={styles.navCenterTitle} numberOfLines={1}>{card.title}</Text>
              </View>
            </Animated.View>

            <Pressable
              style={styles.navButton}
              onPress={() => router.dismissAll()}
              hitSlop={12}
            >
              <Text style={styles.navButtonText}>×</Text>
            </Pressable>
          </View>
          <View style={styles.navBorder} />
        </View>

        {/* ── Contenu scrollable ── */}
        <Animated.View style={[styles.content, { opacity: screenOpacity }]}>
          <Animated.ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 110 },
            ]}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {/* Numéro · Titre */}
            <Text style={styles.cardTitle} onLayout={handleTitleLayout}>
              <Text style={styles.cardNumber}>{cardNum}</Text>
              <Text style={styles.cardDot}> · </Text>
              {card.title}
            </Text>

            {/* Ligne séparatrice avec dégradé aux extrémités */}
            <LinearGradient
              colors={[theme.colors.goldLightTransparent, theme.colors.goldLight, theme.colors.goldLight, theme.colors.goldLightTransparent]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.thinLine}
            />

            {/* Description */}
            <Text style={styles.descriptionText}>{card.description}</Text>
          </Animated.ScrollView>

          {/* Fondu bas */}
          <LinearGradient
            colors={[theme.colors.backgroundTransparent, theme.colors.background]}
            style={[styles.fadeOverlay, { height: insets.bottom + 100 }]}
            pointerEvents="none"
          />
        </Animated.View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  /* ── Navbar fixe ── */
  navbar: {
    backgroundColor: theme.colors.background,
    zIndex: 10,
  },
  navRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 25,
    color: theme.colors.primary,
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  navCenterNumber: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 25,
    color: theme.colors.textLight,
  },
  navCenterDot: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 20,
    color: theme.colors.gold,
  },
  navCenterTitle: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 32,
    lineHeight: 35,
    color: theme.colors.primary,
  },
  navBorder: {
    height: 1,
    backgroundColor: theme.colors.goldLight,
    opacity: 0.7,
    marginHorizontal: 24,
  },

  /* ── Contenu ── */
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 28,
    alignItems: 'center',
  },

  /* ── Numéro (span inline dans cardTitle) ── */
  cardNumber: {
    color: theme.colors.textLight,
  },

  cardDot: {
    fontFamily: 'CormorantGaramond_400Regular',
    color: theme.colors.gold,
  },

  /* ── Titre ── */
  cardTitle: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 38,
    lineHeight: 46,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 22,
  },

  /* ── Ligne séparatrice ── */
  thinLine: {
    width: '72%',
    height: 1,
    marginBottom: 26,
  },

  /* ── Description ── */
  descriptionText: {
    fontFamily: 'CormorantGaramond_400Regular_Italic',
    fontSize: 20,
    lineHeight: 28,
    color: theme.colors.textLight,
    opacity: 0.95,
    textAlign: 'justify',
    width: '100%',
  },

  /* ── Fondu bas ── */
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
