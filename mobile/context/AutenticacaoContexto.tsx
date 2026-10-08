import { onAuthStateChanged, type User } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { auth } from '../services/Firebase';

interface AutenticacaoContextoDados {
  usuario: User | null;
  carregando: boolean;
}

const AutenticacaoContexto = createContext<AutenticacaoContextoDados | null>(null);

export function AutenticacaoProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, (usuarioAtual) => {
      setUsuario(usuarioAtual);
      setCarregando(false);
    });
    return cancelar;
  }, []);

  const valor = useMemo(() => ({ usuario, carregando }), [usuario, carregando]);
  return <AutenticacaoContexto.Provider value={valor}>{children}</AutenticacaoContexto.Provider>;
}

export function useAutenticacaoContexto() {
  const contexto = useContext(AutenticacaoContexto);
  if (!contexto) throw new Error('useAutenticacaoContexto deve estar dentro do AutenticacaoProvider.');
  return contexto;
}
