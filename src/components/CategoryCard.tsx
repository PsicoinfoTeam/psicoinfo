import { Link } from 'react-router-dom';
import type { Categoria } from '../types';
import DataIcon from './DataIcon';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  categoria: Categoria;
  totalServicos: number;
}

function CategoryCard({ categoria, totalServicos }: CategoryCardProps) {
  const urgente = categoria.id === 'urgencia';

  return (
    <Link
      to={`/categoria/${categoria.id}`}
      className={`${styles.card} ${urgente ? styles.urgente : ''}`}
    >
      <span className={styles.icone} aria-hidden="true">
        <DataIcon nome={categoria.icone} size={30} strokeWidth={2} />
      </span>
      <span className={styles.nome}>{categoria.nome}</span>
      <span className={styles.total}>
        {totalServicos} {totalServicos === 1 ? 'serviço' : 'serviços'}
      </span>
    </Link>
  );
}

export default CategoryCard;
