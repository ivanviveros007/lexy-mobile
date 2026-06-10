import type { ImageSourcePropType } from 'react-native';

// Dibujos hechos a mano para las cartas del memotest.
// La clave coincide con CartaMemotest.imagenUrl en los niveles locales.
export const MEMOTEST_IMAGES: Record<string, ImageSourcePropType> = {
  auto: require('./auto.jpg'),
  cangrejo: require('./cangrejo.jpg'),
  casa: require('./casa.jpg'),
  corazon: require('./corazon.jpg'),
  dino: require('./dino.jpg'),
  flor: require('./flor.jpg'),
  galleta: require('./galleta.jpg'),
  hoja: require('./hoja.jpg'),
  mariposa: require('./mariposa.jpg'),
  oruga: require('./oruga.jpg'),
  oso: require('./oso.jpg'),
  zapato: require('./zapato.jpg'),
};
