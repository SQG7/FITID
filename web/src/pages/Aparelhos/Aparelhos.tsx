import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalMensagem } from '../../components/ModalMensagem/ModalMensagem';
import { aparelhoSchema, type AparelhoForm } from '../../schemas';
import { api } from '../../services/api';
import type { Aparelho, GrupoEquipamento } from '../../types';

/*
 * APIs desta página:
 * GET /aparelhos e GET /grupos-equipamento: carregam aparelhos e grupos da academia.
 * POST /aparelhos: recebe nome, grupo_id e status.
 * PUT /aparelhos/:id: atualiza o aparelho selecionado.
 * DELETE /aparelhos/:id: remove o aparelho do cadastro ativo sem apagar o histórico.
 */

export function Aparelhos() {
  const [aparelhos, setAparelhos] = useState<Aparelho[]>([]);
  const [grupos, setGrupos] = useState<GrupoEquipamento[]>([]);
  const [editando, setEditando] = useState<Aparelho | null>(null);
  const [modal, setModal] = useState({ aberto: false, titulo: '', mensagem: '', dados: undefined as unknown });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AparelhoForm>({ resolver: zodResolver(aparelhoSchema), defaultValues: { nome: '', grupo_id: 0, status: 'livre' } });
  async function carregar() { const [a, g] = await Promise.all([api.get<Aparelho[]>('/aparelhos'), api.get<GrupoEquipamento[]>('/grupos-equipamento')]); setAparelhos(a); setGrupos(g); }
  useEffect(() => { carregar(); }, []);
  function editar(a: Aparelho) { if (a.status === 'ocupado') return; setEditando(a); reset({ nome: a.nome, grupo_id: a.grupo_id, status: a.status as 'livre' | 'manutencao' | 'offline' }); }
  async function remover(a: Aparelho) { if (!confirm(`Remover ${a.nome}?`)) return; const r = await api.delete(`/aparelhos/${a.id}`); setModal({ aberto: true, titulo: 'Aparelho removido', mensagem: 'Histórico preservado.', dados: r }); carregar(); }
  async function onSubmit(data: AparelhoForm) { try { const r = editando ? await api.put(`/aparelhos/${editando.id}`, data) : await api.post('/aparelhos', data); setModal({ aberto: true, titulo: editando ? 'Aparelho atualizado' : 'Aparelho cadastrado', mensagem: 'Dados do formulário.', dados: { formulario: data, resposta: r } }); setEditando(null); reset({ nome: '', grupo_id: 0, status: 'livre' }); carregar(); } catch (e) { setModal({ aberto: true, titulo: 'Erro', mensagem: e instanceof Error ? e.message : 'Erro ao salvar aparelho.', dados: data }); } }
  return <section className="grid"><div className="section-header"><div><h1 className="page-title">Aparelhos</h1>
  <p className="page-subtitle">Cadastro de aparelhos físicos da academia. O grupo define quais exercícios podem aparecer nele.</p></div>
  </div><div className="grid grid-2"><div className="card"><h2>{editando ? 'Editar aparelho' : 'Cadastrar aparelho'}</h2>
  <form className="form-grid" onSubmit={handleSubmit(onSubmit)}><div className="form-row"><label>Nome do aparelho físico</label>
  <input placeholder="Supino 01" {...register('nome')} />{errors.nome && <span className="error-message">{errors.nome.message}</span>}</div>
  <div className="form-row"><label>Serve para exercícios de</label><select {...register('grupo_id')}>
    <option value={0}>Selecione</option>{grupos.map((g) => <option key={g.id} value={g.id}>{g.nome}</option>)}</select>{errors.grupo_id && <span className="error-message">{errors.grupo_id.message}</span>}</div><div className="form-row"><label>Status</label>
    <select {...register('status')}><option value="livre">Livre</option>
    <option value="manutencao">Manutenção</option><option value="offline">Offline</option>
    </select>{errors.status && <span className="error-message">{errors.status.message}</span>}</div>
    <div className="actions"><button className="btn" disabled={isSubmitting}>{editando ? 'Salvar' : 'Cadastrar'}</button>{editando && <button type="button" className="btn secondary" onClick={() => { setEditando(null); reset({ nome: '', grupo_id: 0, status: 'livre' }); }}>Cancelar</button>}</div>
    </form></div>
    <div className="card"><h2>Uso no hardware</h2>
    <p className="page-subtitle">No protótipo real, cada ESP32 terá o ID do aparelho físico configurado. O status “ocupado” é controlado automaticamente pela sessão RFID; manualmente são usados livre, manutenção e offline.</p></div>
    </div><div className="card"><div className="table-wrap"><table>
      <thead><tr><th>ID</th><th>Aparelho</th><th>Grupo</th><th>Status</th><th>Ações</th></tr>
      </thead><tbody>{aparelhos.map((a) => <tr key={a.id}><td>{a.id}</td><td>{a.nome}</td><td>{a.grupo_nome}</td>
      <td><span className={`status-pill ${a.status}`}>{a.status}</span></td><td><div className="actions">
        <button className="btn small secondary" disabled={a.status === 'ocupado'} title={a.status === 'ocupado' ? 'Finalize a sessão antes de editar' : undefined} onClick={() => editar(a)}>Editar</button><button className="btn small danger" onClick={() => remover(a)}>Remover</button>
        </div></td></tr>)}</tbody></table></div></div><ModalMensagem {...modal} onFechar={() => setModal((m) => ({ ...m, aberto: false }))} /></section>;
}
