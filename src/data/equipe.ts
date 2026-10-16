import enzo from '../assets/equipe/enzo.jpg';
import igor from '../assets/equipe/igor.jpg';
import joao from '../assets/equipe/joao.jpg';
import josilene from '../assets/equipe/josilene.jpg';
import lara from '../assets/equipe/lara.jpg';
import mariaClara from '../assets/equipe/maria-clara.jpg';
import mariaLuisa from '../assets/equipe/maria-luisa.jpg';
import waitusy from '../assets/equipe/waitusy.jpg';
import type { Curso, GrupoEquipe, Integrante } from '../types';

/** Ordem dos grupos na página e texto que aparece abaixo de cada nome. */
const CURSOS: { curso: Curso; nomeCurso: string; subtitulo: string }[] = [
  {
    curso: 'computacao',
    nomeCurso: 'Ciência da Computação',
    subtitulo: 'Bacharelando em Ciência da Computação',
  },
  {
    curso: 'psicologia',
    nomeCurso: 'Psicologia',
    subtitulo: 'Bacharelanda em Psicologia',
  },
];

/**
 * Integrantes do projeto. Para adicionar uma foto: salve em
 * `src/assets/equipe/<primeiro-nome>.jpg`, importe acima e preencha `foto`.
 * O `enquadramento` indica onde fica o centro do rosto (0 a 1).
 */
const INTEGRANTES: Integrante[] = [
  {
    nome: 'João Victor Vasconcelos',
    curso: 'computacao',
    foto: {
      src: joao,
      largura: 140,
      altura: 163,
      enquadramento: { x: 0.5, y: 0.29, zoom: 1.4 },
    },
  },
  {
    nome: 'Enzo Lima',
    curso: 'computacao',
    foto: {
      src: enzo,
      largura: 768,
      altura: 1024,
      enquadramento: { x: 0.51, y: 0.44, zoom: 1 },
    },
  },
  {
    nome: 'Igor Macêdo',
    curso: 'computacao',
    foto: {
      src: igor,
      largura: 576,
      altura: 1024,
      enquadramento: { x: 0.495, y: 0.33, zoom: 1 },
    },
  },
  {
    nome: 'Maria Clara Granja',
    curso: 'psicologia',
    foto: {
      src: mariaClara,
      largura: 682,
      altura: 1024,
      enquadramento: { x: 0.484, y: 0.23, zoom: 1.9 },
    },
  },
  {
    nome: 'Maria Luísa Bompastor',
    curso: 'psicologia',
    foto: {
      src: mariaLuisa,
      largura: 1024,
      altura: 576,
      enquadramento: { x: 0.532, y: 0.434, zoom: 2 },
    },
  },
  {
    nome: 'Lara Gonzalez',
    curso: 'psicologia',
    foto: {
      src: lara,
      largura: 460,
      altura: 1024,
      enquadramento: { x: 0.435, y: 0.361, zoom: 1.5 },
    },
  },
  {
    nome: 'Waitusy de Araújo',
    curso: 'psicologia',
    foto: {
      src: waitusy,
      largura: 528,
      altura: 726,
      enquadramento: { x: 0.511, y: 0.31, zoom: 1.15 },
    },
  },
  {
    nome: 'Josilene Alves',
    curso: 'psicologia',
    foto: {
      src: josilene,
      largura: 576,
      altura: 1024,
      enquadramento: { x: 0.42, y: 0.32, zoom: 1.2 },
    },
  },
];

/** Equipe agrupada por curso, com os nomes em ordem alfabética. */
export function listarEquipePorCurso(): GrupoEquipe[] {
  return CURSOS.map((grupo) => ({
    ...grupo,
    integrantes: INTEGRANTES.filter(
      (integrante) => integrante.curso === grupo.curso,
    ).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
  }));
}
