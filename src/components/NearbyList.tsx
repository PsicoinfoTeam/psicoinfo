import type { ReactNode } from 'react';
import type { ServicoProximo } from '../data/servicos';
import NearbyCard from './NearbyCard';
import styles from './NearbyList.module.css';

interface NearbyListProps {
  id: string;
  titulo: string;
  /** Texto curto abaixo do título */
  descricao?: ReactNode;
  itens: ServicoProximo[];
  /** false = esconde a distância (quando ela não é a partir da pessoa) */
  mostrarDistancia?: boolean;
  /** Seção de destaque ("Seu CRAS de referência") */
  destaque?: boolean;
}

/** Seção com uma lista de serviços próximos. */
function NearbyList({
  id,
  titulo,
  descricao,
  itens,
  mostrarDistancia = true,
  destaque = false,
}: NearbyListProps) {
  return (
    <section aria-labelledby={id} className={styles.secao}>
      <h2 id={id} className={styles.titulo} tabIndex={-1}>
        {titulo}
      </h2>
      {descricao && <p className={styles.descricao}>{descricao}</p>}
      <ul className={`${styles.lista} ${destaque ? styles.listaDestaque : ''}`}>
        {itens.map(({ servico, distanciaKm }) => (
          <li key={servico.id}>
            <NearbyCard
              servico={servico}
              distanciaKm={mostrarDistancia ? distanciaKm : null}
              destaque={destaque}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NearbyList;
