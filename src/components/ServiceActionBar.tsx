import { MapPinned, MessageCircle, Phone } from 'lucide-react';
import { linkMapa, linkTelefone } from '../data/links';
import type { Servico } from '../types';
import styles from './ServiceActionBar.module.css';

interface ServiceActionBarProps {
  servico: Servico;
}

/** Barra fixa no rodapé da tela (só no celular): "Ligar" e "Como chegar". */
function ServiceActionBar({ servico }: ServiceActionBarProps) {
  // Prefere um número de ligação; se só houver WhatsApp, usa o WhatsApp.
  const telefone =
    servico.telefones.find((t) => t.tipo !== 'whatsapp') ??
    servico.telefones[0];
  const ehWhatsApp = telefone?.tipo === 'whatsapp';

  if (!telefone && !servico.mapaQuery) return null;

  return (
    <nav aria-label="Ações rápidas" className={styles.barra}>
      {telefone && (
        <a
          href={linkTelefone(telefone)}
          className={`${styles.acao} ${ehWhatsApp ? styles.whatsapp : styles.ligar}`}
          {...(ehWhatsApp && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {ehWhatsApp ? (
            <MessageCircle aria-hidden="true" size={24} strokeWidth={2.25} />
          ) : (
            <Phone aria-hidden="true" size={24} strokeWidth={2.25} />
          )}
          <span>{ehWhatsApp ? 'WhatsApp' : 'Ligar'}</span>
          <span className="visually-hidden"> {telefone.numero}</span>
        </a>
      )}
      {servico.mapaQuery && (
        <a
          href={linkMapa(servico.mapaQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.acao} ${styles.mapa}`}
        >
          <MapPinned aria-hidden="true" size={24} strokeWidth={2.25} />
          <span>Como chegar</span>
          <span className="visually-hidden"> (abre o Google Maps)</span>
        </a>
      )}
    </nav>
  );
}

export default ServiceActionBar;
