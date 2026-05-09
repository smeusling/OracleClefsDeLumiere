import { theme } from '@/constants/theme';
import cards from '@/data/cards.json';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SHOW_THRESHOLD = 10;
const NAV_FADE_DURATION = 700;
const SCREEN_FADE_DURATION = 400;

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const screenOpacity = useSharedValue(0);
  const navOpacity = useSharedValue(0);
  const isShowing = useSharedValue(false);

  useEffect(() => {
    screenOpacity.value = withTiming(1, { duration: SCREEN_FADE_DURATION });
  }, []);

  const card = cards.find(c => String(c.id).padStart(2, '0') === id);
  if (!card) return null;

  const cardNum = String(card.id);
  const cardNumDotted = '· ' + cardNum + ' ·';

  const handleBack = () => {
    screenOpacity.value = withTiming(0, { duration: SCREEN_FADE_DURATION }, () => {
      runOnJS(router.back)();
    });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      if (y > SHOW_THRESHOLD && !isShowing.value) {
        isShowing.value = true;
        navOpacity.value = withTiming(1, { duration: NAV_FADE_DURATION });
      } else if (y <= SHOW_THRESHOLD && isShowing.value) {
        isShowing.value = false;
        navOpacity.value = withTiming(0, { duration: NAV_FADE_DURATION });
      }
    },
  });

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const navTitleStyle = useAnimatedStyle(() => ({
    opacity: navOpacity.value,
  }));

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

            <Animated.View style={[styles.navCenter, navTitleStyle]}>
              <View style={styles.navCenterRow}>
                <Text style={styles.navCenterDot}>·</Text>
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
        <Animated.View style={[styles.content, screenStyle]}>
          <Animated.ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 110 },
            ]}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          >
            {/* Numéro */}
            <Text style={styles.cardNumber}>{cardNumDotted}</Text>

            {/* Titre */}
            <Text style={styles.cardTitle}>{card.title}</Text>

            {/* Séparateur : ─── ✦✦ ✦ ✦✦ ─── */}
            <View style={styles.keySepRow}>
              <View style={styles.keySepLine} />
              <Text style={styles.keySepDots}>✦ ✦</Text>
              <Text style={styles.keySepDotBig}>✦</Text>
              <Text style={styles.keySepDots}>✦ ✦</Text>
              <View style={styles.keySepLine} />
            </View>

            {/* Texte de la clef */}
            <Text style={styles.clefText}>{card.clef}</Text>

            {/* Ligne séparatrice avec dégradé aux extrémités */}
            <LinearGradient
              colors={['rgba(232,212,158,0)', '#E8D49E', '#E8D49E', 'rgba(232,212,158,0)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.thinLine}
            />

            {/* Description */}
            <Text style={styles.descriptionText}>{card.description}</Text>
          </Animated.ScrollView>

          {/* Fondu bas */}
          <LinearGradient
            colors={['rgba(250,240,238,0)', theme.colors.background]}
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
    fontFamily: 'Lato_300Light',
    fontSize: 16,
    letterSpacing: 1,
    color: theme.colors.textLight,
  },
  navCenterDot: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    color: theme.colors.gold,
  },
  navCenterTitle: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 30,
    lineHeight: 30,
    color: theme.colors.primary,
  },
  navBorder: {
    height: 1,
    backgroundColor: '#E8D49E',
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

  /* ── Numéro ── */
  cardNumber: {
    fontFamily: 'Lato_300Light',
    fontSize: 15,
    letterSpacing: 3,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: 10,
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

  /* ── Séparateur ── */
  keySepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    marginBottom: 26,
  },
  keySepLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gold,
    opacity: 0.35,
  },
  keySepDots: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 10,
    color: theme.colors.gold,
    letterSpacing: 4,
  },
  keySepDotBig: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 14,
    color: theme.colors.gold,
  },

  /* ── Clef ── */
  clefText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    lineHeight: 31,
    textAlign: 'center',
    color: theme.colors.text,
    marginBottom: 30,
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
    fontSize: 18,
    lineHeight: 27,
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
