import { Accessibility, Contrast, Info, Type, X } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import styles from './AccessibilityMenu.module.css';

const TAMANHO_MINIMO = 100;
const TAMANHO_MAXIMO = 150;
const PASSO_TAMANHO = 10;

function lerLocalStorage(chave: string) {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function salvarLocalStorage(chave: string, valor: string) {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    // Mantém a funcionalidade mesmo sem armazenamento local.
  }
}

function AccessibilityMenu() {
  const [aberto, setAberto] = useState(false);
  const [mensagemAcessibilidade, setMensagemAcessibilidade] = useState('');

  const [tamanhoFonte, setTamanhoFonte] = useState(() => {
    const tamanhoSalvo = Number(lerLocalStorage('psicoinfo-tamanho-fonte'));

    if (tamanhoSalvo >= TAMANHO_MINIMO && tamanhoSalvo <= TAMANHO_MAXIMO) {
      return tamanhoSalvo;
    }

    return 100;
  });

  const [altoContraste, setAltoContraste] = useState(
    () => lerLocalStorage('psicoinfo-alto-contraste') === 'true',
  );

  const idMenu = useId();
  const refMenu = useRef<HTMLElement>(null);
  const refBotao = useRef<HTMLButtonElement>(null);

  // Sincroniza as preferências de acessibilidade com o documento.
  useLayoutEffect(() => {
    const html = document.documentElement;

    html.style.fontSize = tamanhoFonte === 100 ? '' : `${tamanhoFonte}%`;
    html.classList.toggle('alto-contraste', altoContraste);
  }, [tamanhoFonte, altoContraste]);

  // Com o menu aberto: Esc fecha e devolve o foco ao botão; tocar fora fecha.
  useEffect(() => {
    if (!aberto) return;

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        setAberto(false);
        refBotao.current?.focus();
      }
    }

    function aoTocar(evento: PointerEvent) {
      if (!refMenu.current?.contains(evento.target as Node)) {
        setAberto(false);
      }
    }

    document.addEventListener('keydown', aoTeclar);
    document.addEventListener('pointerdown', aoTocar);

    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.removeEventListener('pointerdown', aoTocar);
    };
  }, [aberto]);

  function alterarTamanhoFonte(novoTamanho: number) {
    const tamanho = Math.min(
      TAMANHO_MAXIMO,
      Math.max(TAMANHO_MINIMO, novoTamanho),
    );

    setTamanhoFonte(tamanho);
    setMensagemAcessibilidade(`Tamanho do texto: ${tamanho}%`);
    salvarLocalStorage('psicoinfo-tamanho-fonte', String(tamanho));
  }

  function alternarContraste() {
    const novoValor = !altoContraste;

    setAltoContraste(novoValor);
    setMensagemAcessibilidade(
      novoValor ? 'Alto contraste ativado' : 'Alto contraste desativado',
    );
    salvarLocalStorage('psicoinfo-alto-contraste', String(novoValor));
  }

  return (
    <aside
      ref={refMenu}
      className={styles.container}
      aria-label="Acessibilidade"
    >
      <button
        ref={refBotao}
        type="button"
        className={styles.botaoAcessibilidade}
        aria-label="Abrir menu de acessibilidade"
        aria-expanded={aberto}
        aria-controls={idMenu}
        onClick={() => setAberto((valor) => !valor)}
      >
        <Accessibility aria-hidden="true" size={24} />
      </button>

      {aberto && (
        <div id={idMenu} className={styles.menu}>
          <div className={styles.cabecalho}>
            <strong>Acessibilidade</strong>

            <button
              type="button"
              className={styles.botaoFechar}
              aria-label="Fechar menu de acessibilidade"
              onClick={() => {
                setAberto(false);
                refBotao.current?.focus();
              }}
            >
              <X aria-hidden="true" size={22} />
            </button>
          </div>

          <fieldset className={styles.opcao}>
            <legend className={styles.rotulo}>
              <Type aria-hidden="true" size={22} />
              <span>Tamanho do texto</span>
            </legend>

            <div className={styles.controlesFonte}>
              <button
                type="button"
                aria-label="Diminuir tamanho do texto"
                disabled={tamanhoFonte === TAMANHO_MINIMO}
                onClick={() =>
                  alterarTamanhoFonte(tamanhoFonte - PASSO_TAMANHO)
                }
              >
                A−
              </button>

              <button
                type="button"
                aria-label="Aumentar tamanho do texto"
                disabled={tamanhoFonte === TAMANHO_MAXIMO}
                onClick={() =>
                  alterarTamanhoFonte(tamanhoFonte + PASSO_TAMANHO)
                }
              >
                A+
              </button>

              <button
                type="button"
                disabled={tamanhoFonte === 100}
                onClick={() => alterarTamanhoFonte(100)}
              >
                Padrão
              </button>
            </div>
          </fieldset>

          <button
            type="button"
            className={styles.opcaoBotao}
            aria-pressed={altoContraste}
            onClick={alternarContraste}
          >
            <Contrast aria-hidden="true" size={22} />
            <span>Alto contraste</span>
          </button>

          <p className={styles.observacao}>
            <Info aria-hidden="true" size={16} />
            Suas preferências de acessibilidade ficam salvas neste navegador.
          </p>
        </div>
      )}
      <span className="visually-hidden" aria-live="polite">
        {mensagemAcessibilidade}
      </span>
    </aside>
  );
}

export default AccessibilityMenu;
