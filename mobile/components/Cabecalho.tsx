import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cores } from '../constants/Cores';
import { Fontes } from '../constants/Fontes';
import { useAutenticacao } from '../hooks/useAutenticacao';

interface CabecalhoProps {
  titulo: string;
  mostrarVoltar?: boolean;
  mostrarSair?: boolean;
}

export function Cabecalho({
  titulo,
  mostrarVoltar = false,
  mostrarSair = false
}: CabecalhoProps) {
  const { deslogar } = useAutenticacao();

  async function sair() {
    await deslogar();
    router.replace('/');
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {mostrarVoltar ? (
          <Pressable onPress={() => router.back()} style={styles.iconeBotao}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={Cores.texto}
            />
          </Pressable>
        ) : (
          <View style={styles.espaco} />
        )}

        <Text style={styles.titulo}>{titulo}</Text>

        {mostrarSair ? (
          <Pressable onPress={sair} style={styles.iconeBotao}>
            <MaterialCommunityIcons
              name="logout"
              size={23}
              color={Cores.texto}
            />
          </Pressable>
        ) : (
          <View style={styles.espaco} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Cores.fundoSecundario
  },

  container: {
    minHeight: 60,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Cores.borda,
    backgroundColor: Cores.fundoSecundario
  },

  titulo: {
    color: Cores.texto,
    fontFamily: Fontes.familia.bold,
    fontSize: Fontes.tamanho.medio
  },

  iconeBotao: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },

  espaco: {
    width: 44
  }
});