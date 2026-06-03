// Letter-spacing amplio: reduce inversión de letras en dislexia
// OpenDyslexic se carga en app/_layout.tsx via expo-font

export const Fonts = {
  openDyslexic: 'OpenDyslexic',
  openDyslexicBold: 'OpenDyslexic-Bold',
  system: undefined, // fallback al sistema
} as const;

export const Typography = {
  // Tamaños pensados para iPad — escala cómoda para 9 años
  h1: { fontSize: 36, lineHeight: 48, letterSpacing: 1.5 },
  h2: { fontSize: 28, lineHeight: 38, letterSpacing: 1.2 },
  h3: { fontSize: 22, lineHeight: 32, letterSpacing: 1.0 },
  body: { fontSize: 18, lineHeight: 28, letterSpacing: 0.8 },
  bodyLarge: { fontSize: 20, lineHeight: 30, letterSpacing: 1.0 },
  caption: { fontSize: 14, lineHeight: 20, letterSpacing: 0.6 },
  // Sílabas y palabras — tamaño máximo para facilitar lectura
  gameWord: { fontSize: 40, lineHeight: 54, letterSpacing: 3.0 },
  gameSyllable: { fontSize: 32, lineHeight: 44, letterSpacing: 2.0 },
} as const;
