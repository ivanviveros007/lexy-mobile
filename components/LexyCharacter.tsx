import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export type LexyMood = 'neutral' | 'happy' | 'celebrating' | 'encouraging' | 'thinking';

interface Props {
  mood?: LexyMood;
  size?: number;
  message?: string;
}

// Expresiones de Lexy con emoji hasta que se integre el asset SVG/Lottie definitivo
const MOOD_EXPRESSION: Record<LexyMood, string> = {
  neutral: '😊',
  happy: '😄',
  celebrating: '🎉',
  encouraging: '💪',
  thinking: '🤔',
};

const MOOD_COLOR: Record<LexyMood, string> = {
  neutral: Colors.lexyPurple,
  happy: Colors.success,
  celebrating: Colors.streakGold,
  encouraging: Colors.cazadorSilabas,
  thinking: Colors.palabrasGemelas,
};

export function LexyCharacter({ mood = 'neutral', size = 80, message }: Props) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: MOOD_COLOR[mood] + '22',
            borderColor: MOOD_COLOR[mood],
          },
        ]}
      >
        <Text style={{ fontSize: size * 0.55 }}>{MOOD_EXPRESSION[mood]}</Text>
      </View>

      {message ? (
        <View style={[styles.bubble, { borderColor: MOOD_COLOR[mood] }]}>
          <Text style={styles.bubbleText}>{message}</Text>
          <View style={[styles.bubbleTail, { borderTopColor: MOOD_COLOR[mood] }]} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: 240,
    position: 'relative',
  },
  bubbleText: {
    fontSize: 16,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
