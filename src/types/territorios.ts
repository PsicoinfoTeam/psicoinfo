// Formato de src/data/territorios-cras.json: qual CRAS atende cada bairro.

export interface TerritorioCras {
  /** id do CRAS no JSON de serviços (ex.: "cras-dom-avelar") */
  crasId: string;
  /** Bairros e localidades atendidos, como aparecem no documento de origem */
  bairros: string[];
}

export interface TerritoriosCras {
  /** De onde veio a divisão (documento e link) */
  fonte: string;
  /** Data do documento de origem (AAAA-MM-DD) */
  dataDocumento: string;
  territorios: TerritorioCras[];
  /** Bairros cujo CRAS de referência não existe mais: não têm CRAS definido */
  bairrosSemReferencia: string[];
}
