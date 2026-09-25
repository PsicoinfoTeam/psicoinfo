import { MessageCircle, Phone, Siren } from 'lucide-react';
import { linkTelefone } from '../data/links';
import type { Telefone } from '../types';
import styles from './CallButton.module.css';

interface CallButtonProps {
  telefone: Telefone;
}

/** Botão grande para ligar ou abrir o WhatsApp de um telefone do serviço. */
function CallButton({ telefone }: CallButtonProps) {
  const { tipo, numero, rotulo } = telefone;
  const ehWhatsApp = tipo === 'whatsapp';
  const Icone = ehWhatsApp
    ? MessageCircle
    : tipo === 'emergencia'
      ? Siren
      : Phone;
  const acao = ehWhatsApp ? 'Mandar mensagem no WhatsApp' : 'Ligar';
  // "WhatsApp" como rótulo só repetiria o que o botão já diz
  const detalhe = rotulo && rotulo !== 'WhatsApp' ? rotulo : null;

  return (
    <a
      href={linkTelefone(telefone)}
      className={`${styles.botao} ${styles[tipo] ?? ''}`}
      {...(ehWhatsApp && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      <span className={styles.icone} aria-hidden="true">
        <Icone size={26} strokeWidth={2.25} />
      </span>
      <span className={styles.texto}>
        <span className={styles.acao}>{acao}</span>
        <span className={styles.numero}>{numero}</span>
        {detalhe && <span className={styles.detalhe}>{detalhe}</span>}
      </span>
    </a>
  );
}

export default CallButton;
