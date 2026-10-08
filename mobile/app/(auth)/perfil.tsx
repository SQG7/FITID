import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';
import { Cabecalho } from '../../components/Cabecalho';
import { Cores } from '../../constants/Cores';
import { Fontes } from '../../constants/Fontes';
import { useAutenticacaoContexto } from '../../context/AutenticacaoContexto';

export default function Perfil() {
  const { usuario } = useAutenticacaoContexto();

  return (
    <View style={styles.pagina}>
      <Cabecalho titulo="Meu perfil" mostrarVoltar />
      <View style={styles.conteudo}>
        <View style={styles.avatar}><MaterialCommunityIcons name="account" size={44} color={Cores.branco} /></View>
        <Text style={styles.nome}>{usuario?.displayName || 'Aluno FITID'}</Text>
        <Text style={styles.email}>{usuario?.email || 'E-mail não informado'}</Text>

        <View style={styles.card}>
          <Text style={styles.rotulo}>Status da autenticação</Text>
          <Text style={styles.valor}>Conta autenticada pelo Firebase</Text>
          <Text style={styles.rotulo}>E-mail verificado</Text>
          <Text style={styles.valor}>{usuario?.emailVerified ? 'Sim' : 'Ainda não'}</Text>
          <Text style={styles.rotulo}>Identificador do usuário</Text>
          <Text selectable style={styles.uid}>{usuario?.uid}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: Cores.fundo },
  conteudo: { padding: 22, alignItems: 'center' },
  avatar: { width: 86, height: 86, borderRadius: 28, backgroundColor: Cores.primaria, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  nome: { color: Cores.texto, fontFamily: Fontes.familia.bold, fontSize: Fontes.tamanho.titulo, marginTop: 16, textAlign: 'center' },
  email: { color: Cores.textoSecundario, fontFamily: Fontes.familia.regular, marginTop: 5 },
  card: { width: '100%', marginTop: 28, padding: 18, backgroundColor: Cores.fundoSecundario, borderRadius: 18, borderWidth: 1, borderColor: Cores.borda },
  rotulo: { color: Cores.textoSecundario, fontFamily: Fontes.familia.semiBold, fontSize: Fontes.tamanho.pequeno, marginTop: 8 },
  valor: { color: Cores.texto, fontFamily: Fontes.familia.regular, marginTop: 4, marginBottom: 8 },
  uid: { color: '#BFD6FF', fontFamily: Fontes.familia.regular, fontSize: Fontes.tamanho.pequeno, marginTop: 4 }
});
