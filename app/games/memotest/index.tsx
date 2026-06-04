import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LexyCharacter } from '../../../components/LexyCharacter';
import { Colors } from '../../../constants/colors';

const GAME_COLOR = Colors.memotest;

export default function MemotestScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.emoji}>🧠</Text>

        <LexyCharacter
          mood="thinking"
          size={100}
          message="¡Estamos preparando las tarjetas! Volvé pronto… 🎨"
        />

        <View style={styles.card}>
          <Text style={styles.title}>Memotest de Palabras</Text>
          <Text style={styles.body}>
            Este juego está en camino. Muy pronto vas a poder encontrar parejas de palabras con sus dibujos.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: GAME_COLOR }]}
          onPress={() => router.back()}
        >
          <Text style={styles.btnText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.backgroundCream },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backText: { fontSize: 17, color: GAME_COLOR, fontFamily: 'OpenDyslexic' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 32,
  },
  emoji: { fontSize: 72 },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: GAME_COLOR + '55',
    padding: 28,
    alignItems: 'center',
    gap: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontFamily: 'OpenDyslexic-Bold',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 24,
  },
  btnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    letterSpacing: 0.5,
  },
});
