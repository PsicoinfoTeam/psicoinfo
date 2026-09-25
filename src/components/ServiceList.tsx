import type { Servico } from '../types';
import ServiceCard from './ServiceCard';
import styles from './ServiceList.module.css';

interface ServiceListProps {
  servicos: Servico[];
  /** Nível do título de cada card, conforme a página (padrão: h3) */
  nivelTitulo?: 'h2' | 'h3' | 'h4';
  /** Sempre 1 coluna (para listas dentro de espaços estreitos) */
  umaColuna?: boolean;
}

/** Grade de cards de serviço: 1 coluna no celular, 2 no tablet, 3 no desktop. */
function ServiceList({
  servicos,
  nivelTitulo = 'h3',
  umaColuna = false,
}: ServiceListProps) {
  return (
    <ul className={`${styles.lista} ${umaColuna ? styles.umaColuna : ''}`}>
      {servicos.map((servico) => (
        <li key={servico.id}>
          <ServiceCard servico={servico} nivelTitulo={nivelTitulo} />
        </li>
      ))}
    </ul>
  );
}

export default ServiceList;
