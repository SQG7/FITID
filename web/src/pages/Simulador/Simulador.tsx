import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import type { Aluno, Aparelho, SessaoUso } from '../../types';

/*
 * APIs desta página:
 * GET /alunos e /aparelhos: carregam os dados usados na simulação.
 * GET /dispositivo/:codigo/:aparelhoId/:rfid: simula a leitura RFID e cria/retorna uma sessão de uso compatível.
 * POST /demo/liberar-sessoes: encerra sessões de demonstração para liberar os aparelhos.
 */

export function Simulador() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [aparelhos, setAparelhos] = useState<Aparelho[]>([]);
  const [alunoId, setAlunoId] = useState(0);
  const [aparelhoId, setAparelhoId] = useState(0);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const aluno = useMemo(() => alunos.find((a) => a.id === alunoId), [alunos, alunoId]);

  async function carregar() {
    try {
      const [a, ap] = await Promise.all([api.get<Aluno[]>('/alunos'), api.get<Aparelho[]>('/aparelhos')]);
      setAlunos(a.filter((x) => x.status === 'ativo'));
      setAparelhos(ap);
      setAlunoId((atual) => atual && a.some((x) => x.id === atual) ? atual : (a.find((x) => x.status === 'ativo')?.id || 0));
      setAparelhoId((atual) => atual && ap.some((x) => x.id === atual && x.status === 'livre') ? atual : (ap.find((x) => x.status === 'livre')?.id || 0));
    } catch (e) { setErro(e instanceof Error ? e.message : 'Erro ao carregar simulador.'); }
  }

  useEffect(() => {
    carregar();
    const id = window.setInterval(carregar, 5000);
    return () => window.clearInterval(id);
  }, []);

  async function iniciar() {
    if (!usuario || !aluno || !aparelhoId) return;
    try {
      setCarregando(true); setErro('');
      const sessao = await api.get<SessaoUso>(`/dispositivo/${usuario.academia_codigo}/${aparelhoId}/${encodeURIComponent(aluno.rfid)}`);
      navigate(`/aparelho/${sessao.sessao_token}`);
    } catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível iniciar a sessão.'); }
    finally { setCarregando(false); }
  }

  async function liberarDemo() {
    if (!confirm('Liberar todas as sessões abertas desta academia para a demonstração?')) return;
    try {
      const r = await api.post<{ mensagem: string }>('/demo/liberar-sessoes');
      alert(r.mensagem); await carregar();
    } catch (e) { setErro(e instanceof Error ? e.message : 'Erro ao liberar sessões.'); }
  }

  return <section className="grid">
    <div className="section-header"><div><h1 className="page-title">Simulador RFID</h1><p className="page-subtitle">Substitui temporariamente o ESP32 + RC522 na apresentação. Escolha aluno e aparelho e inicie o fluxo real da API.</p></div><button className="btn danger" onClick={liberarDemo}>Liberar ocupações da demo</button></div>
    {erro && <div className="empty-state">{erro}</div>}
    <div className="grid grid-2">
      <div className="card form-grid">
        <div className="form-row"><label>Aluno / pulseira</label><select value={alunoId} onChange={(e) => setAlunoId(Number(e.target.value))}>{alunos.map((a) => <option key={a.id} value={a.id}>{a.nome} • RFID {a.rfid}</option>)}</select></div>
        <div className="form-row"><label>Aparelho físico</label><select value={aparelhoId} onChange={(e) => setAparelhoId(Number(e.target.value))}>{aparelhos.map((a) => <option key={a.id} value={a.id} disabled={a.status !== 'livre'}>{a.nome} • {a.grupo_nome} • {a.status}</option>)}</select></div>
        <button className="btn" onClick={iniciar} disabled={carregando || !alunoId || !aparelhoId}>{carregando ? 'Identificando...' : 'Aproximar pulseira / iniciar sessão'}</button>
      </div>
      <div className="card"><h2>O que será demonstrado</h2><p className="page-subtitle">1. identifica a academia e a máquina; 2. reconhece o RFID do aluno; 3. encontra exercício compatível; 4. ocupa somente o aparelho escolhido; 5. abre a tela do equipamento; 6. ao finalizar, registra histórico e libera a máquina.</p></div>
    </div>
  </section>;
}
