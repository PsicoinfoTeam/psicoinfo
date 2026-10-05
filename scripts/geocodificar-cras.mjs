// Geocodifica os CRAS com a API pública do OpenStreetMap (Nominatim).
// Script avulso: não faz parte do site.
//
// Uso:
//   node scripts/geocodificar-cras.mjs            → consulta e grava scripts/saida/geocodificacao-cras.json
//   node scripts/geocodificar-cras.mjs --aplicar  → grava também as coordenadas no JSON de serviços
//   node scripts/geocodificar-cras.mjs --so-aplicar → grava a partir da última saída, sem consultar de novo
//
// Política de uso do Nominatim (https://operations.osmfoundation.org/policies/nominatim/):
// no máximo 1 requisição por segundo e um User-Agent que identifique o projeto.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARQ_DADOS = path.join(RAIZ, 'dados/servicos-petrolina.json');
const ARQ_SITE = path.join(RAIZ, 'src/data/servicos-petrolina.json');
const ARQ_SAIDA = path.join(RAIZ, 'scripts/saida/geocodificacao-cras.json');

const USER_AGENT =
  'PsicoInfo-prototipo (https://github.com/PsicoinfoTeam/psicoinfo)';
const INTERVALO_MS = 1100; // um pouco mais de 1 s entre requisições

// Limites do município de Petrolina (resultado fora disso é descartado)
const LIMITES = { latMin: -9.9, latMax: -8.6, lngMin: -41.2, lngMax: -40.2 };

// Resultado que só acha a região (bairro, cidade...) não serve como endereço
const SO_REGIAO = new Set([
  'country',
  'state',
  'region',
  'county',
  'municipality',
  'city',
  'town',
  'village',
  'hamlet',
  'isolated_dwelling',
  'city_district',
  'district',
  'borough',
  'suburb',
  'quarter',
  'neighbourhood',
  'postcode',
  'place',
]);

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function consultar(q) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.search = new URLSearchParams({
    format: 'jsonv2',
    q,
    countrycodes: 'br',
    addressdetails: '1',
    limit: '5',
  }).toString();
  const resp = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'pt-BR' },
  });
  if (!resp.ok) throw new Error(`Nominatim respondeu ${resp.status}`);
  return resp.json();
}

function dentroDePetrolina(r) {
  const lat = Number(r.lat);
  const lng = Number(r.lon);
  return (
    lat >= LIMITES.latMin &&
    lat <= LIMITES.latMax &&
    lng >= LIMITES.lngMin &&
    lng <= LIMITES.lngMax
  );
}

const normalizar = (t) =>
  t
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** O resultado fica no bairro do CRAS? (compara com bairro/localidade do endereço do OSM) */
function noBairro(r, bairro) {
  const alvo = normalizar(bairro);
  const a = r.address ?? {};
  const locais = [
    a.suburb,
    a.neighbourhood,
    a.quarter,
    a.village,
    a.hamlet,
    a.city_district,
  ]
    .filter(Boolean)
    .map(normalizar);
  return locais.some((l) => l && (l.includes(alvo) || alvo.includes(l)));
}

/**
 * Primeiro resultado aceitável: dentro do município e mais preciso que bairro/cidade.
 * Se exigirBairro, o resultado também precisa estar no bairro do CRAS.
 */
function escolher(resultados, bairro, exigirBairro = false) {
  const avaliados = resultados.map((r) => {
    const tipo = r.addresstype ?? r.type;
    let motivo = null;
    if (!dentroDePetrolina(r)) motivo = 'fora de Petrolina';
    else if (SO_REGIAO.has(tipo)) motivo = `só achou a região (${tipo})`;
    else if (exigirBairro && !noBairro(r, bairro))
      motivo = 'rua com o mesmo nome, mas em outro bairro';
    return { r, tipo, motivo };
  });
  const bom = avaliados.find((a) => !a.motivo);
  return { bom, descartados: avaliados.filter((a) => a.motivo) };
}

/** "Av. dos Sentimentos, 121 - Dom Avelar" → { rua: "Av. dos Sentimentos", completo: "Av. dos Sentimentos, 121" } */
function partesDoEndereco(endereco) {
  const [antesDoTraco] = endereco.split(' - ');
  const rua = antesDoTraco.split(',')[0].trim();
  return { rua, completo: antesDoTraco.replace(/,?\s*S\/N/i, '').trim() };
}

async function geocodificar(cras) {
  const { rua, completo } = partesDoEndereco(cras.endereco);
  // Nome curto do bairro para a busca: "N7 (Projeto Senador Nilo Coelho)" → "N7"
  const bairro = cras.bairro.replace(/\s*\(.*\)$/, '');
  // Em TODAS as tentativas o resultado precisa cair no bairro do CRAS: o
  // Nominatim às vezes ignora o bairro da busca e devolve uma rua de mesmo nome
  // em outro lugar (ex.: "Rua B, N7" voltou como Rua B do Residencial Vivendas).
  const consultas = [
    { q: `${completo}, ${bairro}, Petrolina, PE, Brasil`, exigirBairro: true },
    { q: `${rua}, ${bairro}, Petrolina PE`, exigirBairro: true },
    { q: `${rua}, Petrolina PE`, exigirBairro: true },
  ];
  const tentativas = [];
  for (const { q, exigirBairro } of consultas) {
    if (tentativas.some((t) => t.consulta === q)) continue;
    await esperar(INTERVALO_MS);
    const resultados = await consultar(q);
    const { bom, descartados } = escolher(resultados, bairro, exigirBairro);
    tentativas.push({
      consulta: q,
      resultados: resultados.length,
      descartados: descartados.map((d) => ({
        encontrado: d.r.display_name,
        lat: Number(Number(d.r.lat).toFixed(6)),
        lng: Number(Number(d.r.lon).toFixed(6)),
        motivo: d.motivo,
      })),
    });
    if (bom) {
      return {
        id: cras.id,
        nome: cras.nome,
        endereco: cras.endereco,
        coordenadas: {
          lat: Number(Number(bom.r.lat).toFixed(6)),
          lng: Number(Number(bom.r.lon).toFixed(6)),
          precisao: 'aproximada',
        },
        encontrado: bom.r.display_name,
        tipoResultado: bom.tipo,
        consultaUsada: q,
        tentativas,
      };
    }
  }
  return {
    id: cras.id,
    nome: cras.nome,
    endereco: cras.endereco,
    coordenadas: null,
    motivo: 'O Nominatim não achou o endereço (só o bairro/cidade ou nada)',
    tentativas,
  };
}

/** Insere/atualiza "coordenadas" logo depois de "mapaQuery" no bloco do serviço, sem reformatar o arquivo. */
function aplicarNoTexto(texto, resultado) {
  const inicio = texto.indexOf(`"id": "${resultado.id}"`);
  if (inicio < 0) throw new Error(`não achei ${resultado.id} no JSON`);
  const fim = texto.indexOf('\n    }', inicio);
  let bloco = texto.slice(inicio, fim);

  const valor = resultado.coordenadas
    ? `{ "lat": ${resultado.coordenadas.lat}, "lng": ${resultado.coordenadas.lng}, "precisao": "${resultado.coordenadas.precisao}" }`
    : 'null';
  bloco = bloco.replace(/\n {6}"coordenadas": [^\n]*,/, '');
  bloco = bloco.replace(
    /(\n {6}"mapaQuery": [^\n]*,)/,
    `$1\n      "coordenadas": ${valor},`,
  );

  if (!resultado.coordenadas) {
    const pendencia =
      'Coordenadas não encontradas no OpenStreetMap; marcar no mapa';
    bloco = bloco.replace(/"pendencias": \[(.*)\]/, (_, dentro) => {
      if (dentro.includes(pendencia)) return `"pendencias": [${dentro}]`;
      return `"pendencias": [${dentro ? `${dentro}, ` : ''}${JSON.stringify(pendencia)}]`;
    });
  }
  return texto.slice(0, inicio) + bloco + texto.slice(fim);
}

function gravarNosDados(resultados) {
  let texto = fs.readFileSync(ARQ_DADOS, 'utf8');
  for (const r of resultados) texto = aplicarNoTexto(texto, r);
  JSON.parse(texto); // garante que o JSON continua válido
  fs.writeFileSync(ARQ_DADOS, texto);
  fs.copyFileSync(ARQ_DADOS, ARQ_SITE);
  console.log('Coordenadas gravadas em dados/ e src/data/.');
}

async function main() {
  if (process.argv.includes('--so-aplicar')) {
    const { resultados } = JSON.parse(fs.readFileSync(ARQ_SAIDA, 'utf8'));
    gravarNosDados(resultados);
    return;
  }
  const aplicar = process.argv.includes('--aplicar');
  const dados = JSON.parse(fs.readFileSync(ARQ_DADOS, 'utf8'));
  const crasLista = dados.servicos.filter((s) => s.sigla === 'CRAS');
  console.log(
    `Geocodificando ${crasLista.length} CRAS (1 requisição por segundo)...`,
  );

  const resultados = [];
  for (const cras of crasLista) {
    const r = await geocodificar(cras);
    resultados.push(r);
    console.log(
      r.coordenadas
        ? `  ✔ ${r.nome}: ${r.coordenadas.lat}, ${r.coordenadas.lng} (${r.tipoResultado})`
        : `  ✘ ${r.nome}: não encontrado`,
    );
  }

  fs.mkdirSync(path.dirname(ARQ_SAIDA), { recursive: true });
  fs.writeFileSync(
    ARQ_SAIDA,
    JSON.stringify(
      {
        geradoEm: new Date().toISOString(),
        fonte: 'OpenStreetMap / Nominatim',
        resultados,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`Resultado salvo em ${path.relative(RAIZ, ARQ_SAIDA)}`);

  if (aplicar) gravarNosDados(resultados);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
