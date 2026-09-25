# PsicoInfo

Guia de serviços públicos de Petrolina (PE). Ajuda a população a encontrar CRAS, CREAS, UBS, CAPS, Defensoria, Delegacia da Mulher e outros serviços **sem precisar saber antes o nome ou o endereço do local**. Feito para o celular, com letras grandes e linguagem simples.

**Site:** em breve

## Como rodar

Requer Node.js 20.19+ (veja `.nvmrc`).

```bash
npm install
npm run dev
```

Outros comandos: `npm run build` (build de produção), `npm run lint` (verificação de código) e `npm run preview`.

## Stack

- Vite + React + TypeScript
- CSS Modules (CSS puro, sem frameworks de UI)
- `react-router-dom` e `lucide-react`
- Sem backend: os dados vêm de um arquivo JSON, lido só pela camada `src/data/servicos.ts`
- CI com GitHub Actions (lint + build) e deploy na Vercel

## Dados

São 108 serviços reais em 11 categorias. As informações vêm de:

- **Cartilha da ACARI** (Projeto Bem Me Quer)
- **Levantamento em sites oficiais** (set/2026), que corrige telefones e endereços da cartilha e acrescenta CRAS, CREAS e UBS

Os arquivos e a documentação do levantamento estão em [`dados/`](dados/).
