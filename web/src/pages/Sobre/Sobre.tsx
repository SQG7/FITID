import styles from './Sobre.module.css';

export function Sobre() {
  return (
    <section className="grid">
      <div className="section-header">
        <div>
          <h1 className="page-title">Sobre o projeto</h1>
          <p className="page-subtitle">Objetivo, funcionalidades, tecnologias e integrantes do FITID.</p>
        </div>
      </div>

      <div className="card grid">
        <div className={styles.topic}>
          <h3>Objetivo</h3>
          <p>O FITID tem como objetivo tornar o acompanhamento de treinos em academias mais simples e conectado. O sistema identifica o aluno por RFID no aparelho, apresenta o exercício previsto, registra a utilização e permite acompanhar treinos, histórico e ocupação dos equipamentos.</p>
        </div>

        <div className="grid grid-2">
          <div className={styles.topic}>
            <h3>Tecnologias</h3>
            <ul>
              <li>Web: React, Vite, TypeScript, React Router, React Hook Form e Zod.</li>
              <li>Autenticação: Firebase Authentication com e-mail e senha.</li>
              <li>Backend atual: Node.js, Express, Socket.IO e MySQL.</li>
              <li>Mobile: React Native, Expo e Expo Router.</li>
              <li>Protótipo físico: ESP32-S3, RFID RC522 e display.</li>
            </ul>
          </div>
          <div className={styles.topic}>
            <h3>Integrantes</h3>
            <ul>
              <li>Gustavo Squisatti Silva</li>
              <li>Giovanne Vieira Reinaldi</li>
              <li>Caleb Costa Jorge</li>
              <li>Fabricio De Campos Costa</li>
            </ul>
          </div>
        </div>

        <div className={styles.topic}>
          <h3>Funcionalidades principais</h3>
          <p>Cadastro e autenticação de academia, CRUD de alunos, grupos, aparelhos, exercícios e treinos, perfil do aluno, histórico, estatísticas, simulador RFID, sessões de uso e página pública de lotação.</p>
        </div>
      </div>
    </section>
  );
}
