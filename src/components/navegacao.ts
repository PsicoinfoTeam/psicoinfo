import { House, Info, LayoutGrid, HelpCircle, type LucideIcon } from 'lucide-react';

export interface LinkNavegacao {
  rotulo: string;
  caminho: string;
  /** Âncora na página, sem o "#" */
  ancora?: string;
  icone: LucideIcon;
}

/** Links principais, usados no Header e no Footer. */
export const LINKS_PRINCIPAIS: LinkNavegacao[] = [
  { rotulo: 'Início', caminho: '/', icone: House },
  {
    rotulo: 'Categorias',
    caminho: '/',
    ancora: 'categorias',
    icone: LayoutGrid,
  },
  { rotulo: 'FAQ', caminho: '/faq', icone: HelpCircle },
  { rotulo: 'Sobre', caminho: '/sobre', icone: Info },
];

interface Local {
  pathname: string;
  hash: string;
}

export function estaAtivo(link: LinkNavegacao, local: Local): boolean {
  if (local.pathname !== link.caminho) return false;
  const ancoraAtual = local.hash.replace(/^#/, '');
  return link.ancora ? ancoraAtual === link.ancora : ancoraAtual === '';
}
