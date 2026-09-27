import { Search } from 'lucide-react';
import { useId, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';
import { listarServicos } from '../data/servicos';

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
  const idCampo = useId();
  const idDica = useId();
  const refCampo = useRef<HTMLInputElement>(null);
  const navegar = useNavigate();
  const servicos = listarServicos();

  const sugestoes = servicos.filter((servico) =>
    servico.nome.toLowerCase().startsWith(valor.toLowerCase())
  );

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const termo = valor.trim();
    if (!termo) {
      refCampo.current?.focus();
      return;
    }
    setValor(valorInicial)
    navegar(`/busca?q=${encodeURIComponent(termo)}`);
  }

  function aoEnviarClickMenu(termo: string) {
  const termoLimpo = termo.trim();

  if (!termoLimpo) {
    refCampo.current?.focus();
    return;
  }
  setShowMenu(false)
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
                setShowMenu(true)}
              }
              placeholder="Ex.: psicólogo, CRAS, advogado..."
              aria-describedby={mostrarDica ? idDica : undefined}
              autoComplete="off"
              enterKeyHint="search"
            />

            { valor && menuShow && <div className={styles.autocompleteContainer}>
            {sugestoes.map((servico) => (
              <div className={styles.autocomplete} key={servico.id} onClick={() => aoEnviarClickMenu(servico.nome)}>
                {servico.nome}
              </div>
            ))}

          </div> }
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
