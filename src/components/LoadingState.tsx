import { RotateCw } from 'lucide-react';
import Container from './Container';
import styles from './LoadingState.module.css';

interface LoadingStateProps {
  /** true = o carregamento falhou: mostra a mensagem e o botão de tentar de novo */
  erro?: boolean;
}

/**
 * Espaço reservado enquanto os dados chegam. Com dados locais isso dura um
 * instante; a altura mínima evita que o rodapé "pule" para cima.
 */
function LoadingState({ erro = false }: LoadingStateProps) {
  if (erro) {
    return (
      <Container>
        <div className={styles.erro} role="alert">
          <p>Não conseguimos carregar as informações.</p>
          <button
            type="button"
            className={styles.botao}
            onClick={() => window.location.reload()}
          >
            <RotateCw aria-hidden="true" size={22} strokeWidth={2.25} />
            <span>Tentar de novo</span>
          </button>
        </div>
      </Container>
    );
  }
  return (
    <div className={styles.carregando} aria-busy="true">
      <span className="visually-hidden">Carregando…</span>
    </div>
  );
}

export default LoadingState;
