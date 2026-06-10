// Paleta diseñada para accesibilidad en dislexia:
// fondos suaves, texto oscuro sin negro puro, contraste WCAG AA mínimo 4.5:1

export const Colors = {
  // Fondos
  backgroundCream: '#FFFDD0',
  backgroundSkyBlue: '#E8F4FD',
  backgroundCard: '#FFFFFF',

  // Texto — nunca negro puro (reduce fatiga visual)
  textPrimary: '#2D2D2D',
  textSecondary: '#5A5A5A',
  textMuted: '#8A8A8A',

  // Identidad Lexy
  lexyPurple: '#7B5EA7',
  lexyPurpleLight: '#EDE7F6',
  lexyPurpleDark: '#4A3278',

  // Juegos — un color por tipo para reconocimiento rápido
  cazadorSilabas: '#FF8A65',   // naranja cálido
  palabrasGemelas: '#4DB6AC',  // verde azulado
  intrusoRimas: '#FFB74D',     // ámbar
  conductorTexto: '#81C784',   // verde suave
  memotest: '#BA68C8',         // lila
  carreraLectura: '#64B5F6',   // celeste

  // Estado
  success: '#4CAF50',
  successLight: '#E8F5E9',
  error: '#EF5350',
  errorLight: '#FFEBEE',
  warning: '#FFA726',

  // UI
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.4)',

  // Racha / gamificación
  streakGold: '#FFD700',
  streakSilver: '#C0C0C0',
  star: '#FFC107',
} as const;

export type ColorKey = keyof typeof Colors;
