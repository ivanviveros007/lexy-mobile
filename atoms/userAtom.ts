import { atom } from 'jotai';
import type { Usuario, EstadisticasUsuario } from '../types/juegos';

// Átomo raíz — null mientras no hay sesión activa
export const usuarioAtom = atom<Usuario | null>(null);

// Átomos derivados de solo lectura
export const puntosAtom = atom<number>(
  (get) => get(usuarioAtom)?.estadisticas.puntosTotales ?? 0,
);

export const rachaActualAtom = atom<number>(
  (get) => get(usuarioAtom)?.estadisticas.rachaActual ?? 0,
);

export const rachaMaximaAtom = atom<number>(
  (get) => get(usuarioAtom)?.estadisticas.rachaMaxima ?? 0,
);

export const nivelesCompletadosAtom = atom<number>(
  (get) => get(usuarioAtom)?.estadisticas.nivelesCompletados ?? 0,
);

// Átomo de escritura — actualiza solo las estadísticas sin reemplazar todo el usuario
export const actualizarEstadisticasAtom = atom(
  null,
  (get, set, nuevasEstadisticas: EstadisticasUsuario) => {
    const usuario = get(usuarioAtom);
    if (!usuario) return;
    set(usuarioAtom, { ...usuario, estadisticas: nuevasEstadisticas });
  },
);
