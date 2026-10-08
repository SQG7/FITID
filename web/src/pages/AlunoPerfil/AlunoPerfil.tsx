import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { AlunoLogado, HistoricoUso, TreinoItem } from '../../types';
import { formatDateTime } from '../../utils/format';
import styles from './AlunoPerfil.module.css';

/*
 * APIs desta página:
 * GET /aluno-logado: confirma a sessão do aluno identificado.
 * GET /alunos/:id/treinos: retorna os exercícios do treino do aluno.
 * GET /alunos/:id/historico-recente: retorna as utilizações recentes.
 * POST /logout-aluno: encerra a sessão do aluno.
 */

export function AlunoPerfil() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<AlunoLogado | null>(null);
  const [treinos, setTreinos] = useState<TreinoItem[]>([]);
  const [historico, setHistorico] = useState<HistoricoUso[]>([]);
  const [erro, setErro] = useState('');
  async function carregar() { try { const logado = await api.get<{ logado: boolean; aluno: AlunoLogado }>('/aluno-logado'); if (!logado.logado) { navigate('/aluno-login'); return; } setAluno(logado.aluno); const [t, h] = await Promise.all([api.get<TreinoItem[]>(`/alunos/${logado.aluno.id}/treinos`), api.get<HistoricoUso[]>(`/alunos/${logado.aluno.id}/historico-recente`)]); setTreinos(t); setHistorico(h); } catch (e) { setErro(e instanceof Error ? e.message : 'Faça login novamente.'); } }
  useEffect(() => { carregar(); }, []);
  const agrupados = useMemo(() => { const map = new Map<number, { nome: string; objetivo: string | null; itens: TreinoItem[] }>(); treinos.forEach((item) => { if (!map.has(item.plano_id)) map.set(item.plano_id, { nome: item.plano_nome, objetivo: item.objetivo, itens: [] }); map.get(item.plano_id)!.itens.push(item); }); return Array.from(map.values()); }, [treinos]);
  async function sair() { await api.post('/logout-aluno'); navigate('/aluno-login'); }
  return <main className={styles.page}><div className="container grid">
    <div className="section-header"><div><span className="badge">Perfil do aluno</span>
    <h1 className="page-title">Olá, {aluno?.nome || 'aluno'}</h1><p className="page-subtitle">Academia: {aluno?.academia_nome || '---'} • RFID: {aluno?.rfid || '---'}</p>
    </div><div className="actions"><Link className="btn secondary" to={`/publico?academia=${aluno?.academia_codigo || 'fitcenter'}`}>Ver lotação</Link>
    <button className="btn secondary" onClick={sair}>Sair</button></div></div>{erro && <div className="empty-state">{erro}</div>}<div className="grid grid-2">
      <div className="card"><h2>Meus treinos</h2><div className="grid">{agrupados.length ? agrupados.map((plano) => <div className={styles.planCard} key={plano.nome}>
        <h3>{plano.nome}</h3><p className={styles.muted}>{plano.objetivo || 'Sem objetivo cadastrado'}</p>{plano.itens.map((item) => <div className={styles.exercise} key={item.id}>
          <strong>{item.ordem}. {item.exercicio}</strong><br /><span className={styles.muted}>{item.series} séries × {item.repeticoes} repetições • {item.grupo_nome}</span>
          </div>)}</div>) : <div className="empty-state">Nenhum treino cadastrado.</div>}</div></div><div className="card"><h2>Histórico recente</h2>
          <div className="grid">{historico.length ? historico.map((h, index) => <div className={styles.exercise} key={index}><strong>{h.exercicio}</strong>
          <br /><span className={styles.muted}>{h.aparelho_nome} • {formatDateTime(h.data_execucao)}</span></div>) : <div className="empty-state">Nenhum histórico registrado ainda.
            </div>}</div>
            </div></div>
            </div></main>;
}
