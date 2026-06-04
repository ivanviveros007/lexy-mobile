import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { GameCard } from '../../components/GameCard';
import { LexyCharacter } from '../../components/LexyCharacter';
import { usuarioAtom, puntosAtom, rachaActualAtom } from '../../atoms';
import { useProgresoLocal } from '../../hooks/useProgresoLocal';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/fonts';
import type { TipoJuego } from '../../types/juegos';

// Metadatos estáticos de los 4 juegos
const JUEGOS: Array<{
  tipoJuego: TipoJuego;
  titulo: string;
  descripcion: string;
  emoji: string;
  ruta: string;
}> = [
  {
    tipoJuego: 'cazador_silabas',
    titulo: 'Cazador de Sílabas',
    descripcion: '¡Atrapa cada sílaba de la palabra!',
    emoji: '🎯',
    ruta: '/games/cazador-silabas',
  },
  {
    tipoJuego: 'palabras_gemelas',
    titulo: 'Palabras Gemelas',
    descripcion: '¿Son la misma palabra o diferentes?',
    emoji: '👯',
    ruta: '/games/palabras-gemelas',
  },
  {
    tipoJuego: 'intruso_rimas',
    titulo: 'Intruso de las Rimas',
    descripcion: '¡Encuentra la palabra que no rima!',
    emoji: '🔍',
    ruta: '/games/intruso-rimas',
  },
  {
    tipoJuego: 'conductor_texto',
    titulo: 'Conductor del Texto',
    descripcion: 'Lee, comprende y responde.',
    emoji: '🚀',
    ruta: '/games/conductor-texto',
  },
  {
    tipoJuego: 'memotest',
    titulo: 'Memotest de Palabras',
    descripcion: '¡Encuentra las parejas de palabras!',
    emoji: '🧠',
    ruta: '/games/memotest',
  },
];

// Pantalla puramente presentacional — solo consume átomos, no fetching
export default function HomeScreen() {
  const router = useRouter();
  const usuario = useAtomValue(usuarioAtom);
  const puntos = useAtomValue(puntosAtom);
  const racha = useAtomValue(rachaActualAtom);
  const progreso = useProgresoLocal();

  const nombre = usuario?.nombre ?? 'Male';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header — saludo arriba, badges abajo */}
        <View style={styles.header}>
          <Text style={styles.greeting}>¡Hola, {nombre}! 👋</Text>
          <Text style={styles.subtitle}>¿Qué aventura elegimos hoy?</Text>

          {/* Indicadores rápidos en fila bajo el saludo */}
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>⭐</Text>
              <Text style={styles.badgeValue}>{puntos} pts</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>🔥</Text>
              <Text style={styles.badgeValue}>{racha} días</Text>
            </View>
          </View>
        </View>

        {/* Lexy bienvenida */}
        <View style={styles.lexyRow}>
          <LexyCharacter
            mood="happy"
            size={72}
            message="¡Yo te ayudo en cada paso! 💜"
          />
        </View>

        {/* Separador */}
        <Text style={styles.sectionTitle}>Elige tu aventura</Text>

        {/* Tarjetas de juegos */}
        {JUEGOS.map((juego) => (
          <GameCard
            key={juego.tipoJuego}
            tipoJuego={juego.tipoJuego}
            titulo={juego.titulo}
            descripcion={juego.descripcion}
            emoji={juego.emoji}
            nivelesCompletados={progreso?.[juego.tipoJuego]?.nivelesCompletados ?? 0}
            totalNiveles={progreso?.[juego.tipoJuego]?.totalNiveles ?? 3}
            onPress={() => router.push(juego.ruta as any)}
          />
        ))}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundCream,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'column',
    marginBottom: 20,
    gap: 8,
  },
  greeting: {
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: 0.8,
    color: Colors.textPrimary,
    fontFamily: 'OpenDyslexic-Bold',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontFamily: 'OpenDyslexic',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  headerText: { flex: 1 }, // kept for TS, unused visually
  badge: {
    backgroundColor: Colors.lexyPurpleLight,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 56,
  },
  badgeEmoji: { fontSize: 18 },
  badgeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.lexyPurpleDark,
    letterSpacing: 0.3,
  },
  lexyRow: {
    alignItems: 'center',
    marginBottom: 28,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 16,
  },
  footer: { height: 32 },
});
