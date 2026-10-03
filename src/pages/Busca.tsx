import { Info } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import CollapsibleGroup from '../components/CollapsibleGroup';
import Container from '../components/Container';
import DataIcon from '../components/DataIcon';
import LoadingState from '../components/LoadingState';
import NearbyLink from '../components/NearbyLink';
import SearchBar from '../components/SearchBar';
import ServiceList from '../components/ServiceList';
import SuggestionChips from '../components/SuggestionChips';
import { buscar, normalizar } from '../data/busca';
import { useDados } from '../hooks/useDados';
import { useTituloPagina } from '../hooks/useTituloPagina';
import styles from './Busca.module.css';

function Busca() {
  const [params] = useSearchParams();
  const termo = (params.get('q') ?? '').trim();
  const busca = useDados(`busca:${termo}`, () => buscar(termo));
  const vazia = termo === '';

  useTituloPagina(termo ? `Busca: ${termo}` : 'Buscar serviços');

  // Busca por CRAS: oferece o atalho para os CRAS mais perto
  const mostrarPertoDeMim =
    busca.status === 'ok' &&
    busca.dados.tipo === 'resultados' &&
    (normalizar(termo).split(' ').includes('cras') ||
      busca.dados.servicos.some((s) => s.sigla === 'CRAS'));

  return (
    <div className={styles.pagina}>
      <Container>
        <div className={styles.topo}>
          <h1 className={styles.titulo}>
            {vazia ? 'Buscar serviços' : `Resultados para “${termo}”`}
          </h1>
          {/* key: recria o campo com o novo termo ao buscar de novo */}
          <SearchBar key={termo} valorInicial={termo} mostrarDica={vazia} />
        </div>

        {vazia && <SuggestionChips />}

        {!vazia && busca.status !== 'ok' && (
          <LoadingState erro={busca.status === 'erro'} />
        )}

        {busca.status === 'ok' && busca.dados.tipo === 'resultados' && (
          <section aria-labelledby="total-resultados">
            <output id="total-resultados" className={styles.total}>
              {busca.dados.servicos.length === 1
                ? 'Encontramos 1 serviço.'
                : `Encontramos ${busca.dados.servicos.length} serviços.`}
            </output>
            {mostrarPertoDeMim && (
              <div className={styles.pertoDeMim}>
                <NearbyLink />
              </div>
            )}
            <ServiceList servicos={busca.dados.servicos} nivelTitulo="h2" />
          </section>
        )}

        {busca.status === 'ok' && busca.dados.tipo === 'sem-resultado' && (
          <>
            <output className={styles.aviso}>
              <Info
                aria-hidden="true"
                size={28}
                className={styles.avisoIcone}
              />
              <span>
                <strong>
                  Não encontramos “{termo}” nos serviços cadastrados.
                </strong>{' '}
                Estes serviços atendem toda Petrolina. Toque em um assunto para
                ver:
              </span>
            </output>

            <ul className={styles.grupos}>
              {busca.dados.alternativas.map(({ categoria, servicos }) => (
                <li key={categoria.id}>
                  <CollapsibleGroup
                    titulo={categoria.nome}
                    total={servicos.length}
                    nivelTitulo="h2"
                    icone={
                      <DataIcon
                        nome={categoria.icone}
                        size={24}
                        strokeWidth={2}
                      />
                    }
                  >
                    <ServiceList servicos={servicos} />
                  </CollapsibleGroup>
                </li>
              ))}
            </ul>

            <div className={styles.outraBusca}>
              <SuggestionChips />
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

export default Busca;
