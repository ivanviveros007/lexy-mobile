import { useState, useCallback, useEffect } from 'react';
import type { CartaMemotest, ConfigMemotest } from '../types/juegos';

export type ResultadoVolteo = 'ignorada' | 'primera' | 'pareja' | 'fallo';

interface UseMemotestResult {
  cartas: CartaMemotest[];
  volteadas: string[]; // ids boca arriba sin emparejar (máx. 2)
  emparejadas: string[]; // pairIds ya encontrados
  paresTotales: number;
  paresEncontrados: number;
  intentos: number;
  voltear: (carta: CartaMemotest) => ResultadoVolteo;
  cerrarVolteadas: () => void;
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

export function useMemotest(config: ConfigMemotest, resetKey: string = ''): UseMemotestResult {
  const [cartas, setCartas] = useState<CartaMemotest[]>([]);
  const [volteadas, setVolteadas] = useState<string[]>([]);
  const [emparejadas, setEmparejadas] = useState<string[]>([]);
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    setCartas(shuffle(config.cartas));
    setVolteadas([]);
    setEmparejadas([]);
    setIntentos(0);
  }, [resetKey, config.cartas[0]?.id]);

  const paresTotales = config.cartas.length / 2;
  const paresEncontrados = emparejadas.length;
  const juegoTerminado = paresTotales > 0 && paresEncontrados >= paresTotales;

  const voltear = useCallback(
    (carta: CartaMemotest): ResultadoVolteo => {
      if (
        volteadas.length >= 2 ||
        volteadas.includes(carta.id) ||
        emparejadas.includes(carta.pairId)
      ) {
        return 'ignorada';
      }

      if (volteadas.length === 0) {
        setVolteadas([carta.id]);
        return 'primera';
      }

      const primera = cartas.find((c) => c.id === volteadas[0]);
      setVolteadas([volteadas[0], carta.id]);
      setIntentos((n) => n + 1);

      if (primera && primera.pairId === carta.pairId) {
        setEmparejadas((prev) => [...prev, carta.pairId]);
        setVolteadas([]);
        return 'pareja';
      }
      return 'fallo';
    },
    [cartas, volteadas, emparejadas],
  );

  const cerrarVolteadas = useCallback(() => setVolteadas([]), []);

  return {
    cartas,
    volteadas,
    emparejadas,
    paresTotales,
    paresEncontrados,
    intentos,
    voltear,
    cerrarVolteadas,
    juegoTerminado,
  };
}
