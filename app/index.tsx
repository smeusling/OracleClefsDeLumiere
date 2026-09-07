import { theme } from '@/constants/theme';
import { useOracle } from '@/hooks/useOracle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Linking, Modal, PixelRatio, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import clefSource from '../assets/images/clef.png';

export default function HomeScreen() {
  const { drawnId, draw } = useOracle();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const [fontScaleAlertVisible, setFontScaleAlertVisible] = useState(false);
  const fontScaleAlertOpacity = useRef(new Animated.Value(0)).current;
  const [dismissed, setDismissed] = useState(false);
  const [doNotShow, setDoNotShow] = useState(false);
  const hasCustomFontScale = PixelRatio.getFontScale() !== 1;

  useEffect(() => {
    AsyncStorage.getItem('fontScaleWarningDismissed').then(value => {
      if (value === 'true') setDismissed(true);
    });
  }, []);

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(modalOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const closeModal = () => {
    Animated.timing(modalOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      setModalVisible(false);
    });
  };

  const closeFontScaleAlert = (navigate = false) => {
    if (doNotShow) {
      AsyncStorage.setItem('fontScaleWarningDismissed', 'true');
      setDismissed(true);
    }
    if (navigate && drawnId) {
      router.push({ pathname: '/card', params: { id: drawnId } });
    }
    Animated.timing(fontScaleAlertOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      setFontScaleAlertVisible(false);
    });
  };

  useFocusEffect(
    useCallback(() => {
      draw();
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }).start();
    }, []),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

        {/* En-tête */}
        <View style={styles.headerSection}>
          <Text style={styles.surtitle} maxFontSizeMultiplier={1.2}>L'ORACLE DES</Text>
          <Text style={styles.title} maxFontSizeMultiplier={1.2}>Clefs de Lumière</Text>
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
                if (hasCustomFontScale && !dismissed) {
                  setFontScaleAlertVisible(true);
                  Animated.timing(fontScaleAlertOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
                } else {
                  router.push({ pathname: '/card', params: { id: drawnId } });
                }
              }
            }}
          >
            <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>✦{'  '}JE DÉCOUVRE MA CLEF{'  '}✦</Text>
          </Pressable>

          <View style={styles.footer}>
            <Pressable hitSlop={8} onPress={() => WebBrowser.openBrowserAsync('https://www.manonmoureau.fr/soutenir')}>
              <Text style={styles.footerLink} maxFontSizeMultiplier={1.2}>Soutenir</Text>
            </Pressable>
            <Text style={styles.footerDot} maxFontSizeMultiplier={1.2}>·</Text>
            <Pressable hitSlop={8} onPress={() => WebBrowser.openBrowserAsync('https://www.manonmoureau.fr/l-oracle-des-clefs-de-lumiere')}>
              <Text style={styles.footerLink} maxFontSizeMultiplier={1.2}>Se procurer</Text>
            </Pressable>
          </View>
        </View>

      </Animated.View>

      {/* ── Bouton ⓘ ── */}
      <Pressable style={[styles.infoButton, { top: insets.top + 0 }]} onPress={openModal} hitSlop={12}>
        <Text style={styles.infoIcon} maxFontSizeMultiplier={1.2}>ⓘ</Text>
      </Pressable>

      {/* ── Modal À propos ── */}
      <Modal visible={modalVisible} transparent animationType="none" onRequestClose={closeModal}>
        <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
          <View style={styles.modalBox}>
            <Pressable style={styles.modalCloseButton} onPress={closeModal} hitSlop={12}>
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>
            {hasCustomFontScale && (
              <>
                <Text style={styles.fontScaleWarning}>
                  {'Veuillez vérifier le paramétrage de la taille de police de votre appareil afin que le message de la Clef puisse s\'afficher entièrement à l\'écran.'}
                </Text>
                <View style={styles.warningDividerRow}>
                  <LinearGradient
                    colors={[theme.colors.primaryTransparent, theme.colors.primary] as [string, string]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                  />
                  <Text style={styles.separatorDiamond}>✦</Text>
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primaryTransparent] as [string, string]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                  />
                </View>
              </>
            )}
            <Text style={styles.modalText}>
              {'Application développée avec '}
              <Text style={styles.modalHeart}>{'♥︎'}</Text>
              {' par\nStéphanie Meusling'}
            </Text>
            <Pressable hitSlop={8} onPress={() => Linking.openURL('mailto:smeusling@gmail.com')}>
              <View style={styles.contactRow}>
                <LinearGradient
                  colors={[theme.colors.primaryTransparent, theme.colors.primary] as [string, string]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.gradientLine}
                />
                <Text style={styles.separatorDiamond}>✦</Text>
                <Text style={styles.modalLink}>Contacter la développeuse</Text>
                <Text style={styles.separatorDiamond}>✦</Text>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.primaryTransparent] as [string, string]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.gradientLine}
                />
              </View>
            </Pressable>
            <Text style={styles.versionText}>
              {`v${Application.nativeApplicationVersion ?? '—'} (${Application.nativeBuildVersion ?? '—'})`}
            </Text>
          </View>
        </Animated.View>
      </Modal>

      {/* ── Popup alerte taille de police ── */}
      <Modal visible={fontScaleAlertVisible} transparent animationType="none" onRequestClose={() => closeFontScaleAlert(false)}>
        <Animated.View style={[styles.modalOverlay, { opacity: fontScaleAlertOpacity }]}>
          <View style={styles.modalBox}>
            <Text style={styles.alertTitle}>Taille de police modifiée</Text>
            <Text style={styles.modalText}>
              {"Nous avons détecté que la taille de police de votre appareil a été modifiée. Si le message d'une Clef ne s'affiche pas entièrement à l'écran, nous vous invitons à revenir au réglage d'origine dans les paramètres de votre téléphone."}
            </Text>
            <Pressable style={styles.checkboxRow} onPress={() => setDoNotShow(v => !v)} hitSlop={8}>
              <View style={[styles.checkbox, doNotShow && styles.checkboxChecked]}>
                {doNotShow && <Text style={styles.checkboxMark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Ne plus me montrer ce message</Text>
            </Pressable>
            <Pressable hitSlop={8} onPress={() => closeFontScaleAlert(true)} style={{ width: '100%' }}>
              <View style={styles.contactRow}>
                <LinearGradient
                  colors={[theme.colors.primaryTransparent, theme.colors.primary] as [string, string]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.gradientLine}
                />
                <Text style={styles.separatorDiamond}>✦</Text>
                <Text style={styles.modalLink}>Continuer</Text>
                <Text style={styles.separatorDiamond}>✦</Text>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.primaryTransparent] as [string, string]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.gradientLine}
                />
              </View>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>

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
    width: 180,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.goldLight,
  },
  separatorDiamond: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 12,
    color: theme.colors.primary,
  },
  gradientLine: {
    flex: 1,
    height: 1,
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

  /* ── Bouton ⓘ ── */
  infoButton: {
    position: 'absolute',
    right: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.backgroundFrosted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    fontFamily: 'Lato_400Regular',
    fontSize: 18,
    color: theme.colors.textLight,
    lineHeight: 22,
  },

  /* ── Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  modalBox: {
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    paddingTop: 38,
    paddingBottom: 24,
    paddingHorizontal: 28,
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.backgroundFrosted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 15,
    color: theme.colors.primary,
    lineHeight: 17,
  },
  modalText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    lineHeight: 26,
    color: theme.colors.text,
    textAlign: 'center',
  },
  modalHeart: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: theme.colors.gold,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    marginTop: 10,
  },
  modalLink: {
    fontFamily: 'CormorantGaramond_600SemiBold_Italic',
    fontSize: 24,
    color: theme.colors.primary,
  },
  versionText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 11,
    color: theme.colors.textLight,
    opacity: 0.6,
    marginTop: -4,
  },

  alertTitle: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 24,
    lineHeight: 28,
    color: theme.colors.primary,
    textAlign: 'center',
  },

  /* ── Avertissement échelle de police ── */
  fontScaleWarning: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.text,
    opacity: 0.85,
    textAlign: 'center',
  },
  warningDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },

  /* ── Case à cocher popup police ── */
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
  },
  checkboxMark: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    color: theme.colors.background,
    lineHeight: 14,
  },
  checkboxLabel: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: theme.colors.textLight,
  },
});
