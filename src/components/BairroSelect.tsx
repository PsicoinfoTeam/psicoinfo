import { Check, MapPin, Search } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import type { BairroComReferencia } from '../data/servicos';
import { normalizar } from '../data/busca';
import styles from './BairroSelect.module.css';

/** Quantos bairros mostrar enquanto a pessoa digita */
const MAX_RESULTADOS = 8;

interface BairroSelectProps {
  bairros: BairroComReferencia[];
  /** Bairro escolhido no momento (ou null) */
  selecionado: string | null;
  onEscolher: (bairro: string) => void;
}

/**
 * "Ou escolha seu bairro": sempre visível, não só quando a localização falha.
 * Filtro digitável (sem acento) + lista completa em ordem alfabética.
 */
function BairroSelect({ bairros, selecionado, onEscolher }: BairroSelectProps) {
  const [filtro, setFiltro] = useState('');
  const idCampo = useId();
  const idDica = useId();

  const resultados = useMemo(() => {
    const termo = normalizar(filtro);
    if (!termo) return [];
    // Primeiro os que começam com o termo, depois os que o contêm
    const comecam: BairroComReferencia[] = [];
    const contem: BairroComReferencia[] = [];
    for (const b of bairros) {
      const nome = normalizar(b.bairro);
      if (nome.startsWith(termo)) comecam.push(b);
      else if (nome.includes(termo)) contem.push(b);
    }
    return [...comecam, ...contem];
  }, [filtro, bairros]);

  function escolher(bairro: string) {
    setFiltro('');
    onEscolher(bairro);
  }

  const botao = (b: BairroComReferencia) => {
    const ativo = b.bairro === selecionado;
    return (
      <li key={b.bairro}>
        <button
          type="button"
          className={`${styles.opcao} ${ativo ? styles.opcaoAtiva : ''}`}
          aria-pressed={ativo}
          onClick={() => escolher(b.bairro)}
        >
          {ativo ? (
            <Check aria-hidden="true" size={20} strokeWidth={2.5} />
          ) : (
            <MapPin aria-hidden="true" size={20} />
          )}
          <span>{b.bairro}</span>
        </button>
      </li>
    );
  };

  return (
    <div className={styles.bloco}>
      <label htmlFor={idCampo} className={styles.rotulo}>
        Ou escolha seu bairro
      </label>
      <p id={idDica} className={styles.dica}>
        Digite o nome do bairro ou da localidade.
      </p>
      <div className={styles.campoComIcone}>
        <Search aria-hidden="true" size={22} className={styles.iconeCampo} />
        <input
          id={idCampo}
          type="search"
          className={styles.campo}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          aria-describedby={idDica}
          autoComplete="off"
          enterKeyHint="search"
        />
      </div>

      {filtro.trim() !== '' && (
        <div className={styles.resultados}>
          <p className={styles.contagem} aria-live="polite">
            {resultados.length === 0
              ? 'Nenhum bairro com esse nome. Confira como escreveu ou veja a lista completa abaixo.'
              : resultados.length === 1
                ? '1 bairro encontrado:'
                : `${resultados.length} bairros encontrados${
                    resultados.length > MAX_RESULTADOS
                      ? ` (mostrando ${MAX_RESULTADOS})`
                      : ''
                  }:`}
          </p>
          {resultados.length > 0 && (
            <ul className={styles.lista}>
              {resultados.slice(0, MAX_RESULTADOS).map(botao)}
            </ul>
          )}
        </div>
      )}

      <details className={styles.todos}>
        <summary className={styles.resumoTodos}>
          Ver todos os bairros ({bairros.length})
        </summary>
        <ul className={`${styles.lista} ${styles.listaCompleta}`}>
          {bairros.map(botao)}
        </ul>
      </details>
    </div>
  );
}

export default BairroSelect;
