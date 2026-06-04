import type { Nivel, TipoJuego } from '../types/juegos';

const NIVELES_LOCALES: Record<TipoJuego, Nivel[]> = {
  cazador_silabas: [
    {
      id: 'local-cs-1',
      tipoJuego: 'cazador_silabas',
      numeroNivel: 1,
      titulo: 'Sílabas fáciles',
      dificultad: 1,
      puntosRecompensa: 30,
      configuracion: {
        tipo: 'cazador_silabas',
        minAciertos: 3,
        palabras: [
          { palabra: 'gato', silabas: ['ga', 'to'] },
          { palabra: 'luna', silabas: ['lu', 'na'] },
          { palabra: 'silla', silabas: ['si', 'lla'] },
        ],
      },
    },
  ],
  palabras_gemelas: [
    {
      id: 'local-pg-1',
      tipoJuego: 'palabras_gemelas',
      numeroNivel: 1,
      titulo: 'Gemelas nivel 1',
      dificultad: 1,
      puntosRecompensa: 30,
      configuracion: {
        tipo: 'palabras_gemelas',
        minAciertos: 3,
        pares: [
          { palabraA: 'lobo', palabraB: 'lodo', sonGemelas: false },
          { palabraA: 'pato', palabraB: 'pato', sonGemelas: true },
          { palabraA: 'bola', palabraB: 'dola', sonGemelas: false },
          { palabraA: 'pelo', palabraB: 'pelo', sonGemelas: true },
          { palabraA: 'cama', palabraB: 'cana', sonGemelas: false },
        ],
      },
    },
  ],
  intruso_rimas: [
    {
      id: 'local-ir-1',
      tipoJuego: 'intruso_rimas',
      numeroNivel: 1,
      titulo: 'Rimas nivel 1',
      dificultad: 1,
      puntosRecompensa: 30,
      configuracion: {
        tipo: 'intruso_rimas',
        minAciertos: 3,
        grupos: [
          { palabras: ['canción', 'avión'], intruso: 'gato' },
          { palabras: ['pato', 'plato'], intruso: 'luna' },
          { palabras: ['flor', 'calor'], intruso: 'mesa' },
        ],
      },
    },
  ],
  conductor_texto: [
    {
      id: 'local-ct-1',
      tipoJuego: 'conductor_texto',
      numeroNivel: 1,
      titulo: 'Texto nivel 1',
      dificultad: 1,
      puntosRecompensa: 30,
      configuracion: {
        tipo: 'conductor_texto',
        texto: 'El gato Michi vive en una casa roja. Le gusta saltar y jugar con la pelota azul.',
        minAciertos: 2,
        preguntas: [
          {
            pregunta: 'El gato saltó sobre la ___',
            opciones: ['mesa', 'masa', 'muela'],
            respuestaCorrecta: 'mesa',
          },
          {
            pregunta: 'La pelota era de color ___',
            opciones: ['roja', 'azul', 'verde'],
            respuestaCorrecta: 'azul',
          },
          {
            pregunta: 'La casa de Michi es ___',
            opciones: ['azul', 'verde', 'roja'],
            respuestaCorrecta: 'roja',
          },
        ],
      },
    },
  ],
  memotest: [],
};

export function getNivelesLocales(tipoJuego: TipoJuego): Nivel[] {
  return NIVELES_LOCALES[tipoJuego] ?? [];
}
