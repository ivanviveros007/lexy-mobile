import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { getNivelesLocales } from '../services/localNiveles';
import type { Nivel, TipoJuego } from '../types/juegos';

interface UseNivelesResult {
  niveles: Nivel[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNiveles(tipoJuego: TipoJuego): UseNivelesResult {
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    api
      .getNiveles(tipoJuego)
      .then((data) => {
        if (cancelled) return;
        // If backend returns empty array, fall back to local seed
        if (data.length > 0) {
          setNiveles(data);
        } else {
          setNiveles(getNivelesLocales(tipoJuego));
        }
      })
      .catch(() => {
        // Backend unavailable — use local seed data silently
        if (!cancelled) setNiveles(getNivelesLocales(tipoJuego));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tipoJuego, tick]);

  return { niveles, loading, error, refetch: () => setTick((t) => t + 1) };
}
