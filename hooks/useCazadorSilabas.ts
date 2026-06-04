import { useState, useCallback, useEffect } from 'react';
import * as Speech from 'expo-speech';
import type { ConfigCazadorSilabas, PalabraConSilabas } from '../types/juegos';

export interface SilabaItem {
  id: string;
  texto: string;
  indiceOriginal: number;
}

export type ResultadoSilaba = 'correcto' | 'incorrecto' | 'palabra_completa';

interface UseCazadorSilabasResult {
  palabraActual: PalabraConSilabas | null;
  palabraIndex: number;
  totalPalabras: number;
  silabasDisponibles: SilabaItem[];
  silabasColocadas: string[];
  wrongId: string | null;
  tocarSilaba: (item: SilabaItem) => ResultadoSilaba;
  avanzarPalabra: () => void;
  juegoTerminado: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function useCazadorSilabas(config: ConfigCazadorSilabas, resetKey: string = ''): UseCazadorSilabasResult {
  const [palabraIndex, setPalabraIndex] = useState(0);
  const [silabasColocadas, setSilabasColocadas] = useState<string[]>([]);
  const [silabasDisponibles, setSilabasDisponibles] = useState<SilabaItem[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => {
    setPalabraIndex(0);
    setSilabasColocadas([]);
    setSilabasDisponibles([]);
  }, [resetKey]);

  const palabraActual = config.palabras[palabraIndex] ?? null;
  const juegoTerminado = palabraIndex >= config.palabras.length;

  useEffect(() => {
    if (!palabraActual) return;
    const items: SilabaItem[] = palabraActual.silabas.map((texto, i) => ({
      id: `p${palabraIndex}-s${i}-${Date.now()}`,
      texto,
      indiceOriginal: i,
    }));
    setSilabasDisponibles(shuffle(items));
    setSilabasColocadas([]);
  }, [palabraIndex, palabraActual?.palabra]);

  const tocarSilaba = useCallback(
    (item: SilabaItem): ResultadoSilaba => {
      if (!palabraActual) return 'incorrecto';
      const esperado = silabasColocadas.length;

      if (item.indiceOriginal === esperado) {
        const nuevasColocadas = [...silabasColocadas, item.texto];
        setSilabasColocadas(nuevasColocadas);
        setSilabasDisponibles((prev) => prev.filter((s) => s.id !== item.id));
        if (nuevasColocadas.length === palabraActual.silabas.length) {
          return 'palabra_completa';
        }
        return 'correcto';
      } else {
        Speech.speak(item.texto, { language: 'es-ES', rate: 0.8 });
        setWrongId(item.id);
        setTimeout(
          () => setWrongId((prev) => (prev === item.id ? null : prev)),
          700,
        );
        return 'incorrecto';
      }
    },
    [palabraActual, silabasColocadas],
  );

  const avanzarPalabra = useCallback(() => {
    setPalabraIndex((prev) => prev + 1);
  }, []);

  return {
    palabraActual,
    palabraIndex,
    totalPalabras: config.palabras.length,
    silabasDisponibles,
    silabasColocadas,
    wrongId,
    tocarSilaba,
    avanzarPalabra,
    juegoTerminado,
  };
}
