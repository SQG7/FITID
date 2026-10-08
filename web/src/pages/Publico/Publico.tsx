import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { StatCard } from '../../components/StatCard/StatCard';
import { publicoSchema, type PublicoForm } from '../../schemas';
import { api } from '../../services/api';
import type { Aparelho } from '../../types';
import styles from './Publico.module.css';

/*
 * API GET /aparelhos-publicos/:codigo
 * Objetivo: consultar a ocupação pública de uma academia pelo código.
 * Parâmetro: codigo na URL. Retorno: lista de aparelhos com nome, grupo e status atual.
 */

export function Publico() {
  const [params, setParams] = useSearchParams();
  const [aparelhos, setAparelhos] = useState<Aparelho[]>([]);
  const [atualizadoEm, setAtualizadoEm] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const codigoAtual = params.get('academia') || 'fitcenter';
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PublicoForm>({ resolver: zodResolver(publicoSchema), defaultValues: { codigo: codigoAtual } });

  async function carregar(codigo = codigoAtual) {
    try {
      setErro(''); setCarregando(true);
      const resposta = await api.get<Aparelho[]>(`/aparelhos-publicos/${codigo}`);
      setAparelhos(resposta);
      setAtualizadoEm(new Date().toISOString());
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar aparelhos.');
      setAparelhos([]);
    } finally { setCarregando(false); }
  }

  useEffect(() => {
    reset({ codigo: codigoAtual });
    carregar(codigoAtual);
    const id = window.setInterval(() => carregar(codigoAtual), 5000);
    return () => window.clearInterval(id);
  }, [codigoAtual, reset]);

  function onSubmit(data: PublicoForm) { setParams({ academia: data.codigo }); }
  const resumo = useMemo(() => ({
    total: aparelhos.length,
    livres: aparelhos.filter((a) => a.status === 'livre').length,
    ocupados: aparelhos.filter((a) => a.status === 'ocupado').length,
    manutencao: aparelhos.filter((a) => a.status === 'manutencao' || a.status === 'offline').length
  }), [aparelhos]);

  return <main className={styles.page}><div className="container grid">
    <div className={styles.header}><span className="badge">Consulta pública</span>
      <h1 className="page-title">Lotação da academia</h1>
      <p className="page-subtitle">Disponibilidade em tempo real aproximado. “Livre” não é reserva e pode mudar a qualquer momento.</p>
      {atualizadoEm && <p className="page-subtitle">Última atualização: {new Date(atualizadoEm).toLocaleTimeString('pt-BR')}</p>}
    </div>
    <div className="card"><form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row"><label>Código da academia</label><input {...register('codigo')} />{errors.codigo && <span className="error-message">{errors.codigo.message}</span>}</div>
      <div className="actions"><button className="btn" disabled={carregando}>{carregando ? 'Atualizando...' : 'Consultar'}</button><Link className="btn secondary" to="/">Tela inicial</Link></div>
    </form></div>
    {erro && <div className="empty-state">{erro} <button className="btn small secondary" onClick={() => carregar()}>Tentar novamente</button></div>}
    <div className="grid grid-4"><StatCard label="Total" value={resumo.total} /><StatCard label="Livres" value={resumo.livres} /><StatCard label="Ocupados" value={resumo.ocupados} /><StatCard label="Indisponíveis" value={resumo.manutencao} /></div>
    <div className={`grid grid-3 ${styles.cards}`}>{aparelhos.map((a) => <div className={styles.aparelho} key={a.id}><strong>{a.nome}</strong><p>{a.grupo_nome}</p><p><span className={`status-pill ${a.status}`}>{a.status}</span></p></div>)}</div>
  </div></main>;
}
