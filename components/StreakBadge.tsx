import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  racha: number;
}

export function StreakBadge({ racha }: Props) {
  const color = racha >= 7 ? Colors.streakGold : racha >= 3 ? Colors.cazadorSilabas : Colors.lexyPurple;

  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={[styles.count, { color }]}>{racha}</Text>
      <Text style={[styles.label, { color }]}>días</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  fire: { fontSize: 20 },
  count: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
