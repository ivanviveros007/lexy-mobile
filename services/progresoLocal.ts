import AsyncStorage from '@react-native-async-storage/async-storage';
import type { EstadisticasUsuario, TipoJuego } from '../types/juegos';

const key = (t: TipoJuego) => `lexy:nivel:${t}`;
const STATS_KEY = 'lexy:stats';

export async function getNivelIndex(tipo: TipoJuego): Promise<number> {
  try {
    const v = await AsyncStorage.getItem(key(tipo));
    return v !== null ? parseInt(v, 10) : 0;
  } catch {
    return 0;
  }
}

export async function saveNivelIndex(tipo: TipoJuego, index: number): Promise<void> {
  try {
    const actual = await getNivelIndex(tipo);
    // nunca retroceder: el índice guardado = niveles completados
    if (index > actual) {
      await AsyncStorage.setItem(key(tipo), String(index));
    }
  } catch {}
}

const GAME_TYPES: TipoJuego[] = [
  'cazador_silabas',
  'palabras_gemelas',
  'intruso_rimas',
  'conductor_texto',
  'memotest',
  'carrera_lectura',
];

export async function getAllProgress(): Promise<Record<TipoJuego, number>> {
  const values = await Promise.all(GAME_TYPES.map(getNivelIndex));
  return Object.fromEntries(
    GAME_TYPES.map((t, i) => [t, values[i]]),
  ) as Record<TipoJuego, number>;
}

// ── Estadísticas persistentes (puntos, racha, niveles ganados) ────────────────

const STATS_INICIALES: EstadisticasUsuario = {
  puntosTotales: 0,
  rachaActual: 0,
  rachaMaxima: 0,
  nivelesCompletados: 0,
};

export async function getStats(): Promise<EstadisticasUsuario> {
  try {
    const raw = await AsyncStorage.getItem(STATS_KEY);
    return raw ? { ...STATS_INICIALES, ...JSON.parse(raw) } : STATS_INICIALES;
  } catch {
    return STATS_INICIALES;
  }
}

const fecha = (d: Date) => d.toISOString().slice(0, 10);

export async function registrarNivelGanado(puntos: number): Promise<EstadisticasUsuario> {
  const stats = await getStats();

  const hoy = fecha(new Date());
  const ayerDate = new Date();
  ayerDate.setDate(ayerDate.getDate() - 1);
  const ayer = fecha(ayerDate);
  const ultima = stats.ultimaActividad?.slice(0, 10);

  const rachaActual =
    ultima === hoy
      ? Math.max(stats.rachaActual, 1)
      : ultima === ayer
        ? stats.rachaActual + 1
        : 1;

  const nuevas: EstadisticasUsuario = {
    puntosTotales: stats.puntosTotales + puntos,
    rachaActual,
    rachaMaxima: Math.max(stats.rachaMaxima, rachaActual),
    nivelesCompletados: stats.nivelesCompletados + 1,
    ultimaActividad: new Date().toISOString(),
  };

  try {
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(nuevas));
  } catch {}
  return nuevas;
}
