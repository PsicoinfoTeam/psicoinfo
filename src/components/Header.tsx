import { Menu, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo-psicoinfo-horizontal.png';
import styles from './Header.module.css';
import { LINKS_PRINCIPAIS, estaAtivo } from './navegacao';

function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const idMenu = useId();
  const refHeader = useRef<HTMLElement>(null);
  const refBotao = useRef<HTMLButtonElement>(null);
  const local = useLocation();

  // Com o menu aberto: Esc fecha e devolve o foco ao botão; tocar fora fecha.
  useEffect(() => {
    if (!menuAberto) return;

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        setMenuAberto(false);
        refBotao.current?.focus();
      }
    }
    function aoTocar(evento: PointerEvent) {
      if (!refHeader.current?.contains(evento.target as Node)) {
        setMenuAberto(false);
      }
    }

    document.addEventListener('keydown', aoTeclar);
    document.addEventListener('pointerdown', aoTocar);
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.removeEventListener('pointerdown', aoTocar);
    };
  }, [menuAberto]);

  const IconeBotao = menuAberto ? X : Menu;

  return (
    <header ref={refHeader} className={styles.header}>
      <div className={styles.barra}>
        <Link to="/" className={styles.marca}>
          <img
            src={logo}
            alt="PsicoInfo – página inicial"
            className={styles.logo}
            width={589}
            height={168}
          />
        </Link>

        <nav aria-label="Principal" className={styles.nav}>
          <button
            ref={refBotao}
            type="button"
            className={styles.botaoMenu}
            aria-expanded={menuAberto}
            aria-controls={idMenu}
            onClick={() => setMenuAberto((aberto) => !aberto)}
          >
            <IconeBotao aria-hidden="true" size={26} strokeWidth={2.25} />
            <span>{menuAberto ? 'Fechar' : 'Menu'}</span>
          </button>

          <ul
            id={idMenu}
            className={`${styles.lista} ${menuAberto ? styles.aberta : ''}`}
          >
            {LINKS_PRINCIPAIS.map((link) => {
              const ativo = estaAtivo(link, local);
              const Icone = link.icone;
              return (
                <li key={link.rotulo}>
                  <Link
                    to={{ pathname: link.caminho, hash: link.ancora }}
                    className={styles.link}
                    aria-current={ativo ? 'page' : undefined}
                    onClick={() => setMenuAberto(false)}
                  >
                    <Icone aria-hidden="true" size={22} strokeWidth={2.25} />
                    <span>{link.rotulo}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
