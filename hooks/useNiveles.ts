import { useState, useEffect } from 'react';
import { api } from '../services/api';
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
        if (!cancelled) setNiveles(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
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
