/**
 * Camada de dados (mock).
 *
 * Na Sprint 1 os dados vivem em memória, neste arquivo.
 * Na Sprint 2 apenas as funções abaixo mudam: cada uma passa a fazer
 * fetch() para a API em Python/Node. A tela (app.js) não muda uma linha.
 */

const CENTROS_CUSTO = [
  { id: 'TI-001', nome: 'Tecnologia da Informação' },
  { id: 'ADM-002', nome: 'Administrativo' },
  { id: 'COM-003', nome: 'Comercial' },
  { id: 'OPE-004', nome: 'Operações' },
  { id: 'RH-005', nome: 'Recursos Humanos' },
];

const CATEGORIAS = [
  'Material de escritório',
  'Equipamentos de TI',
  'Serviços de terceiros',
  'Licenças de software',
  'Manutenção predial',
  'Viagens e hospedagem',
];

/** Requisições que já existem no sistema quando a tela abre. */
const REQUISICOES_INICIAIS = [
  {
    numero: 'REQ-2026-0141',
    solicitante: 'Marina Duarte',
    centroCusto: 'TI-001',
    categoria: 'Equipamentos de TI',
    justificativa: 'Substituição de 4 notebooks com mais de 5 anos de uso.',
    dataNecessidade: '2026-09-30',
    status: 'aprovada',
    criadaEm: '2026-09-02',
    itens: [
      { descricao: 'Notebook 16GB RAM / 512GB SSD', quantidade: 4, valorUnitario: 4890.0 },
      { descricao: 'Docking station USB-C', quantidade: 4, valorUnitario: 720.5 },
    ],
  },
  {
    numero: 'REQ-2026-0142',
    solicitante: 'Rafael Nogueira',
    centroCusto: 'OPE-004',
    categoria: 'Manutenção predial',
    justificativa: 'Troca do sistema de iluminação do galpão 2 por LED.',
    dataNecessidade: '2026-10-15',
    status: 'pendente',
    criadaEm: '2026-09-08',
    itens: [
      { descricao: 'Luminária LED industrial 150W', quantidade: 32, valorUnitario: 289.9 },
      { descricao: 'Serviço de instalação (diária)', quantidade: 3, valorUnitario: 1200.0 },
    ],
  },
  {
    numero: 'REQ-2026-0143',
    solicitante: 'Camila Prado',
    centroCusto: 'COM-003',
    categoria: 'Viagens e hospedagem',
    justificativa: 'Visita a cliente em Recife para fechamento de contrato.',
    dataNecessidade: '2026-09-22',
    status: 'pendente',
    criadaEm: '2026-09-09',
    itens: [
      { descricao: 'Passagem aérea SP–REC ida e volta', quantidade: 2, valorUnitario: 1340.0 },
      { descricao: 'Diária de hotel', quantidade: 6, valorUnitario: 410.0 },
    ],
  },
  {
    numero: 'REQ-2026-0144',
    solicitante: 'Douglas Ferraz',
    centroCusto: 'ADM-002',
    categoria: 'Material de escritório',
    justificativa: 'Reposição de estoque do almoxarifado para o 4º trimestre.',
    dataNecessidade: '2026-09-25',
    status: 'reprovada',
    criadaEm: '2026-09-05',
    itens: [{ descricao: 'Resma de papel A4 (caixa com 10)', quantidade: 15, valorUnitario: 268.0 }],
  },
];

/* ---------- API local (mesma assinatura que a API real terá na Sprint 2) ---------- */

let _requisicoes = REQUISICOES_INICIAIS.map((r) => ({ ...r }));
let _sequencia = 144;

const Dados = {
  listarCentrosCusto: () => CENTROS_CUSTO,

  listarCategorias: () => CATEGORIAS,

  listarRequisicoes: () => _requisicoes.map((r) => ({ ...r })),

  proximoNumero() {
    _sequencia += 1;
    return `REQ-2026-${String(_sequencia).padStart(4, '0')}`;
  },

  criarRequisicao(dados) {
    const nova = {
      ...dados,
      numero: this.proximoNumero(),
      status: 'pendente',
      criadaEm: new Date().toISOString().slice(0, 10),
    };
    _requisicoes = [nova, ..._requisicoes];
    return nova;
  },

  alterarStatus(numero, status) {
    _requisicoes = _requisicoes.map((r) => (r.numero === numero ? { ...r, status } : r));
    return _requisicoes.find((r) => r.numero === numero);
  },
};
