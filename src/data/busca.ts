// Busca no cliente, seguindo as regras do CLAUDE.md:
// - sem acento e sem diferenciar maiúsculas;
// - campos com pesos: nome/sigla > bairro > tags > categorias > textos;
// - com várias palavras, todas precisam aparecer (cada uma em algum campo);
// - sem resultado: mostra os serviços que atendem toda Petrolina.
// Usa só a camada de acesso (servicos.ts), nunca o JSON direto.

import type { Categoria, Servico } from '../types';
import { listarCategorias, listarServicos } from './servicos';

/** Pontos de cada campo. Maior = mais importante. */
const PESOS = {
  nome: 10,
  bairro: 6,
  tags: 4,
  categorias: 3,
  textos: 1,
} as const;

type Campo = keyof typeof PESOS;

/** Palavras que não ajudam a achar nada ("posto DE saúde", "jose E maria"). */
const PALAVRAS_IGNORADAS = new Set(
  (
    'a o as os e de da do das dos em no na nos nas um uma para pra por com ' +
    'que ao contra quero preciso procuro onde fica'
  ).split(' '),
);

/** Minúsculas, sem acento, sem pontuação e sem espaços repetidos. */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function separarPalavras(textoNormalizado: string): string[] {
  return textoNormalizado ? textoNormalizado.split(' ') : [];
}

/** Palavras da busca, sem as que não ajudam (a não ser que só sobrem elas). */
function palavrasDaBusca(termo: string): string[] {
  const todas = separarPalavras(normalizar(termo));
  const uteis = todas.filter((p) => !PALAVRAS_IGNORADAS.has(p));
  return uteis.length > 0 ? uteis : todas;
}

// ---------- Índice (montado uma vez) ----------

interface CampoIndexado {
  /** Texto inteiro normalizado, para achar a frase completa */
  frase: string;
  palavras: string[];
}

interface ServicoIndexado {
  servico: Servico;
  campos: Record<Campo, CampoIndexado>;
}

function indexar(...textos: (string | null)[]): CampoIndexado {
  const frase = textos
    .filter((t): t is string => Boolean(t))
    .map(normalizar)
    .join(' | ');
  return { frase, palavras: separarPalavras(frase.replace(/ \| /g, ' ')) };
}

let indice: Promise<ServicoIndexado[]> | null = null;

/** Monta o índice uma vez (na primeira busca) e reaproveita depois. */
function obterIndice(): Promise<ServicoIndexado[]> {
  indice ??= (async () => {
    const [servicos, categorias] = await Promise.all([
      listarServicos(),
      listarCategorias(),
    ]);
    const nomeDaCategoria = new Map(categorias.map((c) => [c.id, c.nome]));
    return servicos.map((servico) => ({
      servico,
      campos: {
        nome: indexar(servico.nome, servico.sigla),
        bairro: indexar(servico.bairro),
        tags: indexar(...servico.tags),
        categorias: indexar(
          ...servico.categorias.map((id) => nomeDaCategoria.get(id) ?? null),
        ),
        textos: indexar(servico.paraQueServe, ...servico.oQueEncontra),
      },
    }));
  })();
  return indice;
}

// ---------- Pontuação ----------

/**
 * A palavra buscada bate com uma palavra do campo se for o começo dela
 * ("caps" acha "CAPSi"; "mulher" acha "mulheres"). Plural simples também
 * vale ao contrário ("remedios" acha "remédio").
 */
function palavraBate(buscada: string, doCampo: string): boolean {
  if (doCampo.startsWith(buscada)) return true;
  return (
    buscada.length > 4 &&
    buscada.endsWith('s') &&
    doCampo.startsWith(buscada.slice(0, -1))
  );
}

function pontuar(
  item: ServicoIndexado,
  palavras: string[],
  frase: string,
): number {
  let total = 0;

  // Cada palavra precisa bater em algum campo; vale o campo mais importante.
  for (const palavra of palavras) {
    let melhor = 0;
    for (const campo of Object.keys(PESOS) as Campo[]) {
      if (PESOS[campo] <= melhor) continue;
      if (item.campos[campo].palavras.some((p) => palavraBate(palavra, p))) {
        melhor = PESOS[campo];
      }
    }
    if (melhor === 0) return 0;
    total += melhor;
  }

  // Bônus quando a frase inteira aparece junta ("jose e maria" no nome).
  if (palavras.length > 1) {
    for (const campo of ['nome', 'bairro', 'tags'] as const) {
      if (item.campos[campo].frase.includes(frase)) total += PESOS[campo];
    }
  }

  // Bônus quando a busca é exatamente a sigla ("cras", "upa").
  if (item.servico.sigla && normalizar(item.servico.sigla) === frase) {
    total += PESOS.nome;
  }

  return total;
}

// ---------- API pública ----------

export interface GrupoPorCategoria {
  categoria: Categoria;
  servicos: Servico[];
}

export type RespostaBusca =
  | { tipo: 'vazia' }
  | { tipo: 'resultados'; termo: string; servicos: Servico[] }
  | { tipo: 'sem-resultado'; termo: string; alternativas: GrupoPorCategoria[] };

/** Serviços que atendem toda Petrolina (municipais ou regionais), por categoria. */
export async function servicosDaCidadeToda(): Promise<GrupoPorCategoria[]> {
  const [servicos, categorias] = await Promise.all([
    listarServicos(),
    listarCategorias(),
  ]);
  const daCidade = servicos.filter(
    (s) => s.abrangencia === 'municipal' || s.abrangencia === 'regional',
  );
  return categorias
    .map((categoria) => ({
      categoria,
      servicos: daCidade.filter((s) => s.categoriaPrincipal === categoria.id),
    }))
    .filter((grupo) => grupo.servicos.length > 0);
}

export async function buscar(termoDigitado: string): Promise<RespostaBusca> {
  const termo = termoDigitado.trim();
  const palavras = palavrasDaBusca(termo);
  if (palavras.length === 0) return { tipo: 'vazia' };

  const frase = normalizar(termo);
  const encontrados = (await obterIndice())
    .map((item) => ({
      servico: item.servico,
      pontos: pontuar(item, palavras, frase),
    }))
    .filter((r) => r.pontos > 0)
    .sort(
      (a, b) =>
        b.pontos - a.pontos ||
        a.servico.nome.localeCompare(b.servico.nome, 'pt-BR'),
    );

  if (encontrados.length === 0) {
    return {
      tipo: 'sem-resultado',
      termo,
      alternativas: await servicosDaCidadeToda(),
    };
  }
  return {
    tipo: 'resultados',
    termo,
    servicos: encontrados.map((r) => r.servico),
  };
}
