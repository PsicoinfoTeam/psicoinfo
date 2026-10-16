import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './BackButton.module.css';

export interface DestinoVoltar {
  /** Nome da página, como aparece depois de "Voltar para". */
  rotulo: string;
  caminho: string;
}

const INICIO: DestinoVoltar = { rotulo: 'o Início', caminho: '/' };

interface BackButtonProps {
  /** Página "de cima" da atual. Sem ela, volta para o Início. */
  destino?: DestinoVoltar;
}

/**
 * "Voltar para ...": diz onde a pessoa vai chegar e leva sempre para a
 * página "de cima". Não usa o histórico do navegador, então funciona igual
 * para quem abriu o link direto (WhatsApp, Google) e nunca tira a pessoa do
 * site.
 */
function BackButton({ destino = INICIO }: BackButtonProps) {
  return (
    <Link to={destino.caminho} className={styles.botaoVoltar}>
      <ArrowLeft aria-hidden="true" size={20} />
      <span>Voltar para {destino.rotulo}</span>
    </Link>
  );
}

export default BackButton;
