import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import type { SessaoUso } from '../../types';

/*
 * APIs desta página:
 * GET /sessoes/:token: carrega a sessão ativa criada pela leitura RFID.
 * POST /sessoes/:token/heartbeat: informa periodicamente que a tela/aparelho continua ativo.
 * POST /sessoes/:token/finalizar: recebe o status final e conclui ou cancela a sessão de uso.
 */

const rotuloStatus: Record<string, string> = {
  concluido: 'Exercício concluído e histórico registrado.',
  cancelado: 'Sessão cancelada e aparelho liberado.',
  abandonado: 'Sessão encerrada automaticamente por inatividade.'
};

export function AparelhoTela() {
  const { token = '' } = useParams();
  const [sessao, setSessao] = useState<SessaoUso | null>(null);
  const [erro, setErro] = useState('');
  const [segundos, setSegundos] = useState(45);
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const [mensagemFinal, setMensagemFinal] = useState('');
  const [finalizando, setFinalizando] = useState(false);

  async function carregar() {
    try {
      setErro('');
      const dados = await api.get<SessaoUso>(`/sessoes/${token}`);
      setSessao(dados);
      if (dados.status && dados.status !== 'em_andamento') {
        setMensagemFinal(rotuloStatus[dados.status] || `Sessão finalizada: ${dados.status}.`);
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Sessão não encontrada.');
    }
  }

  useEffect(() => { carregar(); }, [token]);

  useEffect(() => {
    if (!sessao || sessao.status !== 'em_andamento') return;
    const hb = window.setInterval(() => api.post(`/sessoes/${token}/heartbeat`).catch(() => {}), 20000);
    return () => window.clearInterval(hb);
  }, [sessao?.status, token]);

  useEffect(() => {
    if (!sessao || sessao.status !== 'em_andamento' || mensagemFinal) return;
    const t = window.setInterval(() => setSegundos((s) => s > 0 ? s - 1 : 45), 1000);
    return () => window.clearInterval(t);
  }, [sessao?.status, mensagemFinal]);

  async function finalizar(status: 'concluido' | 'cancelado') {
    if (finalizando || sessao?.status !== 'em_andamento') return;
    try {
      setFinalizando(true);
      setErro('');
      const r = await api.post<{ mensagem: string }>(`/sessoes/${token}/finalizar`, { status });
      setMensagemFinal(r.mensagem);
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao finalizar sessão.');
    } finally {
      setFinalizando(false);
    }
  }

  if (erro && !sessao) return <main className="container card" style={{ marginTop: 40 }}><h1>Tela do aparelho</h1><p>{erro}</p><Link className="btn secondary" to="/admin/simulador">Voltar ao simulador</Link></main>;
  if (!sessao) return <main className="container card" style={{ marginTop: 40 }}>Carregando sessão do aparelho...</main>;

  const encerrada = sessao.status !== 'em_andamento';

  return <main className="container" style={{ padding: '36px 0' }}><div className="grid grid-2">
    <div className="card" style={{ display: 'grid', placeItems: 'center', minHeight: 430 }}>
      {sessao.gif && !imagemFalhou ? <img src={sessao.gif} onError={() => setImagemFalhou(true)} alt={`Demonstração de ${sessao.exercicio}`} style={{ maxHeight: 360, borderRadius: 16 }} /> : <div className="empty-state"><strong>Demonstração visual indisponível.</strong><br/>O exercício continua funcionando mesmo sem o GIF externo.</div>}
    </div>
    <div className="card grid">
      <span className={`status-pill ${sessao.status || 'ocupado'}`}>{sessao.status || 'em andamento'}</span>
      <p className="page-subtitle">{sessao.nome} • {sessao.academia_nome}</p>
      <h1 className="page-title" style={{ fontSize: '2.7rem' }}>{sessao.exercicio}</h1>
      <p className="page-subtitle">{sessao.plano_nome} • {sessao.aparelho_nome} ({sessao.grupo_nome})</p>
      <div className="grid grid-3"><div className="empty-state"><strong>{sessao.series}</strong><br/>séries</div><div className="empty-state"><strong>{sessao.repeticoes}</strong><br/>repetições</div><div className="empty-state"><strong>{segundos}s</strong><br/>descanso</div></div>
      {encerrada || mensagemFinal ? <div className="empty-state">{mensagemFinal || rotuloStatus[sessao.status || ''] || `Sessão finalizada: ${sessao.status}.`}<div className="actions" style={{ marginTop: 12 }}><Link className="btn" to="/admin/historico">Ver histórico</Link><Link className="btn secondary" to="/admin/simulador">Nova simulação</Link></div></div> : <div className="actions"><button className="btn" disabled={finalizando} onClick={() => finalizar('concluido')}>{finalizando ? 'Finalizando...' : 'Concluir exercício'}</button><button className="btn danger" disabled={finalizando} onClick={() => finalizar('cancelado')}>Cancelar sessão</button></div>}
      {erro && <div className="empty-state">{erro}</div>}
    </div>
  </div></main>;
}
