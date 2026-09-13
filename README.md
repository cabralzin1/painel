# Financiamento de Campanha — Eleição Presidencial 2026

Painel com a **despesa contratada declarada** pelos candidatos à Presidência,
a partir dos Dados Abertos do TSE. O painel **mede**, não opina: todos os
candidatos recebem o mesmo tratamento.

Disciplina de Projeto de Software. Ordem das sprints: front-end → back-end → banco → integrado.

Repositório: https://github.com/cabralzin1/painel

## Integrantes

| Nome | RA |
| ---- | -- |
| Guilherme Cabral | 2403377 |

- Board: https://app.clickup.com/90171389193/v/li/901715205335
- Vídeo da Sprint 1: _(colar link)_

## Como executar (Sprint 1)

Não há instalação, build nem banco. O professor (ou qualquer pessoa) só precisa
abrir o front no navegador:

1. Clone ou baixe o ZIP do repositório
2. Abra o arquivo `painel/index.html` (duplo clique, ou arraste para o Chrome/Edge/Brave)

Os números da carga já estão em `painel/js/data.js`. **Não é necessário** baixar os
CSVs do TSE nem rodar Python para avaliar esta sprint.

```
painel/
├── index.html     estrutura
├── css/style.css  estilos
└── js/
    ├── data.js    dados agregados da carga TSE (na Sprint 2 vira API)
    └── app.js     filtros, ordenação, comparação e validação
```

A tela só conversa com o objeto `Dados`. Na Sprint 2, a API troca a implementação
de `data.js`; o HTML não muda.

## O que os números representam

Despesa contratada **declarada até 12/09/2026** (`DT_GERACAO` do arquivo TSE),
não o gasto total da campanha. Recorte: cargo Presidente (`CD_CARGO = 1`) no
consolidado `BRASIL`. Quem declarou zero também entra na lista.

Metodologia (incluindo os achados sobre `SQ_DESPESA` e os dois tipos de
prestação): `dados/metodologia.md`.

## Sprints

### Sprint 1 — Front-end (entrega 14/09)

- [x] Despesa declarada por candidato (valor + lançamentos)
- [x] Resumo da carga e ressalva de prestação parcial junto dos números
- [x] Busca, filtro por partido e tipo de prestação, ordenação
- [x] Origens de despesa por candidato
- [x] Comparação de dois candidatos, com validação no front

### Sprint 2 — Back-end (entrega 13/10)

- [ ] API REST; `data.js` passa a usar `fetch()`

### Sprint 3 — Banco (entrega 08/11)

- [ ] SQLite e views de apoio (`dados/02_carregar.py`)

### Entrega final (22/11)

- [ ] Painel integrado com carga atualizada pós-pleito
