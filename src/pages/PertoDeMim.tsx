import { ChevronDown, Info, RotateCw, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import BairroSelect from '../components/BairroSelect';
import Container from '../components/Container';
import DataIcon from '../components/DataIcon';
import LoadingState from '../components/LoadingState';
import LocationButton from '../components/LocationButton';
import NearbyList from '../components/NearbyList';
import {
  crasDeReferencia,
  listarBairrosComReferencia,
  listarProximos,
  OPCOES_FILTRO_PROXIMO,
  validarTipoProximo,
  type TipoProximo,
} from '../data/servicos';
import { useDados } from '../hooks/useDados';
import { useLocalizacao } from '../hooks/useLocalizacao';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { distanciaKm, estaEmPetrolina, type Ponto } from '../lib/geo';
import styles from './PertoDeMim.module.css';

/** Acima disso, avisamos que a localização é aproximada */
const PRECISAO_BAIXA_METROS = 2000;
/** Quantidade inicial de serviços exibidos na lista */
const LIMITE_INICIAL = 6;
/** Total máximo buscado para permitir expandir a lista */
const LIMITE_BUSCA = 120;

function tituloDaLista(
  tipo: TipoProximo,
  rotuloFiltro: string,
  temGps: boolean,
  bairro: string | null,
): string {
  if (tipo === 'todos') {
    if (temGps) return 'Serviços mais perto de você';
    return bairro ? `Serviços em ${bairro} e região` : 'Serviços mais próximos';
  }
  if (temGps) return `${rotuloFiltro}: mais perto de você`;
  return bairro
    ? `${rotuloFiltro} em ${bairro} e região`
    : `${rotuloFiltro}: mais próximos`;
}

function descricaoDaLista(
  tipo: TipoProximo,
  temGps: boolean,
  mostrarCrasRef: boolean,
): string | undefined {
  if (temGps) {
    return (tipo === 'todos' || tipo === 'assistencia-social') &&
      !mostrarCrasRef
      ? 'Para ver também o CRAS que atende a sua casa, escolha seu bairro acima.'
      : undefined;
  }
  return 'Mostrando primeiro os serviços do seu bairro e da sua região.';
}

function PertoDeMim() {
  useTituloPagina('Serviços perto de você');
  const [params, setParams] = useSearchParams();
  const tipo: TipoProximo = validarTipoProximo(params.get('tipo'));
  const bairro = params.get('bairro');
  const [limite, setLimite] = useState(LIMITE_INICIAL);

  const localizacao = useLocalizacao();
  const { estado, coordenadas, precisaoMetros, solicitar } = localizacao;
  const foraDePetrolina =
    estado === 'ok' && coordenadas !== null && !estaEmPetrolina(coordenadas);
  /** Origem pelo GPS: só vale dentro de Petrolina */
  const origemGps: Ponto | null =
    estado === 'ok' && coordenadas && !foraDePetrolina ? coordenadas : null;

  const bairros = useDados(
    'bairros-com-referencia',
    listarBairrosComReferencia,
  );
  const referencia = useDados(`cras-referencia:${bairro ?? ''}`, () =>
    bairro ? crasDeReferencia(bairro) : Promise.resolve(null),
  );
  const crasReferencia = referencia.status === 'ok' ? referencia.dados : null;

  // Sem GPS, os serviços são ordenados a partir do bairro e do CRAS de referência
  // (sem mostrar distância em km, que só faz sentido a partir da localização da pessoa)
  const origem: Ponto | null = origemGps ?? crasReferencia?.coordenadas ?? null;
  const chaveOrigem = origem
    ? `${origem.lat.toFixed(5)},${origem.lng.toFixed(5)}`
    : 'sem-origem';
  const temAlgoParaMostrar = origemGps !== null || bairro !== null;

  const mostrarCrasReferencia =
    crasReferencia !== null &&
    (tipo === 'todos' || tipo === 'assistencia-social' || tipo === 'criancas');

  const proximos = useDados(
    `proximos:${tipo}:${chaveOrigem}:${bairro ?? ''}`,
    () =>
      temAlgoParaMostrar
        ? listarProximos(origem, tipo, LIMITE_BUSCA, bairro)
        : Promise.resolve([]),
    // A lista feita a partir do GPS não fica guardada depois que a tela fecha
    { guardar: origemGps === null, manterAnterior: true },
  );

  const todosOutros =
    proximos.status === 'ok'
      ? proximos.dados.filter(
          (p) => !mostrarCrasReferencia || p.servico.id !== crasReferencia?.id,
        )
      : [];
  const outros = todosOutros.slice(0, limite);
  const temMais = todosOutros.length > limite;

  // Depois de escolher o bairro, leva o foco ao resultado (leitor de tela)
  const refResultados = useRef<HTMLDivElement>(null);
  const escolheuAgora = useRef(false);
  useEffect(() => {
    if (!escolheuAgora.current || referencia.status !== 'ok') return;
    escolheuAgora.current = false;
    refResultados.current?.querySelector<HTMLElement>('h2')?.focus();
  }, [referencia.status, bairro]);

  function atualizarParametros(
    novoTipo: TipoProximo,
    novoBairro: string | null,
  ) {
    const proximo: Record<string, string> = {};
    if (novoTipo !== 'todos') proximo.tipo = novoTipo;
    if (novoBairro) proximo.bairro = novoBairro;
    setParams(proximo, { replace: true });
  }

  function escolherBairro(nome: string) {
    escolheuAgora.current = true;
    setLimite(LIMITE_INICIAL);
    atualizarParametros(tipo, nome);
  }

  function escolherTipo(novoTipo: TipoProximo) {
    setLimite(LIMITE_INICIAL);
    atualizarParametros(novoTipo, bairro);
  }

  const bairroDesconhecido =
    bairro !== null && referencia.status === 'ok' && !crasReferencia;

  const opcaoAtual =
    OPCOES_FILTRO_PROXIMO.find((o) => o.id === tipo) ??
    OPCOES_FILTRO_PROXIMO[0];

  return (
    <div className={styles.pagina}>
      <Container>
        <BackButton />
        <header className={styles.cabecalho}>
          <h1 className={styles.titulo}>Serviços perto de você</h1>
          <p className={styles.intro}>
            Encontre o CRAS do seu bairro, postos de saúde (UBS), CAPS, CREAS e
            outros serviços públicos mais próximos de você.
          </p>
        </header>

        <section
          className={styles.escolha}
          aria-label="Como encontrar serviços perto de você"
        >
          <LocationButton
            procurando={estado === 'pedindo'}
            onClick={solicitar}
          />

          <div className={styles.mensagens} aria-live="polite">
            {estado === 'pedindo' && <p>Procurando sua localização…</p>}
            {estado === 'negado' && (
              <p className={styles.mensagem}>
                <Info aria-hidden="true" size={22} />
                <span>Tudo bem! Escolha seu bairro abaixo.</span>
              </p>
            )}
            {(estado === 'indisponivel' || estado === 'erro') && (
              <div className={styles.mensagem}>
                <TriangleAlert aria-hidden="true" size={22} />
                <div className={styles.mensagemTexto}>
                  <p>Não conseguimos encontrar sua localização.</p>
                  <button
                    type="button"
                    className={styles.tentarDeNovo}
                    onClick={solicitar}
                  >
                    <RotateCw aria-hidden="true" size={20} strokeWidth={2.25} />
                    <span>Tentar de novo</span>
                  </button>
                </div>
              </div>
            )}
            {foraDePetrolina && (
              <p className={styles.mensagem}>
                <Info aria-hidden="true" size={22} />
                <span>
                  Parece que você não está em Petrolina. Escolha um bairro de
                  Petrolina abaixo.
                </span>
              </p>
            )}
          </div>

          <hr className={styles.divisor} />

          {bairros.status === 'ok' ? (
            <BairroSelect
              bairros={bairros.dados}
              selecionado={bairro}
              onEscolher={escolherBairro}
            />
          ) : (
            <LoadingState erro={bairros.status === 'erro'} />
          )}
        </section>

        <section
          className={styles.secaoFiltros}
          aria-labelledby="titulo-filtros"
        >
          <h2 id="titulo-filtros" className={styles.tituloFiltros}>
            Filtrar por tipo de serviço
          </h2>
          <ul className={styles.listaFiltros}>
            {OPCOES_FILTRO_PROXIMO.map((opcao) => {
              const ativo = opcao.id === tipo;
              return (
                <li key={opcao.id}>
                  <button
                    type="button"
                    aria-pressed={ativo}
                    className={`${styles.chipFiltro} ${ativo ? styles.chipFiltroAtivo : ''}`}
                    onClick={() => escolherTipo(opcao.id)}
                  >
                    <DataIcon
                      nome={opcao.icone}
                      size={18}
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    <span>{opcao.rotulo}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <div className={styles.resultados} ref={refResultados}>
          {bairroDesconhecido && (
            <p className={styles.mensagem}>
              <Info aria-hidden="true" size={22} />
              <span>
                Não encontramos o bairro “{bairro}” na lista. Escolha um bairro
                acima.
              </span>
            </p>
          )}

          {mostrarCrasReferencia && crasReferencia && (
            <NearbyList
              id="titulo-referencia"
              titulo="Seu CRAS de referência"
              descricao={`É o CRAS que atende o bairro ${bairro}.`}
              itens={[
                {
                  servico: crasReferencia,
                  distanciaKm:
                    origemGps && crasReferencia.coordenadas
                      ? distanciaKm(origemGps, crasReferencia.coordenadas)
                      : null,
                },
              ]}
              destaque
            />
          )}

          {origemGps &&
            precisaoMetros !== null &&
            precisaoMetros > PRECISAO_BAIXA_METROS && (
              <p className={styles.mensagem}>
                <Info aria-hidden="true" size={22} />
                <span>
                  <strong>Localização aproximada.</strong> As distâncias podem
                  variar.
                </span>
              </p>
            )}

          {temAlgoParaMostrar && outros.length > 0 && (
            <div className={styles.blocoLista}>
              <NearbyList
                id="titulo-outros"
                titulo={tituloDaLista(
                  tipo,
                  opcaoAtual.rotulo,
                  origemGps !== null,
                  bairro,
                )}
                descricao={descricaoDaLista(
                  tipo,
                  origemGps !== null,
                  mostrarCrasReferencia,
                )}
                itens={outros}
                mostrarDistancia={origemGps !== null}
              />

              {temMais && (
                <button
                  type="button"
                  className={styles.mostrarMais}
                  onClick={() => setLimite((atual) => atual + LIMITE_INICIAL)}
                >
                  <ChevronDown
                    aria-hidden="true"
                    size={22}
                    strokeWidth={2.25}
                  />
                  <span>
                    Mostrar mais serviços ({todosOutros.length - limite}{' '}
                    restantes)
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default PertoDeMim;
