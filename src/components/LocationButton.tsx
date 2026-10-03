import { LocateFixed, LoaderCircle } from 'lucide-react';
import { useId } from 'react';
import styles from './LocationButton.module.css';

interface LocationButtonProps {
  /** true enquanto o celular procura a localização */
  procurando: boolean;
  onClick: () => void;
}

/** Botão que pede a localização do celular (só no clique). */
function LocationButton({ procurando, onClick }: LocationButtonProps) {
  const Icone = procurando ? LoaderCircle : LocateFixed;
  const idAviso = useId();
  return (
    <div className={styles.bloco}>
      <button
        type="button"
        className={styles.botao}
        onClick={onClick}
        disabled={procurando}
        aria-describedby={idAviso}
      >
        <Icone
          aria-hidden="true"
          size={26}
          strokeWidth={2.25}
          className={procurando ? styles.girando : undefined}
        />
        <span>{procurando ? 'Procurando…' : 'Usar minha localização'}</span>
      </button>
      <p id={idAviso} className={styles.aviso}>
        Sua localização fica só no seu celular e não é salva.
      </p>
    </div>
  );
}

export default LocationButton;
