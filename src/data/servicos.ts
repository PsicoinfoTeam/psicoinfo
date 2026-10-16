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
import { distanciaKm, type Ponto } from '../lib/geo';
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

/** Categorias aceitas na busca por proximidade. */
export type TipoProximo =
  | 'todos'
  | 'urgencia'
  | 'saude'
  | 'saude-mental'
  | 'assistencia-social'
  | 'criancas'
  | 'mulher'
  | 'direitos'
  | 'seguranca'
  | 'educacao'
  | 'comunidade'
  | 'governo';

export interface OpcaoFiltroProximo {
  id: TipoProximo;
  rotulo: string;
  icone: string;
}

export const OPCOES_FILTRO_PROXIMO: readonly OpcaoFiltroProximo[] = [
  { id: 'todos', rotulo: 'Todos', icone: 'layout-grid' },
  ...dados.categorias.map((c) => ({
    id: c.id as TipoProximo,
    rotulo: c.nome,
    icone: c.icone,
  })),
];

const TIPOS_VALIDOS = new Set<string>(OPCOES_FILTRO_PROXIMO.map((o) => o.id));

const TIPOS_LEGADOS: Record<string, TipoProximo> = {
  cras: 'assistencia-social',
  creas: 'assistencia-social',
  ubs: 'saude',
  caps: 'saude-mental',
};

export function validarTipoProximo(valor: string | null): TipoProximo {
  if (!valor) return 'todos';
  if (TIPOS_VALIDOS.has(valor)) return valor as TipoProximo;
  if (valor in TIPOS_LEGADOS) return TIPOS_LEGADOS[valor];
  return 'todos';
}

export interface ServicoProximo {
  servico: Servico;
  /** Em linha reta; null quando não há origem ou o serviço não tem coordenadas */
  distanciaKm: number | null;
}

function filtrarPorTipo(filtro: TipoProximo): readonly Servico[] {
  if (filtro === 'todos') return dados.servicos;
  return dados.servicos.filter((s) => s.categorias.includes(filtro));
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

const sinonimos = new Map([
  ...Object.entries(territorios.sinonimos).map(
    ([de, para]) =>
      [
        normalizarNome(de),
        normalizarNome(para.replace(/\(.*?\)/g, '').split('/')[0]),
      ] as const,
  ),
  [normalizarNome('Núcleo C I'), normalizarNome('Projeto C1')],
  [normalizarNome('Núcleo C III'), normalizarNome('Projeto C3')],
  [normalizarNome('Vila KM 25'), normalizarNome('KM 25')],
  [normalizarNome('Projeto Bebedouro'), normalizarNome('Bebedouro')],
]);

function acharEntradaTerritorio(
  bairro: string | null | undefined,
): EntradaTerritorio | null {
  if (!bairro) return null;
  const digitado = normalizarNome(bairro);
  if (!digitado) return null;
  const nome = sinonimos.get(digitado) ?? digitado;
  return (
    // 1º o nome exatamente como está na lista (ex.: "Vila Mocó (Jardim Paulo Afonso)")
    entradasTerritorio.find((e) => e.completo === digitado) ??
    entradasTerritorio.find((e) => e.principais.includes(nome)) ??
    entradasTerritorio.find((e) => e.secundarios.includes(nome)) ??
    null
  );
}

function entradaTerritorioDoServico(
  servico: Servico,
): EntradaTerritorio | null {
  const porBairro = acharEntradaTerritorio(servico.bairro);
  if (porBairro) return porBairro;
  const [antesDoTraco = ''] = servico.endereco.split(' - ');
  const localidade = antesDoTraco
    .replace(/^(Povoado de |Povoado |Distrito de )/i, '')
    .trim();
  const porEndereco = acharEntradaTerritorio(localidade);
  if (porEndereco) return porEndereco;
  if (normalizarNome(servico.endereco).includes('jose silvestre')) {
    return acharEntradaTerritorio('Izacolândia');
  }
  return null;
}

/**
 * Serviços de um tipo ou categoria, do mais perto ao mais longe da origem.
 * Quando um bairro é informado, prioriza os serviços do mesmo bairro e do
 * mesmo território de CRAS. Sem origem, vêm em ordem alfabética e sem distância.
 * Serviços sem coordenadas nem território ficam no fim.
 */
export async function listarProximos(
  origem: Ponto | null,
  filtro: TipoProximo,
  limite = 6,
  bairro?: string | null,
): Promise<ServicoProximo[]> {
  const doTipo = filtrarPorTipo(filtro);
  const entradaBairro = acharEntradaTerritorio(bairro);
  const bairroNorm = bairro ? normalizarNome(bairro) : '';

  const avaliados = doTipo.map((servico) => {
    const entradaServico = entradaTerritorioDoServico(servico);
    const crasDoServico = entradaServico
      ? servicosPorId.get(entradaServico.crasId)
      : undefined;
    const servicoBairroNorm = servico.bairro
      ? normalizarNome(servico.bairro)
      : '';

    const noMesmoBairro =
      bairroNorm.length > 0 &&
      (servicoBairroNorm === bairroNorm ||
        (entradaBairro !== null &&
          entradaServico !== null &&
          entradaServico.completo === entradaBairro.completo) ||
        (servico.bairro === ZONA_RURAL &&
          normalizarNome(servico.endereco).includes(bairroNorm)));

    const noMesmoTerritorio =
      entradaBairro !== null &&
      entradaServico !== null &&
      entradaServico.crasId === entradaBairro.crasId;

    const distanciaRealKm =
      origem && servico.coordenadas
        ? distanciaKm(origem, servico.coordenadas)
        : null;

    const pontoOrdenacao =
      servico.coordenadas ?? crasDoServico?.coordenadas ?? null;
    const distanciaOrdenacao =
      origem && pontoOrdenacao ? distanciaKm(origem, pontoOrdenacao) : null;

    return {
      servico,
      distanciaKm: distanciaRealKm,
      noMesmoBairro,
      noMesmoTerritorio,
      temCoordenadaPropria: Boolean(servico.coordenadas),
      distanciaOrdenacao,
    };
  });

  avaliados.sort((a, b) => {
    if (bairroNorm.length > 0) {
      if (a.noMesmoBairro !== b.noMesmoBairro) {
        return a.noMesmoBairro ? -1 : 1;
      }
      if (a.noMesmoTerritorio !== b.noMesmoTerritorio) {
        return a.noMesmoTerritorio ? -1 : 1;
      }
    }
    if (a.distanciaOrdenacao !== null && b.distanciaOrdenacao !== null) {
      const diff = a.distanciaOrdenacao - b.distanciaOrdenacao;
      if (Math.abs(diff) > 0.01) return diff;
      if (a.temCoordenadaPropria !== b.temCoordenadaPropria) {
        return a.temCoordenadaPropria ? -1 : 1;
      }
    } else if (a.distanciaOrdenacao !== null) {
      return -1;
    } else if (b.distanciaOrdenacao !== null) {
      return 1;
    }
    return a.servico.nome.localeCompare(b.servico.nome, 'pt-BR');
  });

  return avaliados
    .slice(0, limite)
    .map(({ servico, distanciaKm }) => ({ servico, distanciaKm }));
}

/**
 * CRAS que atende o bairro (comparação sem acento e sem maiúsculas).
 * Aceita outras grafias ("Terras do Sul", "N7") e o nome entre parênteses
 * ("Jardim Paulo Afonso"), mas o nome principal tem prioridade: "Pau Ferro"
 * é do CRAS Rajada, não dos assentamentos "(Pau Ferro)" do CRAS Uruás.
 */
export async function crasDeReferencia(
  bairro: string,
): Promise<Servico | null> {
  const entrada = acharEntradaTerritorio(bairro);
  return entrada ? (servicosPorId.get(entrada.crasId) ?? null) : null;
}

export interface BairroComReferencia {
  bairro: string;
  crasId: string;
  /** Outras grafias que levam a este bairro (ex.: "Terras do Sul") */
  outrosNomes: string[];
}

/** Todos os bairros que têm CRAS de referência, em ordem alfabética. */
export async function listarBairrosComReferencia(): Promise<
  BairroComReferencia[]
> {
  // Cada sinônimo aponta para o nome exato de um bairro da lista
  const outrosNomesPorBairro = new Map<string, string[]>();
  for (const [de, para] of Object.entries(territorios.sinonimos)) {
    outrosNomesPorBairro.set(para, [
      ...(outrosNomesPorBairro.get(para) ?? []),
      de,
    ]);
  }
  return territorios.territorios
    .flatMap(({ crasId, bairros }) =>
      bairros.map((bairro) => ({
        bairro,
        crasId,
        outrosNomes: outrosNomesPorBairro.get(bairro) ?? [],
      })),
    )
    .sort((a, b) =>
      a.bairro.localeCompare(b.bairro, 'pt-BR', { numeric: true }),
    );
}
