import cardImages from '@/constants/cardImages';
import { theme } from '@/constants/theme';
import cards from '@/data/cards.json';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GOLD_TRANSPARENT = 'rgba(201,168,76,0)';
const TOP_GUTTER = 40;

export default function CardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const card = cards.find(c => String(c.id).padStart(2, '0') === id);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!card) return null;

  const cardTop = insets.top + TOP_GUTTER;
  const cardBottom = insets.bottom + 20;
  const cardHeight = height - cardTop - cardBottom;
  const imageHeight = Math.round(cardHeight * 0.57);

  const handleGoToDetail = () => {
    router.push({ pathname: '/detail', params: { id: id ?? '' } });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>

        <Animated.View
          style={[
            styles.cardBorder,
            { opacity: fadeAnim, marginTop: cardTop, marginBottom: cardBottom },
          ]}
        >
          <View style={styles.cardInner}>

            {/* Image */}
            <Pressable
              onPress={handleGoToDetail}
              style={[styles.imageContainer, { height: imageHeight }]}
            >
              <Image
                source={cardImages[id ?? '01']}
                style={{ position: 'absolute', top: -2, left: 0, right: 0, bottom: 0 }}
                contentFit="cover"
                transition={400}
              />
              <LinearGradient
                colors={['rgba(250,240,238,0)', theme.colors.background]}
                style={styles.imageGradient}
              />
            </Pressable>

            {/* Contenu sous l'image */}
            <Pressable style={styles.cardContent} onPress={handleGoToDetail}>

              <View style={styles.infoSection}>
                <Text
                  style={styles.cardTitle}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  <Text style={styles.cardNumber}>{String(card.id)}</Text>
                  <Text style={styles.cardDot}> · </Text>
                  {card.title.toUpperCase()}
                </Text>

                <View style={styles.separatorRow}>
                  <View style={styles.separatorLine} />
                  <Text style={styles.separatorDiamond}>✦</Text>
                  <View style={styles.separatorLine} />
                </View>
              </View>

              {/* Texte de la clef */}
              <View style={styles.clefSection}>
                <Text
                  style={styles.clefText}
                  adjustsFontSizeToFit
                  minimumFontScale={0.6}
                >
                  {card.clef}
                </Text>
              </View>

              {/* Séparateur bas : traits dégradés + grande étoile */}
              <View style={styles.bottomSepContainer}>
                <View style={styles.bottomSepRow}>
                  <LinearGradient
                    colors={[GOLD_TRANSPARENT, theme.colors.gold] as [string, string]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                  />
                  <Text style={styles.smallDiamond}>✦</Text>
                  <Text style={styles.bigDiamond}>✦</Text>
                  <Text style={styles.smallDiamond}>✦</Text>
                  <LinearGradient
                    colors={[theme.colors.gold, GOLD_TRANSPARENT] as [string, string]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                  />
                </View>
              </View>

            </Pressable>
          </View>
        </Animated.View>

        {/* ── Bouton fermer ── */}
        <Pressable
          style={[styles.closeButton, { top: insets.top + 6 }]}
          onPress={() => router.dismissAll()}
          hitSlop={12}
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>


      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  /* ── Bordure (View externe, pas d'overflow) ── */
  cardBorder: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.35)',
  },

  /* ── Clip image (View interne, overflow sans bordure) ── */
  cardInner: {
    flex: 1,
    borderRadius: 23,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  },

  /* ── Image ── */
  imageContainer: {
    width: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },

  /* ── Contenu sous l'image ── */
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  /* ── Clef ── */
  clefSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  clefText: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 19,
    lineHeight: 27,
    color: theme.colors.text,
    textAlign: 'center',
  },

  /* ── Info ── */
  infoSection: {
    alignItems: 'center',
    paddingTop: 20,
    gap: 12,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 26,
    letterSpacing: 5,
    color: theme.colors.text,
    textAlign: 'center',
  },
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 140,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gold,
  },
  separatorDiamond: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 11,
    color: theme.colors.gold,
  },
  cardNumber: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    color: theme.colors.text,
  },
  cardDot: {
    fontFamily: 'CormorantGaramond_400Regular',
    color: theme.colors.gold,
  },

  /* ── Séparateur bas avec dégradé ── */
  bottomSepContainer: {
    alignItems: 'center',
    paddingBottom: 28,
  },
  bottomSepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
    gap: 8,
  },
  gradientLine: {
    flex: 1,
    height: 1,
  },
  bigDiamond: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 18,
    color: theme.colors.gold,
    lineHeight: 22,
  },
  smallDiamond: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 12,
    color: theme.colors.gold,
    lineHeight: 22,
  },

  /* ── Bouton fermer ── */
  closeButton: {
    position: 'absolute',
    right: 30,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(250, 240, 238, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 20,
  },
});
