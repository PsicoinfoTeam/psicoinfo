import { Search } from 'lucide-react';
import { useId, useRef, useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';
import { buscar } from '../data/busca';

interface SearchBarProps {
  /** Texto já digitado (ex.: na página de resultados) */
  valorInicial?: string;
  /** "destaque": sobre fundo azul, na página inicial */
  variante?: 'destaque' | 'normal';
  /** Mostra a dica abaixo do rótulo (padrão: sim) */
  mostrarDica?: boolean;
}



function SearchBar({
  valorInicial = '',
  variante = 'normal',
  mostrarDica = true,
}: SearchBarProps) {
  const [valor, setValor] = useState(valorInicial);
  const [menuShow, setShowMenu] = useState(false)
  const [indiceAtivo, setIndiceAtivo] = useState(-1);
  const idCampo = useId();
  const idDica = useId();
  const refCampo = useRef<HTMLInputElement>(null);

  const navegar = useNavigate();
  



  function aoPressionarTecla(evento: React.KeyboardEvent<HTMLInputElement>) {
    if (!menuShow || sugestoes.length === 0) return;

    if (evento.key === 'ArrowDown') {
      evento.preventDefault();

      setIndiceAtivo((indice) =>
        indice < sugestoes.length - 1 ? indice + 1 : 0
      );
    }

    if (evento.key === 'ArrowUp') {
      evento.preventDefault();

      setIndiceAtivo((indice) =>
        indice > 0 ? indice - 1 : sugestoes.length - 1
      );
    }

    if (evento.key === 'Enter' && indiceAtivo >= 0) {
      evento.preventDefault();
      aoEnviarClickMenu(sugestoes[indiceAtivo].nome);
    }

    if (evento.key === 'Escape') {
      fecharLista();
    }
  }


    function fecharLista() {
    setShowMenu(false);
    setIndiceAtivo(-1);
  }



  const respostaBusca = buscar(valor);

  const sugestoes =
    respostaBusca.tipo === 'resultados'
      ? respostaBusca.servicos.slice(0, 6)
      : [];

  useEffect(() => {
    if (indiceAtivo < 0) return;

    const elemento = document.querySelector(
      `[data-indice="${indiceAtivo}"]`
    );

    elemento?.scrollIntoView({
      block: 'nearest',
    });
  }, [indiceAtivo]);

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const termo = valor.trim();
    if (!termo) {
      refCampo.current?.focus();
      return;
    }

  fecharLista();
  navegar(`/busca?q=${encodeURIComponent(termo)}`);
  }

  function aoEnviarClickMenu(termo: string) {
    const termoLimpo = termo.trim();

    if (!termoLimpo) {
      refCampo.current?.focus();
      return;
    }

    setValor(termoLimpo);
    fecharLista();
    navegar(`/busca?q=${encodeURIComponent(termoLimpo)}`);
  }

  return (
    <search>
      <form
        action="/busca"
        className={`${styles.form} ${variante === 'destaque' ? styles.destaque : ''}`}
        onSubmit={aoEnviar}
      >
        <label htmlFor={idCampo} className={styles.rotulo}>
          O que você precisa?
        </label>
        {mostrarDica && (
          <p id={idDica} className={styles.dica}>
            Escreva do seu jeito. Ex.: remédio, advogado, bairro.
          </p>
        )}
        <div className={styles.linha}>
          
          <div className={styles.campoComIcone}>
            <Search
              aria-hidden="true"
              className={styles.iconeCampo}
              size={24}
            />
            <input
              ref={refCampo}
              id={idCampo}
              name="q"
              type="search"
              className={styles.campo}
              value={valor}
              onChange={(evento) => {
                setValor(evento.target.value);
                setShowMenu(true);
                setIndiceAtivo(-1);
              }}
              onKeyDown={aoPressionarTecla}
              onBlur={fecharLista}
              aria-describedby={mostrarDica ? idDica : undefined}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={Boolean(valor && menuShow && sugestoes.length > 0)}
              aria-controls="sugestoes-busca"
              aria-activedescendant={
                indiceAtivo >= 0
                  ? `sugestao-${sugestoes[indiceAtivo].id}`
                  : undefined
              }
              autoComplete="off"
              enterKeyHint="search"
            />
            {valor && menuShow && sugestoes.length > 0 && (
              <div
                id="sugestoes-busca"
                role="listbox"
                className={styles.autocompleteContainer}
              >
                {sugestoes.map((servico, indice) => (
                  <button
                    id={`sugestao-${servico.id}`}
                    data-indice={indice}
                    type="button"
                    role="option"
                    aria-selected={indice === indiceAtivo}
                    className={`${styles.autocomplete} ${
                      indice === indiceAtivo ? styles.autocompleteAtivo : ''
                    }`}
                    key={servico.id}
                    onMouseDown={(evento) => {
                      evento.preventDefault();
                      aoEnviarClickMenu(servico.nome);
                  }}
                  >
                    {servico.nome}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className={styles.botao}>
            <Search aria-hidden="true" size={22} strokeWidth={2.5} />
            <span>Buscar</span>
          </button>



          
        </div>
      </form>
    </search>
  );
}

export default SearchBar;
