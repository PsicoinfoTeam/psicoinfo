import type { Servico } from './servico';

export interface Categoria {
  id: string;
  nome: string;
  /** Nome do ícone no lucide-react (kebab-case) */
  icone: string;
  descricao: string;
}

/** Como está no JSON */
export interface NumeroUtilDados {
  nome: string;
  numero: string;
  descricao: string;
  /** "whatsapp" abre o WhatsApp em vez de ligar */
  tipo?: 'whatsapp';
}

/** Como a camada de acesso entrega, já pronto para link tel: */
export interface NumeroUtil extends NumeroUtilDados {
  /** Só dígitos */
  discar: string;
}

export interface Sobre {
  realizacao: string;
  projeto: string;
  descricao: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  email: string;
  site: string;
  instagram: string;
  youtube: string;
}

export interface Meta {
  cidade: string;
  uf: string;
  fonte: string;
  observacoes: string[];
}

/** Formato completo de servicos-petrolina.json */
export interface BaseDeDados {
  meta: Meta;
  categorias: Categoria[];
  numerosUteis: NumeroUtilDados[];
  servicos: Servico[];
  sobre: Sobre;
}
