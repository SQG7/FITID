import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../services/Firebase';

function mensagemErro(codigo?: string) {
  switch (codigo) {
    case 'auth/email-already-in-use': return 'Este e-mail já possui uma conta.';
    case 'auth/invalid-email': return 'Digite um e-mail válido.';
    case 'auth/invalid-credential': return 'E-mail ou senha inválidos.';
    case 'auth/weak-password': return 'A senha precisa ter pelo menos 6 caracteres.';
    default: return 'Não foi possível concluir a autenticação.';
  }
}

function tratarErro(erro: unknown): never {
  const codigo = typeof erro === 'object' && erro !== null && 'code' in erro
    ? String((erro as { code?: string }).code)
    : undefined;
  throw new Error(mensagemErro(codigo));
}

export function useAutenticacao() {
  async function criarAutenticacaoUsuario(nome: string, email: string, senha: string) {
    try {
      const credencial = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      await updateProfile(credencial.user, { displayName: nome.trim() });
      return credencial.user;
    } catch (erro) {
      tratarErro(erro);
    }
  }

  async function validarUsuario(email: string, senha: string) {
    try {
      const credencial = await signInWithEmailAndPassword(auth, email.trim(), senha);
      return credencial.user;
    } catch (erro) {
      tratarErro(erro);
    }
  }

  async function deslogar() {
    await signOut(auth);
  }

  return { criarAutenticacaoUsuario, validarUsuario, deslogar };
}
