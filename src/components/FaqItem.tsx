import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import styles from './FaqItem.module.css';

interface FaqItemProps {
  pergunta: string;
  resposta: string;
}

/** Pergunta que abre e fecha a resposta (acordeão). */
function FaqItem({ pergunta, resposta }: FaqItemProps) {
  const [aberto, setAberto] = useState(false);
  const idResposta = useId();

  return (
    <div className={`${styles.faqItem} ${aberto ? styles.aberto : ''}`}>
      {/* h2: o leitor de tela consegue pular de pergunta em pergunta */}
      <h2 className={styles.tituloPergunta}>
        <button
          type="button"
          className={styles.faqBotao}
          aria-expanded={aberto}
          aria-controls={idResposta}
          onClick={() => setAberto((valor) => !valor)}
        >
          <span className={styles.pergunta}>{pergunta}</span>
          <ChevronDown aria-hidden="true" className={styles.icone} />
        </button>
      </h2>
      {/* hidden: fechada, a resposta não é lida pelo leitor de tela */}
      <div id={idResposta} className={styles.resposta} hidden={!aberto}>
        {resposta}
      </div>
    </div>
  );
}

export default FaqItem;
