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
import { usePalabrasGemelas } from '../../../hooks/usePalabrasGemelas';
import { useNiveles } from '../../../hooks/useNiveles';
import { useGameLogic } from '../../../hooks/useGameLogic';
import { LexyCharacter } from '../../../components/LexyCharacter';
import { iniciarPartidaAtom, estadoPartidaAtom } from '../../../atoms/gameAtom';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/fonts';
import type { ConfigPalabrasGemelas } from '../../../types/juegos';

const GAME_COLOR = Colors.palabrasGemelas;

// Highlight letters that differ between two words
function WordDiff({ wordA, wordB, style }: { wordA: string; wordB: string; style?: object }) {
  const maxLen = Math.max(wordA.length, wordB.length);
  return (
    <View style={styles.wordDiffRow}>
      {Array.from({ length: wordA.length }).map((_, i) => {
        const isDiff =
          i >= wordB.length ||
          wordA[i].toLowerCase() !== wordB[i].toLowerCase();
        return (
          <Text key={i} style={[styles.wordChar, isDiff && styles.wordCharDiff, style]}>
            {wordA[i]}
          </Text>
        );
      })}
    </View>
  );
}

export default function PalabrasGemelasScreen() {
  const router = useRouter();
  const iniciarPartida = useSetAtom(iniciarPartidaAtom);
  const estadoPartida = useAtomValue(estadoPartidaAtom);

  const { niveles, loading, error } = useNiveles('palabras_gemelas');
  const nivel = niveles[0] ?? null;
  const config = nivel?.configuracion as ConfigPalabrasGemelas | undefined;

  const [gameStarted, setGameStarted] = useState(false);
  const [resultado, setResultado] = useState<'correcto' | 'incorrecto' | null>(null);
  const [lexyMsg, setLexyMsg] = useState('¿Son la misma palabra? ¡Fijate bien en cada letra! 🔍');
  const [lexyMood, setLexyMood] = useState<'thinking' | 'happy' | 'celebrating' | 'encouraging'>('thinking');

  const feedbackScale = useRef(new Animated.Value(1)).current;

  const { responder, aciertos, tiempoSegundos } = useGameLogic();
  const gemelas = usePalabrasGemelas(
    config ?? { tipo: 'palabras_gemelas', pares: [], minAciertos: 1 },
  );

  useEffect(() => {
    if (nivel && !gameStarted) {
      iniciarPartida(nivel);
      setGameStarted(true);
    }
  }, [nivel, gameStarted]);

  const handleRespuesta = useCallback(
    (esSi: boolean) => {
      if (resultado !== null || !gemelas.parActual) return;

      const res = gemelas.responderPar(esSi);
      const correctStr = gemelas.parActual.sonGemelas ? 'si' : 'no';
      const userStr = esSi ? 'si' : 'no';

      setResultado(res);
      responder(userStr, correctStr);

      if (res === 'correcto') {
        setLexyMsg('¡Correcto! 🌟 ¡Buen ojo de detective!');
        setLexyMood('celebrating');
      } else {
        setLexyMsg('¡Casi! Mirá letra por letra 🔍');
        setLexyMood('encouraging');
      }

      // Pulse animation on feedback
      Animated.sequence([
        Animated.timing(feedbackScale, { toValue: 1.04, duration: 100, useNativeDriver: true }),
        Animated.timing(feedbackScale, { toValue: 1.0, duration: 120, useNativeDriver: true }),
      ]).start();

      setTimeout(() => {
        gemelas.avanzarPar();
        setResultado(null);
        setLexyMsg('¿Son la misma palabra? ¡Fijate bien en cada letra! 🔍');
        setLexyMood('thinking');
      }, 1300);
    },
    [resultado, gemelas, responder, feedbackScale],
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
                ? `¡Detective experta! 🏆 ${aciertos} aciertos en ${tiempoSegundos}s`
                : '¡Muy bien intentado! ¿Vamos de nuevo? 💪'
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

  const par = gemelas.parActual;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.navText, { color: GAME_COLOR }]}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.navLabel}>
          Par {gemelas.parIndex + 1} / {gemelas.totalPares}
        </Text>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>⏱ {tiempoSegundos}s</Text>
        </View>
      </View>

      {/* Progress dots */}
      <View style={styles.dots}>
        {Array.from({ length: gemelas.totalPares }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i < gemelas.parIndex
                    ? GAME_COLOR
                    : i === gemelas.parIndex
                    ? GAME_COLOR + '66'
                    : Colors.border,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        {/* Question label */}
        <Text style={styles.questionLabel}>🔍 ¿Son la misma palabra?</Text>

        {/* Word cards */}
        {par && (
          <Animated.View
            style={[
              styles.wordsContainer,
              { transform: [{ scale: feedbackScale }] },
              resultado === 'correcto' && styles.cardSuccess,
              resultado === 'incorrecto' && styles.cardError,
            ]}
          >
            <WordDiff wordA={par.palabraA} wordB={par.palabraB} />
            <View style={styles.divider} />
            <WordDiff wordA={par.palabraB} wordB={par.palabraA} />
          </Animated.View>
        )}

        {/* Lexy */}
        <LexyCharacter mood={lexyMood} size={64} message={lexyMsg} />

        {/* Answer buttons */}
        <View style={styles.answersRow}>
          <TouchableOpacity
            style={[
              styles.answerBtn,
              { backgroundColor: Colors.success + '18', borderColor: Colors.success },
            ]}
            onPress={() => handleRespuesta(true)}
            disabled={resultado !== null}
            activeOpacity={0.8}
          >
            <Text style={styles.answerEmoji}>👯</Text>
            <Text style={[styles.answerText, { color: Colors.success }]}>
              ¡Son gemelas!
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.answerBtn,
              { backgroundColor: Colors.error + '18', borderColor: Colors.error },
            ]}
            onPress={() => handleRespuesta(false)}
            disabled={resultado !== null}
            activeOpacity={0.8}
          >
            <Text style={styles.answerEmoji}>🔍</Text>
            <Text style={[styles.answerText, { color: Colors.error }]}>
              Son diferentes
            </Text>
          </TouchableOpacity>
        </View>
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
  wordsContainer: {
    width: '100%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: Colors.border,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardSuccess: { borderColor: Colors.success, backgroundColor: Colors.successLight },
  cardError: { borderColor: Colors.error, backgroundColor: Colors.errorLight },
  wordDiffRow: { flexDirection: 'row', gap: 3 },
  wordChar: {
    fontSize: 42,
    fontFamily: 'OpenDyslexic-Bold',
    letterSpacing: 4,
    color: Colors.textPrimary,
  },
  wordCharDiff: { color: GAME_COLOR },
  divider: {
    width: '60%',
    height: 2,
    backgroundColor: Colors.border,
    borderRadius: 1,
  },
  answersRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  answerBtn: {
    flex: 1,
    borderWidth: 2.5,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  answerEmoji: { fontSize: 32 },
  answerText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
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
