import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Cores } from '../../constants/Cores';
import { useAutenticacaoContexto } from '../../context/AutenticacaoContexto';

export default function LayoutProtegido() {
  const { usuario, carregando } = useAutenticacaoContexto();

  if (carregando) {
    return <View style={styles.carregando}><ActivityIndicator color={Cores.primaria} /></View>;
  }

  if (!usuario) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Cores.fundo } }} />;
}

const styles = StyleSheet.create({
  carregando: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Cores.fundo }
});
