import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ModalMensagem } from '../../components/ModalMensagem/ModalMensagem';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema, type LoginForm } from '../../schemas';
import styles from './AuthPages.module.css';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [modal, setModal] = useState({ aberto: false, titulo: '', mensagem: '', dados: undefined as unknown });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' }
  });

  async function onSubmit(data: LoginForm) {
    try {
      const usuario = await login(data.email, data.senha);
      setModal({
  aberto: true,
  titulo: 'Login realizado',
  mensagem: 'A academia foi autenticada com sucesso.',
  dados: undefined
});
      setTimeout(() => navigate('/admin'), 650);
    } catch (error) {
  setModal({
    aberto: true,
    titulo: 'Erro no login',
    mensagem: error instanceof Error ? error.message : 'Não foi possível entrar.',
    dados: undefined
  });
}
  }

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <div className={styles.hero}>
          <span className="badge">Projeto TCC</span>
          <h1>FITID</h1>
          <p>Sistema inteligente para academias com RFID, treinos personalizados, aparelhos conectados e acompanhamento em tempo real.</p>
          <div className={styles.features}>
            <span>Identificação por pulseira RFID</span>
            <span>Painel administrativo da academia</span>
            <span>Treinos organizados por aluno</span>
          </div>
        </div>

        <div className={styles.formArea}>
          <h2>Login da academia</h2>
          <p>Entre com o e-mail e a senha para acessar a área administrativa.</p>
          <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" {...register('email')} />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>
            <div className="form-row">
              <label htmlFor="senha">Senha</label>
              <input id="senha" type="password" {...register('senha')} />
              {errors.senha && <span className="error-message">{errors.senha.message}</span>}
            </div>
            <button className="btn" disabled={isSubmitting}>{isSubmitting ? 'Entrando...' : 'Entrar'}</button>
          </form>
          <div className={styles.links}>
            <Link to="/cadastro-academia">Cadastrar nova academia</Link>
            <Link to="/aluno-login">Área do aluno</Link>
            <Link to="/publico">Consultar lotação pública</Link>
          </div>
        </div>
      </section>
      <ModalMensagem {...modal} onFechar={() => setModal((m) => ({ ...m, aberto: false }))} />
    </main>
  );
}
