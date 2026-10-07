import type { CSSProperties } from 'react';
import type { FotoIntegrante } from '../types';
import styles from './TeamMember.module.css';

interface TeamMemberProps {
  nome: string;
  subtitulo: string;
  foto?: FotoIntegrante;
}

function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.min(Math.max(valor, minimo), maximo);
}

/**
 * Posiciona a foto dentro do círculo para o rosto ficar no centro.
 * Valores em % do círculo; nunca deixa sobrar espaço vazio nas bordas.
 */
function estiloDaFoto({ largura, altura, enquadramento }: FotoIntegrante) {
  const { x, y, zoom } = enquadramento;
  const larguraFoto = Math.max(zoom, 1, largura / altura);
  const alturaFoto = (larguraFoto * altura) / largura;
  const esquerda = limitar(0.5 - x * larguraFoto, 1 - larguraFoto, 0);
  const topo = limitar(0.5 - y * alturaFoto, 1 - alturaFoto, 0);

  return {
    width: `${larguraFoto * 100}%`,
    left: `${esquerda * 100}%`,
    top: `${topo * 100}%`,
  } satisfies CSSProperties;
}

/** Primeira letra do primeiro e do último nome (ex.: "Lara Gonzalez" → "LG"). */
function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? '') : '';
  return `${primeira}${ultima}`.toUpperCase();
}

/** Integrante da equipe: foto redonda com nome e curso ao lado. */
function TeamMember({ nome, subtitulo, foto }: TeamMemberProps) {
  return (
    <div className={styles.integrante}>
      <div className={styles.foto}>
        {foto ? (
          <img
            src={foto.src}
            alt=""
            width={foto.largura}
            height={foto.altura}
            loading="lazy"
            decoding="async"
            className={styles.imagem}
            style={estiloDaFoto(foto)}
          />
        ) : (
          <span className={styles.iniciais} aria-hidden="true">
            {iniciais(nome)}
          </span>
        )}
      </div>
      <div className={styles.texto}>
        <p className={styles.nome}>{nome}</p>
        <p className={styles.subtitulo}>{subtitulo}</p>
      </div>
    </div>
  );
}

export default TeamMember;
