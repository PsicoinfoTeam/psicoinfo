// Esquema dos dados, conforme dados/analise-cartilha.md (seção 5).

export type Abrangencia = 'bairro' | 'municipal' | 'regional';

export type TipoTelefone = 'fixo' | 'celular' | 'whatsapp' | 'emergencia';

/** De onde veio o registro: cartilha da ACARI, levantamento web (set/2026) ou os dois */
export type FonteServico = 'cartilha' | 'web' | 'cartilha+web';

export interface Telefone {
  /** Formatado para exibir: "(87) 3983-6476" */
  numero: string;
  /** Só dígitos, para links tel: e wa.me (WhatsApp usa 55 + discar) */
  discar: string;
  tipo: TipoTelefone;
  rotulo: string | null;
}

export interface Servico {
  /** Slug usado na URL: /servico/cras-jose-e-maria */
  id: string;
  nome: string;
  sigla: string | null;
  /** Define ícone e cor */
  categoriaPrincipal: string;
  categorias: string[];
  /** Nome do ícone no lucide-react (kebab-case) */
  icone: string;
  bairro: string | null;
  endereco: string;
  /** Ponto de referência */
  referencia: string | null;
  /** Para o link do Google Maps; null quando não há endereço físico */
  mapaQuery: string | null;
  abrangencia: Abrangencia;
  /** Vazio = telefone ainda não confirmado ("Telefone em atualização – em breve") */
  telefones: Telefone[];
  email: string | null;
  /** null = nenhuma fonte informa */
  horario: string | null;
  paraQueServe: string;
  quemPodeProcurar: string;
  oQueEncontra: string[];
  /** Ir direto / precisa de encaminhamento */
  comoAcessar: string;
  /** Sinônimos para a busca ("remédio", "bo", "advogado grátis") */
  tags: string[];
  /** Interno, não exibir: texto original, para conferência (null se veio só da web) */
  descricaoCartilha: string | null;
  /** Interno, não exibir (null se veio só da web) */
  paginaCartilha: number | null;
  /** Interno, não exibir: o que falta confirmar */
  pendencias: string[];
  /** Interno: origem dos dados */
  fonte?: FonteServico;
  /** Interno: mês da última atualização, ex.: "2026-09" */
  atualizadoEm?: string;
}
