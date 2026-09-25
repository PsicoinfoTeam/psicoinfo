import styles from './SectionTitle.module.css';

interface SectionTitleProps {
  id: string;
  titulo: string;
  descricao?: string;
}

/** Título de seção (h2) com o sublinhado amarelo da marca. */
function SectionTitle({ id, titulo, descricao }: SectionTitleProps) {
  return (
    <div className={styles.cabecalho}>
      <h2 id={id} className={styles.titulo}>
        {titulo}
      </h2>
      {descricao && <p className={styles.descricao}>{descricao}</p>}
    </div>
  );
}

export default SectionTitle;
