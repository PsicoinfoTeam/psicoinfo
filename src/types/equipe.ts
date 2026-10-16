export type Curso = 'computacao' | 'psicologia';

/**
 * Onde está o rosto na foto, para centralizá-lo no círculo.
 * `x` e `y` vão de 0 a 1 (0 = borda esquerda/topo, 1 = direita/base).
 */
export interface EnquadramentoFoto {
  x: number;
  y: number;
  /** 1 = a largura da foto ocupa o círculo; 2 = foto ampliada 2 vezes */
  zoom: number;
}

export interface FotoIntegrante {
  src: string;
  /** Tamanho original do arquivo, em pixels */
  largura: number;
  altura: number;
  enquadramento: EnquadramentoFoto;
}

export interface Integrante {
  nome: string;
  curso: Curso;
  /** Sem foto, aparecem as iniciais no lugar */
  foto?: FotoIntegrante;
}

export interface GrupoEquipe {
  curso: Curso;
  nomeCurso: string;
  subtitulo: string;
  integrantes: Integrante[];
}
