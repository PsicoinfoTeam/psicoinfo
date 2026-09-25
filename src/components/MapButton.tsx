import { ExternalLink, MapPinned } from 'lucide-react';
import { linkMapa } from '../data/links';
import styles from './MapButton.module.css';

interface MapButtonProps {
  mapaQuery: string;
}

/** Abre o endereço no Google Maps (no celular, abre o aplicativo de mapas). */
function MapButton({ mapaQuery }: MapButtonProps) {
  return (
    <a
      href={linkMapa(mapaQuery)}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.botao}
    >
      <MapPinned aria-hidden="true" size={24} strokeWidth={2.25} />
      <span>Ver no mapa</span>
      <ExternalLink aria-hidden="true" size={18} className={styles.externo} />
      <span className="visually-hidden">(abre o Google Maps)</span>
    </a>
  );
}

export default MapButton;
