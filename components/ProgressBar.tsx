import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  valor: number;      // 0–1
  color?: string;
  label?: string;
  height?: number;
}

export function ProgressBar({ valor, color = Colors.lexyPurple, label, height = 10 }: Props) {
  const pct = Math.max(0, Math.min(1, valor));

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            { width: `${pct * 100}%`, backgroundColor: color, height },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 4 },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 0.4,
  },
  track: {
    backgroundColor: Colors.border,
    borderRadius: 99,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 99,
  },
});
