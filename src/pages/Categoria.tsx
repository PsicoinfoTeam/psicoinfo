import { MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import CollapsibleGroup from '../components/CollapsibleGroup';
import Container from '../components/Container';
import DataIcon from '../components/DataIcon';
import ServiceList from '../components/ServiceList';
import {
  agruparPorBairro,
  buscarCategoria,
  listarCategorias,
  listarPorCategoria,
} from '../data/servicos';
import { useTituloPagina } from '../hooks/useTituloPagina';
import type { Categoria as TipoCategoria } from '../types';
import NaoEncontrada from './NaoEncontrada';
import styles from './Categoria.module.css';

function Categoria() {
  const { id = '' } = useParams();
  const categoria = buscarCategoria(id);

  if (!categoria) {
    return (
      <NaoEncontrada
        titulo="Assunto não encontrado"
        mensagem="Não achamos este assunto. O link pode estar errado."
      />
    );
  }

  return <PaginaCategoria categoria={categoria} />;
}

interface PaginaCategoriaProps {
  categoria: TipoCategoria;
}

function PaginaCategoria({ categoria }: PaginaCategoriaProps) {
  useTituloPagina(categoria.nome);

  const servicos = listarPorCategoria(categoria.id);
  const principais = servicos.filter(
    (s) => s.categoriaPrincipal === categoria.id,
  );
  const tambem = servicos.filter((s) => s.categoriaPrincipal !== categoria.id);
  // Postos de saúde (UBS) são muitos: ficam numa seção própria, por bairro
  const ubs = principais.filter((s) => s.sigla === 'UBS');
  const outrosPrincipais = principais.filter((s) => s.sigla !== 'UBS');
  const ubsPorBairro = agruparPorBairro(ubs);

  const metade = Math.ceil(ubsPorBairro.length / 2);
  const colunasDeBairros = [
    ubsPorBairro.slice(0, metade),
    ubsPorBairro.slice(metade),
  ];

  const outras = listarCategorias().filter((c) => c.id !== categoria.id);

  return (
    <div className={styles.pagina}>
      <Container>
        <Breadcrumb />

        <header className={styles.cabecalho}>
          <span className={styles.icone} aria-hidden="true">
            <DataIcon nome={categoria.icone} size={36} strokeWidth={2} />
          </span>
          <div className={styles.textos}>
            <h1 className={styles.titulo}>{categoria.nome}</h1>
            <p className={styles.descricao}>{categoria.descricao}</p>
          </div>
        </header>

        <p className={styles.total}>
          {servicos.length === 1
            ? '1 serviço pode ajudar:'
            : `${servicos.length} serviços podem ajudar:`}
        </p>

        {/* Se não houver separação, uma lista só, sem subtítulo */}
        {ubs.length === 0 &&
        (tambem.length === 0 || principais.length === 0) ? (
          <ServiceList servicos={servicos} nivelTitulo="h2" />
        ) : (
          <>
            <section
              aria-labelledby="titulo-principais"
              className={styles.grupo}
            >
              <h2 id="titulo-principais" className={styles.tituloGrupo}>
                Principais serviços
              </h2>
              <ServiceList servicos={outrosPrincipais} />
            </section>
            {ubsPorBairro.length > 0 && (
              <section aria-labelledby="titulo-ubs" className={styles.grupo}>
                <h2 id="titulo-ubs" className={styles.tituloGrupo}>
                  Postos de saúde (UBS) por bairro
                </h2>
                <p className={styles.dica}>
                  {ubs.length} postos de saúde. Toque no seu bairro para ver o
                  posto mais perto.
                </p>
                <div className={styles.bairros}>
                  {colunasDeBairros.map((coluna, i) => (
                    <ul key={i} className={styles.colunaBairros}>
                      {coluna.map(({ bairro, servicos: doBairro }) => (
                        <li key={bairro}>
                          <CollapsibleGroup
                            titulo={bairro}
                            total={doBairro.length}
                            nivelTitulo="h3"
                            icone={<MapPin size={24} strokeWidth={2} />}
                          >
                            <ServiceList
                              servicos={doBairro}
                              nivelTitulo="h4"
                              umaColuna
                            />
                          </CollapsibleGroup>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </section>
            )}
            {tambem.length > 0 && (
              <section aria-labelledby="titulo-tambem" className={styles.grupo}>
                <h2 id="titulo-tambem" className={styles.tituloGrupo}>
                  Também podem ajudar
                </h2>
                <ServiceList servicos={tambem} />
              </section>
            )}
          </>
        )}

        <nav aria-labelledby="titulo-outros" className={styles.outros}>
          <h2 id="titulo-outros" className={styles.tituloGrupo}>
            Outros assuntos
          </h2>
          <ul className={styles.chips}>
            {outras.map((outra) => (
              <li key={outra.id}>
                <Link to={`/categoria/${outra.id}`} className={styles.chip}>
                  <DataIcon nome={outra.icone} size={20} strokeWidth={2.25} />
                  {outra.nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
  );
}

export default Categoria;
