import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './BotaoVoltar.module.css';

export interface ItemTrilha {
  rotulo: string;
  caminho: string;
}

interface BreadcrumbProps {
  itens?: ItemTrilha[];
}

/** 
 * Substituiu a trilha antiga por um botão de voltar, 
 * mantendo a interface para não quebrar outras páginas.
 */
function Breadcrumb(_props: BreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <nav aria-label="Navegação secundária">
      <button 
        onClick={() => navigate(-1)} 
        className={styles.botaoVoltar}
        aria-label="Voltar para a página anterior"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        <span>Voltar</span>
      </button>
    </nav>
  );
}

export default Breadcrumb;
