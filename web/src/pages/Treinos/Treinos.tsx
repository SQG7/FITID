import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalMensagem } from '../../components/ModalMensagem/ModalMensagem';
import { itemTreinoSchema, planoTreinoSchema, type ItemTreinoForm, type PlanoTreinoForm } from '../../schemas';
import { api } from '../../services/api';
import type { Aluno, Exercicio, PlanoTreino, TreinoItem } from '../../types';
import { normalizeSearch } from '../../utils/format';
import styles from './Treinos.module.css';

/*
 * APIs desta página:
 * GET /alunos, /exercicios, /planos-treino e /treinos: montam os dados usados nos formulários e listas.
 * POST/PUT /planos-treino: cria ou altera um treino (A, B, C etc.) do aluno.
 * POST/PUT /treinos: cria ou altera um exercício dentro do treino, com séries, repetições e ordem.
 * DELETE /planos-treino/:id e /treinos/:id: removem itens do cadastro ativo preservando o histórico.
 */

export function Treinos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [planos, setPlanos] = useState<PlanoTreino[]>([]);
  const [itens, setItens] = useState<TreinoItem[]>([]);
  const [busca, setBusca] = useState('');
  const [editPlano, setEditPlano] = useState<PlanoTreino | null>(null);
  const [editItem, setEditItem] = useState<TreinoItem | null>(null);
  const [modal, setModal] = useState({ aberto: false, titulo: '', mensagem: '', dados: undefined as unknown });

  const planoForm = useForm<PlanoTreinoForm>({ resolver: zodResolver(planoTreinoSchema), defaultValues: { aluno_id: 0, nome: '', objetivo: '' } });
  const itemForm = useForm<ItemTreinoForm>({ resolver: zodResolver(itemTreinoSchema), defaultValues: { plano_id: 0, exercicio_id: 0, series: 3, repeticoes: 10, ordem: 1 } });

  async function carregar() {
    const [a, e, p, t] = await Promise.all([
      api.get<Aluno[]>('/alunos'), api.get<Exercicio[]>('/exercicios'), api.get<PlanoTreino[]>('/planos-treino'), api.get<TreinoItem[]>('/treinos')
    ]);
    setAlunos(a); setExercicios(e); setPlanos(p); setItens(t);
  }
  useEffect(() => { carregar(); }, []);

  const planosFiltrados = useMemo(() => {
    const termo = normalizeSearch(busca);
    if (!termo) return planos;
    return planos.filter((p) => {
      const relacionados = itens.filter((i) => i.plano_id === p.id).map((i) => `${i.exercicio} ${i.grupo_nome}`).join(' ');
      return normalizeSearch(`${p.nome} ${p.objetivo || ''} ${p.aluno_nome} ${relacionados}`).includes(termo);
    });
  }, [busca, planos, itens]);

  function editarPlano(plano: PlanoTreino) { setEditPlano(plano); planoForm.reset({ aluno_id: plano.aluno_id, nome: plano.nome, objetivo: plano.objetivo || '' }); }
  function editarItem(item: TreinoItem) { setEditItem(item); itemForm.reset({ plano_id: item.plano_id, exercicio_id: item.exercicio_id, series: item.series, repeticoes: item.repeticoes, ordem: item.ordem }); }

  async function salvarPlano(data: PlanoTreinoForm) {
    try {
      const body = editPlano ? { nome: data.nome, objetivo: data.objetivo } : data;
      const r = editPlano ? await api.put(`/planos-treino/${editPlano.id}`, body) : await api.post('/planos-treino', data);
      setModal({ aberto: true, titulo: editPlano ? 'Treino atualizado' : 'Treino criado', mensagem: 'Formulário de treino validado com Zod.', dados: { formulario: data, resposta: r } });
      setEditPlano(null); planoForm.reset({ aluno_id: 0, nome: '', objetivo: '' }); carregar();
    } catch (e) { setModal({ aberto: true, titulo: 'Erro', mensagem: e instanceof Error ? e.message : 'Erro ao salvar treino.', dados: data }); }
  }

  async function salvarItem(data: ItemTreinoForm) {
    try {
      const r = editItem ? await api.put(`/treinos/${editItem.id}`, data) : await api.post('/treinos', data);
      setModal({ aberto: true, titulo: editItem ? 'Exercício atualizado no treino' : 'Exercício adicionado ao treino', mensagem: 'Dados do formulário.', dados: { formulario: data, resposta: r } });
      setEditItem(null); itemForm.reset({ plano_id: 0, exercicio_id: 0, series: 3, repeticoes: 10, ordem: 1 }); carregar();
    } catch (e) { setModal({ aberto: true, titulo: 'Erro', mensagem: e instanceof Error ? e.message : 'Erro ao salvar item.', dados: data }); }
  }

  async function removerPlano(id: number) { if (!confirm('Remover este treino do cadastro ativo?')) return; const r = await api.delete(`/planos-treino/${id}`); setModal({ aberto: true, titulo: 'Treino removido', mensagem: 'Treino removido do cadastro ativo.', dados: r }); carregar(); }
  async function removerItem(id: number) { if (!confirm('Remover este exercício do treino?')) return; const r = await api.delete(`/treinos/${id}`); setModal({ aberto: true, titulo: 'Exercício removido', mensagem: 'Item removido do treino.', dados: r }); carregar(); }

  return <section className="grid"><div className="section-header"><div><h1 className="page-title">Treinos</h1>
  <p className="page-subtitle">Aqui os treinos aparecem agrupados por aluno, com todos os exercícios dentro de cada treino.</p>
  </div><input className={styles.search} placeholder="Buscar por aluno, treino ou exercício" value={busca} onChange={(e) => setBusca(e.target.value)} /></div>
  <div className="grid grid-2"><div className="card"><h2>{editPlano ? 'Editar treino' : 'Criar treino para aluno'}</h2>
  <form className="form-grid" onSubmit={planoForm.handleSubmit(salvarPlano)}><div className="form-row"><label>Aluno</label>
  <select disabled={!!editPlano} {...planoForm.register('aluno_id')}><option value={0}>Selecione</option>{alunos.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
  </select>{planoForm.formState.errors.aluno_id && <span className="error-message">{planoForm.formState.errors.aluno_id.message}</span>}</div>
  <div className="form-row">
    <label>Nome do treino</label>
    <input placeholder="Treino A - Peito e Costas" {...planoForm.register('nome')} />{planoForm.formState.errors.nome && <span className="error-message">{planoForm.formState.errors.nome.message}</span>}</div>
    <div className="form-row"><label>Objetivo</label><input placeholder="Hipertrofia, força, condicionamento..." {...planoForm.register('objetivo')} /></div><div className="actions"><button className="btn">{editPlano ? 'Salvar treino' : 'Criar treino'}</button>{editPlano && <button type="button" className="btn secondary" onClick={() => { setEditPlano(null); planoForm.reset({ aluno_id: 0, nome: '', objetivo: '' }); }}>Cancelar</button>}</div></form></div>
    <div className="card"><h2>{editItem ? 'Editar exercício do treino' : 'Adicionar exercício ao treino'}</h2><form className="form-grid" onSubmit={itemForm.handleSubmit(salvarItem)}><div className="form-row"><label>Treino</label><select {...itemForm.register('plano_id')}><option value={0}>Selecione</option>{planos.map((p) => <option key={p.id} value={p.id}>{p.aluno_nome} - {p.nome}</option>)}</select>{itemForm.formState.errors.plano_id && <span className="error-message">{itemForm.formState.errors.plano_id.message}</span>}</div><div className="form-row"><label>Exercício</label><select {...itemForm.register('exercicio_id')}><option value={0}>Selecione</option>{exercicios.map((e) => <option key={e.id} value={e.id}>{e.nome} ({e.grupo_nome})</option>)}
    </select>{itemForm.formState.errors.exercicio_id && <span className="error-message">{itemForm.formState.errors.exercicio_id.message}</span>}</div>
    <div className="grid grid-3"><div className="form-row"><label>Séries</label><input type="number" {...itemForm.register('series')} /></div>
    <div className="form-row"><label>Repetições</label><input type="number" {...itemForm.register('repeticoes')} /></div><div className="form-row"><label>Ordem</label>
    <input type="number" {...itemForm.register('ordem')} /></div></div><div className="actions"><button className="btn">{editItem ? 'Salvar exercício' : 'Adicionar exercício'}
      </button>{editItem && <button type="button" className="btn secondary" onClick={() => { setEditItem(null); itemForm.reset({ plano_id: 0, exercicio_id: 0, series: 3, repeticoes: 10, ordem: 1 }); }}>Cancelar</button>}
      </div></form></div></div>
      <div className="card grid">{planosFiltrados.length ? planosFiltrados.map((plano) => { const exs = itens.filter((i) => i.plano_id === plano.id); return <div className={styles.planCard} key={plano.id}><div className={styles.planHeader}><div><h2>{plano.nome}</h2><p className={styles.muted}>{plano.aluno_nome} • {plano.objetivo || 'Sem objetivo cadastrado'}</p></div><div className="actions"><button className="btn small secondary" onClick={() => editarPlano(plano)}>Editar</button><button className="btn small danger" onClick={() => removerPlano(plano.id)}>Remover</button></div></div><div className={styles.exList}>{exs.length ? exs.map((item) => <div className={styles.exItem} key={item.id}><div><strong>{item.ordem}. {item.exercicio}</strong><br /><span className={styles.muted}>{item.series} séries × {item.repeticoes} repetições • {item.grupo_nome}</span>
      </div><div className="actions"><button className="btn small secondary" onClick={() => editarItem(item)}>Editar</button>
      <button className="btn small danger" onClick={() => removerItem(item.id)}>Remover</button></div>
      </div>) : <div className="empty-state">Nenhum exercício dentro deste treino.</div>}</div>
      </div>; }) : <div className="empty-state">Nenhum treino encontrado.</div>}</div><ModalMensagem {...modal} onFechar={() => setModal((m) => ({ ...m, aberto: false }))} />
      </section>;
}
