import { useEffect, useRef, useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  nivelActualAtom,
  turnoActualAtom,
  turnosAtom,
  aciertosAtom,
  erroresAtom,
  tiempoSegundosAtom,
  estadoPartidaAtom,
  puntosPartidaAtom,
} from '../atoms/gameAtom';
import { usuarioAtom } from '../atoms/userAtom';
import { useProgreso } from './useProgreso';
import type { TurnoJuego } from '../types/juegos';

interface UseGameLogicResult {
  // Estado
  turnoActual: number;
  turnos: TurnoJuego[];
  aciertos: number;
  errores: number;
  tiempoSegundos: number;
  estadoPartida: 'jugando' | 'ganada' | 'perdida' | 'idle';
  puntosPartida: number;
  // Acciones
  responder: (respuesta: string, respuestaCorrecta: string) => void;
  // Progreso
  guardandoProgreso: boolean;
}

export function useGameLogic(): UseGameLogicResult {
  const nivel = useAtomValue(nivelActualAtom);
  const usuario = useAtomValue(usuarioAtom);
  const [turnoActual, setTurnoActual] = useAtom(turnoActualAtom);
  const [turnos, setTurnos] = useAtom(turnosAtom);
  const [aciertos, setAciertos] = useAtom(aciertosAtom);
  const [errores, setErrores] = useAtom(erroresAtom);
  const [tiempoSegundos, setTiempoSegundos] = useAtom(tiempoSegundosAtom);
  const [estadoPartida, setEstadoPartida] = useAtom(estadoPartidaAtom);
  const puntosPartida = useAtomValue(puntosPartidaAtom);

  const { completarNivel, loading: guardandoProgreso } = useProgreso();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cronómetro — corre mientras la partida está en curso
  useEffect(() => {
    if (estadoPartida !== 'jugando') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTiempoSegundos((t) => {
        // Si hay límite de tiempo, verificar si se agotó
        if (nivel?.tiempoLimiteSegundos && t + 1 >= nivel.tiempoLimiteSegundos) {
          clearInterval(timerRef.current!);
          setEstadoPartida('perdida');
        }
        return t + 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [estadoPartida, nivel?.tiempoLimiteSegundos]);

  const responder = useCallback(
    (respuesta: string, respuestaCorrecta: string) => {
      if (estadoPartida !== 'jugando' || !nivel) return;

      const esCorrecta = respuesta === respuestaCorrecta;
      const nuevoTurno: TurnoJuego = {
        indice: turnoActual,
        respuestaUsuario: respuesta,
        resultado: esCorrecta ? 'correcto' : 'incorrecto',
      };

      const nuevosAciertos = esCorrecta ? aciertos + 1 : aciertos;
      const nuevosErrores = esCorrecta ? errores : errores + 1;

      setTurnos((prev) => [...prev, nuevoTurno]);
      setAciertos(nuevosAciertos);
      setErrores(nuevosErrores);
      setTurnoActual((t) => t + 1);

      const minAciertos = (nivel.configuracion as any).minAciertos as number;
      const ganada = nuevosAciertos >= minAciertos;

      if (ganada) {
        setEstadoPartida('ganada');

        if (usuario) {
          completarNivel({
            usuarioId: usuario.id,
            nivelId: nivel.id,
            puntosObtenidos: puntosPartida,
            tiempoCompletadoSegundos: tiempoSegundos,
            aciertos: nuevosAciertos,
            errores: nuevosErrores,
          });
        }
      }
    },
    [
      estadoPartida,
      nivel,
      turnoActual,
      aciertos,
      errores,
      tiempoSegundos,
      puntosPartida,
      usuario,
      completarNivel,
    ],
  );

  return {
    turnoActual,
    turnos,
    aciertos,
    errores,
    tiempoSegundos,
    estadoPartida,
    puntosPartida,
    responder,
    guardandoProgreso,
  };
}
