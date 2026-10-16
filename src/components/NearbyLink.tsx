import { LocateFixed } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TipoProximo } from '../data/servicos';
import styles from './NearbyLink.module.css';

interface NearbyLinkProps {
  tipo?: TipoProximo;
  rotulo?: string;
}

/** Atalho para a tela "Perto de mim". */
function NearbyLink({
  tipo = 'todos',
  rotulo = 'Ver serviços mais perto de mim',
}: NearbyLinkProps) {
  const destino =
    tipo === 'todos' ? '/perto-de-mim' : `/perto-de-mim?tipo=${tipo}`;

  return (
    <Link to={destino} className={styles.link}>
      <LocateFixed aria-hidden="true" size={22} strokeWidth={2.25} />
      <span>{rotulo}</span>
    </Link>
  );
}

export default NearbyLink;
