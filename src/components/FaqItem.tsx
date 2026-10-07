import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FaqItem.module.css';

interface FaqItemProps {
  pergunta: string;
  resposta: string;
}

export default function FaqItem({ pergunta, resposta }: FaqItemProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className={`${styles.faqItem} ${aberto ? styles.aberto : ''}`}>
      <button
        className={styles.faqBotao}
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
      >
        <span className={styles.pergunta}>{pergunta}</span>
        <ChevronDown className={styles.icone} />
      </button>
      <div className={styles.faqConteudo}>
        <div className={styles.resposta}>{resposta}</div>
      </div>
    </div>
  );
}
