import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSetAtom, useAtomValue } from 'jotai';
import { useCazadorSilabas } from '../../../hooks/useCazadorSilabas';
import { useNiveles } from '../../../hooks/useNiveles';
import { useGameLogic } from '../../../hooks/useGameLogic';
import { SyllableBubble } from '../../../components/games/SyllableBubble';
import { LexyCharacter } from '../../../components/LexyCharacter';
import { iniciarPartidaAtom, estadoPartidaAtom } from '../../../atoms/gameAtom';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/fonts';
import type { ConfigCazadorSilabas } from '../../../types/juegos';

// Quick emoji map for seed words — no asset needed
const WORD_EMOJI: Record<string, string> = {
  gato: '🐱',
  luna: '🌙',
  silla: '🪑',
  pelota: '⚽',
  camino: '🛤️',
  verano: '☀️',
  dinosaurio: '🦕',
  mariposa: '🦋',
  zapato: '👟',
  caballo: '🐴',
};

const GAME_COLOR = Colors.cazadorSilabas;

export default function CazadorSilabasScreen() {
  const router = useRouter();
  const iniciarPartida = useSetAtom(iniciarPartidaAtom);
  const estadoPartida = useAtomValue(estadoPartidaAtom);

  const { niveles, loading, error } = useNiveles('cazador_silabas');
  const nivel = niveles[0] ?? null;
  const config = nivel?.configuracion as ConfigCazadorSilabas | undefined;

  const [gameStarted, setGameStarted] = useState(false);
  const [palabraResuelta, setPalabraResuelta] = useState(false);
  const [lexyMensaje, setLexyMensaje] = useState('¡Toca las sílabas en orden para armar la palabra! 🎯');
  const [lexyMood, setLexyMood] = useState<'thinking' | 'happy' | 'celebrating' | 'encouraging'>('thinking');

  const { responder, aciertos, errores, tiempoSegundos } = useGameLogic();

  const cazador = useCazadorSilabas(
    config ?? { tipo: 'cazador_silabas', palabras: [], minAciertos: 1 },
  );

  // Start game once nivel is loaded
  useEffect(() => {
    if (nivel && !gameStarted) {
      iniciarPartida(nivel);
      setGameStarted(true);
    }
  }, [nivel, gameStarted]);

  const handleTocarSilaba = useCallback(
    (item: Parameters<typeof cazador.tocarSilaba>[0]) => {
      if (palabraResuelta) return;

      const resultado = cazador.tocarSilaba(item);

      if (resultado === 'incorrecto') {
        setLexyMensaje(`"${item.texto}"… ¿va ahí? Escucha cómo suena 🎧`);
        setLexyMood('encouraging');
      } else if (resultado === 'correcto') {
        setLexyMensaje('¡Bien! Sigue así 👏');
        setLexyMood('happy');
      } else if (resultado === 'palabra_completa') {
        setPalabraResuelta(true);
        setLexyMensaje('¡PALABRA COMPLETA! ¡Genial! 🎉');
        setLexyMood('celebrating');

        // Count as acierto and advance to next word after short pause
        responder(
          cazador.palabraActual?.palabra ?? '',
          cazador.palabraActual?.palabra ?? '',
        );

        setTimeout(() => {
          cazador.avanzarPalabra();
          setPalabraResuelta(false);
          setLexyMensaje('¡Siguiente palabra! ¿Lista? 🚀');
          setLexyMood('thinking');
        }, 1200);
      }
    },
    [cazador, palabraResuelta, responder],
  );

  // ── Loading / Error ──────────────────────────────────────────────────────────
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
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>
            {error ?? 'No se pudo cargar el juego.'}
          </Text>
          <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
            <Text style={styles.btnBackText}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Game Over overlay ───────────────────────────────────────────────────────
  if (estadoPartida === 'ganada' || estadoPartida === 'perdida') {
    const gano = estadoPartida === 'ganada';
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerBox}>
          <LexyCharacter
            mood={gano ? 'celebrating' : 'encouraging'}
            size={100}
            message={
              gano
                ? `¡Lo lograste! 🌟 Armaste ${aciertos} ${aciertos === 1 ? 'palabra' : 'palabras'} en ${tiempoSegundos}s`
                : '¡Muy bien intentado! Vamos de nuevo 💪'
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

  const palabra = cazador.palabraActual;
  const emoji = palabra ? (WORD_EMOJI[palabra.palabra.toLowerCase()] ?? '🔤') : '🔤';

  // ── Game UI ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.progressLabel}>
          Palabra {cazador.palabraIndex + 1} / {cazador.totalPalabras}
        </Text>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>⏱ {tiempoSegundos}s</Text>
        </View>
      </View>

      {/* Progress dots */}
      <View style={styles.dots}>
        {Array.from({ length: cazador.totalPalabras }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i < cazador.palabraIndex
                    ? GAME_COLOR
                    : i === cazador.palabraIndex
                    ? GAME_COLOR + '66'
                    : Colors.border,
              },
            ]}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Word image / emoji */}
        <View style={styles.imageBox}>
          <Text style={styles.wordEmoji}>{emoji}</Text>
        </View>

        {/* Answer slots */}
        {palabra && (
          <View style={styles.slotsRow}>
            {palabra.silabas.map((silaba, i) => {
              const colocada = cazador.silabasColocadas[i];
              return (
                <View
                  key={i}
                  style={[
                    styles.slot,
                    colocada
                      ? { backgroundColor: GAME_COLOR + '22', borderColor: GAME_COLOR }
                      : styles.slotEmpty,
                  ]}
                >
                  <Text
                    style={[
                      styles.slotText,
                      { color: colocada ? GAME_COLOR : Colors.textMuted },
                    ]}
                  >
                    {colocada ?? silaba.replace(/./g, '_')}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Lexy feedback */}
        <View style={styles.lexyRow}>
          <LexyCharacter mood={lexyMood} size={64} message={lexyMensaje} />
        </View>

        {/* Floating bubbles */}
        <View style={styles.bubblesArea}>
          <View style={styles.bubblesWrap}>
            {cazador.silabasDisponibles.map((item, i) => (
              <SyllableBubble
                key={item.id}
                texto={item.texto}
                color={GAME_COLOR}
                onPress={() => handleTocarSilaba(item)}
                isWrong={cazador.wrongId === item.id}
                floatDelay={i * 200}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundCream,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: 4 },
  backText: {
    fontSize: 17,
    color: GAME_COLOR,
    fontFamily: 'OpenDyslexic',
  },
  progressLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontFamily: 'OpenDyslexic',
  },
  timerBadge: {
    backgroundColor: Colors.lexyPurpleLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText: {
    fontSize: 14,
    color: Colors.lexyPurpleDark,
    fontFamily: 'OpenDyslexic',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 24,
  },
  imageBox: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: GAME_COLOR + '18',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderWidth: 3,
    borderColor: GAME_COLOR + '40',
  },
  wordEmoji: {
    fontSize: 80,
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  slot: {
    borderWidth: 2.5,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 64,
    alignItems: 'center',
  },
  slotEmpty: {
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  slotText: {
    fontSize: 26,
    fontFamily: 'OpenDyslexic-Bold',
    letterSpacing: 2,
  },
  lexyRow: {
    width: '100%',
    alignItems: 'center',
  },
  bubblesArea: {
    width: '100%',
    minHeight: 180,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
    padding: 16,
  },
  bubblesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ─── Shared non-game screens ─────────────────────────────────────────────
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 32,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
    textAlign: 'center',
  },
  btnBack: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: GAME_COLOR,
  },
  btnBackText: {
    fontSize: 18,
    color: GAME_COLOR,
    fontFamily: 'OpenDyslexic',
  },
  btnPrimary: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 24,
  },
  btnPrimaryText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    letterSpacing: 0.5,
  },
});
