// Mensajes de Lexy personalizados para Male — siempre alentadores, nunca negativos

const NOMBRE = 'Male';

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

// Al ganar un nivel
export const mensajeVictoria = () =>
  pick([
    `¡Increíble, ${NOMBRE}! 🎉`,
    `¡Sos una campeona, ${NOMBRE}! 🏆`,
    `¡Lo lograste, ${NOMBRE}! ⭐`,
    `¡Wow ${NOMBRE}, qué genia! 💜`,
    `¡Súper trabajo, ${NOMBRE}! 🚀`,
    `¡${NOMBRE}, cada día leés mejor! 📚✨`,
    `¡Aplausos para ${NOMBRE}! 👏👏`,
  ]);

// Al completar TODOS los niveles de un juego
export const mensajeVictoriaFinal = () =>
  pick([
    `¡${NOMBRE}, completaste TODOS los niveles! 👑`,
    `¡Sos la maestra de este juego, ${NOMBRE}! 🏆✨`,
    `¡Nadie te gana, ${NOMBRE}! ¡Terminaste todo! 🌟`,
  ]);

// Al perder o equivocarse — siempre con ánimo
export const mensajeAliento = () =>
  pick([
    `¡Casi casi, ${NOMBRE}! La próxima es tuya 💪`,
    `¡No pasa nada, ${NOMBRE}! Probá otra vez 🌟`,
    `¡Vos podés, ${NOMBRE}! Respirá hondo y seguí 💜`,
    `¡Cada intento te hace más fuerte, ${NOMBRE}! ✨`,
    `¡Vamos ${NOMBRE}, que ya casi lo tenés! 🚀`,
  ]);

// Pequeños festejos durante el juego (acierto individual)
export const mensajeAcierto = () =>
  pick([
    `¡Eso, ${NOMBRE}! 🎉`,
    `¡Genia total! ⭐`,
    `¡Muy bien, ${NOMBRE}! 💜`,
    `¡Seguí así! 🔥`,
    `¡Perfecto! ✨`,
  ]);
