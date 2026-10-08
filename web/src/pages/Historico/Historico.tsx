import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { HistoricoUso } from '../../types';
import { formatDateTime } from '../../utils/format';

/*
 * API GET /historico
 * Objetivo: listar o histórico de utilização dos aparelhos da academia autenticada.
 * Não recebe parâmetros. Retorna registros com aluno, exercício, aparelho, data, duração e status.
 */

export function Historico() {
  const [historico, setHistorico] = useState<HistoricoUso[]>([]);
  const [erro, setErro] = useState('');
  async function carregar() { try { setHistorico(await api.get<HistoricoUso[]>('/historico')); } catch (e) { setErro(e instanceof Error ? e.message : 'Erro ao carregar histórico.'); } }
  useEffect(() => { carregar(); }, []);
  return <section className="grid"><div className="section-header"><div><h1 className="page-title">Histórico</h1>
  <p className="page-subtitle">Últimas sessões de uso registradas, diferenciando conclusão, cancelamento e abandono.</p></div>
  <button className="btn secondary" onClick={carregar}>Atualizar</button></div>{erro && <div className="empty-state">{erro}</div>}<div className="card">
    <div className="table-wrap"><table><thead><tr><th>Data</th><th>Aluno</th><th>Exercício</th><th>Aparelho</th><th>Grupo</th><th>Duração</th><th>Status</th></tr></thead>
    <tbody>{historico.map((h, index) => <tr key={`${h.id}-${index}`}><td>{formatDateTime(h.data_execucao)}</td><td>{h.aluno_nome || h.aluno_id}</td>
    <td>{h.exercicio}</td><td>{h.aparelho_nome}</td><td>{h.grupo_nome}</td><td>{h.tempo_execucao != null ? `${h.tempo_execucao}s` : '—'}</td><td><span className={`status-pill ${h.status}`}>{h.status}</span></td></tr>)}</tbody>
    </table></div></div></section>;
}
