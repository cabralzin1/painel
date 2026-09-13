# Financiamento de Campanha — Eleição Presidencial 2026

Painel que consolida a **despesa contratada declarada** pelos candidatos à Presidência
na Justiça Eleitoral. O painel **mede**, não opina: todos os candidatos recebem o
mesmo tratamento.

Projeto da disciplina de Projeto de Software. Ordem das sprints:
front-end → back-end → banco → sistema integrado.

## Integrantes

| Nome          | RA            |
| ------------- | ------------- |
| _(preencher)_ | _(preencher)_ |

- Board do projeto: _(colar link público)_
- Vídeo da Sprint 1: _(colar link)_

## Como executar (Sprint 1) teste

Não há dependências, build ou instalação. Abra `painel/index.html` no navegador:

```bash
cd painel
start index.html
```

Testado em Chrome, Edge e Firefox.

## Arquitetura

```
painel/
├── index.html          estrutura da página
├── css/style.css       estilos
├── js/
│   ├── data.js         camada de dados (hoje o agregado da carga TSE, na Sprint 2 vira API)
│   └── app.js          camada de apresentação: filtros, ordenação, comparação, validação
└── docs/               roteiro do vídeo
```

A tela nunca acessa o backend diretamente — ela conversa apenas com o objeto `Dados`.
Quando a API entrar na Sprint 2, somente a implementação de `Dados` muda.

## Funcionalidades por sprint

### Sprint 1 — Front-end (entrega 14/09)

- [x] Primeira visão: despesa declarada por candidato (valor + lançamentos)
- [x] Resumo da carga: total, quantidade de candidatos, lançamentos e data de geração do TSE
- [x] Ressalva de prestação parcial visível junto dos números
- [x] Busca, filtro por partido e por tipo de prestação, ordenação
- [x] Expansão das origens de despesa de cada candidato
- [x] Comparação entre dois candidatos com o mesmo critério, com validação no front
- [x] Metodologia dos três achados da carga (BRASIL, SQ_DESPESA, tipos de prestação)

### Sprint 2 — Back-end (entrega 13/10)

- [ ] API REST com listagem de candidatos e detalhe por origem
- [ ] Substituição de `data.js` por `fetch()` nas funções de `Dados`
- [ ] Recálculo a partir do banco, sem o JSON estático

### Sprint 3 — Banco de dados (entrega 08/11)

- [ ] Modelo dimensional já esboçado em `dados/02_carregar.py`
- [ ] Persistência em SQLite e views de apoio ao painel
- [ ] Controle de qualidade: contagem de registros e soma por origem

### Entrega final — Painel integrado (22/11)

- [ ] Filtro por período e categoria alimentado pelo banco
- [ ] Atualização da carga com as contas finais pós-pleito
- [ ] Documentação de metodologia e limitações

## O que os números representam

Despesa contratada declarada até a data da carga (`DT_GERACAO` do arquivo TSE).
Não é o gasto total da campanha. Recorte: `CD_CARGO = 1` no consolidado BRASIL.

Decisões que afetam os números: `dados/metodologia.md`.
