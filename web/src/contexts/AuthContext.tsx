import { onAuthStateChanged, type User } from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { auth } from '../firebase/Firebase';
import { useAutenticacao } from '../hooks/useAutenticacao';
import { api } from '../services/api';
import type { UsuarioLogado } from '../types';

interface AuthContextData {
  usuario: UsuarioLogado | null;
  usuarioFirebase: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<UsuarioLogado>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [usuarioFirebase, setUsuarioFirebase] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { validarUsuario, deslogar } = useAutenticacao();

  /*
   * API GET /usuario-logado
   * Objetivo: recuperar a sessão administrativa já criada no Node/Express.
   * Parâmetros: não recebe corpo; o cookie de sessão é enviado pelo navegador.
   * Retorno: { logado, usuario }, com os dados do administrador e da academia.
   */
  const refresh = useCallback(async () => {
    try {
      const response = await api.get<{ logado: boolean; usuario?: UsuarioLogado }>('/usuario-logado');
      setUsuario(response.logado && response.usuario ? response.usuario : null);
    } catch {
      setUsuario(null);
    }
  }, []);

  useEffect(() => {
    const cancelarObservacao = onAuthStateChanged(auth, async (firebaseUser) => {
      setUsuarioFirebase(firebaseUser);

      if (!firebaseUser) {
        setUsuario(null);
        setLoading(false);
        return;
      }

      await refresh();
      setLoading(false);
    });

    return cancelarObservacao;
  }, [refresh]);

  /*
   * Login em duas etapas: o Firebase Authentication valida e-mail/senha e o endpoint
   * POST /login mantém a sessão do backend atual, que continua responsável pelo MySQL
   * e pelo isolamento dos dados de cada academia.
   */
  const login = useCallback(async (email: string, senha: string) => {
    await validarUsuario(email, senha);
    try {
      const response = await api.post<{ sucesso: boolean; usuario: UsuarioLogado; mensagem?: string }>('/login', { email, senha });
      if (!response.sucesso) throw new Error(response.mensagem || 'Login inválido.');
      setUsuario(response.usuario);
      return response.usuario;
    } catch (erro) {
      await deslogar().catch(() => undefined);
      throw erro;
    }
  }, [deslogar, validarUsuario]);

  const logout = useCallback(async () => {
    await Promise.allSettled([api.post('/logout'), deslogar()]);
    setUsuario(null);
    setUsuarioFirebase(null);
  }, [deslogar]);

  const value = useMemo(
    () => ({ usuario, usuarioFirebase, loading, login, logout, refresh }),
    [usuario, usuarioFirebase, loading, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
