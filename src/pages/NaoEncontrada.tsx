import { House, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import SearchBar from '../components/SearchBar';
import SuggestionChips from '../components/SuggestionChips';
import { useTituloPagina } from '../hooks/useTituloPagina';
import styles from './NaoEncontrada.module.css';

interface NaoEncontradaProps {
  titulo?: string;
  mensagem?: string;
}

/** Página amigável para endereço errado ou item que não existe mais. */
function NaoEncontrada({
  titulo = 'Página não encontrada',
  mensagem = 'O link pode estar errado ou a página não existe mais.',
}: NaoEncontradaProps) {
  useTituloPagina(titulo);

  return (
    <div className={styles.pagina}>
      <Container>
        <div className={styles.conteudo}>
          <span className={styles.icone} aria-hidden="true">
            <SearchX size={40} strokeWidth={2} />
          </span>
          <h1>{titulo}</h1>
          <p className={styles.mensagem}>
            {mensagem} Tente buscar o que você precisa:
          </p>
          <SearchBar />
          <SuggestionChips />
          <Link to="/" className={styles.inicio}>
            <House aria-hidden="true" size={22} strokeWidth={2.25} />
            <span>Voltar para o início</span>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default NaoEncontrada;
