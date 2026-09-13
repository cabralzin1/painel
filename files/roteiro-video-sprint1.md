# Roteiro do vídeo — Sprint 1

Duração alvo: 3 a 4 minutos. Gravar a tela com narração (OBS, Loom ou a própria gravação
do Google Meet). Abrir o `index.html` antes de começar a gravar.

## 1. Abertura (20s)

Diga o nome do projeto, os integrantes do grupo e o que o sistema resolve:
abertura e acompanhamento de requisições de compra internas, com fila de aprovação.

Mencione que esta sprint entrega a camada de front-end, conforme a ordem
front → back → banco → integrado.

## 2. Visão geral da tela (30s)

Mostre o painel no topo: quantidade de requisições aguardando aprovação e o valor total
em análise. Explique que esse número se atualiza sozinho conforme requisições entram.

Mostre a lista à direita, apontando a barra colorida à esquerda de cada linha — é a
situação da requisição.

## 3. A funcionalidade da sprint (90s)

Preencha uma requisição do zero, narrando:

- solicitante, centro de custo e categoria
- data de necessidade
- justificativa
- adicione dois itens, mostrando o total sendo recalculado a cada digitação
- remova um item para mostrar que o total acompanha

## 4. Validação (40s)

Antes de enviar a versão correta, force os erros de propósito:

- envie o formulário vazio → mostre as mensagens em cada campo
- coloque uma data no passado → mostre a mensagem específica
- apague todos os itens e tente enviar → mostre o erro de requisição sem itens

Isso mostra regra de negócio no front, não só tela bonita.

## 5. Envio e resultado (30s)

Corrija os campos e envie. Mostre:

- a confirmação com o número gerado da requisição
- a requisição nova aparecendo no topo da lista, já como pendente
- o contador do topo subindo
- o filtro por situação funcionando
- "Ver itens" expandindo a tabela com subtotais

## 6. Código e próximos passos (30s)

Abra o projeto no editor e mostre a separação de pastas. Explique o ponto principal:

> `app.js` nunca fala com o backend. Ele só conversa com o objeto `Dados`, que hoje está
> em memória no `data.js`. Na Sprint 2, quando a API em Python entrar, só a implementação
> do `Dados` muda — a tela continua igual.

Feche mostrando o board com as funcionalidades das próximas sprints.
