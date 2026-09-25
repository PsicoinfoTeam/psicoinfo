import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './InfoSection.module.css';

interface InfoSectionProps {
  id: string;
  titulo: string;
  icone: LucideIcon;
  children: ReactNode;
}

/** Bloco de informação da página do serviço: ícone + título + conteúdo. */
function InfoSection({ id, titulo, icone: Icone, children }: InfoSectionProps) {
  return (
    <section className={styles.secao} aria-labelledby={id}>
      <h2 id={id} className={styles.titulo}>
        <span className={styles.icone} aria-hidden="true">
          <Icone size={22} strokeWidth={2.25} />
        </span>
        {titulo}
      </h2>
      <div className={styles.conteudo}>{children}</div>
    </section>
  );
}

export default InfoSection;
