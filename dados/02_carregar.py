#!/usr/bin/env python3
"""
Passo 2 — Carga do CSV do TSE para um modelo dimensional em SQLite.

Lê o arquivo de despesas contratadas, mantém apenas os candidatos ao cargo de
Presidente e grava em um banco com três dimensões e uma tabela fato.

Uso:
    python scripts/02_carregar.py dados/brutos/despesas_contratadas_candidatos_2026_BRASIL.csv
"""

import sqlite3
import sys
from pathlib import Path

import pandas as pd

CD_CARGO_PRESIDENTE = "1"
ENCODING = "latin-1"
SEPARADOR = ";"
TAMANHO_LOTE = 200_000

BANCO = Path("dados/campanha.db")

COLUNAS = [
    "DT_GERACAO",
    "DS_ELEICAO",
    "ST_TURNO",
    "DT_PRESTACAO_CONTAS",
    "TP_PRESTACAO_CONTAS",
    "CD_CARGO",
    "DS_CARGO",
    "SQ_CANDIDATO",
    "NR_CANDIDATO",
    "NM_CANDIDATO",
    "NR_PARTIDO",
    "SG_PARTIDO",
    "NM_PARTIDO",
    "DS_TIPO_FORNECEDOR",
    "DS_CNAE_FORNECEDOR",
    "NR_CPF_CNPJ_FORNECEDOR",
    "NM_FORNECEDOR",
    "NM_FORNECEDOR_RFB",
    "SG_UF_FORNECEDOR",
    "NM_MUNICIPIO_FORNECEDOR",
    "DS_TIPO_DOCUMENTO",
    "NR_DOCUMENTO",
    "CD_ORIGEM_DESPESA",
    "DS_ORIGEM_DESPESA",
    "SQ_DESPESA",
    "DT_DESPESA",
    "DS_DESPESA",
    "VR_DESPESA_CONTRATADA",
]

DDL = """
DROP TABLE IF EXISTS fato_despesa;
DROP TABLE IF EXISTS dim_candidato;
DROP TABLE IF EXISTS dim_fornecedor;
DROP TABLE IF EXISTS dim_tempo;
DROP TABLE IF EXISTS carga;

CREATE TABLE dim_candidato (
    sq_candidato   TEXT PRIMARY KEY,
    nm_candidato   TEXT NOT NULL,
    nr_candidato   TEXT,
    sg_partido     TEXT,
    nm_partido     TEXT,
    nr_partido     TEXT
);

CREATE TABLE dim_fornecedor (
    id_fornecedor  INTEGER PRIMARY KEY AUTOINCREMENT,
    cpf_cnpj       TEXT UNIQUE,
    nm_fornecedor  TEXT,
    nm_receita_federal TEXT,
    tipo           TEXT,
    cnae           TEXT,
    uf             TEXT,
    municipio      TEXT
);

CREATE TABLE dim_tempo (
    data     TEXT PRIMARY KEY,
    ano      INTEGER,
    mes      INTEGER,
    dia      INTEGER,
    semana   INTEGER
);

-- Atenção: SQ_DESPESA NÃO é único no arquivo do TSE. O mesmo código aparece
-- com valores diferentes. Por isso a chave da fato é artificial e o SQ_DESPESA
-- fica como atributo. Deduplicar por ele apagaria despesa legítima.
CREATE TABLE fato_despesa (
    id_despesa      INTEGER PRIMARY KEY AUTOINCREMENT,
    sq_despesa      TEXT,
    tp_prestacao    TEXT,
    sq_candidato    TEXT REFERENCES dim_candidato(sq_candidato),
    id_fornecedor   INTEGER REFERENCES dim_fornecedor(id_fornecedor),
    data            TEXT REFERENCES dim_tempo(data),
    origem_despesa  TEXT,
    descricao       TEXT,
    tipo_documento  TEXT,
    nr_documento    TEXT,
    turno           TEXT,
    dt_prestacao    TEXT,
    valor           REAL NOT NULL
);

CREATE INDEX idx_fato_candidato ON fato_despesa(sq_candidato);
CREATE INDEX idx_fato_fornecedor ON fato_despesa(id_fornecedor);
CREATE INDEX idx_fato_data ON fato_despesa(data);

-- Registra quando os dados foram extraídos do TSE. O painel exibe essa data:
-- prestação de contas é parcial durante a campanha.
CREATE TABLE carga (
    executada_em   TEXT,
    dt_geracao_tse TEXT,
    arquivo        TEXT,
    linhas_lidas   INTEGER,
    linhas_presidente INTEGER
);
"""


def valor_para_float(serie):
    """Converte '1.234,56' (padrão brasileiro) para float."""
    return (
        serie.astype(str)
        .str.replace(".", "", regex=False)
        .str.replace(",", ".", regex=False)
        .pipe(pd.to_numeric, errors="coerce")
        .fillna(0.0)
    )


def data_para_iso(serie):
    """Converte 'DD/MM/AAAA' para 'AAAA-MM-DD'. Valores inválidos viram None."""
    convertida = pd.to_datetime(serie, format="%d/%m/%Y", errors="coerce")
    return convertida.dt.strftime("%Y-%m-%d")


def ler_presidente(caminho: Path):
    """Lê o CSV em lotes e devolve apenas as linhas do cargo Presidente."""
    lotes = []
    total_lido = 0

    leitor = pd.read_csv(
        caminho,
        sep=SEPARADOR,
        encoding=ENCODING,
        dtype=str,
        usecols=lambda c: c in COLUNAS,
        chunksize=TAMANHO_LOTE,
        on_bad_lines="skip",
    )

    for lote in leitor:
        total_lido += len(lote)
        presidente = lote[lote["CD_CARGO"] == CD_CARGO_PRESIDENTE]
        if not presidente.empty:
            lotes.append(presidente)
        print(f"  lidas {total_lido:,} linhas...", end="\r")

    print()
    if not lotes:
        raise SystemExit(
            "Nenhuma linha com CD_CARGO = 1 encontrada. "
            "Confira se o arquivo é o consolidado BRASIL."
        )

    return pd.concat(lotes, ignore_index=True), total_lido


def montar_dimensoes(df):
    candidatos = (
        df[["SQ_CANDIDATO", "NM_CANDIDATO", "NR_CANDIDATO", "SG_PARTIDO", "NM_PARTIDO", "NR_PARTIDO"]]
        .drop_duplicates(subset="SQ_CANDIDATO")
        .rename(
            columns={
                "SQ_CANDIDATO": "sq_candidato",
                "NM_CANDIDATO": "nm_candidato",
                "NR_CANDIDATO": "nr_candidato",
                "SG_PARTIDO": "sg_partido",
                "NM_PARTIDO": "nm_partido",
                "NR_PARTIDO": "nr_partido",
            }
        )
    )

    fornecedores = (
        df[
            [
                "NR_CPF_CNPJ_FORNECEDOR",
                "NM_FORNECEDOR",
                "NM_FORNECEDOR_RFB",
                "DS_TIPO_FORNECEDOR",
                "DS_CNAE_FORNECEDOR",
                "SG_UF_FORNECEDOR",
                "NM_MUNICIPIO_FORNECEDOR",
            ]
        ]
        .drop_duplicates(subset="NR_CPF_CNPJ_FORNECEDOR")
        .rename(
            columns={
                "NR_CPF_CNPJ_FORNECEDOR": "cpf_cnpj",
                "NM_FORNECEDOR": "nm_fornecedor",
                "NM_FORNECEDOR_RFB": "nm_receita_federal",
                "DS_TIPO_FORNECEDOR": "tipo",
                "DS_CNAE_FORNECEDOR": "cnae",
                "SG_UF_FORNECEDOR": "uf",
                "NM_MUNICIPIO_FORNECEDOR": "municipio",
            }
        )
        .reset_index(drop=True)
    )
    fornecedores.insert(0, "id_fornecedor", range(1, len(fornecedores) + 1))

    datas = pd.to_datetime(df["data"].dropna().unique())
    tempo = pd.DataFrame(
        {
            "data": datas.strftime("%Y-%m-%d"),
            "ano": datas.year,
            "mes": datas.month,
            "dia": datas.day,
            "semana": datas.isocalendar().week,
        }
    )

    return candidatos, fornecedores, tempo


def carregar(caminho: Path):
    print(f"Lendo {caminho.name}")
    df, total_lido = ler_presidente(caminho)
    print(f"  {len(df):,} linhas do cargo Presidente de {total_lido:,} no total")

    df["valor"] = valor_para_float(df["VR_DESPESA_CONTRATADA"])
    df["data"] = data_para_iso(df["DT_DESPESA"])
    df["dt_prestacao"] = data_para_iso(df["DT_PRESTACAO_CONTAS"])

    candidatos, fornecedores, tempo = montar_dimensoes(df)

    mapa_fornecedor = dict(zip(fornecedores["cpf_cnpj"], fornecedores["id_fornecedor"]))

    fato = pd.DataFrame(
        {
            "sq_despesa": df["SQ_DESPESA"],
            "tp_prestacao": df["TP_PRESTACAO_CONTAS"],
            "sq_candidato": df["SQ_CANDIDATO"],
            "id_fornecedor": df["NR_CPF_CNPJ_FORNECEDOR"].map(mapa_fornecedor),
            "data": df["data"],
            "origem_despesa": df["DS_ORIGEM_DESPESA"],
            "descricao": df["DS_DESPESA"],
            "tipo_documento": df["DS_TIPO_DOCUMENTO"],
            "nr_documento": df["NR_DOCUMENTO"],
            "turno": df["ST_TURNO"],
            "dt_prestacao": df["dt_prestacao"],
            "valor": df["valor"],
        }
    )

    BANCO.parent.mkdir(parents=True, exist_ok=True)
    conexao = sqlite3.connect(BANCO)
    conexao.executescript(DDL)

    candidatos.to_sql("dim_candidato", conexao, if_exists="append", index=False)
    fornecedores.to_sql("dim_fornecedor", conexao, if_exists="append", index=False)
    tempo.to_sql("dim_tempo", conexao, if_exists="append", index=False)
    fato.to_sql("fato_despesa", conexao, if_exists="append", index=False)

    conexao.execute(
        "INSERT INTO carga VALUES (datetime('now','localtime'), ?, ?, ?, ?)",
        (df["DT_GERACAO"].iloc[0], caminho.name, total_lido, len(df)),
    )
    conexao.commit()

    print(f"\nBanco gravado em {BANCO}")
    print(f"  candidatos:  {len(candidatos):>8,}")
    print(f"  fornecedores:{len(fornecedores):>8,}")
    print(f"  despesas:    {len(fato):>8,}")
    print(f"  total:       R$ {fato['valor'].sum():,.2f}")

    print("\nDespesa declarada por candidato:")
    consulta = """
        SELECT c.nm_candidato, c.sg_partido,
               COUNT(*) AS lancamentos,
               ROUND(SUM(f.valor), 2) AS total
        FROM fato_despesa f
        JOIN dim_candidato c ON c.sq_candidato = f.sq_candidato
        GROUP BY c.sq_candidato
        ORDER BY total DESC
    """
    for nome, partido, n, total in conexao.execute(consulta):
        print(f"  R$ {total:>16,.2f}  {n:>5} lanç.  {partido:<10} {nome}")

    conexao.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("Informe o caminho do CSV de despesas. Veja o README.")
    carregar(Path(sys.argv[1]))
