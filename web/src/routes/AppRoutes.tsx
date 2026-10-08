import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout/AdminLayout';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '../pages/Login/Login';
import { CadastroAcademia } from '../pages/CadastroAcademia/CadastroAcademia';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Alunos } from '../pages/Alunos/Alunos';
import { Grupos } from '../pages/Grupos/Grupos';
import { Aparelhos } from '../pages/Aparelhos/Aparelhos';
import { Exercicios } from '../pages/Exercicios/Exercicios';
import { Treinos } from '../pages/Treinos/Treinos';
import { Historico } from '../pages/Historico/Historico';
import { Publico } from '../pages/Publico/Publico';
import { AlunoLogin } from '../pages/AlunoLogin/AlunoLogin';
import { AlunoPerfil } from '../pages/AlunoPerfil/AlunoPerfil';
import { Sobre } from '../pages/Sobre/Sobre';
import { Home } from '../pages/Home/Home';
import { Simulador } from '../pages/Simulador/Simulador';
import { AparelhoTela } from '../pages/AparelhoTela/AparelhoTela';
import { Estatisticas } from '../pages/Estatisticas/Estatisticas';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { usuario, loading } = useAuth();

  if (loading) return <div className="container card" style={{ marginTop: 40 }}>Carregando autenticação...</div>;
  if (!usuario) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro-academia" element={<CadastroAcademia />} />
      <Route path="/publico" element={<Publico />} />
      <Route path="/aluno-login" element={<AlunoLogin />} />
      <Route path="/aluno" element={<AlunoPerfil />} />
      <Route path="/aparelho/:token" element={<AparelhoTela />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="alunos" element={<Alunos />} />
        <Route path="grupos" element={<Grupos />} />
        <Route path="aparelhos" element={<Aparelhos />} />
        <Route path="exercicios" element={<Exercicios />} />
        <Route path="treinos" element={<Treinos />} />
        <Route path="historico" element={<Historico />} />
        <Route path="simulador" element={<Simulador />} />
        <Route path="estatisticas" element={<Estatisticas />} />
        <Route path="sobre" element={<Sobre />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
