import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './CollapsibleGroup.module.css';

interface CollapsibleGroupProps {
  titulo: string;
  /** Quantidade mostrada no selo amarelo */
  total: number;
  /** Ícone decorativo à esquerda do título */
  icone: ReactNode;
  /** Nível do título, conforme a página */
  nivelTitulo: 'h2' | 'h3';
  children: ReactNode;
}

/**
 * Grupo que abre ao tocar (<details> nativo: funciona com teclado e leitor
 * de tela sem código extra). Fechado, é uma linha grande e clara.
 */
function CollapsibleGroup({
  titulo,
  total,
  icone,
  nivelTitulo: Titulo,
  children,
}: CollapsibleGroupProps) {
  return (
    <details className={styles.grupo}>
      <summary className={styles.resumo}>
        <span className={styles.icone} aria-hidden="true">
          {icone}
        </span>
        <Titulo className={styles.titulo}>{titulo}</Titulo>
        <span className={styles.total}>
          {total}
          <span className="visually-hidden">
            {total === 1 ? ' serviço' : ' serviços'}
          </span>
        </span>
        <ChevronDown aria-hidden="true" size={26} className={styles.seta} />
      </summary>
      <div className={styles.conteudo}>{children}</div>
    </details>
  );
}

export default CollapsibleGroup;
