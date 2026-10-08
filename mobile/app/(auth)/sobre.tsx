import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Cabecalho } from '../../components/Cabecalho';
import { Cores } from '../../constants/Cores';
import { Fontes } from '../../constants/Fontes';

const integrantes = [
  'Gustavo Squisatti Silva',
  'Giovanne Vieira Reinaldi',
  'Caleb Costa Jorge',
  'Fabricio De Campos Costa'
];

export default function Sobre() {
  return (
    <View style={styles.pagina}>
      <Cabecalho titulo="Sobre" mostrarVoltar />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>FITID</Text>
        <Text style={styles.subtitulo}>Academia inteligente com identificação RFID</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Objetivo</Text>
          <Text style={styles.texto}>O FITID busca facilitar o acompanhamento do treino dentro da academia. O aluno é identificado por RFID no aparelho, recebe as informações do exercício e o sistema registra o uso para consultas posteriores.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Funcionalidades</Text>
          <Text style={styles.texto}>Painel administrativo, alunos, aparelhos, exercícios, treinos, histórico, estatísticas, lotação pública, simulador RFID e área Mobile do aluno.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Integrantes</Text>
          {integrantes.map((nome) => <Text key={nome} style={styles.integrante}>• {nome}</Text>)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: Cores.fundo },
  conteudo: { padding: 22, gap: 14 },
  titulo: { color: Cores.texto, fontFamily: Fontes.familia.bold, fontSize: Fontes.tamanho.destaque },
  subtitulo: { color: Cores.textoSecundario, fontFamily: Fontes.familia.regular, marginBottom: 8 },
  card: { backgroundColor: Cores.fundoSecundario, borderRadius: 18, borderWidth: 1, borderColor: Cores.borda, padding: 18 },
  cardTitulo: { color: Cores.texto, fontFamily: Fontes.familia.bold, fontSize: Fontes.tamanho.medio, marginBottom: 8 },
  texto: { color: Cores.textoSecundario, fontFamily: Fontes.familia.regular, lineHeight: 22 },
  integrante: { color: Cores.texto, fontFamily: Fontes.familia.regular, lineHeight: 25 }
});
