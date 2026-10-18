import { LocateFixed } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TipoProximo } from '../data/servicos';
import styles from './NearbyLink.module.css';

const ROTULO_POR_TIPO: Record<TipoProximo, string> = {
  cras: 'Ver CRAS mais perto de mim',
  ubs: 'Ver postos de saúde mais perto de mim',
};

interface NearbyLinkProps {
  tipo: TipoProximo;
}

/** Atalho para a tela "Perto de mim". */
function NearbyLink({ tipo }: NearbyLinkProps) {
  return (
    <Link to={`/perto-de-mim?tipo=${tipo}`} className={styles.link}>
      <LocateFixed aria-hidden="true" size={22} strokeWidth={2.25} />
      <span>{ROTULO_POR_TIPO[tipo]}</span>
    </Link>
  );
}

export default NearbyLink;
