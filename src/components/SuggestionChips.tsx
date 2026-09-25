import { Link } from 'react-router-dom';
import styles from './SuggestionChips.module.css';

/** Atalhos de busca definidos no CLAUDE.md */
const SUGESTOES = [
  'CRAS',
  'Posto de saúde',
  'Advogado gratuito',
  'Violência contra a mulher',
  'Saúde mental',
];

interface SuggestionChipsProps {
  /** "destaque": sobre fundo azul, na página inicial */
  variante?: 'destaque' | 'normal';
}

function SuggestionChips({ variante = 'normal' }: SuggestionChipsProps) {
  return (
    <nav
      aria-label="Buscas comuns"
      className={`${styles.chips} ${variante === 'destaque' ? styles.destaque : ''}`}
    >
      <p className={styles.rotulo}>Buscas comuns:</p>
      <ul className={styles.lista}>
        {SUGESTOES.map((sugestao) => (
          <li key={sugestao}>
            <Link
              to={`/busca?q=${encodeURIComponent(sugestao)}`}
              className={styles.chip}
            >
              {sugestao}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SuggestionChips;
