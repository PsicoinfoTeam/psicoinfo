import { LocateFixed } from 'lucide-react';
import { Link } from 'react-router-dom';
import ponte from '../assets/ponte-negativo.png';
import CategoryCard from '../components/CategoryCard';
import Container from '../components/Container';
import LoadingState from '../components/LoadingState';
import PhoneButton from '../components/PhoneButton';
import SearchBar from '../components/SearchBar';
import SectionTitle from '../components/SectionTitle';
import ServiceList from '../components/ServiceList';
import SuggestionChips from '../components/SuggestionChips';
import {
  listarCategorias,
  listarMaisProcurados,
  listarPorCategoria,
  numerosUteis,
} from '../data/servicos';
import { useDados } from '../hooks/useDados';
import { useTituloPagina } from '../hooks/useTituloPagina';
import styles from './Home.module.css';

/** Tudo o que a página inicial precisa da camada de dados, de uma vez. */
async function carregarInicio() {
  const [categorias, maisProcurados, telefones] = await Promise.all([
    listarCategorias(),
    listarMaisProcurados(),
    numerosUteis(),
  ]);
  const comTotal = await Promise.all(
    categorias.map(async (categoria) => ({
      categoria,
      total: (await listarPorCategoria(categoria.id)).length,
    })),
  );
  return { categorias: comTotal, maisProcurados, telefones };
}

function Home() {
  useTituloPagina('Serviços públicos de Petrolina');
  const inicio = useDados('inicio', carregarInicio);

  return (
    <>
      <section className={styles.hero} aria-labelledby="titulo-inicio">
        <img
          src={ponte}
          alt=""
          className={styles.ponte}
          width={631}
          height={360}
        />
        <Container>
          <div className={styles.heroConteudo}>
            <h1 id="titulo-inicio" className={styles.titulo}>
              Encontre serviços públicos perto de você
            </h1>
            <p className={styles.subtitulo}>
              Saúde, assistência social, direitos e proteção em Petrolina. Não
              precisa saber o nome nem o endereço do lugar.
            </p>
            <div className={styles.busca}>
              <SearchBar variante="destaque" />
              <SuggestionChips variante="destaque" />
            </div>
          </div>
        </Container>
      </section>

      <section className={styles.secaoPerto} aria-labelledby="titulo-perto">
        <Container>
          <div className={styles.cartaoPerto}>
            <span className={styles.iconePerto} aria-hidden="true">
              <LocateFixed size={32} strokeWidth={2} />
            </span>
            <div className={styles.textoPerto}>
              <h2 id="titulo-perto" className={styles.tituloPerto}>
                Encontre o CRAS mais perto de você
              </h2>
              <p>
                CRAS é o Centro de Referência de Assistência Social. Use sua
                localização ou escolha seu bairro.
              </p>
            </div>
            <Link to="/perto-de-mim?tipo=cras" className={styles.botaoPerto}>
              <LocateFixed aria-hidden="true" size={22} strokeWidth={2.25} />
              <span>Ver CRAS perto de mim</span>
            </Link>
          </div>
        </Container>
      </section>

      {inicio.status !== 'ok' ? (
        <LoadingState erro={inicio.status === 'erro'} />
      ) : (
        <>
          <section
            id="categorias"
            className={styles.secao}
            aria-labelledby="titulo-categorias"
          >
            <Container>
              <SectionTitle
                id="titulo-categorias"
                titulo="Escolha um assunto"
                descricao="Toque no assunto para ver os serviços que podem ajudar."
              />
              <ul className={styles.gradeCategorias}>
                {inicio.dados.categorias.map(({ categoria, total }) => (
                  <li key={categoria.id}>
                    <CategoryCard categoria={categoria} totalServicos={total} />
                  </li>
                ))}
              </ul>
            </Container>
          </section>

          <section
            className={`${styles.secao} ${styles.secaoLigue}`}
            aria-labelledby="titulo-ligue"
          >
            <Container>
              <SectionTitle
                id="titulo-ligue"
                titulo="Ligue agora"
                descricao="Em perigo ou precisando de ajuda urgente? Toque no número para ligar."
              />
              <ul className={styles.gradeTelefones}>
                {inicio.dados.telefones.map((telefone) => (
                  <li key={telefone.numero}>
                    <PhoneButton {...telefone} />
                  </li>
                ))}
              </ul>
            </Container>
          </section>

          <section className={styles.secao} aria-labelledby="titulo-procurados">
            <Container>
              <SectionTitle
                id="titulo-procurados"
                titulo="Serviços mais procurados"
              />
              <ServiceList servicos={inicio.dados.maisProcurados} />
            </Container>
          </section>
        </>
      )}
    </>
  );
}

export default Home;
