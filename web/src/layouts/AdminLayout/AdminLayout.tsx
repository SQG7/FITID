import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AdminLayout.module.css';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/alunos', label: 'Alunos' },
  { to: '/admin/grupos', label: 'Grupos' },
  { to: '/admin/aparelhos', label: 'Aparelhos' },
  { to: '/admin/exercicios', label: 'Exercícios' },
  { to: '/admin/treinos', label: 'Treinos' },
  { to: '/admin/historico', label: 'Histórico' },
  { to: '/admin/simulador', label: 'Simulador RFID' },
  { to: '/admin/estatisticas', label: 'Estatísticas' },
  { to: '/admin/sobre', label: 'Sobre' }
];

export function AdminLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h1>FITID</h1>
          <p>Gestão inteligente de academia</p>
        </div>

        {usuario && (
          <div className={styles.academia}>
            <strong>{usuario.academia_nome}</strong>
            <span>Código: {usuario.academia_codigo}</span>
          </div>
        )}

        <nav className={styles.nav}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button className={`btn secondary ${styles.logout}`} onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <main className={styles.content}>
        <div className={styles.topbar}>
          <div>
            <span className="badge">Área administrativa</span>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
