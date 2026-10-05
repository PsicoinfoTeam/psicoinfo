import { Navigation } from 'lucide-react';
import { formatarDistancia } from '../lib/geo';
import styles from './DistanceBadge.module.css';

interface DistanceBadgeProps {
  km: number;
}

/** "a cerca de 2,3 km em linha reta": a distância nunca é dita como trajeto. */
function DistanceBadge({ km }: DistanceBadgeProps) {
  return (
    <p className={styles.selo}>
      <Navigation aria-hidden="true" size={18} strokeWidth={2.25} />
      <span>{formatarDistancia(km)} em linha reta</span>
    </p>
  );
}

export default DistanceBadge;
