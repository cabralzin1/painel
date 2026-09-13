/**
 * Camada de dados (Sprint 1).
 *
 * Os números abaixo são um recorte agregado do arquivo
 * despesas_contratadas_candidatos_2026_BRASIL.csv (TSE),
 * filtrado por CD_CARGO = 1 (Presidente). Todas as linhas foram
 * mantidas: SQ_DESPESA não é chave única, e os dois tipos de
 * prestação (Relatório Financeiro e Parcial) não se sobrepõem.
 *
 * Na Sprint 2 apenas as funções de Dados mudam: cada uma passa a
 * fazer fetch() para a API. A tela (app.js) não muda uma linha.
 */

const CARGA = {
  "fonte": "Portal de Dados Abertos do TSE — Prestação de Contas Eleitorais 2026",
  "arquivo": "despesas_contratadas_candidatos_2026_BRASIL.csv",
  "dt_geracao_tse": "12/09/2026",
  "linhas_arquivo": 256862,
  "linhas_presidente": 1017,
  "total_declarado": 100282585.58,
  "periodo_despesas": {
    "inicio": "2026-08-01",
    "fim": "2026-09-10"
  },
  "ressalva": "Despesa contratada declarada até a data da carga. Não é o gasto total da campanha.",
  "candidatos": [
    {
      "sq_candidato": "280002551544",
      "nm_candidato": "FLAVIO NANTES BOLSONARO",
      "nr_candidato": "22",
      "sg_partido": "PL",
      "nm_partido": "PARTIDO LIBERAL",
      "nr_partido": "22",
      "lancamentos": 145,
      "total": 55258532.43,
      "origens": [
        {
          "origem": "Serviços prestados por terceiros",
          "lancamentos": 19,
          "total": 41586956.69
        },
        {
          "origem": "Serviços advocatícios",
          "lancamentos": 2,
          "total": 3335000.0
        },
        {
          "origem": "Publicidade por adesivos",
          "lancamentos": 11,
          "total": 2942080.0
        },
        {
          "origem": "Despesas com transporte ou deslocamento",
          "lancamentos": 9,
          "total": 2841928.05
        },
        {
          "origem": "Serviços contábeis",
          "lancamentos": 1,
          "total": 1025000.0
        },
        {
          "origem": "Despesa com Impulsionamento de Conteúdos",
          "lancamentos": 10,
          "total": 900000.0
        },
        {
          "origem": "Pesquisas ou testes eleitorais",
          "lancamentos": 1,
          "total": 765000.0
        },
        {
          "origem": "Locação/cessão de bens imóveis",
          "lancamentos": 3,
          "total": 674843.26
        },
        {
          "origem": "Eventos de promoção da candidatura",
          "lancamentos": 1,
          "total": 433151.6
        },
        {
          "origem": "Despesas com pessoal",
          "lancamentos": 9,
          "total": 380026.99
        },
        {
          "origem": "Locação/cessão de bens móveis (exceto veículos)",
          "lancamentos": 2,
          "total": 174968.43
        },
        {
          "origem": "Despesas com Hospedagem",
          "lancamentos": 28,
          "total": 159803.12
        },
        {
          "origem": "Publicidade por materiais impressos",
          "lancamentos": 19,
          "total": 35754.0
        },
        {
          "origem": "Materiais de expediente",
          "lancamentos": 6,
          "total": 2539.74
        },
        {
          "origem": "Diversas a especificar",
          "lancamentos": 6,
          "total": 728.15
        },
        {
          "origem": "Alimentação",
          "lancamentos": 2,
          "total": 696.9
        },
        {
          "origem": "Encargos financeiros, taxas bancárias e/ou op. cartão de crédito",
          "lancamentos": 16,
          "total": 55.5
        }
      ],
      "prestacoes": [
        {
          "tipo": "Relatório Financeiro",
          "lancamentos": 145,
          "total": 55258532.43
        }
      ]
    },
    {
      "sq_candidato": "280002551932",
      "nm_candidato": "RONALDO RAMOS CAIADO",
      "nr_candidato": "55",
      "sg_partido": "PSD",
      "nm_partido": "PARTIDO SOCIAL DEMOCRÁTICO",
      "nr_partido": "55",
      "lancamentos": 55,
      "total": 24144034.99,
      "origens": [
        {
          "origem": "Serviços prestados por terceiros",
          "lancamentos": 3,
          "total": 11195000.0
        },
        {
          "origem": "Produção de programas de rádio, televisão ou vídeo",
          "lancamentos": 1,
          "total": 10000000.0
        },
        {
          "origem": "Despesas com transporte ou deslocamento",
          "lancamentos": 17,
          "total": 1132469.73
        },
        {
          "origem": "Serviços advocatícios",
          "lancamentos": 2,
          "total": 925000.0
        },
        {
          "origem": "Serviços contábeis",
          "lancamentos": 1,
          "total": 270000.0
        },
        {
          "origem": "Locação/cessão de bens imóveis",
          "lancamentos": 2,
          "total": 202288.0
        },
        {
          "origem": "Despesa com Impulsionamento de Conteúdos",
          "lancamentos": 2,
          "total": 156700.0
        },
        {
          "origem": "Publicidade por materiais impressos",
          "lancamentos": 5,
          "total": 123805.0
        },
        {
          "origem": "Produção de jingles, vinhetas e slogans",
          "lancamentos": 1,
          "total": 100000.0
        },
        {
          "origem": "Despesas com Hospedagem",
          "lancamentos": 3,
          "total": 13340.72
        },
        {
          "origem": "Despesas com pessoal",
          "lancamentos": 4,
          "total": 12000.0
        },
        {
          "origem": "Passagem Aérea",
          "lancamentos": 4,
          "total": 10955.2
        },
        {
          "origem": "Locação/cessão de bens móveis (exceto veículos)",
          "lancamentos": 1,
          "total": 1913.8
        },
        {
          "origem": "Aquisição/Doação de bens móveis ou imóveis",
          "lancamentos": 2,
          "total": 467.34
        },
        {
          "origem": "Encargos financeiros, taxas bancárias e/ou op. cartão de crédito",
          "lancamentos": 7,
          "total": 95.2
        }
      ],
      "prestacoes": [
        {
          "tipo": "Parcial",
          "lancamentos": 55,
          "total": 24144034.99
        }
      ]
    },
    {
      "sq_candidato": "280002542548",
      "nm_candidato": "LUIZ INACIO LULA DA SILVA",
      "nr_candidato": "13",
      "sg_partido": "PT",
      "nm_partido": "PARTIDO DOS TRABALHADORES",
      "nr_partido": "13",
      "lancamentos": 440,
      "total": 15468711.14,
      "origens": [
        {
          "origem": "Serviços prestados por terceiros",
          "lancamentos": 76,
          "total": 8919595.36
        },
        {
          "origem": "Publicidade por adesivos",
          "lancamentos": 75,
          "total": 2833068.66
        },
        {
          "origem": "Publicidade por materiais impressos",
          "lancamentos": 91,
          "total": 2823480.48
        },
        {
          "origem": "Passagem Aérea",
          "lancamentos": 194,
          "total": 654926.16
        },
        {
          "origem": "Eventos de promoção da candidatura",
          "lancamentos": 1,
          "total": 231341.0
        },
        {
          "origem": "Taxa de Administração de Financiamento Coletivo",
          "lancamentos": 3,
          "total": 6299.48
        }
      ],
      "prestacoes": [
        {
          "tipo": "Relatório Financeiro",
          "lancamentos": 440,
          "total": 15468711.14
        }
      ]
    },
    {
      "sq_candidato": "280002539826",
      "nm_candidato": "ROMEU ZEMA NETO",
      "nr_candidato": "30",
      "sg_partido": "NOVO",
      "nm_partido": "PARTIDO NOVO",
      "nr_partido": "30",
      "lancamentos": 153,
      "total": 3338055.19,
      "origens": [
        {
          "origem": "Serviços prestados por terceiros",
          "lancamentos": 36,
          "total": 2230960.0
        },
        {
          "origem": "Serviços advocatícios",
          "lancamentos": 2,
          "total": 300000.0
        },
        {
          "origem": "Produção de programas de rádio, televisão ou vídeo",
          "lancamentos": 9,
          "total": 196500.0
        },
        {
          "origem": "Publicidade por adesivos",
          "lancamentos": 14,
          "total": 172063.0
        },
        {
          "origem": "Serviços contábeis",
          "lancamentos": 1,
          "total": 100000.0
        },
        {
          "origem": "Locação/cessão de bens móveis (exceto veículos)",
          "lancamentos": 3,
          "total": 99550.0
        },
        {
          "origem": "Despesas com pessoal",
          "lancamentos": 5,
          "total": 82900.0
        },
        {
          "origem": "Produção de jingles, vinhetas e slogans",
          "lancamentos": 4,
          "total": 73600.0
        },
        {
          "origem": "Publicidade por materiais impressos",
          "lancamentos": 1,
          "total": 29600.0
        },
        {
          "origem": "Despesas com Hospedagem",
          "lancamentos": 20,
          "total": 15006.0
        },
        {
          "origem": "Serviços próprios prestados por terceiros",
          "lancamentos": 3,
          "total": 14600.0
        },
        {
          "origem": "Segurança e prevenção, repressão e combate à violência política",
          "lancamentos": 1,
          "total": 10320.19
        },
        {
          "origem": "Despesas com transporte ou deslocamento",
          "lancamentos": 2,
          "total": 7508.0
        },
        {
          "origem": "Materiais de expediente",
          "lancamentos": 26,
          "total": 4108.5
        },
        {
          "origem": "Alimentação",
          "lancamentos": 4,
          "total": 1291.0
        },
        {
          "origem": "Encargos financeiros, taxas bancárias e/ou op. cartão de crédito",
          "lancamentos": 22,
          "total": 48.5
        }
      ],
      "prestacoes": [
        {
          "tipo": "Relatório Financeiro",
          "lancamentos": 153,
          "total": 3338055.19
        }
      ]
    },
    {
      "sq_candidato": "280002540694",
      "nm_candidato": "RENAN ANTONIO FERREIRA DOS SANTOS",
      "nr_candidato": "14",
      "sg_partido": "MISSÃO",
      "nm_partido": "PARTIDO MISSÃO",
      "nr_partido": "14",
      "lancamentos": 144,
      "total": 858504.61,
      "origens": [
        {
          "origem": "Publicidade por adesivos",
          "lancamentos": 7,
          "total": 193080.94
        },
        {
          "origem": "Publicidade por materiais impressos",
          "lancamentos": 3,
          "total": 134527.45
        },
        {
          "origem": "Serviços advocatícios",
          "lancamentos": 1,
          "total": 125000.0
        },
        {
          "origem": "Serviços próprios prestados por terceiros",
          "lancamentos": 12,
          "total": 88000.0
        },
        {
          "origem": "Despesas com transporte ou deslocamento",
          "lancamentos": 5,
          "total": 65798.13
        },
        {
          "origem": "Serviços contábeis",
          "lancamentos": 1,
          "total": 65000.0
        },
        {
          "origem": "Eventos de promoção da candidatura",
          "lancamentos": 12,
          "total": 44335.0
        },
        {
          "origem": "Produção de programas de rádio, televisão ou vídeo",
          "lancamentos": 17,
          "total": 42671.55
        },
        {
          "origem": "Serviços prestados por terceiros",
          "lancamentos": 16,
          "total": 37588.0
        },
        {
          "origem": "Taxa de Administração de Financiamento Coletivo",
          "lancamentos": 6,
          "total": 23460.8
        },
        {
          "origem": "Despesas com Hospedagem",
          "lancamentos": 5,
          "total": 12055.75
        },
        {
          "origem": "Diversas a especificar",
          "lancamentos": 8,
          "total": 9467.66
        },
        {
          "origem": "Segurança e prevenção, repressão e combate à violência política",
          "lancamentos": 2,
          "total": 8000.0
        },
        {
          "origem": "Despesas com pessoal",
          "lancamentos": 1,
          "total": 8000.0
        },
        {
          "origem": "Água",
          "lancamentos": 2,
          "total": 1105.0
        },
        {
          "origem": "Alimentação",
          "lancamentos": 4,
          "total": 276.0
        },
        {
          "origem": "Encargos financeiros, taxas bancárias e/ou op. cartão de crédito",
          "lancamentos": 42,
          "total": 138.33
        }
      ],
      "prestacoes": [
        {
          "tipo": "Relatório Financeiro",
          "lancamentos": 144,
          "total": 858504.61
        }
      ]
    },
    {
      "sq_candidato": "280002548139",
      "nm_candidato": "WILSON GRASSI JUNIOR",
      "nr_candidato": "35",
      "sg_partido": "DEMOCRATA",
      "nm_partido": "DEMOCRATA",
      "nr_partido": "35",
      "lancamentos": 18,
      "total": 488778.65,
      "origens": [
        {
          "origem": "Diversas a especificar",
          "lancamentos": 1,
          "total": 250000.0
        },
        {
          "origem": "Despesa com Impulsionamento de Conteúdos",
          "lancamentos": 6,
          "total": 165000.0
        },
        {
          "origem": "Serviços advocatícios",
          "lancamentos": 1,
          "total": 54000.0
        },
        {
          "origem": "Publicidade por materiais impressos",
          "lancamentos": 2,
          "total": 12120.0
        },
        {
          "origem": "Passagem Aérea",
          "lancamentos": 1,
          "total": 3546.25
        },
        {
          "origem": "Serviços prestados por terceiros",
          "lancamentos": 2,
          "total": 2100.0
        },
        {
          "origem": "Despesas com pessoal",
          "lancamentos": 1,
          "total": 1950.0
        },
        {
          "origem": "Encargos financeiros, taxas bancárias e/ou op. cartão de crédito",
          "lancamentos": 3,
          "total": 39.0
        },
        {
          "origem": "Materiais de expediente",
          "lancamentos": 1,
          "total": 23.4
        }
      ],
      "prestacoes": [
        {
          "tipo": "Relatório Financeiro",
          "lancamentos": 18,
          "total": 488778.65
        }
      ]
    },
    {
      "sq_candidato": "280002541457",
      "nm_candidato": "HERTZ DA CONCEICAO DIAS",
      "nr_candidato": "16",
      "sg_partido": "PSTU",
      "nm_partido": "PARTIDO SOCIALISTA  DOS TRABALHADORES UNIFICADO",
      "nr_partido": "16",
      "lancamentos": 15,
      "total": 453107.78,
      "origens": [
        {
          "origem": "Publicidade por adesivos",
          "lancamentos": 2,
          "total": 141500.0
        },
        {
          "origem": "Serviços advocatícios",
          "lancamentos": 1,
          "total": 135000.0
        },
        {
          "origem": "Publicidade por materiais impressos",
          "lancamentos": 2,
          "total": 42700.0
        },
        {
          "origem": "Pesquisas ou testes eleitorais",
          "lancamentos": 1,
          "total": 40000.0
        },
        {
          "origem": "Serviços contábeis",
          "lancamentos": 1,
          "total": 35000.0
        },
        {
          "origem": "Serviços prestados por terceiros",
          "lancamentos": 1,
          "total": 35000.0
        },
        {
          "origem": "Despesa com Impulsionamento de Conteúdos",
          "lancamentos": 2,
          "total": 18000.0
        },
        {
          "origem": "Correspondências e despesas postais",
          "lancamentos": 3,
          "total": 5903.78
        },
        {
          "origem": "Encargos financeiros, taxas bancárias e/ou op. cartão de crédito",
          "lancamentos": 2,
          "total": 4.0
        }
      ],
      "prestacoes": [
        {
          "tipo": "Relatório Financeiro",
          "lancamentos": 15,
          "total": 453107.78
        }
      ]
    },
    {
      "sq_candidato": "280002551547",
      "nm_candidato": "AUGUSTO JORGE CURY",
      "nr_candidato": "70",
      "sg_partido": "AVANTE",
      "nm_partido": "AVANTE",
      "nr_partido": "70",
      "lancamentos": 39,
      "total": 265153.77,
      "origens": [
        {
          "origem": "Despesa com Impulsionamento de Conteúdos",
          "lancamentos": 3,
          "total": 120000.0
        },
        {
          "origem": "Serviços prestados por terceiros",
          "lancamentos": 4,
          "total": 78000.0
        },
        {
          "origem": "Produção de programas de rádio, televisão ou vídeo",
          "lancamentos": 7,
          "total": 34349.0
        },
        {
          "origem": "Despesas com Hospedagem",
          "lancamentos": 11,
          "total": 16293.3
        },
        {
          "origem": "Serviços contábeis",
          "lancamentos": 1,
          "total": 15000.0
        },
        {
          "origem": "Alimentação",
          "lancamentos": 1,
          "total": 958.1
        },
        {
          "origem": "Combustíveis e lubrificantes",
          "lancamentos": 1,
          "total": 376.87
        },
        {
          "origem": "Publicidade por materiais impressos",
          "lancamentos": 3,
          "total": 168.0
        },
        {
          "origem": "Encargos financeiros, taxas bancárias e/ou op. cartão de crédito",
          "lancamentos": 8,
          "total": 8.5
        }
      ],
      "prestacoes": [
        {
          "tipo": "Parcial",
          "lancamentos": 39,
          "total": 265153.77
        }
      ]
    },
    {
      "sq_candidato": "280002551975",
      "nm_candidato": "EDMILSON SILVA COSTA",
      "nr_candidato": "21",
      "sg_partido": "PCB",
      "nm_partido": "PARTIDO COMUNISTA BRASILEIRO",
      "nr_partido": "21",
      "lancamentos": 5,
      "total": 7569.72,
      "origens": [
        {
          "origem": "Serviços advocatícios",
          "lancamentos": 1,
          "total": 6000.0
        },
        {
          "origem": "Publicidade por materiais impressos",
          "lancamentos": 3,
          "total": 1290.0
        },
        {
          "origem": "Taxa de Administração de Financiamento Coletivo",
          "lancamentos": 1,
          "total": 279.72
        }
      ],
      "prestacoes": [
        {
          "tipo": "Relatório Financeiro",
          "lancamentos": 5,
          "total": 7569.72
        }
      ]
    },
    {
      "sq_candidato": "280002552487",
      "nm_candidato": "RUI COSTA PIMENTA",
      "nr_candidato": "29",
      "sg_partido": "PCO",
      "nm_partido": "PARTIDO DA CAUSA OPERÁRIA",
      "nr_partido": "29",
      "lancamentos": 1,
      "total": 137.3,
      "origens": [
        {
          "origem": "Taxa de Administração de Financiamento Coletivo",
          "lancamentos": 1,
          "total": 137.3
        }
      ],
      "prestacoes": [
        {
          "tipo": "Relatório Financeiro",
          "lancamentos": 1,
          "total": 137.3
        }
      ]
    },
    {
      "sq_candidato": "280002552484",
      "nm_candidato": "CLARIANA ZACARKIM BARAO",
      "nr_candidato": "27",
      "sg_partido": "DC",
      "nm_partido": "DEMOCRACIA CRISTÃ",
      "nr_partido": "27",
      "lancamentos": 1,
      "total": 0.0,
      "origens": [
        {
          "origem": "#NULO",
          "lancamentos": 1,
          "total": 0.0
        }
      ],
      "prestacoes": [
        {
          "tipo": "Relatório Financeiro",
          "lancamentos": 1,
          "total": 0.0
        }
      ]
    },
    {
      "sq_candidato": "280002553884",
      "nm_candidato": "PABLO HENRIQUE COSTA MARCAL",
      "nr_candidato": "28",
      "sg_partido": "PRTB",
      "nm_partido": "PARTIDO RENOVADOR TRABALHISTA BRASILEIRO",
      "nr_partido": "28",
      "lancamentos": 1,
      "total": 0.0,
      "origens": [
        {
          "origem": "#NULO",
          "lancamentos": 1,
          "total": 0.0
        }
      ],
      "prestacoes": [
        {
          "tipo": "Relatório Financeiro",
          "lancamentos": 1,
          "total": 0.0
        }
      ]
    }
  ]
};

const Dados = {
  obterCarga() {
    return CARGA;
  },

  listarCandidatos() {
    return CARGA.candidatos.slice();
  },

  obterCandidato(sq) {
    return CARGA.candidatos.find((c) => c.sq_candidato === sq) || null;
  },

  listarPartidos() {
    const vistos = new Map();
    CARGA.candidatos.forEach((c) => {
      if (!vistos.has(c.sg_partido)) {
        vistos.set(c.sg_partido, c.nm_partido);
      }
    });
    return Array.from(vistos, ([sigla, nome]) => ({ sigla, nome })).sort((a, b) =>
      a.sigla.localeCompare(b.sigla, 'pt-BR')
    );
  },

  listarTiposPrestacao() {
    const tipos = new Set();
    CARGA.candidatos.forEach((c) => {
      c.prestacoes.forEach((p) => tipos.add(p.tipo));
    });
    return Array.from(tipos).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  },

  listarOrigens() {
    const origens = new Set();
    CARGA.candidatos.forEach((c) => {
      c.origens.forEach((o) => {
        if (o.origem && o.origem !== '#NULO') origens.add(o.origem);
      });
    });
    return Array.from(origens).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  },
};
