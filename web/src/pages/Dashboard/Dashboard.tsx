import { useEffect, useState } from 'react';
import { StatCard } from '../../components/StatCard/StatCard';
import { api } from '../../services/api';
import type { Aluno, Aparelho, DashboardData } from '../../types';
import { formatDateTime } from '../../utils/format';
import styles from './Dashboard.module.css';

/*
 * APIs desta página:
 * GET /dashboard-inteligente: retorna check-ins, último uso, exercício mais usado e histórico recente.
 * GET /alunos e GET /aparelhos: retornam os cadastros da academia para os indicadores do painel.
 * Todas as chamadas usam a sessão da academia autenticada.
 */

export function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [aparelhos, setAparelhos] = useState<Aparelho[]>([]);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      const [dados, listaAlunos, listaAparelhos] = await Promise.all([
        api.get<DashboardData>('/dashboard-inteligente'),
        api.get<Aluno[]>('/alunos'),
        api.get<Aparelho[]>('/aparelhos')
      ]);
      setDashboard(dados);
      setAlunos(listaAlunos);
      setAparelhos(listaAparelhos);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar dashboard.');
    }
  }

  useEffect(() => { carregar(); }, []);

  const alunosAtivos = alunos.filter((a) => a.status === 'ativo').length;
  const livres = aparelhos.filter((a) => a.status === 'livre').length;
  const ocupados = aparelhos.filter((a) => a.status === 'ocupado').length;

  return (
    <section className="grid">
      <div className="section-header">
        <div>
          <h1 className="page-title">Painel Geral</h1>
          <p className="page-subtitle">Resumo da academia logada, consumindo dados reais da API Node.js.</p>
        </div>
        <button className="btn secondary" onClick={carregar}>Atualizar</button>
      </div>

      {erro && <div className="empty-state">{erro}</div>}

      <div className="grid grid-4">
        <StatCard label="Alunos ativos" value={alunosAtivos} hint={`${alunos.length} cadastro(s) visível(is)`} />
        <StatCard label="Aparelhos livres" value={livres} hint="Disponíveis para uso" />
        <StatCard label="Aparelhos ocupados" value={ocupados} hint="Em uso no momento" />
        <StatCard label="Check-ins hoje" value={dashboard?.checkinsHoje.total ?? 0} hint="Exercícios finalizados" />
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="section-header"><div><h2>Histórico recente</h2><p>Últimas execuções registradas.</p></div></div>
          <div className={styles.lists}>
            {dashboard?.historicoRecente.length ? dashboard.historicoRecente.map((item, index) => (
              <div className={styles.listItem} key={`${item.nome}-${item.data_execucao}-${index}`}>
                <div><strong>{item.nome}</strong><br /><span>{item.exercicio} em {item.aparelho_nome}</span></div>
                <span>{formatDateTime(item.data_execucao)}</span>
              </div>
            )) : <div className="empty-state">Nenhum histórico recente.</div>}
          </div>
        </div>

        <div className="card">
          <div className="section-header"><div><h2>Indicadores</h2><p>Uso e frequência da academia.</p></div></div>
          <div className={styles.lists}>
            <div className={styles.listItem}><strong>Exercício mais usado</strong><span>{dashboard?.exercicioMaisUsado?.exercicio ?? 'Nenhum'}</span></div>
            <div className={styles.listItem}><strong>Último aluno</strong><span>{dashboard?.ultimoAluno?.nome ?? 'Nenhum'}</span></div>
            {dashboard?.alunosAtivos.map((aluno) => (
              <div className={styles.listItem} key={aluno.nome}><strong>{aluno.nome}</strong><span>{aluno.total} usos</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
