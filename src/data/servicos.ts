// Camada de acesso aos dados. É o ÚNICO arquivo que importa o JSON.
// Para trocar por uma API ou área administrativa no futuro, basta mudar
// este arquivo: as telas só conhecem as funções abaixo.

import json from './servicos-petrolina.json';
import { soDigitos } from './links';
import type {
  BaseDeDados,
  Categoria,
  NumeroUtil,
  Servico,
  Sobre,
} from '../types';

const dados = json as BaseDeDados;

const servicosPorId = new Map(dados.servicos.map((s) => [s.id, s]));
const categoriasPorId = new Map(dados.categorias.map((c) => [c.id, c]));

/** Escolha fixa da página inicial (CLAUDE.md), na ordem de exibição. */
const IDS_MAIS_PROCURADOS = [
  'cras-jose-e-maria',
  'ubs-lia-bezerra',
  'cadunico',
  'upa',
  'capsi',
  'defensoria-publica',
];

export function listarServicos(): readonly Servico[] {
  return dados.servicos;
}

export function buscarServico(id: string): Servico | undefined {
  return servicosPorId.get(id);
}

export function listarCategorias(): readonly Categoria[] {
  return dados.categorias;
}

export function buscarCategoria(id: string): Categoria | undefined {
  return categoriasPorId.get(id);
}

/**
 * Serviços de uma categoria, usando o campo `categorias` (não só a principal).
 * Os que têm a categoria como principal vêm primeiro.
 */
export function listarPorCategoria(idCategoria: string): Servico[] {
  const daCategoria = dados.servicos.filter((s) =>
    s.categorias.includes(idCategoria),
  );
  const principais = daCategoria.filter(
    (s) => s.categoriaPrincipal === idCategoria,
  );
  const secundarios = daCategoria.filter(
    (s) => s.categoriaPrincipal !== idCategoria,
  );
  return [...principais, ...secundarios];
}

export interface GrupoPorBairro {
  bairro: string;
  servicos: Servico[];
}

const ZONA_RURAL = 'Zona rural';

/**
 * Agrupa serviços por bairro, em ordem alfabética ("N4" antes de "N11"),
 * com a zona rural no fim. Serviços sem bairro ficam de fora.
 */
export function agruparPorBairro(
  servicos: readonly Servico[],
): GrupoPorBairro[] {
  const grupos = new Map<string, Servico[]>();
  for (const servico of servicos) {
    if (!servico.bairro) continue;
    const lista = grupos.get(servico.bairro) ?? [];
    lista.push(servico);
    grupos.set(servico.bairro, lista);
  }
  return [...grupos]
    .map(([bairro, lista]) => ({ bairro, servicos: lista }))
    .sort((a, b) => {
      if (a.bairro === ZONA_RURAL) return 1;
      if (b.bairro === ZONA_RURAL) return -1;
      return a.bairro.localeCompare(b.bairro, 'pt-BR', { numeric: true });
    });
}

export function listarMaisProcurados(): Servico[] {
  return IDS_MAIS_PROCURADOS.map((id) => servicosPorId.get(id)).filter(
    (s): s is Servico => s !== undefined,
  );
}

export function numerosUteis(): NumeroUtil[] {
  return dados.numerosUteis.map((n) => ({ ...n, discar: soDigitos(n.numero) }));
}

export function obterSobre(): Sobre {
  return dados.sobre;
}
