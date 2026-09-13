# Metodologia

Decisões que afetam os números do painel. Qualquer critério de recorte, exclusão ou
agrupamento é registrado aqui antes de ser aplicado.

## Recorte

- Fonte: arquivo `despesas_contratadas_candidatos_2026_BRASIL.csv`, conjunto
  Prestação de Contas Eleitorais 2026 do Portal de Dados Abertos do TSE.
- Filtro: `CD_CARGO = 1` (Presidente). Nenhum outro filtro é aplicado.
- Todos os candidatos que aparecem no arquivo entram no painel, inclusive os que
  declararam valor zero. Não há recorte por partido, por valor mínimo ou por
  relevância eleitoral.

## O que os números representam

**Despesa contratada declarada até a data da carga.** Não é o gasto total da campanha.

Durante o período eleitoral o TSE publica prestações de contas parciais, e os valores
aparecem à medida que cada campanha declara. As contas finais só são entregues e
analisadas após o pleito.

Consequência prática: a diferença entre dois candidatos pode refletir ritmo de
declaração tanto quanto volume de gasto. O painel exibe, ao lado do valor, a
quantidade de lançamentos e a data da carga, justamente para que essa leitura fique
disponível.

## Achados sobre a estrutura do arquivo

### SQ_DESPESA não é chave única

O mesmo `SQ_DESPESA` aparece em linhas com valores diferentes — por exemplo, o código
73658096 consta com R$ 3.000,00 e com R$ 8.900,00. Foram identificados 50 códigos
repetidos, envolvendo 205 linhas.

Decisão: a tabela fato usa chave artificial (`id_despesa` autoincremento) e mantém
`SQ_DESPESA` como atributo. **Não deduplicar por esse campo** — a primeira versão do
script fazia isso e descartava 155 lançamentos legítimos, subestimando o total em
cerca de R$ 4,2 milhões.

### Dois tipos de prestação de contas convivem no arquivo

`TP_PRESTACAO_CONTAS` assume dois valores: "Relatório Financeiro" (923 lançamentos) e
"Parcial" (94).

Verificação feita: nenhum candidato aparece sob os dois tipos, e nenhuma despesa
(mesma combinação de candidato, data, valor e fornecedor) consta nos dois. **Não há
dupla contagem** — os dois tipos podem ser somados.

Ressalva: candidatos estão declarando sob regimes documentais diferentes, com prazos e
conteúdos distintos. Isso reforça o caráter aproximado da comparação entre totais nesta
fase.

### Duas eleições no mesmo conjunto

Os arquivos `BRASIL` são consolidados nacionais e contêm tanto "Eleições Gerais
Estaduais 2026" quanto "Eleição Geral Federal 2026". O filtro por cargo já isola a
disputa presidencial, mas a distinção é relevante ao trabalhar com outros cargos.

### Formato dos campos

- Encoding `latin-1`, separador `;`
- Valores no padrão brasileiro (`1.234,56`), convertidos para float na carga
- Datas em `DD/MM/AAAA`, convertidas para ISO `AAAA-MM-DD`

## Modelo de dados

Modelo dimensional com três dimensões e uma fato:

- `dim_candidato` — candidato, número, partido
- `dim_fornecedor` — CPF/CNPJ, nome, nome na Receita Federal, CNAE, UF, município
- `dim_tempo` — data, ano, mês, dia, semana
- `fato_despesa` — valor, origem, descrição, documento, tipo de prestação

A tabela `carga` registra quando os dados foram extraídos e a data de geração informada
pelo próprio TSE, exibida no painel.

## Pendências conhecidas

- Fornecedores são distinguidos por CPF/CNPJ. Um mesmo fornecedor com cadastros
  distintos ainda aparece duplicado. Tratamento previsto para a Sprint 2.
- Despesas de partido não entram neste recorte. Somar despesa de partido e de candidato
  contaria duas vezes as transferências partidárias; o tratamento exige identificar e
  excluir essas transferências, previsto para sprint posterior.
