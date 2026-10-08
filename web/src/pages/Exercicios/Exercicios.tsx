import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalMensagem } from '../../components/ModalMensagem/ModalMensagem';
import { exercicioSchema, type ExercicioForm } from '../../schemas';
import { api } from '../../services/api';
import type { Exercicio, GrupoEquipamento } from '../../types';

/*
 * APIs desta página:
 * GET /exercicios e GET /grupos-equipamento: carregam exercícios e grupos compatíveis.
 * POST /exercicios: recebe nome, grupo_id, gif e descrição.
 * PUT /exercicios/:id: atualiza o exercício selecionado.
 * DELETE /exercicios/:id: desativa o exercício da biblioteca ativa.
 */

export function Exercicios() {
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [grupos, setGrupos] = useState<GrupoEquipamento[]>([]);
  const [editando, setEditando] = useState<Exercicio | null>(null);
  const [modal, setModal] = useState({ aberto: false, titulo: '', mensagem: '', dados: undefined as unknown });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ExercicioForm>({ resolver: zodResolver(exercicioSchema), defaultValues: { nome: '', grupo_id: 0, gif: '', descricao: '' } });
  async function carregar() { const [e, g] = await Promise.all([api.get<Exercicio[]>('/exercicios'), api.get<GrupoEquipamento[]>('/grupos-equipamento')]); setExercicios(e); setGrupos(g); }
  useEffect(() => { carregar(); }, []);
  function editar(e: Exercicio) { setEditando(e); reset({ nome: e.nome, grupo_id: e.grupo_id, gif: e.gif || '', descricao: e.descricao || '' }); }
  async function remover(e: Exercicio) { if (!confirm(`Remover ${e.nome}?`)) return; const r = await api.delete(`/exercicios/${e.id}`); setModal({ aberto: true, titulo: 'Exercício removido', mensagem: 'Exercício removido da biblioteca ativa.', dados: r }); carregar(); }
  async function onSubmit(data: ExercicioForm) { try { const r = editando ? await api.put(`/exercicios/${editando.id}`, data) : await api.post('/exercicios', data); setModal({ aberto: true, titulo: editando ? 'Exercício atualizado' : 'Exercício cadastrado', mensagem: 'Dados do formulário.', dados: { formulario: data, resposta: r } }); setEditando(null); reset({ nome: '', grupo_id: 0, gif: '', descricao: '' }); carregar(); } catch (e) { setModal({ aberto: true, titulo: 'Erro', mensagem: e instanceof Error ? e.message : 'Erro ao salvar exercício.', dados: data }); } }
  return <section className="grid"><div className="section-header"><div>
    <h1 className="page-title">Biblioteca de exercícios</h1>
    <p className="page-subtitle">Cadastre os exercícios disponíveis na academia e em qual grupo de aparelho eles podem ser feitos.</p></div>
    </div><div className="grid grid-2">
      <div className="card"><h2>{editando ? 'Editar exercício' : 'Cadastrar exercício'}</h2>
      <form className="form-grid" onSubmit={handleSubmit(onSubmit)}><div className="form-row"><label>Nome</label>
      <input placeholder="Supino reto" {...register('nome')} />{errors.nome && <span className="error-message">{errors.nome.message}</span>}</div>
      <div className="form-row"><label>Pode ser feito em</label><select {...register('grupo_id')}>
        <option value={0}>Selecione</option>{grupos.map((g) => <option key={g.id} value={g.id}>{g.nome}</option>)}
        </select>{errors.grupo_id && <span className="error-message">{errors.grupo_id.message}</span>}</div><div className="form-row">
          <label>URL do GIF ou imagem</label><input {...register('gif')} /></div><div className="form-row"><label>Descrição</label>
          <textarea {...register('descricao')} /></div><div className="actions"><button className="btn" disabled={isSubmitting}>{editando ? 'Salvar' : 'Cadastrar'}
            </button>{editando && <button type="button" className="btn secondary" onClick={() => { setEditando(null); reset({ nome: '', grupo_id: 0, gif: '', descricao: '' }); }}>
              Cancelar</button>}</div></form></div>
              <div className="card"><h2>Exemplo</h2>
              <p className="page-subtitle">Supino reto pode ser feito em aparelhos do grupo Supino. Tríceps corda pode ser feito em aparelhos do grupo Polia.</p></div>
              </div><div className="card"><div className="table-wrap"><table><thead><tr><th>ID</th><th>Exercício</th><th>Grupo</th><th>Descrição</th><th>Ações</th></tr>
              </thead><tbody>{exercicios.map((e) => <tr key={e.id}><td>{e.id}</td><td>{e.nome}</td><td>{e.grupo_nome}</td><td>{e.descricao || 'Sem descrição'}</td><td>
                <div className="actions"><button className="btn small secondary" onClick={() => editar(e)}>Editar</button>
                <button className="btn small danger" onClick={() => remover(e)}>Remover</button></div></td></tr>)}</tbody>
                </table></div></div><ModalMensagem {...modal} onFechar={() => setModal((m) => ({ ...m, aberto: false }))} /></section>;
}
