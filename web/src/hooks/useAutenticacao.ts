import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User
} from 'firebase/auth';
import { auth } from '../firebase/Firebase';

function mensagemFirebase(codigo?: string) {
  switch (codigo) {
    case 'auth/email-already-in-use': return 'Este e-mail já está cadastrado no Firebase Authentication.';
    case 'auth/invalid-email': return 'Digite um e-mail válido.';
    case 'auth/invalid-credential': return 'E-mail ou senha inválidos.';
    case 'auth/weak-password': return 'A senha precisa ter pelo menos 6 caracteres.';
    case 'auth/too-many-requests': return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
    default: return 'Não foi possível concluir a autenticação no Firebase.';
  }
}

export function useAutenticacao() {
  async function criarAutenticacaoUsuario(email: string, senha: string, nome: string): Promise<User> {
    try {
      const credencial = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      await updateProfile(credencial.user, { displayName: nome.trim() });
      return credencial.user;
    } catch (erro) {
      const codigo = typeof erro === 'object' && erro !== null && 'code' in erro
        ? String((erro as { code?: string }).code)
        : undefined;
      throw new Error(mensagemFirebase(codigo));
    }
  }

  async function validarUsuario(email: string, senha: string): Promise<User> {
    try {
      const credencial = await signInWithEmailAndPassword(auth, email.trim(), senha);
      return credencial.user;
    } catch (erro) {
      const codigo = typeof erro === 'object' && erro !== null && 'code' in erro
        ? String((erro as { code?: string }).code)
        : undefined;
      throw new Error(mensagemFirebase(codigo));
    }
  }

  async function deslogar() {
    await signOut(auth);
  }

  async function removerUsuarioCriado(user: User) {
    await deleteUser(user);
  }

  return { criarAutenticacaoUsuario, validarUsuario, deslogar, removerUsuarioCriado };
}
