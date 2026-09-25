import { Phone } from 'lucide-react';
import styles from './PendingPhone.module.css';

/**
 * Aviso para serviços ainda sem telefone confirmado.
 * Estilo neutro de propósito: é uma informação, não um erro.
 */
function PendingPhone() {
  return (
    <p className={styles.aviso}>
      <Phone aria-hidden="true" size={20} strokeWidth={2.25} />
      <span>Telefone em atualização – em breve</span>
    </p>
  );
}

export default PendingPhone;
