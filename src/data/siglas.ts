// Nome por extenso das siglas que o JSON não traz escritas no nome.
// O CLAUDE.md pede "siglas sempre acompanhadas do nome por extenso".
// São os nomes oficiais dos serviços da rede pública, não dados novos.
// Quando houver área administrativa, isto pode virar um campo do serviço.

import type { Servico } from '../types';

/** Pela sigla: vale para todas as unidades (os 10 CRAS, as UBS etc.). */
const POR_SIGLA: Record<string, string> = {
  CRAS: 'Centro de Referência de Assistência Social',
  CREAS: 'Centro de Referência Especializado de Assistência Social',
  UBS: 'Unidade Básica de Saúde (posto de saúde)',
};

/** Pelo id: serviços cuja sigla é única ou tem variação (CAPS, SAMU...). */
const POR_ID: Record<string, string> = {
  'centro-pop':
    'Centro de Referência Especializado para População em Situação de Rua',
  samu: 'Serviço de Atendimento Móvel de Urgência',
  capsi: 'Centro de Atenção Psicossocial para crianças e adolescentes',
  'caps-ii': 'Centro de Atenção Psicossocial',
  'capsad-iii': 'Centro de Atenção Psicossocial Álcool e Drogas',
  'espaco-vida':
    'Centro de Testagem e Aconselhamento e Serviço de Assistência Especializada',
};

/** Nome por extenso da sigla, quando o nome do serviço não o traz. */
export function nomePorExtenso(servico: Servico): string | null {
  return (
    POR_ID[servico.id] ??
    (servico.sigla ? POR_SIGLA[servico.sigla] : undefined) ??
    null
  );
}
