import { MessageCircle, Phone } from 'lucide-react';
import { linkLigar, linkWhatsApp } from '../data/links';
import styles from './PhoneButton.module.css';

interface PhoneButtonProps {
  nome: string;
  numero: string;
  discar: string;
  descricao: string;
  /** "whatsapp" abre o WhatsApp em vez de ligar */
  tipo?: 'whatsapp';
}

/** Botão grande para um número útil (192, 190...): liga ou abre o WhatsApp. */
function PhoneButton({
  nome,
  numero,
  discar,
  descricao,
  tipo,
}: PhoneButtonProps) {
  const curto = discar.length <= 4;
  const ehWhatsApp = tipo === 'whatsapp';
  const Icone = ehWhatsApp ? MessageCircle : Phone;

  return (
    <a
      href={ehWhatsApp ? linkWhatsApp(discar) : linkLigar(discar)}
      className={`${styles.botao} ${ehWhatsApp ? styles.whatsapp : ''}`}
      {...(ehWhatsApp && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      <span className={styles.icone} aria-hidden="true">
        <Icone size={26} strokeWidth={2.25} />
      </span>
      <span className={styles.texto}>
        <span className="visually-hidden">
          {ehWhatsApp ? 'Mandar mensagem no WhatsApp para ' : 'Ligar para '}
        </span>
        <span className={styles.nome}>{nome}</span>
        <span className={`${styles.numero} ${curto ? styles.numeroCurto : ''}`}>
          {numero}
        </span>
        <span className={styles.descricao}>{descricao}</span>
      </span>
    </a>
  );
}

export default PhoneButton;
