export type StatusAluno = 'ativo' | 'inativo';
export type StatusAparelho = 'livre' | 'ocupado' | 'manutencao' | 'offline';

export interface UsuarioLogado {
  id: number;
  academia_id: number;
  nome: string;
  email: string;
  tipo: string;
  academia_nome: string;
  academia_codigo: string;
}

export interface Academia {
  id: number;
  nome: string;
  codigo: string;
}

export interface Aluno {
  id: number;
  academia_id: number;
  nome: string;
  rfid: string;
  status: StatusAluno;
  ativo: number;
}

export interface GrupoEquipamento {
  id: number;
  academia_id: number;
  nome: string;
  ativo: number;
}

export interface Aparelho {
  id: number;
  academia_id: number;
  grupo_id: number;
  grupo_nome: string;
  nome: string;
  status: StatusAparelho;
  ativo: number;
}

export interface Exercicio {
  id: number;
  academia_id: number;
  grupo_id: number;
  grupo_nome: string;
  nome: string;
  gif: string | null;
  descricao: string | null;
  ativo: number;
}

export interface PlanoTreino {
  id: number;
  academia_id: number;
  aluno_id: number;
  aluno_nome: string;
  aluno_status: StatusAluno;
  nome: string;
  objetivo: string | null;
  ativo: number;
}

export interface TreinoItem {
  id: number;
  academia_id: number;
  plano_id: number;
  plano_nome: string;
  objetivo: string | null;
  aluno_id: number;
  aluno_nome?: string;
  aluno_status?: StatusAluno;
  exercicio_id: number;
  exercicio: string;
  grupo_id: number;
  grupo_nome: string;
  gif: string | null;
  series: number;
  repeticoes: number;
  ordem: number;
}

export interface HistoricoUso {
  id?: number;
  academia_id?: number;
  aluno_id?: number;
  aparelho_id?: number;
  plano_exercicio_id?: number | null;
  exercicio: string;
  inicio_execucao?: string | null;
  fim_execucao?: string | null;
  tempo_execucao?: number | null;
  data_execucao: string;
  status: string;
  aluno_nome?: string;
  aparelho_nome: string;
  grupo_nome: string;
}

export interface DashboardData {
  checkinsHoje: { total: number };
  ultimoAluno: null | {
    nome: string;
    exercicio: string;
    aparelho_nome: string;
    data_execucao: string;
  };
  exercicioMaisUsado: null | {
    exercicio: string;
    total: number;
  };
  historicoRecente: Array<{
    nome: string;
    exercicio: string;
    aparelho_nome: string;
    data_execucao: string;
  }>;
  alunosAtivos: Array<{
    nome: string;
    total: number;
  }>;
}

export interface AlunoLogado {
  id: number;
  academia_id: number;
  nome: string;
  rfid: string;
  status: StatusAluno;
  academia_nome: string;
  academia_codigo: string;
}

export interface SessaoUso {
  sessao_token: string;
  status?: 'em_andamento' | 'concluido' | 'cancelado' | 'abandonado';
  inicio: string;
  fim?: string | null;
  ultima_atividade?: string;
  academia_id: number;
  academia_nome: string;
  academia_codigo: string;
  aluno_id: number;
  nome: string;
  aparelho_id: number;
  aparelho_nome: string;
  grupo_nome: string;
  plano_exercicio_id: number | null;
  plano_nome: string;
  exercicio: string;
  gif: string | null;
  series: number;
  repeticoes: number | string;
}

export interface EstatisticasAvancadas {
  resumo: { total_treinos: number; exercicios_diferentes: number };
  favorito: { exercicio: string; total: number };
  ultimo: { exercicio: string; data_execucao: string | null };
  ranking: Array<{ exercicio: string; total: number }>;
}
