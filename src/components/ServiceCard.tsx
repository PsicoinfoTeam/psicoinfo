import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { linkTelefone } from '../data/links';
import { nomePorExtenso } from '../data/siglas';
import type { Servico } from '../types';
import DataIcon from './DataIcon';
import PendingPhone from './PendingPhone';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  servico: Servico;
  /** Nível do título, conforme a página (padrão: h3) */
  nivelTitulo?: 'h2' | 'h3' | 'h4';
}

function ServiceCard({ servico, nivelTitulo = 'h3' }: ServiceCardProps) {
  const Titulo = nivelTitulo;
  const extenso = nomePorExtenso(servico);
  const telefone = servico.telefones[0];
  const ehWhatsApp = telefone?.tipo === 'whatsapp';

  return (
    <article className={styles.card}>
      <div className={styles.topo}>
        <span className={styles.icone} aria-hidden="true">
          <DataIcon nome={servico.icone} size={26} strokeWidth={2} />
        </span>
        <div className={styles.titulos}>
          <Titulo className={styles.nome}>
            {/* O link cobre o card inteiro (ver ::after no CSS) */}
            <Link to={`/servico/${servico.id}`} className={styles.link}>
              {servico.nome}
            </Link>
          </Titulo>
          {extenso && <p className={styles.extenso}>{extenso}</p>}
        </div>
      </div>

      <p className={styles.local}>
        <MapPin aria-hidden="true" size={20} />
        <span>
          {servico.bairro ? (
            <>
              <span className="visually-hidden">Bairro: </span>
              {servico.bairro}
            </>
          ) : (
            'Atende na rua, em vários bairros'
          )}
        </span>
      </p>

      {telefone ? (
        <a
          href={linkTelefone(telefone)}
          className={`${styles.telefone} ${ehWhatsApp ? styles.whatsapp : ''}`}
        >
          {ehWhatsApp ? (
            <MessageCircle aria-hidden="true" size={20} strokeWidth={2.25} />
          ) : (
            <Phone aria-hidden="true" size={20} strokeWidth={2.25} />
          )}
          <span>
            {ehWhatsApp ? 'WhatsApp' : 'Ligar'}
            <span className="visually-hidden"> para {servico.nome}:</span>{' '}
            {telefone.numero}
          </span>
        </a>
      ) : (
        <div className={styles.semTelefone}>
          <PendingPhone />
        </div>
      )}
    </article>
  );
}

export default ServiceCard;
