import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSetAtom, useAtomValue } from 'jotai';
import { useIntrusoRimas } from '../../../hooks/useIntrusoRimas';
import { useNiveles } from '../../../hooks/useNiveles';
import { useGameLogic } from '../../../hooks/useGameLogic';
import { LexyCharacter } from '../../../components/LexyCharacter';
import { iniciarPartidaAtom, estadoPartidaAtom } from '../../../atoms/gameAtom';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/fonts';
import type { ConfigIntrusoRimas } from '../../../types/juegos';
import type { PalabraRimaItem } from '../../../hooks/useIntrusoRimas';

const GAME_COLOR = Colors.intrusoRimas;

export default function IntrusoRimasScreen() {
  const router = useRouter();
  const iniciarPartida = useSetAtom(iniciarPartidaAtom);
  const estadoPartida = useAtomValue(estadoPartidaAtom);

  const { niveles, loading, error } = useNiveles('intruso_rimas');
  const nivel = niveles[0] ?? null;
  const config = nivel?.configuracion as ConfigIntrusoRimas | undefined;

  const [gameStarted, setGameStarted] = useState(false);
  const [tappedId, setTappedId] = useState<string | null>(null);
  const [lexyMsg, setLexyMsg] = useState('Dos palabras riman entre sí. ¡Encuentra la que no rima! 🎵');
  const [lexyMood, setLexyMood] = useState<'thinking' | 'happy' | 'celebrating' | 'encouraging'>('thinking');

  const shakeAnims = useRef<Record<string, Animated.Value>>({}).current;

  const { responder, aciertos, tiempoSegundos } = useGameLogic();
  const rimas = useIntrusoRimas(
    config ?? { tipo: 'intruso_rimas', grupos: [], minAciertos: 1 },
  );

  useEffect(() => {
    if (nivel && !gameStarted) {
      iniciarPartida(nivel);
      setGameStarted(true);
    }
  }, [nivel, gameStarted]);

  // Pre-create shake animated values for each word card
  const getShakeAnim = useCallback(
    (id: string) => {
      if (!shakeAnims[id]) {
        shakeAnims[id] = new Animated.Value(0);
      }
      return shakeAnims[id];
    },
    [shakeAnims],
  );

  const shake = useCallback(
    (id: string) => {
      const anim = getShakeAnim(id);
      Animated.sequence([
        Animated.timing(anim, { toValue: -12, duration: 55, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 12, duration: 55, useNativeDriver: true }),
        Animated.timing(anim, { toValue: -8, duration: 55, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 8, duration: 55, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 55, useNativeDriver: true }),
      ]).start();
    },
    [getShakeAnim],
  );

  const handleTapPalabra = useCallback(
    (item: PalabraRimaItem) => {
      if (tappedId !== null) return;
      setTappedId(item.id);

      const res = rimas.responderPalabra(item);
      responder(item.texto, rimas.grupoActual?.intruso ?? '');

      if (res === 'correcto') {
        setLexyMsg(`¡Correcto! "${item.texto}" no rima con las demás 🎉`);
        setLexyMood('celebrating');
        setTimeout(() => {
          rimas.avanzarGrupo();
          setTappedId(null);
          setLexyMsg('Dos palabras riman entre sí. ¡Encuentra la que no rima! 🎵');
          setLexyMood('thinking');
        }, 1300);
      } else {
        setLexyMsg(`Hmm… "${item.texto}" sí rima. ¡Busca la que suena distinto! 🔍`);
        setLexyMood('encouraging');
        shake(item.id);
        setTimeout(() => setTappedId(null), 900);
      }
    },
    [tappedId, rimas, responder, shake],
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color={GAME_COLOR} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (error || !config) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error ?? 'No se pudo cargar el juego.'}</Text>
          <TouchableOpacity style={styles.btnOutline} onPress={() => router.back()}>
            <Text style={[styles.btnOutlineText, { color: GAME_COLOR }]}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (estadoPartida === 'ganada' || estadoPartida === 'perdida') {
    const gano = estadoPartida === 'ganada';
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <LexyCharacter
            mood={gano ? 'celebrating' : 'encouraging'}
            size={100}
            message={
              gano
                ? `¡Oído musical! 🎶 ${aciertos} intrusos atrapados en ${tiempoSegundos}s`
                : '¡Casi! ¡La próxima es tuya! 💪'
            }
          />
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: GAME_COLOR }]}
            onPress={() => router.back()}
          >
            <Text style={styles.btnPrimaryText}>
              {gano ? '¡A la siguiente! ✨' : 'Intentar de nuevo'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.navText, { color: GAME_COLOR }]}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.navLabel}>
          Grupo {rimas.grupoIndex + 1} / {rimas.totalGrupos}
        </Text>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>⏱ {tiempoSegundos}s</Text>
        </View>
      </View>

      {/* Progress dots */}
      <View style={styles.dots}>
        {Array.from({ length: rimas.totalGrupos }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i < rimas.grupoIndex
                    ? GAME_COLOR
                    : i === rimas.grupoIndex
                    ? GAME_COLOR + '66'
                    : Colors.border,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <Text style={styles.questionLabel}>🎵 ¿Cuál NO rima con las demás?</Text>

        {/* Word cards grid */}
        <View style={styles.cardsGrid}>
          {rimas.palabrasMezcladas.map((item) => {
            const shakeX = getShakeAnim(item.id);
            const isSelected = tappedId === item.id;
            const isCorrect = isSelected && item.esIntruso;
            const isWrong = isSelected && !item.esIntruso;

            return (
              <Animated.View
                key={item.id}
                style={[
                  styles.cardWrap,
                  { transform: [{ translateX: shakeX }] },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.wordCard,
                    { borderColor: GAME_COLOR },
                    isCorrect && styles.cardSuccess,
                    isWrong && styles.cardError,
                  ]}
                  onPress={() => handleTapPalabra(item)}
                  disabled={tappedId !== null && !isSelected}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.wordText,
                      isCorrect && { color: Colors.success },
                      isWrong && { color: Colors.error },
                      !isSelected && { color: Colors.textPrimary },
                    ]}
                  >
                    {item.texto}
                  </Text>
                  {isCorrect && <Text style={styles.resultIcon}>✓</Text>}
                  {isWrong && <Text style={styles.resultIcon}>✗</Text>}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <LexyCharacter mood={lexyMood} size={64} message={lexyMsg} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.backgroundCream },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navText: { fontSize: 17, fontFamily: 'OpenDyslexic' },
  navLabel: { ...Typography.body, color: Colors.textSecondary, fontFamily: 'OpenDyslexic' },
  timerBadge: {
    backgroundColor: Colors.lexyPurpleLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText: { fontSize: 14, color: Colors.lexyPurpleDark, fontFamily: 'OpenDyslexic' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 10 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  questionLabel: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontFamily: 'OpenDyslexic-Bold',
    textAlign: 'center',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  cardWrap: { width: '44%' },
  wordCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    borderWidth: 2.5,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardSuccess: { backgroundColor: Colors.successLight, borderColor: Colors.success },
  cardError: { backgroundColor: Colors.errorLight, borderColor: Colors.error },
  wordText: {
    fontSize: 28,
    fontFamily: 'OpenDyslexic-Bold',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  resultIcon: { fontSize: 22 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 32,
  },
  errorText: { ...Typography.body, color: Colors.error, textAlign: 'center' },
  btnOutline: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: GAME_COLOR,
  },
  btnOutlineText: { fontSize: 18, fontFamily: 'OpenDyslexic' },
  btnPrimary: { paddingVertical: 18, paddingHorizontal: 40, borderRadius: 24 },
  btnPrimaryText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    letterSpacing: 0.5,
  },
});
