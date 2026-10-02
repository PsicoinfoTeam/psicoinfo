import { useEffect, useRef, useState } from 'react';

export type EstadoDados<T> =
  { status: 'carregando' } | { status: 'ok'; dados: T } | { status: 'erro' };

interface OpcoesDados {
  /**
   * Enquanto carrega uma chave nova, continua mostrando o resultado anterior
   * (ex.: sugestões da busca, que não podem piscar a cada letra).
   */
  manterAnterior?: boolean;
  /**
   * Guardar o resultado em memória para as próximas visitas (padrão: sim).
   * Use false para dados sensíveis, como resultados calculados a partir da
   * localização da pessoa: eles somem quando a tela fecha.
   */
  guardar?: boolean;
}

// Resultados já carregados, por chave. Fica só na memória da aba: com ele, as
// páginas voltam instantâneas e o "Voltar" do navegador mantém a rolagem.
const resultados = new Map<string, unknown>();

interface Interno<T> {
  chave: string;
  estado: EstadoDados<T>;
}

function doCache<T>(chave: string): EstadoDados<T> | null {
  return resultados.has(chave)
    ? { status: 'ok', dados: resultados.get(chave) as T }
    : null;
}

/**
 * Carrega dados da camada de acesso (funções async de src/data/).
 * `chave` identifica a consulta: quando ela muda, carrega de novo.
 */
export function useDados<T>(
  chave: string,
  carregar: () => Promise<T>,
  { manterAnterior = false, guardar = true }: OpcoesDados = {},
): EstadoDados<T> {
  const [interno, setInterno] = useState<Interno<T>>(() => ({
    chave,
    estado: (guardar && doCache<T>(chave)) || { status: 'carregando' },
  }));

  // A função mais recente, sem obrigar quem chama a memorizá-la
  const refCarregar = useRef(carregar);
  useEffect(() => {
    refCarregar.current = carregar;
  });

  useEffect(() => {
    if (guardar && resultados.has(chave)) return;
    let ativo = true;
    refCarregar
      .current()
      .then((dados) => {
        if (guardar) resultados.set(chave, dados);
        if (ativo) setInterno({ chave, estado: { status: 'ok', dados } });
      })
      .catch(() => {
        if (ativo) setInterno({ chave, estado: { status: 'erro' } });
      });
    return () => {
      ativo = false;
    };
  }, [chave, guardar]);

  // Chave nova: usa o cache, o resultado anterior ou "carregando"
  if (interno.chave !== chave) {
    const emCache = guardar ? doCache<T>(chave) : null;
    if (emCache) return emCache;
    if (manterAnterior && interno.estado.status === 'ok') return interno.estado;
    return { status: 'carregando' };
  }
  return interno.estado;
}
