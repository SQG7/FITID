import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { Cabecalho } from '../components/Cabecalho';
import { Cores } from '../constants/Cores';
import { Fontes } from '../constants/Fontes';
import { useAutenticacao } from '../hooks/useAutenticacao';

export default function NovoUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { criarAutenticacaoUsuario, deslogar } = useAutenticacao();

  async function criarConta() {
    if (nome.trim().length < 3 || !email.includes('@') || senha.length < 6) {
      Alert.alert('Confira os dados', 'Preencha nome, e-mail e uma senha com pelo menos 6 caracteres.');
      return;
    }
    try {
      setEnviando(true);
      await criarAutenticacaoUsuario(nome, email, senha);
      await deslogar();
      Alert.alert('Conta criada', 'Usuário criado no Firebase Authentication. Agora faça o login.', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (erro) {
      Alert.alert('Erro', erro instanceof Error ? erro.message : 'Não foi possível criar a conta.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.pagina}>
      <Cabecalho titulo="Nova conta" mostrarVoltar />
      <Text style={styles.titulo}>Criar acesso</Text>
      <Text style={styles.texto}>Cadastro simples usando e-mail e senha no Firebase Authentication.</Text>
      <TextInput value={nome} onChangeText={setNome} placeholder="Nome" placeholderTextColor={Cores.textoSecundario} style={styles.input} />
      <TextInput value={email} onChangeText={setEmail} placeholder="E-mail" placeholderTextColor={Cores.textoSecundario} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
      <TextInput value={senha} onChangeText={setSenha} placeholder="Senha" placeholderTextColor={Cores.textoSecundario} secureTextEntry style={styles.input} />
      <Pressable style={styles.botao} onPress={criarConta} disabled={enviando}>
        <Text style={styles.botaoTexto}>{enviando ? 'Criando...' : 'Criar conta'}</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: Cores.fundo, paddingBottom: 24, gap: 14 },
  titulo: { color: Cores.texto, fontFamily: Fontes.familia.bold, fontSize: Fontes.tamanho.titulo, marginHorizontal: 22, marginTop: 14 },
  texto: { color: Cores.textoSecundario, fontFamily: Fontes.familia.regular, marginHorizontal: 22, lineHeight: 22 },
  input: { marginHorizontal: 22, backgroundColor: Cores.superficie, borderColor: Cores.borda, borderWidth: 1, borderRadius: 14, color: Cores.texto, padding: 14, fontFamily: Fontes.familia.regular },
  botao: { marginHorizontal: 22, marginTop: 4, backgroundColor: Cores.primaria, borderRadius: 14, padding: 14, alignItems: 'center' },
  botaoTexto: { color: Cores.branco, fontFamily: Fontes.familia.bold }
});
