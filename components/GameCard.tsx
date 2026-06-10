import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/fonts';
import type { TipoJuego } from '../types/juegos';

interface GameCardProps {
  tipoJuego: TipoJuego;
  titulo: string;
  descripcion: string;
  emoji: string;
  nivelesCompletados: number;
  totalNiveles: number;
  onPress: () => void;
}

const CARD_COLOR: Record<TipoJuego, string> = {
  cazador_silabas: Colors.cazadorSilabas,
  palabras_gemelas: Colors.palabrasGemelas,
  intruso_rimas: Colors.intrusoRimas,
  conductor_texto: Colors.conductorTexto,
  memotest: Colors.memotest,
  carrera_lectura: Colors.carreraLectura,
};

export function GameCard({
  tipoJuego,
  titulo,
  descripcion,
  emoji,
  nivelesCompletados,
  totalNiveles,
  onPress,
}: GameCardProps) {
  const color = CARD_COLOR[tipoJuego];
  const progreso = totalNiveles > 0 ? nivelesCompletados / totalNiveles : 0;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: color, borderLeftWidth: 6 }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Ícono */}
      <View style={[styles.iconWrapper, { backgroundColor: color + '22' }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>

        {/* Barra de progreso */}
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progreso * 100}%`, backgroundColor: color },
              ]}
            />
          </View>
          <Text style={[styles.progressLabel, { color }]}>
            {nivelesCompletados}/{totalNiveles}
          </Text>
        </View>
      </View>

      {/* Flecha */}
      <Text style={[styles.arrow, { color }]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  titulo: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  descripcion: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    ...Typography.caption,
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'right',
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },
});
