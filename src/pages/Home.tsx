import ponte from '../assets/ponte-negativo.png';
import CategoryCard from '../components/CategoryCard';
import Container from '../components/Container';
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
import { useTituloPagina } from '../hooks/useTituloPagina';
import styles from './Home.module.css';

function Home() {
  useTituloPagina('Serviços públicos de Petrolina');
  const categorias = listarCategorias();
  const maisProcurados = listarMaisProcurados();
  const telefones = numerosUteis();

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
            {categorias.map((categoria) => (
              <li key={categoria.id}>
                <CategoryCard
                  categoria={categoria}
                  totalServicos={listarPorCategoria(categoria.id).length}
                />
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
            {telefones.map((telefone) => (
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
          <ServiceList servicos={maisProcurados} />
        </Container>
      </section>
    </>
  );
}

export default Home;
