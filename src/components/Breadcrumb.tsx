import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

export interface ItemTrilha {
  rotulo: string;
  caminho: string;
}

interface BreadcrumbProps {
  /** Páginas acima da atual; "Início" já vem incluído. */
  itens?: ItemTrilha[];
}

/** Trilha "Início › ..." para a pessoa saber onde está e voltar. */
function Breadcrumb({ itens = [] }: BreadcrumbProps) {
  const todos = [{ rotulo: 'Início', caminho: '/' }, ...itens];

  return (
    <nav aria-label="Você está em" className={styles.trilha}>
      <ol className={styles.lista}>
        {todos.map((item, indice) => (
          <li key={item.caminho} className={styles.item}>
            {indice > 0 && <ChevronRight aria-hidden="true" size={18} />}
            <Link to={item.caminho} className={styles.link}>
              {item.rotulo}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
