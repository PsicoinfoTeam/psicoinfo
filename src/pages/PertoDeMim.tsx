import { Info, RotateCw, TriangleAlert } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import BairroSelect from '../components/BairroSelect';
import Breadcrumb from '../components/Breadcrumb';
import Container from '../components/Container';
import LoadingState from '../components/LoadingState';
import LocationButton from '../components/LocationButton';
import NearbyList from '../components/NearbyList';
import {
  crasDeReferencia,
  listarBairrosComReferencia,
  listarProximos,
  type TipoProximo,
} from '../data/servicos';
import { useDados } from '../hooks/useDados';
import { useLocalizacao } from '../hooks/useLocalizacao';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { distanciaKm, estaEmPetrolina, type Ponto } from '../lib/geo';
import styles from './PertoDeMim.module.css';

/** Acima disso, avisamos que a localização é aproximada */
const PRECISAO_BAIXA_METROS = 2000;
/** Quantos "outros CRAS" mostrar */
const LIMITE_OUTROS = 5;

function PertoDeMim() {
  useTituloPagina('CRAS perto de você');
  const [params, setParams] = useSearchParams();
  // Por enquanto só CRAS; o parâmetro já fica pronto para "ubs" no futuro
  const tipo: TipoProximo = 'cras';
  const bairro = params.get('bairro');

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

  // Sem GPS, os outros CRAS são ordenados a partir do CRAS de referência
  // (sem mostrar distância, que só faz sentido a partir da pessoa)
  const origem: Ponto | null = origemGps ?? crasReferencia?.coordenadas ?? null;
  const chaveOrigem = origem
    ? `${origem.lat.toFixed(5)},${origem.lng.toFixed(5)}`
    : 'sem-origem';
  const temAlgoParaMostrar = origemGps !== null || bairro !== null;
  const proximos = useDados(
    `proximos:${tipo}:${chaveOrigem}`,
    () =>
      temAlgoParaMostrar
        ? listarProximos(origem, tipo, LIMITE_OUTROS + 1)
        : Promise.resolve([]),
    // A lista feita a partir do GPS não fica guardada depois que a tela fecha
    { guardar: origemGps === null, manterAnterior: true },
  );
  const outros =
    proximos.status === 'ok'
      ? proximos.dados
          .filter((p) => p.servico.id !== crasReferencia?.id)
          .slice(0, LIMITE_OUTROS)
      : [];

  // Depois de escolher o bairro, leva o foco ao resultado (leitor de tela)
  const refResultados = useRef<HTMLDivElement>(null);
  const escolheuAgora = useRef(false);
  useEffect(() => {
    if (!escolheuAgora.current || referencia.status !== 'ok') return;
    escolheuAgora.current = false;
    refResultados.current?.querySelector<HTMLElement>('h2')?.focus();
  }, [referencia.status, bairro]);

  function escolherBairro(nome: string) {
    escolheuAgora.current = true;
    setParams({ tipo, bairro: nome });
  }

  const bairroDesconhecido =
    bairro !== null && referencia.status === 'ok' && !crasReferencia;

  return (
    <div className={styles.pagina}>
      <Container>
        <Breadcrumb />
        <header className={styles.cabecalho}>
          <h1 className={styles.titulo}>CRAS perto de você</h1>
          <p className={styles.intro}>
            O CRAS (Centro de Referência de Assistência Social) ajuda com
            benefícios, Cadastro Único e apoio à família. Veja qual atende o seu
            bairro.
          </p>
        </header>

        <section className={styles.escolha} aria-label="Como encontrar o CRAS">
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

          {crasReferencia && (
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
            <NearbyList
              id="titulo-outros"
              titulo={
                origemGps
                  ? crasReferencia
                    ? 'Outros CRAS perto de você'
                    : 'CRAS mais perto de você'
                  : 'Outros CRAS'
              }
              descricao={
                origemGps
                  ? crasReferencia
                    ? undefined
                    : 'Para saber qual CRAS atende a sua casa, escolha seu bairro acima.'
                  : 'Para ver a distância até cada um, use sua localização.'
              }
              itens={outros}
              mostrarDistancia={origemGps !== null}
            />
          )}
        </div>
      </Container>
    </div>
  );
}

export default PertoDeMim;
