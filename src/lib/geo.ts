// Cálculos de localização. Lógica pura: sem React e sem APIs do navegador.

export interface Ponto {
  lat: number;
  lng: number;
}

const RAIO_DA_TERRA_KM = 6371;

/** Centro de Petrolina (referência para mensagens e testes). */
export const CENTRO_PETROLINA: Ponto = { lat: -9.3891, lng: -40.503 };

/**
 * Retângulo que cobre o município de Petrolina, com folga.
 * Usado no lugar de "até 60 km do centro" porque o CRAS Rajada, que é de
 * Petrolina, fica a cerca de 74 km do centro.
 */
export const LIMITES_PETROLINA = {
  latMin: -9.9,
  latMax: -8.6,
  lngMin: -41.2,
  lngMax: -40.2,
} as const;

const emRadianos = (graus: number) => (graus * Math.PI) / 180;

/** Distância em linha reta entre dois pontos, em km (fórmula de Haversine). */
export function distanciaKm(a: Ponto, b: Ponto): number {
  const dLat = emRadianos(b.lat - a.lat);
  const dLng = emRadianos(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(emRadianos(a.lat)) *
      Math.cos(emRadianos(b.lat)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * RAIO_DA_TERRA_KM * Math.asin(Math.sqrt(h));
}

export interface ComDistancia<T> {
  item: T;
  /** null quando o item não tem coordenadas */
  distanciaKm: number | null;
}

/**
 * Ordena do mais perto ao mais longe. Itens sem coordenadas vão para o fim,
 * na ordem em que vieram.
 */
export function ordenarPorDistancia<T extends { coordenadas?: Ponto | null }>(
  origem: Ponto,
  itens: readonly T[],
): ComDistancia<T>[] {
  const comDistancia = itens.map((item) => ({
    item,
    distanciaKm: item.coordenadas
      ? distanciaKm(origem, item.coordenadas)
      : null,
  }));
  return [
    ...comDistancia
      .filter((x) => x.distanciaKm !== null)
      .sort((a, b) => (a.distanciaKm ?? 0) - (b.distanciaKm ?? 0)),
    ...comDistancia.filter((x) => x.distanciaKm === null),
  ];
}

const umaCasaDecimal = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
});
const semDecimais = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
});

/**
 * Distância em português simples:
 * "a cerca de 350 m" (arredondado para 50 m), "a cerca de 2,3 km",
 * e sem casa decimal a partir de 10 km ("a cerca de 74 km").
 */
export function formatarDistancia(km: number): string {
  const metros = Math.max(50, Math.round((km * 1000) / 50) * 50);
  if (metros < 1000) return `a cerca de ${metros} m`;
  const formato = km < 10 ? umaCasaDecimal : semDecimais;
  return `a cerca de ${formato.format(km)} km`;
}

/** O ponto está dentro dos limites do município de Petrolina? */
export function estaEmPetrolina(ponto: Ponto): boolean {
  const { latMin, latMax, lngMin, lngMax } = LIMITES_PETROLINA;
  return (
    ponto.lat >= latMin &&
    ponto.lat <= latMax &&
    ponto.lng >= lngMin &&
    ponto.lng <= lngMax
  );
}
