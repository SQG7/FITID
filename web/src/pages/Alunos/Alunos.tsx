import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalMensagem } from '../../components/ModalMensagem/ModalMensagem';
import { alunoSchema, type AlunoForm } from '../../schemas';
import { api } from '../../services/api';
import type { Aluno } from '../../types';

/*
 * APIs desta página:
 * GET /alunos: lista os alunos da academia autenticada. Retorna Aluno[].
 * POST /alunos: recebe nome, RFID e status para cadastrar um aluno.
 * PUT /alunos/:id: recebe os mesmos campos para atualizar um aluno específico.
 * DELETE /alunos/:id: desativa o aluno mantendo o histórico já registrado.
 */

export function Alunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [editando, setEditando] = useState<Aluno | null>(null);
  const [erro, setErro] = useState('');
  const [modal, setModal] = useState({ aberto: false, titulo: '', mensagem: '', dados: undefined as unknown });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AlunoForm>({
    resolver: zodResolver(alunoSchema),
    defaultValues: { nome: '', rfid: '', status: 'ativo' }
  });

  async function carregar() {
    try {
      setErro('');
      setAlunos(await api.get<Aluno[]>('/alunos'));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar alunos.');
    }
  }

  useEffect(() => { carregar(); }, []);

  function editar(aluno: Aluno) {
    setEditando(aluno);
    reset({ nome: aluno.nome, rfid: aluno.rfid, status: aluno.status });
  }

  async function inativar(aluno: Aluno) {
    if (!confirm(`Inativar ${aluno.nome}? O histórico será preservado e o aluno poderá ser reativado depois.`)) return;
    try {
      const response = await api.delete(`/alunos/${aluno.id}`);
      setModal({ aberto: true, titulo: 'Aluno inativado', mensagem: 'O acesso por RFID foi bloqueado, mas o cadastro e o histórico foram preservados.', dados: response });
      if (editando?.id === aluno.id) {
        setEditando(null);
        reset({ nome: '', rfid: '', status: 'ativo' });
      }
      await carregar();
    } catch (e) {
      setModal({ aberto: true, titulo: 'Erro', mensagem: e instanceof Error ? e.message : 'Não foi possível inativar o aluno.', dados: aluno });
    }
  }

  async function reativar(aluno: Aluno) {
    try {
      const response = await api.put(`/alunos/${aluno.id}`, { nome: aluno.nome, rfid: aluno.rfid, status: 'ativo' });
      setModal({ aberto: true, titulo: 'Aluno reativado', mensagem: 'O aluno voltou a poder usar o RFID e acessar o protótipo.', dados: response });
      await carregar();
    } catch (e) {
      setModal({ aberto: true, titulo: 'Erro', mensagem: e instanceof Error ? e.message : 'Não foi possível reativar o aluno.', dados: aluno });
    }
  }

  async function onSubmit(data: AlunoForm) {
    try {
      const response = editando
        ? await api.put(`/alunos/${editando.id}`, data)
        : await api.post('/alunos', data);
      setModal({ aberto: true, titulo: editando ? 'Aluno atualizado' : 'Aluno cadastrado', mensagem: 'Dados salvos com sucesso.', dados: { formulario: data, resposta: response } });
      setEditando(null);
      reset({ nome: '', rfid: '', status: 'ativo' });
      await carregar();
    } catch (error) {
      setModal({ aberto: true, titulo: 'Erro', mensagem: error instanceof Error ? error.message : 'Erro ao salvar aluno.', dados: data });
    }
  }

  return (
    <section className="grid">
      <div className="section-header"><div><h1 className="page-title">Alunos</h1><p className="page-subtitle">Cadastros vinculados à academia logada. Alunos inativos mantêm histórico e podem ser reativados.</p></div></div>
      {erro && <div className="empty-state">{erro} <button className="btn small secondary" onClick={carregar}>Tentar novamente</button></div>}
      <div className="grid grid-2">
        <div className="card">
          <h2>{editando ? 'Editar aluno' : 'Cadastrar aluno'}</h2>
          <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row"><label>Nome</label><input {...register('nome')} />{errors.nome && <span className="error-message">{errors.nome.message}</span>}</div>
            <div className="form-row"><label>RFID</label><input {...register('rfid')} />{errors.rfid && <span className="error-message">{errors.rfid.message}</span>}</div>
            <div className="form-row"><label>Status</label><select {...register('status')}><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select>{errors.status && <span className="error-message">{errors.status.message}</span>}</div>
            <div className="actions"><button className="btn" disabled={isSubmitting}>{editando ? 'Salvar alteração' : 'Cadastrar'}</button>{editando && <button type="button" className="btn secondary" onClick={() => { setEditando(null); reset({ nome: '', rfid: '', status: 'ativo' }); }}>Cancelar</button>}</div>
          </form>
        </div>
        <div className="card">
          <h2>Orientação</h2>
          <p className="page-subtitle">Aluno inativo não acessa o perfil e não usa RFID no aparelho. Para retorno à academia, basta reativá-lo: o histórico anterior continua ligado ao mesmo cadastro.</p>
        </div>
      </div>
      <div className="card">
        <div className="table-wrap"><table><thead><tr><th>ID</th><th>Nome</th><th>RFID</th><th>Status</th><th>Ações</th></tr></thead><tbody>{alunos.map((aluno) => (<tr key={aluno.id}><td>{aluno.id}</td><td>{aluno.nome}</td><td>{aluno.rfid}</td><td><span className={`status-pill ${aluno.status}`}>{aluno.status}</span></td><td><div className="actions"><button className="btn small secondary" onClick={() => editar(aluno)}>Editar</button>{aluno.status === 'ativo' ? <button className="btn small danger" onClick={() => inativar(aluno)}>Inativar</button> : <button className="btn small" onClick={() => reativar(aluno)}>Reativar</button>}</div></td></tr>))}</tbody></table></div>
      </div>
      <ModalMensagem {...modal} onFechar={() => setModal((m) => ({ ...m, aberto: false }))} />
    </section>
  );
}
