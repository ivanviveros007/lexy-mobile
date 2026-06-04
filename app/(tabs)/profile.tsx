import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtomValue } from 'jotai';
import { LexyCharacter, type LexyMood } from '../../components/LexyCharacter';
import { StreakBadge } from '../../components/StreakBadge';
import { ProgressBar } from '../../components/ProgressBar';
import {
  usuarioAtom,
  puntosAtom,
  rachaActualAtom,
  rachaMaximaAtom,
  nivelesCompletadosAtom,
} from '../../atoms';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/fonts';

// Pantalla puramente presentacional — Lexy muestra logros y motivación
export default function ProfileScreen() {
  const usuario = useAtomValue(usuarioAtom);
  const puntos = useAtomValue(puntosAtom);
  const racha = useAtomValue(rachaActualAtom);
  const rachaMaxima = useAtomValue(rachaMaximaAtom);
  const nivelesCompletados = useAtomValue(nivelesCompletadosAtom);

  const nombre = usuario?.nombre ?? 'aventurera';

  const lexyMood: LexyMood =
    racha >= 7 ? 'celebrating' : racha >= 3 ? 'happy' : 'encouraging';

  const lexyMessage =
    racha >= 7
      ? `¡${racha} días seguidos! ¡Eres increíble! 🌟`
      : racha >= 3
        ? `¡Llevas ${racha} días! ¡Sigue así! 💜`
        : '¡Cada día que practicas, te vuelves más fuerte!';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Nombre */}
        <Text style={styles.title}>Mi Perfil</Text>
        <Text style={styles.nombre}>{nombre} ✨</Text>

        {/* Lexy celebrando */}
        <View style={styles.lexySection}>
          <LexyCharacter mood={lexyMood} size={100} message={lexyMessage} />
        </View>

        {/* Stats principales */}
        <View style={styles.statsGrid}>
          <StatCard
            emoji="⭐"
            valor={puntos.toLocaleString()}
            label="Puntos totales"
            color={Colors.lexyPurple}
          />
          <StatCard
            emoji="📚"
            valor={String(nivelesCompletados)}
            label="Niveles ganados"
            color={Colors.conductorTexto}
          />
        </View>

        {/* Racha */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Racha de práctica</Text>
          <View style={styles.streakRow}>
            <StreakBadge racha={racha} />
            <Text style={styles.streakMax}>Máximo: {rachaMaxima} días 🏆</Text>
          </View>
        </View>

        {/* Progreso por juego */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progreso por aventura</Text>
          <View style={styles.progressList}>
            <ProgressRow
              emoji="🎯"
              label="Cazador de Sílabas"
              valor={0.4}
              color={Colors.cazadorSilabas}
            />
            <ProgressRow
              emoji="👯"
              label="Palabras Gemelas"
              valor={0.2}
              color={Colors.palabrasGemelas}
            />
            <ProgressRow
              emoji="🔍"
              label="Intruso de las Rimas"
              valor={0.1}
              color={Colors.intrusoRimas}
            />
            <ProgressRow
              emoji="🚀"
              label="Conductor del Texto"
              valor={0.05}
              color={Colors.conductorTexto}
            />
          </View>
        </View>

        {/* Mensaje motivacional de Lexy */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            "La práctica diaria es tu superpoder, {nombre}. ¡Yo creo en ti!" — Lexy 💜
          </Text>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-componentes locales (no se necesitan fuera de esta pantalla)
function StatCard({
  emoji,
  valor,
  label,
  color,
}: {
  emoji: string;
  valor: string;
  label: string;
  color: string;
}) {
  return (
    <View style={[styles.statCard, { borderColor: color }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statValor, { color }]}>{valor}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ProgressRow({
  emoji,
  label,
  valor,
  color,
}: {
  emoji: string;
  label: string;
  valor: number;
  color: string;
}) {
  return (
    <View style={styles.progressRow}>
      <Text style={styles.progressEmoji}>{emoji}</Text>
      <View style={styles.progressContent}>
        <Text style={styles.progressLabel}>{label}</Text>
        <ProgressBar valor={valor} color={color} height={8} />
      </View>
      <Text style={[styles.progressPct, { color }]}>
        {Math.round(valor * 100)}%
      </Text>
    </View>
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
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    fontFamily: 'OpenDyslexic-Bold',
  },
  nombre: {
    ...Typography.h3,
    color: Colors.lexyPurple,
    fontFamily: 'OpenDyslexic',
    marginBottom: 8,
  },
  lexySection: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: Colors.lexyPurpleLight,
    borderRadius: 24,
    marginVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    borderWidth: 2,
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  statEmoji: { fontSize: 32 },
  statValor: {
    ...Typography.h2,
    fontFamily: 'OpenDyslexic-Bold',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'OpenDyslexic',
  },
  section: { marginBottom: 28 },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 16,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakMax: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontFamily: 'OpenDyslexic',
  },
  progressList: { gap: 16 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressEmoji: { fontSize: 24 },
  progressContent: { flex: 1, gap: 4 },
  progressLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontFamily: 'OpenDyslexic',
  },
  progressPct: {
    ...Typography.caption,
    fontFamily: 'OpenDyslexic-Bold',
    minWidth: 36,
    textAlign: 'right',
  },
  motivationCard: {
    backgroundColor: Colors.lexyPurple,
    borderRadius: 20,
    padding: 20,
    marginBottom: 8,
  },
  motivationText: {
    ...Typography.body,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 0.6,
  },
  footer: { height: 32 },
});
