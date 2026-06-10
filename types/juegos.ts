// ─────────────────────────────────────────────────────────────────────────────
// CONTRATO CANÓNICO — compartido entre lexy-mobile y lexy-backend
// Cualquier cambio aquí debe reflejarse en backend/src/types/juegos.ts
// ─────────────────────────────────────────────────────────────────────────────

export type TipoJuego =
  | 'cazador_silabas'
  | 'palabras_gemelas'
  | 'intruso_rimas'
  | 'conductor_texto'
  | 'memotest'
  | 'carrera_lectura';

// ── Cazador de Sílabas ────────────────────────────────────────────────────────
export interface PalabraConSilabas {
  palabra: string;
  silabas: string[];
  imagenUrl?: string;
}

export interface ConfigCazadorSilabas {
  tipo: 'cazador_silabas';
  palabras: PalabraConSilabas[];
  minAciertos: number;
}

// ── Palabras Gemelas ──────────────────────────────────────────────────────────
// Entrena la discriminación visual b/d p/q — confusiones típicas de dislexia
export interface ParPalabras {
  palabraA: string;
  palabraB: string;
  sonGemelas: boolean;
}

export interface ConfigPalabrasGemelas {
  tipo: 'palabras_gemelas';
  pares: ParPalabras[];
  minAciertos: number;
}

// ── Intruso de las Rimas ──────────────────────────────────────────────────────
export interface GrupoRimas {
  palabras: string[];
  intruso: string;
}

export interface ConfigIntrusoRimas {
  tipo: 'intruso_rimas';
  grupos: GrupoRimas[];
  minAciertos: number;
}

// ── Conductor del Texto ───────────────────────────────────────────────────────
export interface PreguntaTexto {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
}

export interface ConfigConductorTexto {
  tipo: 'conductor_texto';
  texto: string;
  preguntas: PreguntaTexto[];
  minAciertos: number;
}

// ── Memotest ──────────────────────────────────────────────────────────────────
export interface CartaMemotest {
  id: string;
  contenido: string;
  pairId: string;
  imagenUrl?: string;
}

export interface ConfigMemotest {
  tipo: 'memotest';
  cartas: CartaMemotest[];
  // = cantidad de parejas; la partida se gana al encontrarlas todas
  minAciertos: number;
}

// ── Carrera de Lectura ────────────────────────────────────────────────────────
// El rival avanza con el reloj (tiempoLimiteSegundos = palabras × segundosPorPalabra);
// la jugadora avanza presionando un botón por cada palabra leída
export interface ConfigCarreraLectura {
  tipo: 'carrera_lectura';
  palabras: string[];
  segundosPorPalabra: number;
  // = palabras.length; se gana al leerlas todas antes de que llegue el rival
  minAciertos: number;
}

// ── Union discriminada ────────────────────────────────────────────────────────
export type ConfiguracionJuego =
  | ConfigCazadorSilabas
  | ConfigPalabrasGemelas
  | ConfigIntrusoRimas
  | ConfigMemotest
  | ConfigConductorTexto
  | ConfigCarreraLectura;

// ── Nivel ─────────────────────────────────────────────────────────────────────
export interface Nivel {
  id: string;
  tipoJuego: TipoJuego;
  numeroNivel: number;
  titulo: string;
  descripcion?: string;
  dificultad: 1 | 2 | 3 | 4 | 5;
  puntosRecompensa: number;
  tiempoLimiteSegundos?: number;
  configuracion: ConfiguracionJuego;
}

// ── Usuario ───────────────────────────────────────────────────────────────────
export interface EstadisticasUsuario {
  puntosTotales: number;
  rachaActual: number;
  rachaMaxima: number;
  nivelesCompletados: number;
  ultimaActividad?: string; // ISO 8601
}

export interface Usuario {
  id: string;
  nombre: string;
  avatarUrl?: string;
  estadisticas: EstadisticasUsuario;
}

// ── Progreso — Payload POST /progreso/completar ───────────────────────────────
export interface ProgresoCompletarPayload {
  usuarioId: string;
  nivelId: string;
  puntosObtenidos: number;
  tiempoCompletadoSegundos: number;
  aciertos: number;
  errores: number;
}

// ── Progreso — Respuesta ──────────────────────────────────────────────────────
export interface ProgresoCompletarResponse {
  success: boolean;
  nuevasEstadisticas: EstadisticasUsuario;
  siguienteNivel?: Nivel;
  logrosDesbloqueados: string[];
  mensajeLexy: string;
}

// ── Resultado de turno individual ────────────────────────────────────────────
export type ResultadoTurno = 'correcto' | 'incorrecto' | 'pendiente';

export interface TurnoJuego {
  indice: number;
  respuestaUsuario?: string;
  resultado: ResultadoTurno;
}
