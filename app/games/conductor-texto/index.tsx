import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSetAtom, useAtomValue } from 'jotai';
import { useConductorTexto } from '../../../hooks/useConductorTexto';
import { useNiveles } from '../../../hooks/useNiveles';
import { useGameLogic } from '../../../hooks/useGameLogic';
import { LexyCharacter } from '../../../components/LexyCharacter';
import { iniciarPartidaAtom, estadoPartidaAtom } from '../../../atoms/gameAtom';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/fonts';
import type { ConfigConductorTexto } from '../../../types/juegos';

const GAME_COLOR = Colors.conductorTexto;

// Renders text where each word is long-pressable to trigger TTS
function TappableText({
  text,
  onLongPressWord,
  style,
}: {
  text: string;
  onLongPressWord: (word: string) => void;
  style?: object;
}) {
  const words = text.split(' ');
  return (
    <View style={styles.tappableRow}>
      {words.map((word, i) => (
        <Pressable
          key={i}
          onLongPress={() => onLongPressWord(word.replace(/[.,;:!?]/g, ''))}
          delayLongPress={400}
        >
          <Text style={[styles.tappableWord, style]}>{word} </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function ConductorTextoScreen() {
  const router = useRouter();
  const iniciarPartida = useSetAtom(iniciarPartidaAtom);
  const estadoPartida = useAtomValue(estadoPartidaAtom);

  const { niveles, loading, error } = useNiveles('conductor_texto');
  const nivel = niveles[0] ?? null;
  const config = nivel?.configuracion as ConfigConductorTexto | undefined;

  const [gameStarted, setGameStarted] = useState(false);
  const [opcionResultado, setOpcionResultado] = useState<Record<string, 'correcto' | 'incorrecto'>>({});
  const [answered, setAnswered] = useState(false);
  const [lexyMsg, setLexyMsg] = useState('Mantén presionada una palabra para escucharla 🔊');
  const [lexyMood, setLexyMood] = useState<'thinking' | 'happy' | 'celebrating' | 'encouraging'>('thinking');

  const { responder, aciertos, tiempoSegundos } = useGameLogic();
  const conductor = useConductorTexto(
    config ?? { tipo: 'conductor_texto', texto: '', preguntas: [], minAciertos: 1 },
  );

  useEffect(() => {
    if (nivel && !gameStarted) {
      iniciarPartida(nivel);
      setGameStarted(true);
    }
  }, [nivel, gameStarted]);

  const handleOpcion = useCallback(
    (opcion: string) => {
      if (answered || !conductor.preguntaActual) return;
      setAnswered(true);

      const res = conductor.responderOpcion(opcion);
      responder(opcion, conductor.preguntaActual.respuestaCorrecta);

      const fb: Record<string, 'correcto' | 'incorrecto'> = {};
      conductor.preguntaActual.opciones.forEach((o) => {
        if (o === opcion) fb[o] = res;
        else if (o === conductor.preguntaActual!.respuestaCorrecta) fb[o] = 'correcto';
      });
      setOpcionResultado(fb);

      if (res === 'correcto') {
        setLexyMsg('¡Exacto! 🌟 Escucha la oración completa…');
        setLexyMood('celebrating');
      } else {
        setLexyMsg(`La respuesta era "${conductor.preguntaActual.respuestaCorrecta}". ¡Casi! 💪`);
        setLexyMood('encouraging');
      }

      setTimeout(() => {
        conductor.avanzarPregunta();
        setOpcionResultado({});
        setAnswered(false);
        setLexyMsg('Mantén presionada una palabra para escucharla 🔊');
        setLexyMood('thinking');
      }, 1800);
    },
    [answered, conductor, responder],
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
                ? `¡Lectora experta! 📖 ${aciertos} respuestas en ${tiempoSegundos}s`
                : '¡Lo intentaste con todo! ¡Vamos de nuevo! 💪'
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

  const pregunta = conductor.preguntaActual;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.navText, { color: GAME_COLOR }]}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.navLabel}>
          Pregunta {conductor.preguntaIndex + 1} / {conductor.totalPreguntas}
        </Text>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>⏱ {tiempoSegundos}s</Text>
        </View>
      </View>

      {/* Progress dots */}
      <View style={styles.dots}>
        {Array.from({ length: conductor.totalPreguntas }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i < conductor.preguntaIndex
                    ? GAME_COLOR
                    : i === conductor.preguntaIndex
                    ? GAME_COLOR + '66'
                    : Colors.border,
              },
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* TTS hint */}
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>
            🔊 Mantén presionada cualquier palabra para escucharla
          </Text>
        </View>

        {/* Story text — each word is long-pressable */}
        <View style={styles.textCard}>
          <TappableText
            text={conductor.texto}
            onLongPressWord={conductor.hablarPalabra}
            style={styles.storyWord}
          />
        </View>

        {/* Sentence with blank */}
        {pregunta && (
          <>
            <View style={styles.sentenceBox}>
              <TappableText
                text={pregunta.pregunta}
                onLongPressWord={conductor.hablarPalabra}
                style={styles.sentenceWord}
              />
            </View>

            {/* Lexy */}
            <LexyCharacter mood={lexyMood} size={64} message={lexyMsg} />

            {/* Options */}
            <View style={styles.optionsGrid}>
              {pregunta.opciones.map((opcion) => {
                const state = opcionResultado[opcion];
                return (
                  <TouchableOpacity
                    key={opcion}
                    style={[
                      styles.optionBtn,
                      { borderColor: GAME_COLOR },
                      state === 'correcto' && styles.optionCorrect,
                      state === 'incorrecto' && styles.optionError,
                    ]}
                    onPress={() => handleOpcion(opcion)}
                    onLongPress={() => conductor.hablarPalabra(opcion)}
                    disabled={answered}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        state === 'correcto' && { color: Colors.success },
                        state === 'incorrecto' && { color: Colors.error },
                        !state && { color: Colors.textPrimary },
                      ]}
                    >
                      {opcion}
                    </Text>
                    {state === 'correcto' && <Text style={styles.stateIcon}>✓</Text>}
                    {state === 'incorrecto' && <Text style={styles.stateIcon}>✗</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 20,
    alignItems: 'center',
  },
  hintBox: {
    backgroundColor: Colors.lexyPurpleLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
  },
  hintText: {
    fontSize: 14,
    color: Colors.lexyPurpleDark,
    fontFamily: 'OpenDyslexic',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  textCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: GAME_COLOR + '55',
    padding: 20,
    width: '100%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  tappableRow: { flexDirection: 'row', flexWrap: 'wrap' },
  tappableWord: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic',
    letterSpacing: 0.8,
    lineHeight: 34,
    color: Colors.textPrimary,
  },
  storyWord: { fontSize: 20 },
  sentenceBox: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: GAME_COLOR,
    padding: 20,
    width: '100%',
  },
  sentenceWord: {
    fontSize: 22,
    fontFamily: 'OpenDyslexic-Bold',
    letterSpacing: 1.0,
    lineHeight: 36,
    color: Colors.textPrimary,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    width: '100%',
  },
  optionBtn: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 2.5,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 24,
    minWidth: '28%',
    alignItems: 'center',
    gap: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  optionCorrect: { backgroundColor: Colors.successLight, borderColor: Colors.success },
  optionError: { backgroundColor: Colors.errorLight, borderColor: Colors.error },
  optionText: {
    fontSize: 22,
    fontFamily: 'OpenDyslexic-Bold',
    letterSpacing: 1.0,
    textAlign: 'center',
  },
  stateIcon: { fontSize: 18 },
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
