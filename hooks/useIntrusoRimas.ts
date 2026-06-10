import { useState, useCallback, useEffect } from 'react';
import type { ConfigIntrusoRimas, GrupoRimas } from '../types/juegos';

export interface PalabraRimaItem {
  id: string;
  texto: string;
  esIntruso: boolean;
}

interface UseIntrusoRimasResult {
  grupoActual: GrupoRimas | null;
  grupoIndex: number;
  totalGrupos: number;
  palabrasMezcladas: PalabraRimaItem[];
  responderPalabra: (item: PalabraRimaItem) => 'correcto' | 'incorrecto';
  avanzarGrupo: () => void;
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

export function useIntrusoRimas(config: ConfigIntrusoRimas, resetKey: string = ''): UseIntrusoRimasResult {
  const [grupoIndex, setGrupoIndex] = useState(0);
  const [palabrasMezcladas, setPalabrasMezcladas] = useState<PalabraRimaItem[]>([]);

  useEffect(() => {
    setGrupoIndex(0);
    setPalabrasMezcladas([]);
  }, [resetKey]);

  const grupoActual = config.grupos[grupoIndex] ?? null;
  const juegoTerminado = grupoIndex >= config.grupos.length;

  useEffect(() => {
    if (!grupoActual) return;
    const items: PalabraRimaItem[] = [
      ...grupoActual.palabras.map((p, i) => ({
        id: `g${grupoIndex}-p${i}`,
        texto: p,
        esIntruso: false,
      })),
      { id: `g${grupoIndex}-intruso`, texto: grupoActual.intruso, esIntruso: true },
    ];
    setPalabrasMezcladas(shuffle(items));
  }, [grupoIndex, grupoActual?.palabras[0], resetKey]);

  const responderPalabra = useCallback(
    (item: PalabraRimaItem): 'correcto' | 'incorrecto' =>
      item.esIntruso ? 'correcto' : 'incorrecto',
    [],
  );

  const avanzarGrupo = useCallback(() => {
    setGrupoIndex((prev) => prev + 1);
  }, []);

  return {
    grupoActual,
    grupoIndex,
    totalGrupos: config.grupos.length,
    palabrasMezcladas,
    responderPalabra,
    avanzarGrupo,
    juegoTerminado,
  };
}
