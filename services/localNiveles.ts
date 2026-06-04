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
    {
      id: 'local-cs-2',
      tipoJuego: 'cazador_silabas',
      numeroNivel: 2,
      titulo: 'Tres sílabas',
      dificultad: 2,
      puntosRecompensa: 50,
      configuracion: {
        tipo: 'cazador_silabas',
        minAciertos: 3,
        palabras: [
          { palabra: 'pelota', silabas: ['pe', 'lo', 'ta'] },
          { palabra: 'camino', silabas: ['ca', 'mi', 'no'] },
          { palabra: 'zapato', silabas: ['za', 'pa', 'to'] },
        ],
      },
    },
    {
      id: 'local-cs-3',
      tipoJuego: 'cazador_silabas',
      numeroNivel: 3,
      titulo: 'Palabras largas',
      dificultad: 3,
      puntosRecompensa: 80,
      configuracion: {
        tipo: 'cazador_silabas',
        minAciertos: 3,
        palabras: [
          { palabra: 'mariposa', silabas: ['ma', 'ri', 'po', 'sa'] },
          { palabra: 'caballito', silabas: ['ca', 'ba', 'lli', 'to'] },
          { palabra: 'dinosaurio', silabas: ['di', 'no', 'sau', 'rio'] },
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
    {
      id: 'local-pg-2',
      tipoJuego: 'palabras_gemelas',
      numeroNivel: 2,
      titulo: 'Gemelas nivel 2',
      dificultad: 2,
      puntosRecompensa: 50,
      configuracion: {
        tipo: 'palabras_gemelas',
        minAciertos: 3,
        pares: [
          { palabraA: 'perro', palabraB: 'perro', sonGemelas: true },
          { palabraA: 'tigre', palabraB: 'tigro', sonGemelas: false },
          { palabraA: 'árbol', palabraB: 'árbol', sonGemelas: true },
          { palabraA: 'dragón', palabraB: 'dragón', sonGemelas: true },
          { palabraA: 'ratón', palabraB: 'patón', sonGemelas: false },
        ],
      },
    },
    {
      id: 'local-pg-3',
      tipoJuego: 'palabras_gemelas',
      numeroNivel: 3,
      titulo: 'Gemelas difícil',
      dificultad: 3,
      puntosRecompensa: 80,
      configuracion: {
        tipo: 'palabras_gemelas',
        minAciertos: 3,
        pares: [
          { palabraA: 'globo', palabraB: 'glovo', sonGemelas: false },
          { palabraA: 'paloma', palabraB: 'paloma', sonGemelas: true },
          { palabraA: 'flecha', palabraB: 'flacha', sonGemelas: false },
          { palabraA: 'queso', palabraB: 'queso', sonGemelas: true },
          { palabraA: 'plato', palabraB: 'ploto', sonGemelas: false },
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
    {
      id: 'local-ir-2',
      tipoJuego: 'intruso_rimas',
      numeroNivel: 2,
      titulo: 'Rimas nivel 2',
      dificultad: 2,
      puntosRecompensa: 50,
      configuracion: {
        tipo: 'intruso_rimas',
        minAciertos: 3,
        grupos: [
          { palabras: ['sol', 'col'], intruso: 'pan' },
          { palabras: ['mar', 'dar'], intruso: 'carro' },
          { palabras: ['tren', 'bien'], intruso: 'pato' },
        ],
      },
    },
    {
      id: 'local-ir-3',
      tipoJuego: 'intruso_rimas',
      numeroNivel: 3,
      titulo: 'Rimas difícil',
      dificultad: 3,
      puntosRecompensa: 80,
      configuracion: {
        tipo: 'intruso_rimas',
        minAciertos: 3,
        grupos: [
          { palabras: ['ratón', 'cartón'], intruso: 'lago' },
          { palabras: ['amor', 'dolor'], intruso: 'mesa' },
          { palabras: ['pan', 'plan'], intruso: 'nube' },
        ],
      },
    },
  ],

  conductor_texto: [
    {
      id: 'local-ct-1',
      tipoJuego: 'conductor_texto',
      numeroNivel: 1,
      titulo: 'El gato Michi',
      dificultad: 1,
      puntosRecompensa: 30,
      configuracion: {
        tipo: 'conductor_texto',
        texto: 'El gato Michi vive en una casa roja. Le gusta saltar y jugar con la pelota azul.',
        minAciertos: 2,
        preguntas: [
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
          {
            pregunta: 'A Michi le gusta ___',
            opciones: ['dormir', 'saltar', 'nadar'],
            respuestaCorrecta: 'saltar',
          },
        ],
      },
    },
    {
      id: 'local-ct-2',
      tipoJuego: 'conductor_texto',
      numeroNivel: 2,
      titulo: 'Bruno el oso',
      dificultad: 2,
      puntosRecompensa: 50,
      configuracion: {
        tipo: 'conductor_texto',
        texto: 'Bruno el oso vive en el bosque. Cada mañana busca miel en los árboles. Su color favorito es el marrón.',
        minAciertos: 2,
        preguntas: [
          {
            pregunta: 'Bruno vive en el ___',
            opciones: ['bosque', 'mar', 'campo'],
            respuestaCorrecta: 'bosque',
          },
          {
            pregunta: 'Cada mañana Bruno busca ___',
            opciones: ['fruta', 'miel', 'peces'],
            respuestaCorrecta: 'miel',
          },
          {
            pregunta: 'El color favorito de Bruno es el ___',
            opciones: ['azul', 'verde', 'marrón'],
            respuestaCorrecta: 'marrón',
          },
        ],
      },
    },
    {
      id: 'local-ct-3',
      tipoJuego: 'conductor_texto',
      numeroNivel: 3,
      titulo: 'Sofía pinta',
      dificultad: 3,
      puntosRecompensa: 80,
      configuracion: {
        tipo: 'conductor_texto',
        texto: 'Sofía ama pintar. Un día pintó un arcoíris enorme en su cuaderno. Usó siete colores y tardó una hora.',
        minAciertos: 2,
        preguntas: [
          {
            pregunta: 'Sofía ama ___',
            opciones: ['cantar', 'pintar', 'saltar'],
            respuestaCorrecta: 'pintar',
          },
          {
            pregunta: 'Sofía pintó un ___',
            opciones: ['sol', 'arcoíris', 'árbol'],
            respuestaCorrecta: 'arcoíris',
          },
          {
            pregunta: 'Sofía tardó ___',
            opciones: ['dos horas', 'media hora', 'una hora'],
            respuestaCorrecta: 'una hora',
          },
        ],
      },
    },
  ],

  memotest: [],
};

export const TOTAL_NIVELES_LOCALES: Record<TipoJuego, number> = {
  cazador_silabas: 3,
  palabras_gemelas: 3,
  intruso_rimas: 3,
  conductor_texto: 3,
  memotest: 0,
};

export function getNivelesLocales(tipoJuego: TipoJuego): Nivel[] {
  return NIVELES_LOCALES[tipoJuego] ?? [];
}
