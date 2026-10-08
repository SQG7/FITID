import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ModalMensagem } from '../../components/ModalMensagem/ModalMensagem';
import { useAutenticacao } from '../../hooks/useAutenticacao';
import { api } from '../../services/api';
import { cadastroAcademiaSchema, type CadastroAcademiaForm } from '../../schemas';
import styles from './AuthPages.module.css';

export function CadastroAcademia() {
  const [modal, setModal] = useState({ aberto: false, titulo: '', mensagem: '', dados: undefined as unknown });
  const { criarAutenticacaoUsuario, deslogar, removerUsuarioCriado } = useAutenticacao();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CadastroAcademiaForm>({
    resolver: zodResolver(cadastroAcademiaSchema),
    defaultValues: { nomeAcademia: '', codigo: '', nomeAdmin: '', email: '', senha: '' }
  });

  /*
   * Firebase Authentication cria a credencial de e-mail/senha.
   * API POST /academias grava academia e administrador no MySQL.
   * Envio: nomeAcademia, codigo, nomeAdmin, email e senha.
   * Retorno: situação do cadastro e os dados básicos da academia criada.
   */
  async function onSubmit(data: CadastroAcademiaForm) {
    let usuarioCriado = null;
    try {
      usuarioCriado = await criarAutenticacaoUsuario(data.email, data.senha, data.nomeAdmin);
      const response = await api.post('/academias', data);
      await deslogar();
      setModal({
        aberto: true,
        titulo: 'Academia cadastrada',
        mensagem: 'Conta criada no Firebase Authentication e academia cadastrada no FITID.',
        dados: response
      });
      reset();
    } catch (error) {
      if (usuarioCriado) {
        await removerUsuarioCriado(usuarioCriado).catch(() => undefined);
        await deslogar().catch(() => undefined);
      }
      setModal({
        aberto: true,
        titulo: 'Erro no cadastro',
        mensagem: error instanceof Error ? error.message : 'Não foi possível cadastrar.',
        dados: data
      });
    }
  }

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <div className={styles.hero}>
          <span className="badge">Nova academia</span>
          <h1>Cadastro FITID</h1>
          <p>Crie a conta da academia. O e-mail e a senha são registrados no Firebase Authentication e os dados do FITID permanecem no MySQL.</p>
        </div>
        <div className={styles.formArea}>
          <h2>Cadastrar academia</h2>
          <p>Os campos são validados com React Hook Form e Zod.</p>
          <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row"><label>Nome da academia</label><input {...register('nomeAcademia')} />{errors.nomeAcademia && <span className="error-message">{errors.nomeAcademia.message}</span>}</div>
            <div className="form-row"><label>Código público</label><input placeholder="fitcenter" {...register('codigo')} />{errors.codigo && <span className="error-message">{errors.codigo.message}</span>}</div>
            <div className="form-row"><label>Nome do responsável</label><input {...register('nomeAdmin')} />{errors.nomeAdmin && <span className="error-message">{errors.nomeAdmin.message}</span>}</div>
            <div className="form-row"><label>E-mail</label><input type="email" {...register('email')} />{errors.email && <span className="error-message">{errors.email.message}</span>}</div>
            <div className="form-row"><label>Senha</label><input type="password" {...register('senha')} />{errors.senha && <span className="error-message">{errors.senha.message}</span>}</div>
            <button className="btn" disabled={isSubmitting}>{isSubmitting ? 'Cadastrando...' : 'Cadastrar academia'}</button>
          </form>
          <div className={styles.links}><Link to="/login">Voltar para login</Link></div>
        </div>
      </section>
      <ModalMensagem {...modal} onFechar={() => setModal((m) => ({ ...m, aberto: false }))} />
    </main>
  );
}
