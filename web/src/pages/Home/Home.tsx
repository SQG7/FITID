import { Link } from 'react-router-dom';

export function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', alignItems: 'center', padding: '40px 0' }}>
      <div className="container grid grid-2" style={{ alignItems: 'center' }}>
        <section className="grid">
          <span className="badge">FITID • musculação inteligente</span>
          <h1 className="page-title">Treino, aparelho e aluno conectados por RFID.</h1>
          <p className="page-subtitle">Protótipo de TCC para academias: gestão de alunos, treinos, aparelhos, histórico e lotação, com identificação no equipamento.</p>
          <div className="actions">
            <Link className="btn" to="/login">Painel da academia</Link>
            <Link className="btn secondary" to="/publico?academia=fitcenter">Ver lotação</Link>
            <Link className="btn secondary" to="/aluno-login">Área do aluno</Link>
          </div>
        </section>
        <section className="card grid">
          <span className="badge">Fluxo principal</span>
          <h2>Pulseira → aparelho → treino → histórico</h2>
          <p className="page-subtitle">Na demonstração, o Simulador RFID representa o ESP32 + RC522. Ao iniciar uma sessão, o aparelho fica ocupado; ao concluir, o histórico é registrado e o equipamento volta a ficar livre.</p>
          <div className="grid grid-2">
            <div className="empty-state"><strong>RFID</strong><br/>Identifica o aluno</div>
            <div className="empty-state"><strong>Tempo real</strong><br/>Atualiza ocupação</div>
          </div>
        </section>
      </div>
    </main>
  );
}
