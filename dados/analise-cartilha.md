# Análise da cartilha: recorte Petrolina

**Fonte:** "Serviços da Rede de Proteção – Petrolina e Juazeiro" (ACARI / Projeto Bem Me Quer), versão celular, 33 páginas.
**Dados extraídos:** [`servicos-petrolina.json`](servicos-petrolina.json)

> **Atualização (set/2026):** os dados da cartilha foram corrigidos e ampliados com o [levantamento web](levantamento-web-petrolina.md): telefones e endereços novos, DEAM separada do CEAM, horários, mais 9 CRAS, o CREAS Região 2 e 59 UBS (a UBS José e Maria virou "UBS Lia Bezerra (José e Maria)", id `ubs-lia-bezerra`; o CREAS virou `creas-regiao-1`). Várias lacunas listadas abaixo foram resolvidas; o que ainda falta confirmar está em `pendencias` de cada serviço. O esquema ganhou `fonte` e `atualizadoEm`, e `descricaoCartilha`/`paginaCartilha` passaram a aceitar `null`.

## 1. Como a cartilha foi separada

| Páginas | Conteúdo | Uso |
|---|---|---|
| 1–3 | Capa e apresentação da ACARI | Só para a página "Sobre" (campo `sobre` do JSON) |
| 4 | Sumário de Petrolina | Referência |
| 5 | Sumário de Juazeiro | **Descartado** |
| **6–19** | **Serviços de Petrolina** | **Todos extraídos: 39 serviços** |
| 20–32 | Serviços de Juazeiro | **Descartado** |
| 33 | Realização / apoio | Descartado |

Cuidados na separação:

- A parte de Juazeiro repete quatro serviços que ficam em Petrolina: CEPPSI, NAIS/UNIFTC, UNINASSAU e CVV. Eles já estão na parte de Petrolina, então não foram duplicados. O valor da UNINASSAU (R$ 10 a R$ 15) só aparece na parte de Juazeiro e foi aproveitado.
- Na página 20 (Juazeiro) aparece um "CMDDCA de Petrolina" com endereço de Petrolina. É erro de diagramação da cartilha e foi ignorado.

## 2. Serviços de Petrolina por categoria

As categorias foram reorganizadas pelo que a pessoa procura, não pela estrutura da cartilha. Um serviço pode estar em mais de uma categoria (campo `categorias`).

| Categoria | Serviços |
|---|---|
| 🚑 Urgência e Emergência | SAMU, UPA, HU-Univasf (+ PM e CVV como secundárias) |
| 🏥 Saúde | UBS José e Maria, Policlínica, Hospital Dom Malan, Espaço Vida (HIV/IST), SESAU |
| 🧠 Saúde Mental e Apoio Emocional | CAPSi, CAPS II, CAPSad III 24h, CEPPSI, NAIS, UNINASSAU, CVV |
| 👥 Assistência Social | CRAS José e Maria, CREAS, CadÚnico, Centro POP, Abordagem Social, SEDESDH |
| 🧒 Crianças e Adolescentes | Conselho Tutelar 1 e 2, CMDDCA (+ CAPSi, Dom Malan, CEIP, Vida Nova) |
| 💜 Apoio à Mulher | CEAM, DEAM, Patrulha da Mulher (+ Secretaria DH/Mulher, Rendeiras) |
| ⚖️ Direitos e Justiça | Defensoria Pública, NPJ FACAPE, Ministério Público |
| 🛡️ Segurança | Polícia Militar, Guarda Civil Municipal |
| 📚 Educação | SEDUC, CEIP |
| 🤝 Projetos Sociais | Associação das Mulheres Rendeiras, Projeto Vida Nova |
| 🏛️ Prefeitura e Secretarias | Prefeitura, VIII GERES, Secretaria de DH/Mulher/Acessibilidade |

Mudanças em relação à cartilha:

- **Saúde Mental** virou categoria própria, porque combina com o nome PsicoInfo e tem 7 serviços.
- **NPJ** saiu de "Educação" e foi para "Direitos e Justiça".
- A **Secretaria de DH/Mulher** saiu de "Sociedade Civil" e foi para "Prefeitura".
- Foi criada uma lista de **números úteis** (192, 190, 153, 188, 156, plantão do Conselho Tutelar) para um bloco de "ligue agora" na tela inicial.

## 3. Confronto com a proposta do site

| O que a proposta pede | A cartilha tem? | Situação |
|---|---|---|
| Nome do serviço | ✅ Sim | Completo |
| Endereço + botão de mapa | ✅ Sim | 38 de 39 têm endereço físico (a Abordagem Social é volante). Campo `mapaQuery` pronto para o Google Maps |
| Telefone | ⚠️ Quase sempre | 3 sem telefone: Policlínica, VIII GERES e CEIP |
| **Horário de funcionamento** | ❌ **Quase nunca** | Só CAPSad (24h), SAMU e PM (emergência) e Espaço Vida ("o dia todo") |
| Para que serve | ✅ Sim | Reescrito em linguagem simples |
| Quem pode procurar | ⚠️ Às vezes | Parte foi deduzida do texto |
| O que encontra lá | ✅ Sim | Transformado em lista curta |
| Busca por bairro | ⚠️ Limitada | Veja abaixo |
| Farmácia Popular / medicamentos | ❌ **Não existe** | A única farmácia é a Farmácia Central, que é de Juazeiro. A equipe confirmou que as UBSs entregam remédios: a UBS ganhou as tags "remédio", "medicamento" e "farmácia" |

## 4. Lacunas importantes

1. **O exemplo "Dom Avelar" não funciona com a cartilha.** Ela tem só 1 CRAS (José e Maria) e 1 UBS (José e Maria). Não há nada no Dom Avelar. A busca por bairro só retorna resultado para Centro, José e Maria, Vila Eduardo, Gercino Coelho, Vila Mocó, Maria Auxiliadora, Parque Bandeirantes, Cohab Massangano e Cidade Universitária.
   - **Sugestão para o protótipo:** quando o bairro não tiver serviço próprio, mostrar os serviços que atendem **a cidade toda** (campo `abrangencia: "municipal"`), com uma mensagem do tipo "Não encontramos serviços no Dom Avelar, mas estes atendem toda Petrolina".
   - **Decisão:** o protótipo usa **apenas os dados reais da cartilha**, sem registros fictícios.
2. **Faltam os horários** de 35 serviços. No protótipo, mostrar "Horário não informado – ligue antes de ir".
3. **O público-alvo da cartilha é outro.** Ela foi feita para a rede de proteção de crianças e adolescentes, não como guia geral de serviços. Para o site crescer, será preciso cadastrar outros CRAS, UBSs e farmácias.
4. **Possíveis erros da cartilha:**
   - CEAM, DEAM e o Setor Mulher da Secretaria têm o mesmo telefone, (87) 3867-3516. CEAM e DEAM têm o mesmo endereço.
   - Espaço Vida e SESAU têm o mesmo endereço e telefone.
   - O sumário escreve "D. Malam"; o nome correto é Dom Malan.
5. **Dados de 2021 a 2026:** telefones e endereços devem ser confirmados antes de publicar. Cada serviço tem `paginaCartilha` e `pendencias` para facilitar essa revisão.

## 5. Estrutura de cada serviço no JSON

```ts
interface Servico {
  id: string;                 // slug, usado na URL: /servico/cras-jose-e-maria
  nome: string;
  sigla: string | null;
  categoriaPrincipal: string; // define ícone e cor
  categorias: string[];
  icone: string;              // nome sugerido do lucide-react
  bairro: string | null;
  endereco: string;
  referencia: string | null;  // ponto de referência
  mapaQuery: string | null;   // para o link do Google Maps
  abrangencia: "bairro" | "municipal" | "regional";
  telefones: { numero: string; discar: string; tipo: "fixo" | "celular" | "whatsapp" | "emergencia"; rotulo: string | null }[];
  email: string | null;
  horario: string | null;
  paraQueServe: string;       // linguagem simples
  quemPodeProcurar: string;   // linguagem simples
  oQueEncontra: string[];     // linguagem simples
  comoAcessar: string;        // ir direto / precisa de encaminhamento
  tags: string[];             // sinônimos para a busca ("remédio", "bo", "advogado grátis")
  descricaoCartilha: string;  // texto original, para conferência
  paginaCartilha: number;
  pendencias: string[];       // o que falta confirmar
}
```
