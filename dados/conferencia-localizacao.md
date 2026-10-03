# Conferência da localização: CRAS e territórios

Relatório da **Parte 1** da funcionalidade "Perto de mim" (branch `feat/perto-de-mim`), gerado em 29/09/2026.

- **Coordenadas:** OpenStreetMap / Nominatim, via `scripts/geocodificar-cras.mjs` (1 requisição por segundo, User-Agent "PsicoInfo-prototipo"). Resposta completa em `scripts/saida/geocodificacao-cras.json`.
- **Territórios:** documento "Área de abrangência dos CRAS" ([PDF no portal Rede GN](https://www.redegn.com.br/ckfinder/userfiles/files/%C3%81REA%20DE%20ABRANG%C3%8ANCIA%20DOS%20CRAS.pdf)), **criado em 15/01/2016** segundo os metadados do PDF. Resultado em `src/data/territorios-cras.json`.

---

## 1. Coordenadas dos 10 CRAS

**Conferência feita em 01/10/2026:** 9 CRAS com coordenadas **verificadas** e 1 sem localização (Izacolândia).

Os pontos foram marcados em cima do prédio de cada CRAS, no Google Maps e no Street View. Os pontos automáticos do OpenStreetMap ficavam na rua, a uma distância de 28 m a 401 m do prédio.

| CRAS | Endereço (Prefeitura) | lat, lng | Mapa | Status |
|---|---|---|---|---|
| CRAS José e Maria | Rua Amazonas, 81 – José e Maria | -9.366183, -40.495973 | [abrir](https://www.google.com/maps?q=-9.366183,-40.495973) | ✅ verificado |
| CRAS Dom Avelar | Av. dos Sentimentos, 121 – Dom Avelar | -9.355681, -40.488752 | [abrir](https://www.google.com/maps?q=-9.355681,-40.488752) | ✅ verificado |
| CRAS João de Deus | Av. Terezinha Campos, S/N – João de Deus | -9.35736, -40.533311 | [abrir](https://www.google.com/maps?q=-9.35736,-40.533311) | ✅ verificado |
| CRAS Rio Corrente | Rua do Tamarindo, S/N – Rio Corrente | -9.394414, -40.548898 | [abrir](https://www.google.com/maps?q=-9.394414,-40.548898) | ✅ verificado |
| CRAS Vila Eduardo | Rua Sizenando Nunes Amorim, 30 – Loteamento Eduardo | -9.391155, -40.487779 | [abrir](https://www.google.com/maps?q=-9.391155,-40.487779) | ✅ verificado |
| CRAS Agrovila Massangano | Rua São João, S/N – estrada da Tapera | -9.441018, -40.570274 | [abrir](https://www.google.com/maps?q=-9.441018,-40.570274) | ✅ verificado |
| CRAS N7 | Rua B, 130-D – Projeto Senador Nilo Coelho | -9.291614, -40.507519 | [abrir](https://www.google.com/maps?q=-9.291614,-40.507519) | ✅ verificado |
| CRAS Rajada | Av. Nilo Coelho, 370 – Centro de Rajada | -8.81071, -40.832225 | [abrir](https://www.google.com/maps?q=-8.81071,-40.832225) | ✅ verificado |
| CRAS Uruás | Km 45-85 – Povoado de Uruás | -8.938542, -40.576125 | [abrir](https://www.google.com/maps?q=-8.938542,-40.576125) | ✅ verificado |
| CRAS Izacolândia | Av. José Silvestre, 24 – Izacolândia | — | — | ⚠️ **não localizado** |

### CRAS Izacolândia: não localizado no mapa

Na conferência, só a **UBS** de Izacolândia foi encontrada no mapa, e nenhum CRAS. Mas **a Prefeitura lista o CRAS Izacolândia** na página publicada em 10/07/2026 (endereço Av. José Silvestre, 24; telefone (87) 3983-6471; e-mail crasizacolandia2017@outlook.com). O CRAS **continua nos dados**, com `coordenadas: null` e uma pendência. Não achar no mapa não prova que ele não existe, porque muitos serviços da zona rural não estão marcados no Google Maps.

**Para resolver:** ligar para (87) 3983-6471 e perguntar se o CRAS funciona e onde fica. Se ele não existir mais, aí sim o registro sai do site.

### Por que o script exige o bairro certo
Na primeira versão do script, o CRAS N7 foi "achado" na **Rua B do Residencial Vivendas**, na área urbana. Os dados corretos da conferência confirmam o erro: o CRAS N7 fica a cerca de 5,4 km dali. O Nominatim tinha ignorado o "N7" da busca, e por isso o script agora exige que o resultado esteja no bairro do CRAS.

### Observação para a Parte 3
O **CRAS Rajada fica a cerca de 74 km do centro** de Petrolina, e o de Uruás a cerca de 51 km. O prompt da Parte 3 pede para considerar "em Petrolina" quem está a **até 60 km do centro**. Com esse limite, **quem mora em Rajada receberia a mensagem "Parece que você não está em Petrolina"**. Vai ser preciso usar os limites do município (lat -9.9 a -8.6, lng -41.2 a -40.2, os mesmos do script) ou um raio maior.

---

## 2. Territórios: qual CRAS atende cada bairro

O documento de 2016 lista **160 bairros e localidades**, e a ligação de 02/10/2026 acrescentou **Porto de Palhas**. Agora **todos os 161** têm CRAS de referência.

### CRAS Dom Avelar (12)
Dom Avelar, São Joaquim, Vila Rotary, Padre Cícero, Loteamento Recife, Vila Marcela, Vila Débora, Povoado do Capim, Serra da Santa, Ocupação Luís Inácio Lula da Silva, Assentamento do Pontal (Região do Capim), Loteamento Monsenhor Bernardino

### CRAS João de Deus (25)
João de Deus, Cosme e Damião / Invasão do Cosme e Damião, Quati I e II, Cacheado, Pedro Raimundo, Jardim Amazonas, Jardim São Paulo, Pedra Linda, Alto do Cocar, Santo André, Santa Marina, Vale do Grande Rio, Ponta da Serra, Assentamento Vila Débora, Nova Vida I e II, Ocupação Vila Dilma, Assentamento Nossa Senhora de Fátima, Vila Chocolate (ocupação), Assentamento Mandacaru (Ponta da Serra), Assentamento Euclides Nascimento (Ponta da Serra), Assentamento Nova Esperança (Ponta da Serra), Assentamento Terra da Liberdade, Sítio Pé de Serra - Curral Queimado, Parque São Paulo, IPSEP II

### CRAS José e Maria (15)
São Jorge, Santa Luzia, José e Maria, Lagoa Seca, Antônio Cassimiro I, Antônio Cassimiro II, Vila Eulália, KM 2, Dom Malan, Areia Branca, Vila Aparecida, Terra do Sul, IPSEP I, Vila Esperança, Mandacaru

### CRAS Rio Corrente (21)
São Gonçalo, Alto da Boa Vista, Rio Claro, Rio Corrente, Cohab IV, Cohab V (Cohab Massangano), Cohab VI (Cohab Massangano), Distrito Industrial, Jardim Imperial, Jardim Petrópolis, Ouro Preto, Jardim Maravilha, Jardim Guararapes, Jardim Guanabara, Parque Massangano, Nova Petrolina, Gercino Coelho, Palhinhas, Parque Bandeirantes, Atrás da Banca, Assentamento São Paulo (depois do Loteamento Nova Petrolina)

### CRAS Vila Eduardo (22): antigo CRAS Fernando Idalino
**Confirmado por telefone com o CRAS em 02/10/2026:** o CRAS Vila Eduardo é o antigo CRAS Fernando Idalino. Os bairros abaixo eram do Fernando Idalino no documento de 2016; Porto de Palhas foi citado na ligação.

Fernando Idalino, Henrique Leite, Vila Vitória, Parque Jatobá, Loteamento Geovana, Rio Jordão, Carneiro, Serrote do Urubu, Pedra do Bode, Pedrinhas, Picos I e II, Sítio Rio Verde, Vila Eduardo, São José, Cidade Universitária, Maria Auxiliadora, **Centro**, **Vila Mocó (Jardim Paulo Afonso)**, Poço da Cruz, Jardim Colonial, Ponta da Ilha, **Porto de Palhas**

### CRAS Agrovila Massangano (14)
Agrovila Massangano, Ilha do Massangano, Tapera, Caatinguinha, Roçado, Sítio São João, Assentamento José Almeida (em frente ao Sítio São João), Projeto C1, Projeto C2, Projeto N1, Projeto N2, Projeto N3, Projeto N4, Projeto N5

### CRAS Izacolândia (16)
Bebedouro, Izacolândia, Nova Descoberta, Cristália, Simpatia, Assentamento Alto da Areia, Assentamento São Francisco, Assentamento Gavião, Assentamento Poço do Angico, Assentamento Rio Pontal, Assentamento Manga Nova, Assentamento São José do Vale, Assentamento José Ramos, Assentamento Mansueto, Sítio Coelho, Sítio Paulista

### CRAS N7 (9)
Projeto N6, Projeto N7, Projeto N8, Projeto N9, Projeto C3, Projeto N10, Projeto N11, Projeto N12, KM 25 / Maria Tereza

### CRAS Rajada (14)
Rajada, Boa Vista, Cabaceira, Pau Ferro, Santa Fé, Tigre, Barreiro, Garcinha, Favela, Pedra Preta, Caeira, Tabatinga, Emparedado, Xique-Xique

### CRAS Uruás (13)
Uruás, Icozeiro, Lajedo, Cruz de Salina, Atalho, Caititu, Assentamento Curimatá (Pau Ferro), Assentamento Esperança (Pau Ferro), Assentamento Lindolfo Silva (Uruás), Assentamento Nossa Senhora de Fátima (Uruás), Assentamento Maracy Amador (Uruás), Volta da Carolina, Morro Massapê

### Bairros sem CRAS de referência (0)
Nenhum. Os 21 que estavam aqui passaram para o **CRAS Vila Eduardo** depois da confirmação por telefone.

---

## 3. Dúvidas encontradas no documento

1. ✅ **Resolvida em 02/10/2026: o CRAS Vila Eduardo é o antigo CRAS Fernando Idalino.** Confirmado por telefone com o próprio CRAS, que citou entre os bairros atendidos Pedrinhas, Pedra do Bode, Porto de Palhas, Vila Mocó e Centro. Os 21 bairros do Fernando Idalino passaram para `cras-vila-eduardo`, e Porto de Palhas foi acrescentado. A ligação citou só alguns bairros como exemplo ("são bastante bairros"); os demais seguem a lista de 2016.

2. **O documento é de 2016 e os endereços mudaram.** Em 7 dos 9 CRAS em comum, o endereço do documento é diferente do atual. Isso indica mudanças de sede e, talvez, de território:

   | CRAS | Endereço no documento (2016) | Endereço atual (Prefeitura, 2026) |
   |---|---|---|
   | José e Maria | Av. Principal, S/N | Rua Amazonas, 81 |
   | Rio Corrente | Rua 11 (Rua do Tamarindo) | Rua do Tamarindo, S/N ✓ |
   | Izacolândia | Rua da Caixa D'água, S/N | Av. José Silvestre, 24 |
   | João de Deus | Rua Doze, S/N | Av. Terezinha Campos, S/N |
   | Dom Avelar | Av. do Sentimento, 121 | Av. dos Sentimentos, 121 ✓ |
   | Uruás | Av. Principal, S/N | Km 45-85, Povoado de Uruás |
   | Rajada | Rua Vaz Filgueira, 180 | Av. Nilo Coelho, 370 |
   | N7 | Rua C, 146 | Rua B, 130-D |
   | Agrovila Massangano | Rua da Esperança, 08 | Rua São João, S/N |

3. **Localidades com nomes parecidos em CRAS diferentes.** Estão no documento assim e mantive:
   - "Pau Ferro" no CRAS **Rajada**, mas "Assentamento Curimatá (Pau Ferro)" e "Assentamento Esperança (Pau Ferro)" no CRAS **Uruás**.
   - "Assentamento Nossa Senhora de Fátima" no **João de Deus** e "Assentamento Nossa Senhora de Fátima (Uruás)" no **Uruás**.
   - "Vila Débora" no **Dom Avelar** e "Assentamento Vila Débora" no **João de Deus**.
   - "Mandacaru" no **José e Maria** e "Assentamento Mandacaru (Ponta da Serra)" no **João de Deus**.

4. **Nomes do documento × nomes do nosso JSON.** Dos 55 bairros que aparecem nos nossos serviços, **37** batem com um CRAS (29 antes da ligação + 8 que eram "sem referência" e agora são do Vila Eduardo) e **18 não aparecem no documento com o mesmo nome**. A maioria é só diferença de escrita, e a Parte 3 vai precisar tratar isso (sinônimos):
   - "Terras do Sul" (nosso) × "Terra do Sul" (documento)
   - "Antônio Cassimiro" × "Antônio Cassimiro I / II"
   - "Cosme e Damião" × "Cosme e Damião / Invasão do Cosme e Damião"
   - "Cohab Massangano" × "Cohab V / Cohab VI (Cohab Massangano)"
   - "N4", "N5", "N8", "N10", "Vila Nova N6", "Vila Velha N1", "Projeto Senador Nilo Coelho N7/N9/N11" × "Projeto N4", "Projeto N5"…
   - Não aparecem de jeito nenhum: **Caminho do Sol**, **Vila NS2**, "Projeto Senador Nilo Coelho" (genérico) e "Zona rural" (genérico).

5. **Ajustes que fiz nos nomes** (só grafia; nada foi mudado de CRAS):
   - Acentos: "Jose e Maria" → "José e Maria", "Uruas" → "Uruás", "Antonio Cassimiro I" → "Antônio Cassimiro I", "Sitio" → "Sítio", "Luis Inácio" → "Luís Inácio", "Xique xique" → "Xique-Xique".
   - Erros de digitação: "Assentameno Nova Esperança" → "Assentamento Nova Esperança", "Assentamento São Franciso" → "Assentamento São Francisco".
   - Padronização: "Projeto N-06" → "Projeto N6", "Projeto N 10" → "Projeto N10", "Projeto C-03" → "Projeto C3".
   - Removidos: "Assentamento Rio Pontal", que aparece **duas vezes** na lista de Izacolândia (mantido uma vez), e as linhas "E adjacências das localidades citadas" (Uruás e Rajada), que não são bairros.

---

## O que você precisa fazer (Parte 2) – concluída em 01/10/2026, exceto Izacolândia

1. Abrir os 5 links da tabela da seção 1 e ver se o pino cai **no prédio** do CRAS.
2. Para os que estiverem errados e para os 5 não encontrados: achar o CRAS no Google Maps, clicar com o botão direito no prédio e copiar os números.
3. ~~Confirmar a **dúvida 1** (Vila Eduardo × Fernando Idalino).~~ ✅ Confirmado por telefone em 02/10/2026. Falta só ligar para o CRAS Izacolândia, (87) 3983-6471.
4. Responder no Claude CLI:

```
Conferi as coordenadas. Estas estão corretas: <lista>.
Corrija estas: <nome do CRAS> = <lat>, <lng> ...
Marque todas as conferidas como precisao "verificada".
```
