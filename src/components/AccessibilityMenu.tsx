import { Accessibility, Contrast, Info, Type, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import styles from './AccessibilityMenu.module.css';

const TAMANHO_MINIMO = 90;
const TAMANHO_MAXIMO = 120;
const PASSO_TAMANHO = 10;

function AccessibilityMenu() {
  const [aberto, setAberto] = useState(false);

  const [tamanhoFonte, setTamanhoFonte] = useState(() => {
    const tamanhoSalvo = Number(
      localStorage.getItem('psicoinfo-tamanho-fonte'),
    );

    if (tamanhoSalvo >= TAMANHO_MINIMO && tamanhoSalvo <= TAMANHO_MAXIMO) {
      return tamanhoSalvo;
    }

    return 100;
  });

  const [altoContraste, setAltoContraste] = useState(
    () => localStorage.getItem('psicoinfo-alto-contraste') === 'true',
  );

  const idMenu = useId();
  const refMenu = useRef<HTMLDivElement>(null);
  const refBotao = useRef<HTMLButtonElement>(null);

  // Sincroniza as preferências de acessibilidade com o documento.
  useEffect(() => {
    if (tamanhoFonte === 100) {
      delete document.documentElement.dataset.fontSize;
    } else {
      document.documentElement.dataset.fontSize = String(tamanhoFonte);
    }

    document.documentElement.classList.toggle('alto-contraste', altoContraste);
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
    localStorage.setItem('psicoinfo-tamanho-fonte', String(tamanho));
  }

  function alternarContraste() {
    const novoValor = !altoContraste;

    setAltoContraste(novoValor);
    localStorage.setItem('psicoinfo-alto-contraste', String(novoValor));
  }

  return (
    <div ref={refMenu} className={styles.container}>
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

          <div className={styles.opcao}>
            <div className={styles.rotulo}>
              <Type aria-hidden="true" size={22} />
              <span>Tamanho do texto</span>
            </div>

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
          </div>

          <button
            type="button"
            className={styles.opcaoBotao}
            aria-pressed={altoContraste}
            onClick={alternarContraste}
          >
            <Contrast aria-hidden="true" size={13} />
            <span>Alto contraste</span>
          </button>

          <p className={styles.observacao}>
            <Info aria-hidden="true" size={16} />
            Suas preferências de acessibilidade ficam salvas neste navegador.
          </p>
        </div>
      )}
    </div>
  );
}

export default AccessibilityMenu;
