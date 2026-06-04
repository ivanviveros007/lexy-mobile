import { useState, useCallback } from 'react';
import * as Speech from 'expo-speech';
import type { ConfigConductorTexto, PreguntaTexto } from '../types/juegos';

interface UseConductorTextoResult {
  texto: string;
  preguntaActual: PreguntaTexto | null;
  preguntaIndex: number;
  totalPreguntas: number;
  selectedOpcion: string | null;
  responderOpcion: (opcion: string) => 'correcto' | 'incorrecto';
  avanzarPregunta: () => void;
  juegoTerminado: boolean;
  hablarPalabra: (palabra: string) => void;
}

export function useConductorTexto(config: ConfigConductorTexto): UseConductorTextoResult {
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [selectedOpcion, setSelectedOpcion] = useState<string | null>(null);

  const preguntaActual = config.preguntas[preguntaIndex] ?? null;
  const juegoTerminado = preguntaIndex >= config.preguntas.length;

  const hablarPalabra = useCallback((palabra: string) => {
    Speech.speak(palabra, { language: 'es-ES', rate: 0.75 });
  }, []);

  const responderOpcion = useCallback(
    (opcion: string): 'correcto' | 'incorrecto' => {
      setSelectedOpcion(opcion);
      if (!preguntaActual) return 'incorrecto';
      const esCorrecta = opcion === preguntaActual.respuestaCorrecta;
      if (esCorrecta) {
        // Slight delay so the UI shows the selection first
        setTimeout(() => {
          const oracion = preguntaActual.pregunta.replace('___', preguntaActual.respuestaCorrecta);
          Speech.speak(oracion, { language: 'es-ES', rate: 0.82 });
        }, 350);
      }
      return esCorrecta ? 'correcto' : 'incorrecto';
    },
    [preguntaActual],
  );

  const avanzarPregunta = useCallback(() => {
    setPreguntaIndex((prev) => prev + 1);
    setSelectedOpcion(null);
  }, []);

  return {
    texto: config.texto,
    preguntaActual,
    preguntaIndex,
    totalPreguntas: config.preguntas.length,
    selectedOpcion,
    responderOpcion,
    avanzarPregunta,
    juegoTerminado,
    hablarPalabra,
  };
}
