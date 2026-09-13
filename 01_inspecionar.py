#!/usr/bin/env python3
"""
Passo 1 — Inspeção dos arquivos do TSE.

O TSE altera nomes de coluna entre eleições. Antes de escrever qualquer
transformação, este script abre os CSVs baixados e mostra o que existe de fato:
colunas, tipos, cardinalidade e uma amostra.

Uso:
    python scripts/01_inspecionar.py dados/brutos
"""

import sys
import zipfile
from pathlib import Path

import pandas as pd

ENCODINGS = ["latin-1", "utf-8-sig", "utf-8"]
SEPARADORES = [";", ","]


def ler_amostra(caminho_ou_buffer, nome, linhas=2000):
    """Tenta abrir o CSV variando encoding e separador até obter algo coerente."""
    for encoding in ENCODINGS:
        for sep in SEPARADORES:
            try:
                if hasattr(caminho_ou_buffer, "seek"):
                    caminho_ou_buffer.seek(0)
                df = pd.read_csv(
                    caminho_ou_buffer,
                    sep=sep,
                    encoding=encoding,
                    nrows=linhas,
                    dtype=str,
                    on_bad_lines="skip",
                )
                if df.shape[1] > 1:
                    print(f"    lido com encoding={encoding} sep='{sep}'")
                    return df
            except Exception:
                continue
    print(f"    !! não foi possível ler {nome}")
    return None


def descrever(df, nome):
    print(f"\n  {nome}")
    print(f"    {df.shape[1]} colunas · amostra de {len(df)} linhas")
    print("    colunas:")
    for coluna in df.columns:
        distintos = df[coluna].nunique(dropna=True)
        exemplo = df[coluna].dropna().iloc[0] if distintos else ""
        exemplo = str(exemplo)[:42]
        print(f"      {coluna:<38} {distintos:>6} distintos   ex.: {exemplo}")


def inspecionar(pasta: Path):
    arquivos = sorted(list(pasta.glob("*.zip")) + list(pasta.glob("*.csv")))

    if not arquivos:
        print(f"Nenhum .zip ou .csv encontrado em {pasta.resolve()}")
        print("Baixe os arquivos do TSE e coloque nessa pasta. Veja o README.")
        return

    for arquivo in arquivos:
        print(f"\n{'=' * 78}\n{arquivo.name}\n{'=' * 78}")

        if arquivo.suffix == ".zip":
            with zipfile.ZipFile(arquivo) as z:
                internos = [n for n in z.namelist() if n.lower().endswith((".csv", ".txt"))]
                print(f"  {len(internos)} arquivo(s) de dados dentro do zip")
                for nome in internos[:40]:
                    info = z.getinfo(nome)
                    print(f"    {nome}  ({info.file_size / 1_048_576:.1f} MB)")
                if len(internos) > 40:
                    print(f"    ... e mais {len(internos) - 40}")

                # Descreve apenas o primeiro, como referência de layout.
                if internos:
                    with z.open(internos[0]) as f:
                        df = ler_amostra(f, internos[0])
                    if df is not None:
                        descrever(df, internos[0])
        else:
            df = ler_amostra(arquivo, arquivo.name)
            if df is not None:
                descrever(df, arquivo.name)


if __name__ == "__main__":
    pasta = Path(sys.argv[1] if len(sys.argv) > 1 else "dados/brutos")
    inspecionar(pasta)
