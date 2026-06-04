import { useState, useCallback, useEffect } from 'react';
import * as Speech from 'expo-speech';
import type { ConfigPalabrasGemelas, ParPalabras } from '../types/juegos';

interface UsePalabrasGemelasResult {
  parActual: ParPalabras | null;
  parIndex: number;
  totalPares: number;
  responderPar: (esSiGemelas: boolean) => 'correcto' | 'incorrecto';
  avanzarPar: () => void;
  juegoTerminado: boolean;
}

export function usePalabrasGemelas(config: ConfigPalabrasGemelas, resetKey: string = ''): UsePalabrasGemelasResult {
  const [parIndex, setParIndex] = useState(0);

  useEffect(() => {
    setParIndex(0);
  }, [resetKey]);

  const parActual = config.pares[parIndex] ?? null;
  const juegoTerminado = parIndex >= config.pares.length;

  const responderPar = useCallback(
    (esSiGemelas: boolean): 'correcto' | 'incorrecto' => {
      if (!parActual) return 'incorrecto';
      const esCorrecta = esSiGemelas === parActual.sonGemelas;
      if (esCorrecta) {
        Speech.speak(parActual.palabraA, { language: 'es-ES', rate: 0.85 });
      }
      return esCorrecta ? 'correcto' : 'incorrecto';
    },
    [parActual],
  );

  const avanzarPar = useCallback(() => {
    setParIndex((prev) => prev + 1);
  }, []);

  return {
    parActual,
    parIndex,
    totalPares: config.pares.length,
    responderPar,
    avanzarPar,
    juegoTerminado,
  };
}
