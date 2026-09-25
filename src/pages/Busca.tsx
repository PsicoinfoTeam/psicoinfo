import { Info } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import CollapsibleGroup from '../components/CollapsibleGroup';
import Container from '../components/Container';
import DataIcon from '../components/DataIcon';
import SearchBar from '../components/SearchBar';
import ServiceList from '../components/ServiceList';
import SuggestionChips from '../components/SuggestionChips';
import { buscar } from '../data/busca';
import { useTituloPagina } from '../hooks/useTituloPagina';
import styles from './Busca.module.css';

function Busca() {
  const [params] = useSearchParams();
  const termo = (params.get('q') ?? '').trim();
  const resposta = useMemo(() => buscar(termo), [termo]);

  useTituloPagina(termo ? `Busca: ${termo}` : 'Buscar serviços');

  return (
    <div className={styles.pagina}>
      <Container>
        <div className={styles.topo}>
          <h1 className={styles.titulo}>
            {resposta.tipo === 'vazia'
              ? 'Buscar serviços'
              : `Resultados para “${termo}”`}
          </h1>
          {/* key: recria o campo com o novo termo ao buscar de novo */}
          <SearchBar
            key={termo}
            valorInicial={termo}
            mostrarDica={resposta.tipo === 'vazia'}
          />
        </div>

        {resposta.tipo === 'vazia' && <SuggestionChips />}

        {resposta.tipo === 'resultados' && (
          <section aria-labelledby="total-resultados">
            <output id="total-resultados" className={styles.total}>
              {resposta.servicos.length === 1
                ? 'Encontramos 1 serviço.'
                : `Encontramos ${resposta.servicos.length} serviços.`}
            </output>
            <ServiceList servicos={resposta.servicos} nivelTitulo="h2" />
          </section>
        )}

        {resposta.tipo === 'sem-resultado' && (
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
              {resposta.alternativas.map(({ categoria, servicos }) => (
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
