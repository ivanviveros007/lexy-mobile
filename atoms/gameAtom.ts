import { atom } from 'jotai';
import type { Nivel, TipoJuego, TurnoJuego } from '../types/juegos';

// Nivel que se está jugando actualmente
export const nivelActualAtom = atom<Nivel | null>(null);

// Tipo de juego activo (para navegación y estilos)
export const tipoJuegoActivoAtom = atom<TipoJuego | null>(null);

// Índice del turno/pregunta actual dentro del nivel
export const turnoActualAtom = atom<number>(0);

// Historial de turnos jugados
export const turnosAtom = atom<TurnoJuego[]>([]);

// Contadores de partida
export const aciertosAtom = atom<number>(0);
export const erroresAtom = atom<number>(0);

// Tiempo transcurrido en segundos (el hook lo incrementa)
export const tiempoSegundosAtom = atom<number>(0);

// Estado terminal de la partida
export type EstadoPartida = 'jugando' | 'ganada' | 'perdida' | 'idle';
export const estadoPartidaAtom = atom<EstadoPartida>('idle');

// Átomo de escritura — reinicia toda la partida al entrar a un nivel
export const iniciarPartidaAtom = atom(null, (_get, set, nivel: Nivel) => {
  set(nivelActualAtom, nivel);
  set(tipoJuegoActivoAtom, nivel.tipoJuego);
  set(turnoActualAtom, 0);
  set(turnosAtom, []);
  set(aciertosAtom, 0);
  set(erroresAtom, 0);
  set(tiempoSegundosAtom, 0);
  set(estadoPartidaAtom, 'jugando');
});

// Átomo derivado — puntos acumulados en la partida actual
export const puntosPartidaAtom = atom<number>((get) => {
  const nivel = get(nivelActualAtom);
  const aciertos = get(aciertosAtom);
  if (!nivel) return 0;
  const baseUnit = nivel.puntosRecompensa / (nivel.configuracion as any).minAciertos;
  return Math.round(baseUnit * aciertos);
});
