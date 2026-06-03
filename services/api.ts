import type {
  Nivel,
  ProgresoCompletarPayload,
  ProgresoCompletarResponse,
} from '../types/juegos';
import type { TipoJuego } from '../types/juegos';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  getNiveles: (tipoJuego: TipoJuego): Promise<Nivel[]> =>
    request(`/niveles/${tipoJuego}`),

  getNivel: (tipoJuego: TipoJuego, nivelId: string): Promise<Nivel> =>
    request(`/niveles/${tipoJuego}/${nivelId}`),

  completarNivel: (
    payload: ProgresoCompletarPayload,
  ): Promise<ProgresoCompletarResponse> =>
    request('/progreso/completar', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
