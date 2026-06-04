import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TipoJuego } from '../types/juegos';

const key = (t: TipoJuego) => `lexy:nivel:${t}`;

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
    await AsyncStorage.setItem(key(tipo), String(index));
  } catch {}
}

const GAME_TYPES: TipoJuego[] = [
  'cazador_silabas',
  'palabras_gemelas',
  'intruso_rimas',
  'conductor_texto',
];

export async function getAllProgress(): Promise<Record<TipoJuego, number>> {
  const values = await Promise.all(GAME_TYPES.map(getNivelIndex));
  return Object.fromEntries(
    GAME_TYPES.map((t, i) => [t, values[i]]),
  ) as Record<TipoJuego, number>;
}
