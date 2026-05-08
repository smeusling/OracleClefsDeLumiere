import { theme } from '@/constants/theme';
import { useOracle } from '@/hooks/useOracle';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import clefSource from '../assets/images/clef.png';

export default function HomeScreen() {
  const { drawnId, draw } = useOracle();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    draw();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

        {/* En-tête */}
        <View style={styles.headerSection}>
          <Text style={styles.surtitle}>L'ORACLE DES</Text>
          <Text style={styles.title}>Clefs de Lumière</Text>
          <View style={styles.separatorRow}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorDiamond}>✦</Text>
            <View style={styles.separatorLine} />
          </View>
        </View>

        {/* Citation méditative */}
        <Text style={styles.quote}>
          {'Respire profondément.\nPose une intention,\nou laisse simplement\nvenir ce qui t’est destiné.'}
        </Text>

        {/* Illustration clef ailée */}
        <Image
          source={clefSource}
          style={styles.keyImage}
          contentFit="contain"
        />

        {/* Bas de page : CTA + liens discrets */}
        <View style={styles.bottomSection}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => {
              if (drawnId) {
                router.push({ pathname: '/card/[id]', params: { id: drawnId } });
              }
            }}
          >
            <Text style={styles.buttonText}>✦{'  '}JE DÉCOUVRE MA CLEF{'  '}✦</Text>
          </Pressable>

          <View style={styles.footer}>
            <Pressable hitSlop={8}>
              <Text style={styles.footerLink}>Soutenir</Text>
            </Pressable>
            <Text style={styles.footerDot}>·</Text>
            <Pressable hitSlop={8}>
              <Text style={styles.footerLink}>Se procurer</Text>
            </Pressable>
          </View>
        </View>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 36,
    paddingTop: 28,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /* ── En-tête ── */
  headerSection: {
    alignItems: 'center',
    gap: 4,
  },
  surtitle: {
    fontFamily: 'Lato_300Light',
    fontSize: 14,
    letterSpacing: 3.5,
    color: theme.colors.textLight,
  },
  title: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 40,
    lineHeight: 52,
    color: theme.colors.primary,
  },

  /* ── Séparateur ── */
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    width: 130,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8D49E',
  },
  separatorDiamond: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 12,
    color: theme.colors.gold,
  },

  /* ── Citation ── */
  quote: {
    fontFamily: 'CormorantGaramond_400Regular_Italic',
    fontSize: 20,
    lineHeight: 34,
    textAlign: 'center',
    color: theme.colors.text,
    opacity: 0.82,
  },

  /* ── Image ── */
  keyImage: {
    width: 244,
    height: 182,
  },

  /* ── Zone basse ── */
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    gap: 18,
    paddingBottom: 4,
  },
  button: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: theme.colors.gold,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  buttonPressed: {
    opacity: 0.55,
  },
  buttonText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    letterSpacing: 2,
    color: theme.colors.text,
  },

  /* ── Footer ── */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  footerLink: {
    fontFamily: 'Lato_400Regular',
    fontSize: 15,
    color: theme.colors.textLight,
    textDecorationLine: 'underline',
  },
  footerDot: {
    fontFamily: 'Lato_400Regular',
    fontSize: 15,
    color: theme.colors.textLight,
    opacity: 0.5,
  },
});
