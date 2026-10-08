import styles from './ModalMensagem.module.css';

interface ModalMensagemProps {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  dados?: unknown;
  onFechar: () => void;
}

export function ModalMensagem({ aberto, titulo, mensagem, dados, onFechar }: ModalMensagemProps) {
  if (!aberto) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{titulo}</h2>
          <button className={styles.close} onClick={onFechar} aria-label="Fechar modal">
            ×
          </button>
        </div>
        <div className={styles.body}>
          <p className={styles.message}>{mensagem}</p>
          {dados !== undefined && <pre className={styles.details}>{JSON.stringify(dados, null, 2)}</pre>}
        </div>
      </div>
    </div>
  );
}
