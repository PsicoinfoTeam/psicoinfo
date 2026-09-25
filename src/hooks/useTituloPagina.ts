import { useEffect } from 'react';

/** Título da aba do navegador (também lido pelos leitores de tela ao trocar de página). */
export function useTituloPagina(titulo: string) {
  useEffect(() => {
    document.title = `${titulo} – PsicoInfo`;
  }, [titulo]);
}
