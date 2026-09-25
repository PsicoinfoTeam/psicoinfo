# PsicoInfo – Guia de serviços públicos de Petrolina

## O que é

Protótipo de um site para a população de Petrolina (PE) encontrar serviços públicos e de assistência (CRAS, CREAS, UBS, CAPS, Defensoria, Delegacia da Mulher etc.) de forma rápida, simples e intuitiva, **sem precisar saber antes o nome ou o endereço do local**.

O público inclui pessoas idosas, com pouca escolaridade ou pouca familiaridade com internet, e quase todas usam **celular**. Toda decisão de produto, texto e design parte disso.

## Material de referência (leia antes de começar)

| Arquivo | O que é |
|---|---|
| `dados/servicos-petrolina.json` | **Fonte única de dados.** 108 serviços reais, 11 categorias e números úteis. Fonte: **cartilha da ACARI + levantamento web (`dados/levantamento-web-petrolina.md`)**. Cada serviço diz sua origem no campo `fonte` (`cartilha`, `web` ou `cartilha+web`). |
| `dados/levantamento-web-petrolina.md` | Levantamento em sites oficiais (set/2026): corrige telefones e endereços da cartilha e acrescenta os 10 CRAS, os 2 CREAS e as UBS. Itens ⚠️/🔎 estão em `pendencias`. |
| `dados/analise-cartilha.md` | Como os dados foram extraídos, o esquema (`interface Servico`) e as lacunas conhecidas. |
| `assets/logo-psicoinfo.jpg` | Logo oficial (ponte + símbolo Ψ, "PSICO" azul + "INFO" amarelo). |
| `assets/referencia-layout.webp` | Referência visual. **Não é para copiar**; serve para identidade, clima e cores. |

## Stack e regras técnicas

- **Vite + React + TypeScript** (modo `strict`).
- **CSS puro com CSS Modules** (`Componente.module.css`) + um `src/styles/global.css` com reset e variáveis.
- **Proibido:** Tailwind, CSS-in-JS (styled-components, emotion), bibliotecas de UI (MUI, Chakra, Bootstrap etc.) e classes utilitárias no estilo Tailwind.
- **Permitido:** `react-router-dom` (rotas) e `lucide-react` (ícones; os nomes no JSON seguem essa biblioteca). Qualquer outra dependência precisa ser justificada e aprovada antes.
- **Sem backend.** Os dados vêm do JSON, lidos só por uma camada de acesso (`src/data/servicos.ts`, com funções como `listarServicos()`, `buscarServico(id)` e `buscar(termo)`). Nenhum componente importa o JSON direto. Assim, no futuro, dá para trocar por uma API ou área administrativa sem mexer nas telas.
- Tipos em `src/types/`, conforme o esquema de `dados/analise-cartilha.md`.

### Estrutura sugerida

```
src/
  components/   # Header, Footer, SearchBar, CategoryCard, ServiceCard, PhoneButton, MapButton...
  pages/        # Home, Busca, Categoria, Servico, Sobre, NaoEncontrada
  data/         # servicos-petrolina.json + servicos.ts (camada de acesso) + busca.ts
  types/
  styles/       # global.css, tokens (variáveis CSS)
  assets/
```

## Páginas e rotas

| Rota | Conteúdo |
|---|---|
| `/` | Logo, frase "Encontre serviços públicos perto de você", **barra de busca em destaque**, grade de categorias com ícones, bloco **"Ligue agora"** (`numerosUteis`: 192, 190, 153, 188, 156) e "Serviços mais procurados" (escolha fixa: CRAS, UBS, CadÚnico, UPA, CAPSi, Defensoria). |
| `/busca?q=termo` | Resultados em cards (ícone, nome, bairro, telefone principal). |
| `/categoria/:id` | Lista dos serviços da categoria (usar `categorias`, não só `categoriaPrincipal`). |
| `/servico/:id` | Página do serviço (ver abaixo). |
| `/sobre` | Sobre o PsicoInfo e a fonte dos dados (campo `sobre`: ACARI / Projeto Bem Me Quer). |
| `*` | Página não encontrada, com a busca. |

### Página do serviço (ordem dos blocos)

1. Ícone + nome (+ sigla) + chips das categorias
2. 📍 Endereço + ponto de referência + botão **"Ver no mapa"**
3. 📞 Telefones como botões grandes: `tel:` para ligar, `https://wa.me/55<discar>` para WhatsApp
4. 🕐 Horário. Se `null`: **"Horário não informado – ligue antes de ir"**
5. ❓ Para que serve
6. 👥 Quem pode procurar
7. 📝 O que você encontra lá (lista)
8. 🚪 Como ser atendido (`comoAcessar`)
9. Botão fixo no rodapé da tela (celular): "Ligar" e "Como chegar"

Link do mapa: `https://www.google.com/maps/search/?api=1&query=` + `encodeURIComponent(mapaQuery)`. Se `mapaQuery` for `null`, não mostrar o botão.

**Telefone em atualização:** quando `telefones` estiver vazio, mostrar no lugar do botão de ligar o aviso **"📞 Telefone em atualização – em breve"** (componente `PendingPhone`), com estilo neutro (não pode parecer erro), nos cards e na página do serviço. Nesse caso, a barra fixa mostra só "Como chegar".

**Não exibir para o usuário:** `pendencias`, `paginaCartilha`, `descricaoCartilha`, `fonte` e `atualizadoEm`. São campos internos de revisão.

## Busca

- Busca no cliente, **sem acento e sem diferenciar maiúsculas** ("creas" encontra "CREAS"; "jose e maria" encontra "José e Maria").
- Campos considerados, em ordem de peso: `nome`/`sigla` > `bairro` > `tags` > nomes das categorias > `paraQueServe`/`oQueEncontra`.
- Termos com várias palavras: todas precisam bater em algum campo.
- **Sem resultado** (ex.: o bairro "Dom Avelar"): mostrar *"Não encontramos “Dom Avelar” nos serviços cadastrados. Estes serviços atendem toda Petrolina:"* seguido dos serviços com `abrangencia` `"municipal"` ou `"regional"`, agrupados por categoria (grupos que abrem ao tocar). Nunca deixar a tela vazia. A frase é neutra porque o JSON não tem lista de bairros, então não dá para saber se o termo é um bairro.
- Sugestões rápidas abaixo da barra (chips): "CRAS", "Posto de saúde", "Advogado gratuito", "Violência contra a mulher", "Saúde mental".
- **Usar só os dados reais do JSON.** Não inventar serviços, bairros, telefones, números de casa ou horários: tudo precisa estar na cartilha ou no levantamento web.

## Design

### Identidade (a partir da logo)

- Azul principal: `#003DA6` (medido na logo), com variações mais escuras e mais claras
- Amarelo: `#FFC53D` (destaques, sublinhados, botão de busca)
- Fundo creme claro: `#F5F1E8`, com cards brancos
- Símbolo da ponte/Ψ como elemento gráfico. Clima acolhedor, confiável e público.
- Definir tudo como variáveis CSS em `:root` (cores, espaçamentos, raios, sombras, tipografia).
- ⚠️ Amarelo sobre branco não tem contraste suficiente para texto. Usar amarelo como fundo com texto azul-escuro, ou só como detalhe.

### Mobile first (obrigatório)

- Escrever o CSS para **360px primeiro** e expandir com `min-width` (ex.: 600px, 900px, 1200px).
- Sem rolagem horizontal em nenhuma largura.
- Categorias: 2 colunas no celular, 3 no tablet, 4 a 6 no desktop.
- Menu: botão hambúrguer no celular, links visíveis no desktop.
- Testar em 360px, 390px, 768px e 1280px.

### Acessibilidade e leitura fácil

- Fonte base de **18px**, altura de linha de 1.5 ou mais. Sugestão: *Atkinson Hyperlegible* (corpo) e uma condensada em negrito para títulos, parecida com a da logo (ex.: *Saira Condensed*), via Google Fonts.
- Alvos de toque de **48px** no mínimo; botões grandes com ícone + texto (nunca só ícone).
- Contraste WCAG AA, `:focus-visible` bem visível, HTML semântico, `alt`/`aria-label` corretos, respeitar `prefers-reduced-motion`.
- **Textos curtos**, em blocos, tópicos e ícones. Linguagem neutra, simples e sem termos técnicos. Siglas sempre acompanhadas do nome por extenso.

## Convenções de código

- Componentes funcionais, um por arquivo, com `PascalCase.tsx` + `PascalCase.module.css` lado a lado.
- Nomes de componentes e código em inglês. **Todo texto visível em português do Brasil.**
- Sem `any`. Props tipadas com `interface`.
- `npm run build` e `npm run lint` precisam passar sem erros antes de considerar uma etapa concluída.

## Fora do escopo agora (deixar a estrutura preparada)

- Área administrativa para editar serviços: a camada `src/data/servicos.ts` existe exatamente para isso.
- Geolocalização / "perto de mim", mapa embutido e backend.
