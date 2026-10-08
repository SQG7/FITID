import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Aluno, EstatisticasAvancadas } from '../../types';

/*
 * APIs desta página:
 * GET /alunos: carrega os alunos disponíveis para seleção.
 * GET /estatisticas-avancadas/:aluno: recebe o id do aluno na URL e retorna resumo, favorito, último exercício e ranking.
 */

export function Estatisticas() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoId, setAlunoId] = useState(0);
  const [dados, setDados] = useState<EstatisticasAvancadas | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => { api.get<Aluno[]>('/alunos').then((a) => { setAlunos(a); setAlunoId(a[0]?.id || 0); }).catch((e) => setErro(e.message)); }, []);
  useEffect(() => { if (alunoId) api.get<EstatisticasAvancadas>(`/estatisticas-avancadas/${alunoId}`).then(setDados).catch((e) => setErro(e.message)); }, [alunoId]);

  const max = Math.max(1, ...(dados?.ranking.map((x) => Number(x.total)) || [1]));
  return <section className="grid"><div className="section-header"><div><h1 className="page-title">Estatísticas</h1><p className="page-subtitle">Resumo calculado a partir do histórico registrado.</p></div></div>
    {erro && <div className="empty-state">{erro}</div>}
    <div className="card form-row"><label>Aluno</label><select value={alunoId} onChange={(e) => setAlunoId(Number(e.target.value))}>{alunos.map((a) => <option value={a.id} key={a.id}>{a.nome}</option>)}</select></div>
    {dados && <><div className="grid grid-3"><div className="card"><h2>{dados.resumo.total_treinos}</h2><p className="page-subtitle">registros no histórico</p></div><div className="card"><h2>{dados.resumo.exercicios_diferentes}</h2><p className="page-subtitle">exercícios diferentes</p></div><div className="card"><h2>{dados.favorito.exercicio}</h2><p className="page-subtitle">exercício mais frequente</p></div></div>
    <div className="card"><h2>Exercícios mais registrados</h2><div className="grid">{dados.ranking.map((item) => <div key={item.exercicio}><div className="section-header" style={{ marginBottom: 6 }}><strong>{item.exercicio}</strong><span>{item.total}</span></div><div style={{ height: 12, borderRadius: 99, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}><div style={{ width: `${Number(item.total) / max * 100}%`, height: '100%', background: 'linear-gradient(90deg,#2f7cff,#16c784)' }} /></div></div>)}</div></div></>}
  </section>;
}
