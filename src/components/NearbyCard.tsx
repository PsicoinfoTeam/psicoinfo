import {
  ChevronRight,
  MapPin,
  MapPinned,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { linkMapa, linkTelefone } from '../data/links';
import type { Servico } from '../types';
import DataIcon from './DataIcon';
import DistanceBadge from './DistanceBadge';
import styles from './NearbyCard.module.css';
import PendingPhone from './PendingPhone';

interface NearbyCardProps {
  servico: Servico;
  /** Distância em linha reta; null = não mostrar */
  distanciaKm: number | null;
  /** Card de destaque ("Seu CRAS de referência") */
  destaque?: boolean;
  nivelTitulo?: 'h2' | 'h3';
}

/** Card de um serviço próximo: nome, bairro, distância, Ligar e Como chegar. */
function NearbyCard({
  servico,
  distanciaKm,
  destaque = false,
  nivelTitulo: Titulo = 'h3',
}: NearbyCardProps) {
  // Prefere um número de ligação; se só houver WhatsApp, usa o WhatsApp
  const telefone =
    servico.telefones.find((t) => t.tipo !== 'whatsapp') ??
    servico.telefones[0];
  const ehWhatsApp = telefone?.tipo === 'whatsapp';

  return (
    <article className={`${styles.card} ${destaque ? styles.destaque : ''}`}>
      <div className={styles.topo}>
        <span className={styles.icone} aria-hidden="true">
          <DataIcon nome={servico.icone} size={26} strokeWidth={2} />
        </span>
        <div className={styles.textos}>
          <Titulo className={styles.nome}>
            <Link to={`/servico/${servico.id}`} className={styles.linkNome}>
              {servico.nome}
            </Link>
          </Titulo>
          {servico.bairro && (
            <p className={styles.bairro}>
              <MapPin aria-hidden="true" size={18} />
              <span>
                <span className="visually-hidden">Bairro: </span>
                {servico.bairro}
              </span>
            </p>
          )}
        </div>
      </div>

      {distanciaKm !== null && <DistanceBadge km={distanciaKm} />}

      <div className={styles.acoes}>
        {telefone ? (
          <a
            href={linkTelefone(telefone)}
            className={`${styles.acao} ${styles.ligar}`}
            {...(ehWhatsApp && {
              target: '_blank',
              rel: 'noopener noreferrer',
            })}
          >
            {ehWhatsApp ? (
              <MessageCircle aria-hidden="true" size={22} strokeWidth={2.25} />
            ) : (
              <Phone aria-hidden="true" size={22} strokeWidth={2.25} />
            )}
            <span>{ehWhatsApp ? 'WhatsApp' : 'Ligar'}</span>
            <span className="visually-hidden">
              {' '}
              para {servico.nome}: {telefone.numero}
            </span>
          </a>
        ) : (
          <PendingPhone />
        )}
        {servico.mapaQuery && (
          <a
            href={linkMapa(servico.mapaQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.acao} ${styles.mapa}`}
          >
            <MapPinned aria-hidden="true" size={22} strokeWidth={2.25} />
            <span>Como chegar</span>
            <span className="visually-hidden">
              {' '}
              até {servico.nome} (abre o Google Maps)
            </span>
          </a>
        )}
      </div>

      <Link to={`/servico/${servico.id}`} className={styles.mais}>
        <span>Ver horário, endereço e mais</span>
        <ChevronRight aria-hidden="true" size={20} />
        <span className="visually-hidden"> sobre {servico.nome}</span>
      </Link>
    </article>
  );
}

export default NearbyCard;
