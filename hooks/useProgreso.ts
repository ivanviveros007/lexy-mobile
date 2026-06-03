import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { api } from '../services/api';
import { actualizarEstadisticasAtom } from '../atoms/userAtom';
import type {
  ProgresoCompletarPayload,
  ProgresoCompletarResponse,
} from '../types/juegos';

interface UseProgresoResult {
  completarNivel: (payload: ProgresoCompletarPayload) => Promise<ProgresoCompletarResponse | null>;
  loading: boolean;
  error: string | null;
}

export function useProgreso(): UseProgresoResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const actualizarEstadisticas = useSetAtom(actualizarEstadisticasAtom);

  const completarNivel = async (
    payload: ProgresoCompletarPayload,
  ): Promise<ProgresoCompletarResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.completarNivel(payload);

      // Actualiza el átomo global de estadísticas con la respuesta del backend
      actualizarEstadisticas(response.nuevasEstadisticas);

      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { completarNivel, loading, error };
}
