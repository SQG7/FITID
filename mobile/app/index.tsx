import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Cores } from '../constants/Cores';
import { Fontes } from '../constants/Fontes';
import { useAutenticacaoContexto } from '../context/AutenticacaoContexto';
import { useAutenticacao } from '../hooks/useAutenticacao';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { usuario, carregando } = useAutenticacaoContexto();
  const { validarUsuario } = useAutenticacao();

  if (carregando) return <View style={styles.centralizar}><ActivityIndicator color={Cores.primaria} /></View>;
  if (usuario) return <Redirect href="/(auth)/home" />;

  async function entrar() {
    if (!email.trim() || senha.length < 6) {
      Alert.alert('Confira os dados', 'Digite um e-mail válido e uma senha com pelo menos 6 caracteres.');
      return;
    }
    try {
      setEnviando(true);
      await validarUsuario(email, senha);
      router.replace('/(auth)/home');
    } catch (erro) {
      Alert.alert('Não foi possível entrar', erro instanceof Error ? erro.message : 'Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.pagina}>
      <View style={styles.logoArea}>
        <View style={styles.logoIcone}><MaterialCommunityIcons name="dumbbell" size={34} color={Cores.branco} /></View>
        <Text style={styles.logo}>FITID</Text>
        <Text style={styles.subtitulo}>Área do aluno</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Entrar</Text>
        <Text style={styles.texto}>Use seu e-mail e senha cadastrados no Firebase Authentication.</Text>
        <TextInput value={email} onChangeText={setEmail} placeholder="E-mail" placeholderTextColor={Cores.textoSecundario} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
        <TextInput value={senha} onChangeText={setSenha} placeholder="Senha" placeholderTextColor={Cores.textoSecundario} secureTextEntry style={styles.input} />
        <Pressable style={styles.botao} onPress={entrar} disabled={enviando}>
          <Text style={styles.botaoTexto}>{enviando ? 'Entrando...' : 'Entrar'}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/novoUsuario')}><Text style={styles.link}>Criar uma conta</Text></Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pagina: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: Cores.fundo, gap: 28 },
  centralizar: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Cores.fundo },
  logoArea: { alignItems: 'center' },
  logoIcone: { width: 68, height: 68, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: Cores.primaria, marginBottom: 12 },
  logo: { color: Cores.texto, fontFamily: Fontes.familia.bold, fontSize: Fontes.tamanho.destaque },
  subtitulo: { color: Cores.textoSecundario, fontFamily: Fontes.familia.regular, fontSize: Fontes.tamanho.normal },
  card: { backgroundColor: Cores.fundoSecundario, borderColor: Cores.borda, borderWidth: 1, borderRadius: 22, padding: 20, gap: 14 },
  titulo: { color: Cores.texto, fontFamily: Fontes.familia.bold, fontSize: Fontes.tamanho.titulo },
  texto: { color: Cores.textoSecundario, fontFamily: Fontes.familia.regular, lineHeight: 22 },
  input: { backgroundColor: Cores.superficie, borderColor: Cores.borda, borderWidth: 1, borderRadius: 14, color: Cores.texto, paddingHorizontal: 15, paddingVertical: 13, fontFamily: Fontes.familia.regular },
  botao: { backgroundColor: Cores.primaria, borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 4 },
  botaoTexto: { color: Cores.branco, fontFamily: Fontes.familia.bold, fontSize: Fontes.tamanho.normal },
  link: { color: '#BFD6FF', textAlign: 'center', fontFamily: Fontes.familia.semiBold, marginTop: 4 }
});
