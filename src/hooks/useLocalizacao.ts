import { useCallback, useEffect, useRef, useState } from 'react';
import type { Ponto } from '../lib/geo';

export type EstadoLocalizacao =
  'parado' | 'pedindo' | 'ok' | 'negado' | 'indisponivel' | 'erro';

export interface Localizacao {
  estado: EstadoLocalizacao;
  coordenadas: Ponto | null;
  /** Raio de incerteza informado pelo celular, em metros */
  precisaoMetros: number | null;
  /** Pede a localização. Chamar SÓ a partir de um clique da pessoa. */
  solicitar: () => void;
}

const OPCOES: PositionOptions = {
  timeout: 10000,
  maximumAge: 300000,
  enableHighAccuracy: true,
};

/**
 * Localização do celular.
 *
 * Privacidade (CLAUDE.md, seção "Localização"):
 * - nada acontece ao carregar a página: só `solicitar()`, chamado no clique;
 * - a posição fica apenas no estado deste componente (memória). Nunca vai
 *   para localStorage, sessionStorage, cookies, URL ou qualquer envio de rede.
 */
export function useLocalizacao(): Localizacao {
  const [estado, setEstado] = useState<EstadoLocalizacao>('parado');
  const [coordenadas, setCoordenadas] = useState<Ponto | null>(null);
  const [precisaoMetros, setPrecisaoMetros] = useState<number | null>(null);

  // Ignora respostas que chegam depois que a tela foi fechada
  const montado = useRef(true);
  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);

  const solicitar = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setEstado('indisponivel');
      return;
    }
    setEstado('pedindo');
    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        if (!montado.current) return;
        setCoordenadas({
          lat: posicao.coords.latitude,
          lng: posicao.coords.longitude,
        });
        setPrecisaoMetros(posicao.coords.accuracy);
        setEstado('ok');
      },
      (erro) => {
        if (!montado.current) return;
        setCoordenadas(null);
        setPrecisaoMetros(null);
        if (erro.code === erro.PERMISSION_DENIED) setEstado('negado');
        else if (erro.code === erro.POSITION_UNAVAILABLE)
          setEstado('indisponivel');
        else setEstado('erro'); // TIMEOUT ou outro
      },
      OPCOES,
    );
  }, []);

  return { estado, coordenadas, precisaoMetros, solicitar };
}
