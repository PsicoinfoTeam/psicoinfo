import type { MouseEvent } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import styles from './Layout.module.css';

const ID_CONTEUDO = 'conteudo';

// Estrutura comum a todas as páginas.
function Layout() {
  // Leva o foco ao conteúdo sem mudar a URL (quem usa teclado pula o menu).
  function pularParaConteudo(evento: MouseEvent<HTMLAnchorElement>) {
    evento.preventDefault();
    document.getElementById(ID_CONTEUDO)?.focus();
  }

  return (
    <div className={styles.layout}>
      <a
        href={`#${ID_CONTEUDO}`}
        className={styles.pularLink}
        onClick={pularParaConteudo}
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id={ID_CONTEUDO} tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}

export default Layout;
