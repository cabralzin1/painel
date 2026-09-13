# Portal de Requisições de Compra

Sistema web para abertura e acompanhamento de requisições de compra internas.
Um colaborador registra o que precisa comprar, informa centro de custo e justificativa,
e a requisição entra na fila de aprovação do responsável.

Projeto da disciplina de Projeto de Software.

## Integrantes

| Nome | RA |
| ---- | -- |
| _(preencher)_ | _(preencher)_ |

- Board do projeto: _(colar link do Trello / GitHub Projects)_
- Vídeo da Sprint 1: _(colar link do YouTube ou Drive)_

## Como executar

Não há dependências, build ou instalação. Basta abrir o arquivo `index.html` no navegador:

```bash
git clone <url-do-repositorio>
cd portal-requisicoes
# abra index.html no navegador (duplo clique ou):
xdg-open index.html   # Linux
open index.html       # macOS
start index.html      # Windows
```

Testado em Chrome, Edge e Firefox.

## Arquitetura

O projeto segue três camadas, entregues progressivamente ao longo das sprints.

```
portal-requisicoes/
├── index.html          estrutura da página
├── css/style.css       estilos
├── js/
│   ├── data.js         camada de dados (hoje em memória, na Sprint 2 vira chamada à API)
│   └── app.js          camada de apresentação: validação, listagem, filtros
└── docs/               roteiro do vídeo e material de apoio
```

A separação entre `data.js` e `app.js` é proposital. A tela nunca acessa o backend
diretamente — ela conversa apenas com o objeto `Dados`. Quando a API entrar na Sprint 2,
somente a implementação de `Dados` muda; a interface continua igual.

## Funcionalidades por sprint

### Sprint 1 — Front-end (entrega 14/09) ✅

- [x] Formulário de abertura de requisição com centro de custo e categoria
- [x] Inclusão e remoção dinâmica de itens, com cálculo de subtotal e total
- [x] Validação de campos obrigatórios, data retroativa e requisição sem itens
- [x] Listagem das requisições com situação (pendente / aprovada / reprovada)
- [x] Filtro por situação e expansão dos itens de cada requisição
- [x] Painel com quantidade e valor total aguardando aprovação

### Sprint 2 — Back-end (entrega 13/10)

- [ ] API REST com endpoints de criação, consulta e listagem de requisições
- [ ] Geração do número sequencial da requisição no servidor
- [ ] Regras de negócio: limite de alçada por centro de custo
- [ ] Endpoint de aprovação e reprovação com registro do aprovador
- [ ] Substituição dos dados mockados por chamadas `fetch` à API

### Sprint 3 — Banco de dados (entrega 08/11)

- [ ] Modelagem relacional: requisição, item, centro de custo, usuário, aprovação
- [ ] Persistência das requisições e do histórico de mudanças de situação
- [ ] Consultas de apoio: gasto por centro de custo e por categoria
- [ ] Script de criação do banco e carga inicial

### Entrega final — Sistema integrado (22/11)

- [ ] Autenticação e perfis (solicitante e aprovador)
- [ ] Fluxo completo de aprovação ponta a ponta
- [ ] Painel de indicadores: valor aprovado no mês, tempo médio de aprovação
- [ ] Exportação da requisição aprovada para o setor de compras

## Situação atual

Sprint 1 concluída. Os dados são carregados de `js/data.js` e mantidos em memória durante
a sessão — recarregar a página restaura a carga inicial. A persistência é escopo da Sprint 3.
