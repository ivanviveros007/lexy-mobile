import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getAllProgress } from '../services/progresoLocal';
import { TOTAL_NIVELES_LOCALES } from '../services/localNiveles';
import type { TipoJuego } from '../types/juegos';

interface ProgresoJuego {
  nivelesCompletados: number;
  totalNiveles: number;
}

type ProgresoMap = Record<TipoJuego, ProgresoJuego>;

export function useProgresoLocal() {
  const [progreso, setProgreso] = useState<ProgresoMap | null>(null);

  const cargar = useCallback(async () => {
    const indexes = await getAllProgress();
    const map = Object.fromEntries(
      Object.entries(indexes).map(([tipo, index]) => [
        tipo,
        {
          nivelesCompletados: index,
          totalNiveles: TOTAL_NIVELES_LOCALES[tipo as TipoJuego] ?? 0,
        },
      ]),
    ) as ProgresoMap;
    setProgreso(map);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  return progreso;
}
