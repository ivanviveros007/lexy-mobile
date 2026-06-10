import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSetAtom, useAtomValue } from 'jotai';
import { useMemotest } from '../../../hooks/useMemotest';
import { useNiveles } from '../../../hooks/useNiveles';
import { useGameLogic } from '../../../hooks/useGameLogic';
import { LexyCharacter } from '../../../components/LexyCharacter';
import { iniciarPartidaAtom, estadoPartidaAtom } from '../../../atoms/gameAtom';
import { getNivelIndex, saveNivelIndex } from '../../../services/progresoLocal';
import { mensajeVictoria, mensajeVictoriaFinal, mensajeAliento, mensajeAcierto } from '../../../services/mensajesLexy';
import { MEMOTEST_IMAGES } from '../../../assets/memotest';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/fonts';
import type { CartaMemotest, ConfigMemotest } from '../../../types/juegos';

const GAME_COLOR = Colors.memotest;
const MSG_INICIAL = '¡Da vuelta las cartas y encuentra las parejas! 🧠';

// ── Carta con animación de flip ───────────────────────────────────────────────
function MemoCard({
  carta,
  faceUp,
  matched,
  size,
  onPress,
}: {
  carta: CartaMemotest;
  faceUp: boolean;
  matched: boolean;
  size: { width: number; height: number };
  onPress: () => void;
}) {
  const anim = useRef(new Animated.Value(faceUp ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: faceUp ? 1 : 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [faceUp, anim]);

  const frontRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  const imagen = MEMOTEST_IMAGES[carta.imagenUrl ?? carta.pairId];
  const wordSize = size.width > 130 ? 17 : size.width > 95 ? 14 : 12;

  return (
    <TouchableOpacity style={size} onPress={onPress} activeOpacity={0.85} disabled={faceUp}>
      {/* Dorso */}
      <Animated.View
        style={[
          styles.cardFace,
          styles.cardBack,
          { transform: [{ perspective: 800 }, { rotateY: frontRotate }] },
        ]}
      >
        <Text style={styles.cardBackText}>?</Text>
      </Animated.View>

      {/* Frente — dibujo + palabra */}
      <Animated.View
        style={[
          styles.cardFace,
          styles.cardFront,
          matched && styles.cardMatched,
          { transform: [{ perspective: 800 }, { rotateY: backRotate }] },
        ]}
      >
        <Image source={imagen} style={styles.cardImage} resizeMode="contain" />
        <Text style={[styles.cardWord, { fontSize: wordSize }, matched && { color: Colors.success }]}>
          {carta.contenido}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Pantalla ──────────────────────────────────────────────────────────────────
export default function MemotestScreen() {
  const router = useRouter();
  const iniciarPartida = useSetAtom(iniciarPartidaAtom);
  const estadoPartida = useAtomValue(estadoPartidaAtom);

  const { niveles, loading, error } = useNiveles('memotest');

  const [nivelIndex, setNivelIndex] = useState(0);
  const [indexLoaded, setIndexLoaded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const [gridArea, setGridArea] = useState({ width: 0, height: 0 });
  const [lexyMsg, setLexyMsg] = useState(MSG_INICIAL);
  const [lexyMood, setLexyMood] = useState<'thinking' | 'happy' | 'celebrating' | 'encouraging'>('thinking');

  useEffect(() => {
    getNivelIndex('memotest').then((i) => {
      setNivelIndex(i);
      setIndexLoaded(true);
    });
  }, []);

  // clamp: el índice guardado = niveles completados, puede ser igual al total
  const idx = niveles.length > 0 ? Math.min(nivelIndex, niveles.length - 1) : nivelIndex;
  const nivel = indexLoaded ? (niveles[idx] ?? null) : null;
  const config = nivel?.configuracion as ConfigMemotest | undefined;
  const isLastLevel = idx >= niveles.length - 1;

  const { responder, tiempoSegundos } = useGameLogic();
  const memo = useMemotest(
    config ?? { tipo: 'memotest', cartas: [], minAciertos: 1 },
    nivel?.id ?? '',
  );

  useEffect(() => {
    if (nivel && !gameStarted) {
      iniciarPartida(nivel);
      setGameStarted(true);
    }
  }, [nivel, gameStarted]);

  // Marca el nivel como completado apenas se gana
  useEffect(() => {
    if (estadoPartida === 'ganada') {
      saveNivelIndex('memotest', idx + 1);
    }
  }, [estadoPartida, idx]);

  const resultadoMsg = useMemo(() => {
    if (estadoPartida === 'ganada') {
      return isLastLevel
        ? mensajeVictoriaFinal()
        : `${mensajeVictoria()} ${memo.paresTotales} parejas en ${tiempoSegundos}s 🧠`;
    }
    if (estadoPartida === 'perdida') return mensajeAliento();
    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoPartida]);

  const handleNextLevel = useCallback(async () => {
    const next = idx + 1;
    await saveNivelIndex('memotest', next);
    setNivelIndex(next);
    setGameStarted(false);
    setBloqueado(false);
    setLexyMsg(MSG_INICIAL);
    setLexyMood('thinking');
  }, [idx]);

  const handleRetry = useCallback(() => {
    setGameStarted(false);
    setBloqueado(false);
    setLexyMsg(MSG_INICIAL);
    setLexyMood('thinking');
  }, []);

  const handleTapCarta = useCallback(
    (carta: CartaMemotest) => {
      if (bloqueado) return;

      const res = memo.voltear(carta);
      if (res === 'pareja') {
        responder(carta.pairId, carta.pairId);
        setLexyMsg(`${mensajeAcierto()} ¡Pareja de ${carta.contenido}!`);
        setLexyMood('celebrating');
      } else if (res === 'fallo') {
        setLexyMsg('¡Casi! Memoriza dónde está cada dibujo 🔍');
        setLexyMood('encouraging');
        setBloqueado(true);
        setTimeout(() => {
          memo.cerrarVolteadas();
          setBloqueado(false);
        }, 950);
      }
    },
    [bloqueado, memo, responder],
  );

  const onGridLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setGridArea({ width, height });
  }, []);

  if (loading || !indexLoaded) {
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
            message={resultadoMsg}
          />
          {gano && !isLastLevel && (
            <TouchableOpacity
              style={[styles.btnPrimary, { backgroundColor: GAME_COLOR }]}
              onPress={handleNextLevel}
            >
              <Text style={styles.btnPrimaryText}>¡Nivel {idx + 2}! ✨</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={gano && !isLastLevel ? styles.btnOutline : [styles.btnPrimary, { backgroundColor: GAME_COLOR }]}
            onPress={gano ? () => router.back() : handleRetry}
          >
            <Text style={gano && !isLastLevel ? [styles.btnOutlineText, { color: GAME_COLOR }] : styles.btnPrimaryText}>
              {gano ? (isLastLevel ? '¡Al inicio! 🏠' : 'Volver al inicio') : 'Intentar de nuevo'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Tamaño de carta según cuántas entran en la grilla
  const total = memo.cartas.length;
  const cols = total <= 6 ? 3 : 4;
  const rows = Math.ceil(total / cols);
  const GAP = 10;
  const cardWidth = gridArea.width
    ? Math.floor(
        Math.min(
          (gridArea.width - GAP * (cols - 1)) / cols,
          ((gridArea.height - GAP * (rows - 1)) / rows) * 0.78,
        ),
      )
    : 0;
  const cardSize = { width: cardWidth, height: Math.floor(cardWidth / 0.78) };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.navText, { color: GAME_COLOR }]}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.navLabel}>
          Nivel {idx + 1} · Parejas {memo.paresEncontrados}/{memo.paresTotales}
        </Text>
      </View>

      <View style={styles.dotsRow}>
        <View style={styles.dots}>
          {Array.from({ length: memo.paresTotales }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i < memo.paresEncontrados ? GAME_COLOR : Colors.border },
              ]}
            />
          ))}
        </View>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>⏱ {tiempoSegundos}s</Text>
        </View>
      </View>

      <View style={styles.gridArea} onLayout={onGridLayout}>
        {cardWidth > 0 && (
          <View style={[styles.grid, { gap: GAP, width: cardWidth * cols + GAP * (cols - 1) }]}>
            {memo.cartas.map((carta) => (
              <MemoCard
                key={`${nivel?.id}-${carta.id}`}
                carta={carta}
                faceUp={memo.volteadas.includes(carta.id) || memo.emparejadas.includes(carta.pairId)}
                matched={memo.emparejadas.includes(carta.pairId)}
                size={cardSize}
                onPress={() => handleTapCarta(carta)}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.lexyRow}>
        <LexyCharacter mood={lexyMood} size={56} message={lexyMsg} />
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
  navLabel: { ...Typography.body, color: Colors.textSecondary, fontFamily: 'OpenDyslexic', fontSize: 13 },
  timerBadge: {
    backgroundColor: Colors.lexyPurpleLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText: { fontSize: 14, color: Colors.lexyPurpleDark, fontFamily: 'OpenDyslexic' },
  dotsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 10, gap: 12 },
  dots: { flexDirection: 'row', gap: 8, flex: 1, justifyContent: 'center', flexWrap: 'wrap' },
  dot: { width: 12, height: 12, borderRadius: 6 },
  gridArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardFace: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardBack: {
    backgroundColor: GAME_COLOR,
    borderColor: GAME_COLOR,
  },
  cardBackText: { fontSize: 34, color: '#FFFFFF', fontFamily: 'OpenDyslexic-Bold' },
  cardFront: {
    backgroundColor: '#FFFFFF',
    borderColor: GAME_COLOR + '55',
    padding: 6,
    gap: 2,
  },
  cardMatched: { borderColor: Colors.success, backgroundColor: Colors.successLight },
  cardImage: { flex: 1, width: '100%', borderRadius: 10 },
  cardWord: {
    fontFamily: 'OpenDyslexic-Bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  lexyRow: { paddingHorizontal: 24, paddingBottom: 16, alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 32 },
  errorText: { ...Typography.body, color: Colors.error, textAlign: 'center' },
  btnOutline: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 20, borderWidth: 2, borderColor: GAME_COLOR, width: '100%', alignItems: 'center' },
  btnOutlineText: { fontSize: 18, fontFamily: 'OpenDyslexic' },
  btnPrimary: { paddingVertical: 18, paddingHorizontal: 40, borderRadius: 24, width: '100%', alignItems: 'center' },
  btnPrimaryText: { fontSize: 20, color: '#FFFFFF', fontFamily: 'OpenDyslexic-Bold', letterSpacing: 0.5 },
});
