import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getAllProgress, getStats } from '../services/progresoLocal';
import { TOTAL_NIVELES_LOCALES } from '../services/localNiveles';
import type { EstadisticasUsuario, TipoJuego } from '../types/juegos';

interface ProgresoJuego {
  nivelesCompletados: number;
  totalNiveles: number;
}

type ProgresoMap = Record<TipoJuego, ProgresoJuego>;

export function useProgresoLocal() {
  const [progreso, setProgreso] = useState<ProgresoMap | null>(null);
  const [stats, setStats] = useState<EstadisticasUsuario | null>(null);

  const cargar = useCallback(async () => {
    const [indexes, estadisticas] = await Promise.all([getAllProgress(), getStats()]);
    const map = Object.fromEntries(
      Object.entries(indexes).map(([tipo, index]) => {
        const total = TOTAL_NIVELES_LOCALES[tipo as TipoJuego] ?? 0;
        return [
          tipo,
          {
            // el índice guardado puede superar el total si se ganó el último nivel
            nivelesCompletados: Math.min(index, total),
            totalNiveles: total,
          },
        ];
      }),
    ) as ProgresoMap;
    setProgreso(map);
    setStats(estadisticas);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  return { progreso, stats };
}
