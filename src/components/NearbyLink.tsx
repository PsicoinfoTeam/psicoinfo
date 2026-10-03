import { LocateFixed } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './NearbyLink.module.css';

/** Atalho para a tela "Perto de mim" (por enquanto, só CRAS). */
function NearbyLink() {
  return (
    <Link to="/perto-de-mim?tipo=cras" className={styles.link}>
      <LocateFixed aria-hidden="true" size={22} strokeWidth={2.25} />
      <span>Ver CRAS mais perto de mim</span>
    </Link>
  );
}

export default NearbyLink;
