import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail.').email('Digite um e-mail válido.'),
  senha: z.string().min(1, 'Informe a senha.').min(6, 'A senha deve ter pelo menos 6 caracteres.')
});

export const cadastroAcademiaSchema = z.object({
  nomeAcademia: z.string().min(3, 'Informe o nome da academia.'),
  codigo: z.string().min(3, 'Informe um código público com pelo menos 3 caracteres.'),
  nomeAdmin: z.string().min(3, 'Informe o nome do responsável.'),
  email: z.string().min(1, 'Informe o e-mail.').email('Digite um e-mail válido.'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.')
});

export const alunoSchema = z.object({
  nome: z.string().min(3, 'Informe o nome do aluno.'),
  rfid: z.string().min(3, 'Informe o código RFID.'),
  status: z.enum(['ativo', 'inativo'])
});

export const grupoSchema = z.object({
  nome: z.string().min(2, 'Informe o nome do grupo de equipamento.')
});

export const aparelhoSchema = z.object({
  nome: z.string().min(2, 'Informe o nome do aparelho físico.'),
  grupo_id: z.coerce.number().min(1, 'Selecione o grupo do aparelho.'),
  status: z.enum(['livre', 'manutencao', 'offline'])
});

export const exercicioSchema = z.object({
  nome: z.string().min(2, 'Informe o nome do exercício.'),
  grupo_id: z.coerce.number().min(1, 'Selecione o grupo compatível.'),
  gif: z.string().optional(),
  descricao: z.string().optional()
});

export const planoTreinoSchema = z.object({
  aluno_id: z.coerce.number().min(1, 'Selecione o aluno.'),
  nome: z.string().min(3, 'Informe o nome do treino.'),
  objetivo: z.string().optional()
});

export const itemTreinoSchema = z.object({
  plano_id: z.coerce.number().min(1, 'Selecione o treino.'),
  exercicio_id: z.coerce.number().min(1, 'Selecione o exercício.'),
  series: z.coerce.number().min(1, 'Informe pelo menos 1 série.'),
  repeticoes: z.coerce.number().min(1, 'Informe pelo menos 1 repetição.'),
  ordem: z.coerce.number().min(1, 'Informe a ordem do exercício.')
});

export const alunoLoginSchema = z.object({
  codigo: z.string().min(3, 'Informe o código da academia.'),
  rfid: z.string().min(3, 'Informe o RFID da pulseira.')
});

export const publicoSchema = z.object({
  codigo: z.string().min(3, 'Informe o código da academia.')
});

export type LoginForm = z.infer<typeof loginSchema>;
export type CadastroAcademiaForm = z.infer<typeof cadastroAcademiaSchema>;
export type AlunoForm = z.infer<typeof alunoSchema>;
export type GrupoForm = z.infer<typeof grupoSchema>;
export type AparelhoForm = z.infer<typeof aparelhoSchema>;
export type ExercicioForm = z.infer<typeof exercicioSchema>;
export type PlanoTreinoForm = z.infer<typeof planoTreinoSchema>;
export type ItemTreinoForm = z.infer<typeof itemTreinoSchema>;
export type AlunoLoginForm = z.infer<typeof alunoLoginSchema>;
export type PublicoForm = z.infer<typeof publicoSchema>;
