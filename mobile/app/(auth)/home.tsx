import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Cabecalho } from '../../components/Cabecalho';
import { Cores } from '../../constants/Cores';
import { Fontes } from '../../constants/Fontes';
import { useAutenticacaoContexto } from '../../context/AutenticacaoContexto';

interface AtalhoProps {
  titulo: string;
  descricao: string;
  icone: keyof typeof MaterialCommunityIcons.glyphMap;
  rota: '/(auth)/perfil' | '/(auth)/sobre';
}

function Atalho({ titulo, descricao, icone, rota }: AtalhoProps) {
  return (
    <Pressable style={styles.atalho} onPress={() => router.push(rota)}>
      <View style={styles.icone}><MaterialCommunityIcons name={icone} size={24} color={Cores.branco} /></View>
      <View style={styles.atalhoTexto}>
        <Text style={styles.atalhoTitulo}>{titulo}</Text>
        <Text style={styles.atalhoDescricao}>{descricao}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={Cores.textoSecundario} />
    </Pressable>
  );
}

export default function Home() {
  const { usuario } = useAutenticacaoContexto();
  const primeiroNome = usuario?.displayName?.split(' ')[0] || 'Aluno';

  return (
    <View style={styles.pagina}>
      <Cabecalho titulo="FITID" mostrarSair />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.saudacao}>Olá, {primeiroNome}</Text>
        <Text style={styles.texto}>Este é o acesso Mobile do aluno.</Text>

        <View style={styles.statusCard}>
          <MaterialCommunityIcons name="shield-check" size={30} color={Cores.destaque} />
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitulo}>Acesso autenticado</Text>
            <Text style={styles.statusTexto}>Sua sessão está protegida pelo Firebase Authentication.</Text>
          </View>
        </View>

        <Text style={styles.secao}>Acesso rápido</Text>
        <Atalho titulo="Meu perfil" descricao="Veja os dados da conta autenticada." icone="account-circle" rota="/(auth)/perfil" />
        <Atalho titulo="Sobre o FITID" descricao="Objetivo, funções e integrantes do projeto." icone="information-outline" rota="/(auth)/sobre" />

        <View style={styles.proximoPasso}>
          <Text style={styles.proximoTitulo}>Próximas integrações</Text>
          <Text style={styles.proximoTexto}>Treino, histórico e identificação do aluno serão ligados ao banco atual do FITID em uma próxima etapa.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: Cores.fundo },
  conteudo: { padding: 22, gap: 14 },
  saudacao: { color: Cores.texto, fontFamily: Fontes.familia.bold, fontSize: Fontes.tamanho.titulo },
  texto: { color: Cores.textoSecundario, fontFamily: Fontes.familia.regular, lineHeight: 22 },
  statusCard: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 18, borderRadius: 18, borderWidth: 1, borderColor: '#1C5A4A', backgroundColor: '#0D2A2A' },
  statusTitulo: { color: Cores.texto, fontFamily: Fontes.familia.bold, fontSize: Fontes.tamanho.medio },
  statusTexto: { color: '#B6D8CE', fontFamily: Fontes.familia.regular, marginTop: 4, lineHeight: 20 },
  secao: { color: Cores.texto, fontFamily: Fontes.familia.bold, fontSize: Fontes.tamanho.medio, marginTop: 8 },
  atalho: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: Cores.fundoSecundario, borderRadius: 18, borderWidth: 1, borderColor: Cores.borda },
  icone: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: Cores.primaria },
  atalhoTexto: { flex: 1 },
  atalhoTitulo: { color: Cores.texto, fontFamily: Fontes.familia.semiBold, fontSize: Fontes.tamanho.normal },
  atalhoDescricao: { color: Cores.textoSecundario, fontFamily: Fontes.familia.regular, fontSize: Fontes.tamanho.pequeno, marginTop: 4 },
  proximoPasso: { marginTop: 4, padding: 18, borderRadius: 18, backgroundColor: Cores.superficie },
  proximoTitulo: { color: Cores.texto, fontFamily: Fontes.familia.semiBold },
  proximoTexto: { color: Cores.textoSecundario, fontFamily: Fontes.familia.regular, lineHeight: 20, marginTop: 7 }
});
