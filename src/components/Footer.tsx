import { Link } from 'react-router-dom';
import logo from '../assets/logo-psicoinfo-horizontal-negativo.png';
import styles from './Footer.module.css';
import { LINKS_PRINCIPAIS } from './navegacao';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.conteudo}>
        <div className={styles.marca}>
          <Link to="/" className={styles.linkLogo}>
            <img
              src={logo}
              alt="PsicoInfo – página inicial"
              className={styles.logo}
              width={589}
              height={168}
              loading="lazy"
            />
          </Link>
          <p>Guia de serviços públicos e de assistência de Petrolina (PE).</p>
        </div>

        <nav aria-label="Rodapé">
          <ul className={styles.links}>
            {LINKS_PRINCIPAIS.map((link) => {
              const Icone = link.icone;
              return (
                <li key={link.rotulo}>
                  <Link
                    to={{ pathname: link.caminho, hash: link.ancora }}
                    className={styles.link}
                  >
                    <Icone aria-hidden="true" size={22} strokeWidth={2.25} />
                    <span>{link.rotulo}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.creditos}>
          <p>
            Dados:{' '}
            <Link to="/sobre" className={styles.linkTexto}>
              Fontes oficiais e públicas
            </Link>
          </p>
          <p className={styles.aviso}>
            Telefones e endereços podem mudar. Se puder, ligue antes de ir.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
