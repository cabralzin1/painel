# Roteiro do vídeo — Sprint 1

Duração alvo: 3 a 4 minutos. Gravar a tela com narração. Abrir `painel/index.html`
antes de começar.

## 1. Abertura (20s)

Diga o nome do projeto, os integrantes e o que o painel resolve: mostrar a despesa
contratada declarada pelos candidatos à Presidência, a partir dos dados abertos do TSE.

Mencione que esta sprint entrega a camada de front-end, na ordem
front → back → banco → integrado.

## 2. Visão geral da tela (40s)

Mostre o topo: total declarado, quantidade de candidatos, lançamentos e a data de
geração do TSE. Leia o aviso amarelo em voz alta — a prestação é parcial, os números
não são o gasto total da campanha.

Aponte a lista: cada candidato tem o mesmo layout (nome, partido, valor, barra
proporcional, quantidade de lançamentos). Não há destaque editorial.

## 3. A funcionalidade da sprint (80s)

- Busque um nome e mostre a lista encolher
- Filtre por tipo de prestação (Relatório Financeiro / Parcial)
- Ordene por lançamentos e volte para maior valor
- Abra “Ver origens” em um candidato e mostre a tabela por categoria

## 4. Validação (30s)

Na comparação, force os erros:

- clique em Comparar sem selecionar ninguém
- selecione o mesmo candidato nos dois campos

Depois compare dois nomes distintos e mostre a tabela de origens lado a lado.

## 5. Metodologia (30s)

Leia os três achados no painel da direita: arquivo BRASIL com duas eleições,
`SQ_DESPESA` que não é chave única, e os dois tipos de prestação que não se sobrepõem.

## 6. Código e próximos passos (30s)

Mostre a pasta `painel/`. Diga:

> `app.js` nunca fala com o backend. Ele só conversa com o objeto `Dados`, hoje em
> `data.js`. Na Sprint 2, quando a API entrar, só a implementação de `Dados` muda.

Feche no board com o que vem nas próximas sprints.
