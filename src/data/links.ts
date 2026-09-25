// Montagem dos links externos (ligar, WhatsApp, mapa) a partir dos dados.

import type { Telefone } from '../types';

/** Só os dígitos de um número de telefone, para os links. */
export function soDigitos(texto: string): string {
  return texto.replace(/\D/g, '');
}

export function linkLigar(discar: string): string {
  return `tel:${discar}`;
}

export function linkWhatsApp(discar: string): string {
  return `https://wa.me/55${discar}`;
}

export function linkTelefone(telefone: Telefone): string {
  return telefone.tipo === 'whatsapp'
    ? linkWhatsApp(telefone.discar)
    : linkLigar(telefone.discar);
}

export function linkMapa(mapaQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapaQuery)}`;
}
