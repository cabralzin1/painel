# Financiamento de Campanha — Eleição Presidencial 2026

Projeto de dados que consolida receitas e despesas declaradas pelos candidatos à
Presidência da República na Justiça Eleitoral, e apresenta os números em um painel.

O painel **mede**, não opina. Todos os candidatos recebem o mesmo tratamento, sem
recorte, destaque ou texto interpretativo. Qualquer leitura fica por conta de quem olha.

Projeto da disciplina de Projeto de Software.

## Integrantes

| Nome | RA |
| ---- | -- |
| _(preencher)_ | _(preencher)_ |

- Board do projeto: _(colar link público do ClickUp)_
- Vídeo da Sprint 1: _(colar link)_

## Fonte dos dados

Portal de Dados Abertos do TSE — conjunto **Prestação de Contas Eleitorais 2026**
e conjunto **Candidatos 2026**.

- https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais-2026
- https://dadosabertos.tse.jus.br/dataset/candidatos-2026

Os dados não são versionados neste repositório (são grandes demais). Baixe os zips
e coloque em `dados/brutos/`.

### Limitação importante

Durante o período eleitoral o TSE publica **prestações de contas parciais**: os valores
aparecem à medida que candidatos e partidos declaram. As contas finais só são entregues
e analisadas após o pleito.

Ou seja, os números deste painel representam o que foi **declarado até a data da carga**,
não o gasto total da campanha. A data da última carga é exibida no painel e essa
ressalva deve aparecer junto dos números, não escondida no rodapé.

## Como executar

```bash
pip install -r requirements.txt

# 1. inspeciona os arquivos baixados e mostra as colunas reais
python scripts/01_inspecionar.py dados/brutos

# 2. carrega e modela no SQLite  (criado no passo seguinte)
python scripts/02_carregar.py
```

O passo 1 existe porque o TSE muda nomes de coluna entre eleições. Rode-o antes de
qualquer transformação e confira o layout real em vez de supor.

## Estrutura

```
gastos-campanha/
├── dados/
│   ├── brutos/        zips e csvs baixados do TSE (fora do git)
│   └── campanha.db    banco SQLite gerado pela carga
├── scripts/
│   ├── 01_inspecionar.py
│   └── 02_carregar.py
├── painel/            dashboard
└── docs/              decisões de modelagem e roteiro do vídeo
```

## Funcionalidades por sprint

### Sprint 1 — Front-end / primeira visão (entrega 14/09)

- [x] Download e inspeção dos arquivos do TSE
- [x] Pipeline de carga: leitura, normalização de encoding e tipos
- [x] Filtro dos candidatos ao cargo de Presidente
- [ ] Carga em banco relacional com modelo dimensional
- [x] Primeira visão no painel (`painel/`): despesa declarada por candidato

### Sprint 2 — Modelo e regras (entrega 13/10)

- [ ] Dimensões de candidato, partido, fornecedor, categoria e tempo
- [ ] Tabela fato de receitas e tabela fato de despesas
- [ ] Tratamento de fornecedores duplicados por CNPJ
- [ ] Indicadores: concentração por fornecedor, participação do fundo eleitoral

### Sprint 3 — Banco e consultas (entrega 08/11)

- [ ] Scripts DDL versionados e carga incremental
- [ ] Views de apoio para o painel
- [ ] Controle de qualidade: contagem de registros e soma por origem

### Entrega final — Painel integrado (22/11)

- [ ] Painel com filtro por candidato, período e categoria de despesa
- [ ] Comparação entre candidatos com o mesmo critério
- [ ] Atualização da carga com as contas finais pós-pleito
- [ ] Documentação de metodologia e limitações

## Metodologia

Decisões que afetam os números estão registradas em `docs/metodologia.md`. Qualquer
critério de recorte, exclusão ou agrupamento deve ser escrito lá antes de ser aplicado.
