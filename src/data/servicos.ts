// Camada de acesso aos dados. É o ÚNICO lugar que importa os JSON.
// Para trocar por uma API ou área administrativa no futuro, basta mudar
// este arquivo: as telas só conhecem as funções abaixo.
//
// As funções que buscam dados devolvem Promise (como uma API faria).
// Funções que só transformam dados já carregados (agruparPorBairro)
// continuam síncronas.

import json from './servicos-petrolina.json';
import territoriosJson from './territorios-cras.json';
import { soDigitos } from './links';
import { ordenarPorDistancia, type Ponto } from '../lib/geo';
import type {
  BaseDeDados,
  Categoria,
  NumeroUtil,
  Servico,
  Sobre,
  TerritoriosCras,
} from '../types';

const dados = json as BaseDeDados;
const territorios = territoriosJson as TerritoriosCras;

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

export async function listarServicos(): Promise<readonly Servico[]> {
  return dados.servicos;
}

export async function buscarServico(id: string): Promise<Servico | undefined> {
  return servicosPorId.get(id);
}

export async function listarCategorias(): Promise<readonly Categoria[]> {
  return dados.categorias;
}

export async function buscarCategoria(
  id: string,
): Promise<Categoria | undefined> {
  return categoriasPorId.get(id);
}

/**
 * Serviços de uma categoria, usando o campo `categorias` (não só a principal).
 * Os que têm a categoria como principal vêm primeiro.
 */
export async function listarPorCategoria(
  idCategoria: string,
): Promise<Servico[]> {
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

export async function listarMaisProcurados(): Promise<Servico[]> {
  return IDS_MAIS_PROCURADOS.map((id) => servicosPorId.get(id)).filter(
    (s): s is Servico => s !== undefined,
  );
}

export async function numerosUteis(): Promise<NumeroUtil[]> {
  return dados.numerosUteis.map((n) => ({ ...n, discar: soDigitos(n.numero) }));
}

export async function obterSobre(): Promise<Sobre> {
  return dados.sobre;
}

// ---------- Agrupamento (transformação, não acessa dados) ----------

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

// ---------- Perto de mim ----------

/** Tipos de serviço que a busca por proximidade aceita (futuro: 'ubs'). */
export type TipoProximo = 'cras';

const SIGLA_POR_TIPO: Record<TipoProximo, string> = { cras: 'CRAS' };

export interface ServicoProximo {
  servico: Servico;
  /** Em linha reta; null quando não há origem ou o serviço não tem coordenadas */
  distanciaKm: number | null;
}

/**
 * Serviços de um tipo, do mais perto ao mais longe da origem.
 * Sem origem, vêm em ordem alfabética e sem distância.
 * Serviços sem coordenadas ficam no fim.
 */
export async function listarProximos(
  origem: Ponto | null,
  filtro: TipoProximo,
  limite = 5,
): Promise<ServicoProximo[]> {
  const doTipo = dados.servicos.filter(
    (s) => s.sigla === SIGLA_POR_TIPO[filtro],
  );
  const ordenados: ServicoProximo[] = origem
    ? ordenarPorDistancia(origem, doTipo).map(({ item, distanciaKm }) => ({
        servico: item,
        distanciaKm,
      }))
    : [...doTipo]
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
        .map((servico) => ({ servico, distanciaKm: null }));
  return ordenados.slice(0, limite);
}

/** Sem acento, minúsculas, só letras e números separados por um espaço. */
const normalizarNome = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

interface EntradaTerritorio {
  crasId: string;
  /** Nome completo, como aparece na lista de bairros */
  completo: string;
  /** Nome sem o que está entre parênteses, e cada parte de "A / B" */
  principais: string[];
  /** O que está entre parênteses: "Vila Mocó (Jardim Paulo Afonso)" → "jardim paulo afonso" */
  secundarios: string[];
}

const entradasTerritorio: EntradaTerritorio[] = territorios.territorios.flatMap(
  ({ crasId, bairros }) =>
    bairros.map((bairro) => ({
      crasId,
      completo: normalizarNome(bairro),
      principais: bairro
        .replace(/\(.*?\)/g, '')
        .split('/')
        .map(normalizarNome)
        .filter(Boolean),
      secundarios: [...bairro.matchAll(/\((.*?)\)/g)].map((m) =>
        normalizarNome(m[1]),
      ),
    })),
);

const sinonimos = new Map(
  Object.entries(territorios.sinonimos).map(([de, para]) => [
    normalizarNome(de),
    normalizarNome(para.replace(/\(.*?\)/g, '').split('/')[0]),
  ]),
);

/**
 * CRAS que atende o bairro (comparação sem acento e sem maiúsculas).
 * Aceita outras grafias ("Terras do Sul", "N7") e o nome entre parênteses
 * ("Jardim Paulo Afonso"), mas o nome principal tem prioridade: "Pau Ferro"
 * é do CRAS Rajada, não dos assentamentos "(Pau Ferro)" do CRAS Uruás.
 */
export async function crasDeReferencia(
  bairro: string,
): Promise<Servico | null> {
  const digitado = normalizarNome(bairro);
  if (!digitado) return null;
  const nome = sinonimos.get(digitado) ?? digitado;
  const entrada =
    // 1º o nome exatamente como está na lista (ex.: "Vila Mocó (Jardim Paulo Afonso)")
    entradasTerritorio.find((e) => e.completo === digitado) ??
    entradasTerritorio.find((e) => e.principais.includes(nome)) ??
    entradasTerritorio.find((e) => e.secundarios.includes(nome));
  return entrada ? (servicosPorId.get(entrada.crasId) ?? null) : null;
}

export interface BairroComReferencia {
  bairro: string;
  crasId: string;
}

/** Todos os bairros que têm CRAS de referência, em ordem alfabética. */
export async function listarBairrosComReferencia(): Promise<
  BairroComReferencia[]
> {
  return territorios.territorios
    .flatMap(({ crasId, bairros }) =>
      bairros.map((bairro) => ({ bairro, crasId })),
    )
    .sort((a, b) =>
      a.bairro.localeCompare(b.bairro, 'pt-BR', { numeric: true }),
    );
}
