import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalMensagem } from '../../components/ModalMensagem/ModalMensagem';
import { grupoSchema, type GrupoForm } from '../../schemas';
import { api } from '../../services/api';
import type { GrupoEquipamento } from '../../types';

/*
 * APIs desta página:
 * GET /grupos-equipamento: retorna os grupos ativos da academia.
 * POST /grupos-equipamento: recebe o nome do novo grupo.
 * PUT /grupos-equipamento/:id: atualiza o nome do grupo.
 * DELETE /grupos-equipamento/:id: desativa o grupo quando ele não está em uso.
 */

export function Grupos() {
  const [grupos, setGrupos] = useState<GrupoEquipamento[]>([]);
  const [editando, setEditando] = useState<GrupoEquipamento | null>(null);
  const [modal, setModal] = useState({ aberto: false, titulo: '', mensagem: '', dados: undefined as unknown });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<GrupoForm>({ resolver: zodResolver(grupoSchema), defaultValues: { nome: '' } });

  async function carregar() { setGrupos(await api.get<GrupoEquipamento[]>('/grupos-equipamento')); }
  useEffect(() => { carregar(); }, []);

  function editar(grupo: GrupoEquipamento) { setEditando(grupo); reset({ nome: grupo.nome }); }
  async function remover(grupo: GrupoEquipamento) {
    if (!confirm(`Remover o grupo ${grupo.nome}?`)) return;
    try { const r = await api.delete(`/grupos-equipamento/${grupo.id}`); setModal({ aberto: true, titulo: 'Grupo removido', mensagem: 'Grupo removido do cadastro ativo.', dados: r }); carregar(); }
    catch (e) { setModal({ aberto: true, titulo: 'Não foi possível remover', mensagem: e instanceof Error ? e.message : 'Erro.', dados: grupo }); }
  }
  async function onSubmit(data: GrupoForm) {
    try {
      const r = editando ? await api.put(`/grupos-equipamento/${editando.id}`, data) : await api.post('/grupos-equipamento', data);
      setModal({ aberto: true, titulo: editando ? 'Grupo atualizado' : 'Grupo cadastrado', mensagem: 'Dados do formulário exibidos conforme solicitado na tarefa.', dados: { formulario: data, resposta: r } });
      setEditando(null); reset({ nome: '' }); carregar();
    } catch (e) { setModal({ aberto: true, titulo: 'Erro', mensagem: e instanceof Error ? e.message : 'Erro ao salvar grupo.', dados: data }); }
  }

  return <section className="grid"><div className="section-header"><div>
    <h1 className="page-title">Grupos de equipamento</h1>
    <p className="page-subtitle">O grupo indica em quais aparelhos um exercício pode ser feito. Ex.: Supino 01 e Supino 02 pertencem ao grupo Supino.</p>
    </div></div><div className="grid grid-2"><div className="card"><h2>{editando ? 'Editar grupo' : 'Cadastrar grupo'}</h2>
    <form className="form-grid" onSubmit={handleSubmit(onSubmit)}><div className="form-row"><label>Nome do grupo</label>
    <input placeholder="Supino, Polia, Leg Press..." {...register('nome')} />{errors.nome && <span className="error-message">{errors.nome.message}</span>}</div>
    <div className="actions"><button className="btn" disabled={isSubmitting}>{editando ? 'Salvar' : 'Cadastrar'}</button>{editando && <button type="button" className="btn secondary" onClick={() => { setEditando(null); reset({ nome: '' }); }}>Cancelar</button>}</div>
    </form></div><div className="card"><h2>Por que existe?</h2>
    <p className="page-subtitle">Sem grupo, o sistema teria que ligar um exercício a cada aparelho físico. Com grupo, Supino reto pode funcionar no Supino 01 ou Supino 02.</p>
    </div></div><div className="card"><div className="table-wrap"><table><thead><tr><th>ID</th><th>Grupo</th><th>Ações</th></tr>
    </thead><tbody>{grupos.map((g) => <tr key={g.id}><td>{g.id}</td><td>{g.nome}</td><td><div className="actions">
      <button className="btn small secondary" onClick={() => editar(g)}>Editar</button><button className="btn small danger" onClick={() => remover(g)}>Remover</button>
      </div></td></tr>)}</tbody></table></div></div><ModalMensagem {...modal} onFechar={() => setModal((m) => ({ ...m, aberto: false }))} /></section>;
}
