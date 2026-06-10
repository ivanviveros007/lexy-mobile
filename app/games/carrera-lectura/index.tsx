import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Easing,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSetAtom, useAtomValue } from 'jotai';
import { useNiveles } from '../../../hooks/useNiveles';
import { useGameLogic } from '../../../hooks/useGameLogic';
import { LexyCharacter } from '../../../components/LexyCharacter';
import { iniciarPartidaAtom, estadoPartidaAtom } from '../../../atoms/gameAtom';
import { getNivelIndex, saveNivelIndex } from '../../../services/progresoLocal';
import { mensajeVictoria, mensajeVictoriaFinal, mensajeAliento, mensajeAcierto } from '../../../services/mensajesLexy';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/fonts';
import type { ConfigCarreraLectura } from '../../../types/juegos';

const GAME_COLOR = Colors.carreraLectura;
const DINO_IMG = require('../../../assets/memotest/dino.jpg');
const AUTO_IMG = require('../../../assets/memotest/auto.jpg');
const AVATAR = 48;
const MSG_INICIAL = 'Leé cada palabra en voz alta y tocá el botón. ¡No dejes que el auto te alcance! 🏁';

export default function CarreraLecturaScreen() {
  const router = useRouter();
  const iniciarPartida = useSetAtom(iniciarPartidaAtom);
  const estadoPartida = useAtomValue(estadoPartidaAtom);

  const { niveles, loading, error } = useNiveles('carrera_lectura');

  const [nivelIndex, setNivelIndex] = useState(0);
  const [indexLoaded, setIndexLoaded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const [lexyMsg, setLexyMsg] = useState(MSG_INICIAL);

  const dinoAnim = useRef(new Animated.Value(0)).current;
  const autoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getNivelIndex('carrera_lectura').then((i) => {
      setNivelIndex(i);
      setIndexLoaded(true);
    });
  }, []);

  const idx = niveles.length > 0 ? Math.min(nivelIndex, niveles.length - 1) : nivelIndex;
  const nivel = indexLoaded ? (niveles[idx] ?? null) : null;
  const config = nivel?.configuracion as ConfigCarreraLectura | undefined;
  const isLastLevel = idx >= niveles.length - 1;

  const { responder, aciertos, tiempoSegundos } = useGameLogic();

  const total = config?.palabras.length ?? 0;
  const tiempoLimite = nivel?.tiempoLimiteSegundos ?? 1;
  const palabraActual = config?.palabras[Math.min(aciertos, Math.max(0, total - 1))] ?? '';

  useEffect(() => {
    if (nivel && !gameStarted) {
      iniciarPartida(nivel);
      dinoAnim.setValue(0);
      autoAnim.setValue(0);
      setGameStarted(true);
    }
  }, [nivel, gameStarted]);

  // Marca el nivel como completado apenas se gana
  useEffect(() => {
    if (estadoPartida === 'ganada') {
      saveNivelIndex('carrera_lectura', idx + 1);
    }
  }, [estadoPartida, idx]);

  // El dino avanza con cada palabra leída
  const usable = Math.max(0, trackWidth - AVATAR - 8);
  useEffect(() => {
    if (!total || !usable) return;
    Animated.timing(dinoAnim, {
      toValue: (aciertos / total) * usable,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [aciertos, total, usable]);

  // El auto rival avanza con el reloj, un segundo por vez
  useEffect(() => {
    if (!usable || estadoPartida !== 'jugando') return;
    Animated.timing(autoAnim, {
      toValue: Math.min(1, tiempoSegundos / tiempoLimite) * usable,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [tiempoSegundos, usable, tiempoLimite, estadoPartida]);

  const resultadoMsg = useMemo(() => {
    if (estadoPartida === 'ganada') {
      return isLastLevel
        ? mensajeVictoriaFinal()
        : `${mensajeVictoria()} ¡Le ganaste al auto en ${tiempoSegundos}s! 🏁`;
    }
    if (estadoPartida === 'perdida') {
      return `El auto llegó primero esta vez… ${mensajeAliento()}`;
    }
    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoPartida]);

  const handleNextLevel = useCallback(async () => {
    const next = idx + 1;
    await saveNivelIndex('carrera_lectura', next);
    setNivelIndex(next);
    setGameStarted(false);
    setLexyMsg(MSG_INICIAL);
  }, [idx]);

  const handleRetry = useCallback(() => {
    setGameStarted(false);
    setLexyMsg(MSG_INICIAL);
  }, []);

  const handleLeida = useCallback(() => {
    if (estadoPartida !== 'jugando' || !palabraActual) return;
    responder(palabraActual, palabraActual);
    if ((aciertos + 1) % 5 === 0) {
      setLexyMsg(mensajeAcierto());
    }
  }, [estadoPartida, palabraActual, responder, aciertos]);

  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
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
              {gano ? (isLastLevel ? '¡Al inicio! 🏠' : 'Volver al inicio') : '¡Revancha! 🦖'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.navText, { color: GAME_COLOR }]}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.navLabel}>
          Nivel {idx + 1} · Palabra {Math.min(aciertos + 1, total)}/{total}
        </Text>
      </View>

      {/* Pista de carrera */}
      <View style={styles.pista} onLayout={onTrackLayout}>
        <View style={styles.lane}>
          <Text style={styles.laneLabel}>Male</Text>
          <View style={styles.laneTrack}>
            <View style={styles.metaLine} />
            <Text style={styles.metaFlag}>🏁</Text>
            <Animated.View style={[styles.avatarWrap, { transform: [{ translateX: dinoAnim }] }]}>
              <Image source={DINO_IMG} style={styles.avatar} resizeMode="cover" />
            </Animated.View>
          </View>
        </View>

        <View style={styles.lane}>
          <Text style={styles.laneLabel}>Auto</Text>
          <View style={styles.laneTrack}>
            <View style={styles.metaLine} />
            <Text style={styles.metaFlag}>🏁</Text>
            <Animated.View style={[styles.avatarWrap, { transform: [{ translateX: autoAnim }] }]}>
              <Image source={AUTO_IMG} style={styles.avatar} resizeMode="cover" />
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Palabra a leer */}
      <View style={styles.wordArea}>
        <View style={[styles.wordCard, { borderColor: GAME_COLOR }]}>
          <Text style={styles.wordText}>{palabraActual}</Text>
        </View>

        <TouchableOpacity
          style={[styles.btnLeida, { backgroundColor: GAME_COLOR }]}
          onPress={handleLeida}
          activeOpacity={0.8}
        >
          <Text style={styles.btnLeidaText}>¡La leí! ✅</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.lexyRow}>
        <LexyCharacter mood="happy" size={52} message={lexyMsg} />
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
  pista: {
    marginHorizontal: 20,
    marginTop: 14,
    gap: 10,
  },
  lane: { gap: 2 },
  laneLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 4,
  },
  laneTrack: {
    height: AVATAR + 12,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: GAME_COLOR + '44',
    justifyContent: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  metaLine: {
    position: 'absolute',
    right: AVATAR / 2 + 4,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: GAME_COLOR + '55',
  },
  metaFlag: { position: 'absolute', right: 6, top: 4, fontSize: 18 },
  avatarWrap: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    borderWidth: 2,
    borderColor: GAME_COLOR,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  avatar: { width: '100%', height: '100%' },
  wordArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  wordCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 24,
    borderWidth: 3,
    paddingVertical: 30,
    paddingHorizontal: 24,
    minWidth: '80%',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  wordText: {
    fontSize: 38,
    fontFamily: 'OpenDyslexic-Bold',
    color: Colors.textPrimary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  btnLeida: {
    width: '90%',
    paddingVertical: 22,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  btnLeidaText: { fontSize: 24, color: '#FFFFFF', fontFamily: 'OpenDyslexic-Bold', letterSpacing: 1 },
  lexyRow: { paddingHorizontal: 24, paddingBottom: 14, alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 32 },
  errorText: { ...Typography.body, color: Colors.error, textAlign: 'center' },
  btnOutline: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 20, borderWidth: 2, borderColor: GAME_COLOR, width: '100%', alignItems: 'center' },
  btnOutlineText: { fontSize: 18, fontFamily: 'OpenDyslexic' },
  btnPrimary: { paddingVertical: 18, paddingHorizontal: 40, borderRadius: 24, width: '100%', alignItems: 'center' },
  btnPrimaryText: { fontSize: 20, color: '#FFFFFF', fontFamily: 'OpenDyslexic-Bold', letterSpacing: 0.5 },
});
