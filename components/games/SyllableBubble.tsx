import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/colors';

interface SyllableBubbleProps {
  texto: string;
  color: string;
  onPress: () => void;
  isWrong: boolean;
  floatDelay?: number;
}

export function SyllableBubble({
  texto,
  color,
  onPress,
  isWrong,
  floatDelay = 0,
}: SyllableBubbleProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Gentle floating loop
  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    );
    const timeout = setTimeout(() => float.start(), floatDelay);
    return () => {
      clearTimeout(timeout);
      float.stop();
    };
  }, []);

  // Shake + scale pulse on wrong tap
  useEffect(() => {
    if (!isWrong) return;
    Animated.sequence([
      Animated.timing(translateX, { toValue: -14, duration: 55, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 14, duration: 55, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 10, duration: 55, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.18, duration: 90, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.0, duration: 130, useNativeDriver: true }),
    ]).start();
  }, [isWrong]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { transform: [{ translateY }, { translateX }, { scale }] },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.bubble,
          { backgroundColor: color + '20', borderColor: color },
        ]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <Text style={[styles.texto, { color }]}>{texto}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 8,
  },
  bubble: {
    borderWidth: 3,
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 88,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  texto: {
    fontSize: 28,
    fontFamily: 'OpenDyslexic-Bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
});
