import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ModalMensagem } from '../../components/ModalMensagem/ModalMensagem';
import { alunoLoginSchema, type AlunoLoginForm } from '../../schemas';
import { api } from '../../services/api';
import styles from '../Login/AuthPages.module.css';

/*
 * API POST /login-aluno
 * Objetivo: identificar o aluno no protótipo Web usando código da academia e RFID.
 * Envio: { codigo, rfid }. Retorno: situação do login e dados do aluno identificado.
 */

export function AlunoLogin() {
  const [modal, setModal] = useState({ aberto: false, titulo: '', mensagem: '', dados: undefined as unknown });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AlunoLoginForm>({ resolver: zodResolver(alunoLoginSchema), defaultValues: { codigo: 'fitcenter', rfid: '123456' } });
  async function onSubmit(data: AlunoLoginForm) { try { const r = await api.post('/login-aluno', data); setModal({ aberto: true, titulo: 'Aluno identificado', mensagem: 'Aluno identificado para o protótipo. Em uma versão de produção, o acesso web deve ter autenticação adicional ao RFID.', dados: r }); setTimeout(() => window.location.assign('/aluno'), 650); } catch (e) { setModal({ aberto: true, titulo: 'Erro no acesso', mensagem: e instanceof Error ? e.message : 'Não foi possível acessar.', dados: data }); } }
  return <main className={styles.authPage}>
    <section className={styles.authCard}>
      <div className={styles.hero}>
        <span className="badge">Área do aluno</span>
        <h1>Meu FITID</h1>
        <p>No protótipo, o aluno acessa seu perfil usando o código da academia e o RFID/código da pulseira.</p>
        </div>
        <div className={styles.formArea}>
          <h2>Login do aluno</h2>
          <p>Demonstração do TCC: o RFID identifica o aluno. Em produção, o login web deverá usar um segundo fator/credencial além do RFID.</p>
          <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
          <label>Código da academia</label>
          <input {...register('codigo')} />{errors.codigo && <span className="error-message">{errors.codigo.message}</span>}</div>
          <div className="form-row"><label>RFID da pulseira</label>
          <input {...register('rfid')} />{errors.rfid && <span className="error-message">{errors.rfid.message}</span>}</div>
          <button className="btn" disabled={isSubmitting}>{isSubmitting ? 'Entrando...' : 'Entrar no perfil'}</button></form>
          <div className={styles.links}><Link to="/login">Login da academia</Link>
          <Link to="/publico">Ver lotação pública</Link>
          </div></div>
          </section><ModalMensagem {...modal} onFechar={() => setModal((m) => ({ ...m, aberto: false }))} /></main>;
}
