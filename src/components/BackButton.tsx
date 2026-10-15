import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css';

export interface ItemTrilha {
  rotulo: string;
  caminho: string;
}

interface BackButtonProps {
  /** Páginas acima da atual. A última é o destino quando não há para onde voltar. */
  itens?: ItemTrilha[];
}

/**
 * Botão "Voltar". Volta para a página anterior do site; se a pessoa abriu
 * este link direto (WhatsApp, Google), vai para a página "de cima" (ou o
 * Início) em vez de sair do site.
 */
function BackButton({ itens = [] }: BackButtonProps) {
  const navigate = useNavigate();
  const destino = itens.at(-1)?.caminho ?? '/';

  function voltar() {
    // O React Router guarda em history.state a posição (idx) da página no
    // histórico do site. 0 = primeira página aberta nesta aba: voltar com
    // navigate(-1) tiraria a pessoa do site.
    const posicao = (window.history.state as { idx?: number } | null)?.idx;

    if (posicao && posicao > 0) {
      navigate(-1);
    } else {
      // replace: a página "de cima" substitui a atual no histórico. Assim, o
      // próximo "Voltar" sobe mais um nível, em vez de voltar para cá.
      navigate(destino, { replace: true });
    }
  }

  return (
    <button type="button" className={styles.botaoVoltar} onClick={voltar}>
      <ArrowLeft aria-hidden="true" size={20} />
      <span>Voltar</span>
    </button>
  );
}

export default BackButton;
