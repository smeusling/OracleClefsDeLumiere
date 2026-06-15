import cardImages from '@/constants/cardImages';
import { theme } from '@/constants/theme';
import cards from '@/data/cards.json';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TOP_GUTTER = 40;

export default function CardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const tapHintOpacity = useRef(new Animated.Value(1)).current;

  const card = cards.find(c => String(c.id).padStart(2, '0') === id);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(tapHintOpacity, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
        Animated.timing(tapHintOpacity, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  if (!card) return null;

  const cardTop = insets.top + TOP_GUTTER;
  const cardBottom = insets.bottom + 43;
  const cardHeight = height - cardTop - cardBottom;
  const isSmallAndroid = Platform.OS === 'android' && height < 700;
  const imageRatio = (height < 700 && card.clef.length > 200) || isSmallAndroid ? 0.50 : 0.57;
  const imageHeight = Math.round(cardHeight * imageRatio);

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
            <Pressable onPress={handleGoToDetail} style={styles.cardPressable}>

              {/* Image */}
              <View style={[styles.imageContainer, { height: imageHeight }]}>
                <Image
                  source={cardImages[id ?? '01']}
                  style={{ position: 'absolute', top: -2, left: 0, right: 0, bottom: 0 }}
                  contentFit="cover"
                  transition={400}
                />
                <LinearGradient
                  colors={[theme.colors.backgroundTransparent, theme.colors.background]}
                  style={styles.imageGradient}
                />
              </View>

              {/* Contenu sous l'image */}
              <View style={styles.cardContent}>

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
                  <LinearGradient
                    colors={[theme.colors.goldTransparent, theme.colors.gold] as [string, string]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                  />
                  <Text style={styles.separatorDiamond}>✦</Text>
                  <LinearGradient
                    colors={[theme.colors.gold, theme.colors.goldTransparent] as [string, string]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                  />
                </View>
              </View>

              {/* Texte de la clef */}
              <View style={styles.clefSection}>
                <Text
                  style={[styles.clefText,
                    isSmallAndroid ? { lineHeight: 26 } : (height < 700 && { lineHeight: 24 })
                  ]}
                  {...(isSmallAndroid
                    ? { adjustsFontSizeToFit: true, numberOfLines: 9, minimumFontScale: 0.7 }
                    : (height < 700 && card.clef.length > 200
                      ? { adjustsFontSizeToFit: true, numberOfLines: 8, minimumFontScale: 0.7 }
                      : {})
                  )}
                >
                  {card.clef}
                </Text>
              </View>

              {/* Séparateur bas : traits dégradés + grande étoile */}
              <View style={[styles.bottomSepContainer, height < 700 && { paddingBottom: 6, gap: 4 }]}>
                <View style={styles.bottomSepRow}>
                  <LinearGradient
                    colors={[theme.colors.goldTransparent, theme.colors.gold] as [string, string]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                  />
                  <Text style={styles.smallDiamond}>✦</Text>
                  <Text style={styles.bigDiamond}>✦</Text>
                  <Text style={styles.smallDiamond}>✦</Text>
                  <LinearGradient
                    colors={[theme.colors.gold, theme.colors.goldTransparent] as [string, string]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                  />
                </View>
              </View>

              </View>
            </Pressable>
          </View>
        </Animated.View>

        {/* ── Indicateur de tap ── */}
        <Animated.Text
          onPress={handleGoToDetail}
          suppressHighlighting
          style={[styles.tapHint, { opacity: tapHintOpacity, bottom: insets.bottom + 2 }]}
        >
          Dévoile ton message
        </Animated.Text>

        {/* ── Bouton fermer ── */}
        <Pressable
          style={[styles.closeButton, { top: insets.top - 2 }]}
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
    borderColor: theme.colors.goldBorder,
  },

  /* ── Clip image (View interne, overflow sans bordure) ── */
  cardInner: {
    flex: 1,
    borderRadius: 23,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  },

  cardPressable: {
    flex: 1,
  },

  /* ── Image ── */
  imageContainer: {
    width: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 162,
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
    paddingTop: 5,
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
    paddingBottom: 12,
    gap: 8,
  },
  tapHint: {
    position: 'absolute',
    alignSelf: 'center',
    fontFamily: 'CormorantGaramond_600SemiBold_Italic',
    fontSize: 23,
    color: theme.colors.primary,
    paddingHorizontal: 8,
    paddingBottom: 4,
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
    backgroundColor: theme.colors.backgroundFrosted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 18,
    color: theme.colors.primary,
    lineHeight: 20,
  },
});
