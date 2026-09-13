/**
 * Camada de apresentação.
 * Conversa apenas com o objeto `Dados` (js/data.js) — nunca com o backend
 * diretamente. Na Sprint 2, trocar a implementação de `Dados` é suficiente.
 */

(function () {
  'use strict';

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const el = (id) => document.getElementById(id);

  const estado = {
    itens: [{ descricao: '', quantidade: '', valorUnitario: '' }],
    filtro: 'todas',
  };

  /* ----------------------------- Utilidades ----------------------------- */

  function totalRequisicao(itens) {
    return itens.reduce(
      (soma, item) => soma + (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0),
      0
    );
  }

  function dataBR(iso) {
    if (!iso) return '—';
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  function nomeCentroCusto(id) {
    const centro = Dados.listarCentrosCusto().find((c) => c.id === id);
    return centro ? centro.nome : id;
  }

  const ROTULO_SITUACAO = {
    pendente: 'Aguardando aprovação',
    aprovada: 'Aprovada',
    reprovada: 'Reprovada',
  };

  /* ------------------------- Carga inicial de selects ------------------------- */

  function popularSelects() {
    const centro = el('centroCusto');
    Dados.listarCentrosCusto().forEach((c) => {
      const opcao = document.createElement('option');
      opcao.value = c.id;
      opcao.textContent = `${c.id} — ${c.nome}`;
      centro.appendChild(opcao);
    });

    const categoria = el('categoria');
    Dados.listarCategorias().forEach((nome) => {
      const opcao = document.createElement('option');
      opcao.value = nome;
      opcao.textContent = nome;
      categoria.appendChild(opcao);
    });
  }

  /* ------------------------------ Itens ------------------------------ */

  function desenharItens() {
    const container = el('listaItens');
    container.innerHTML = '';

    if (estado.itens.length === 0) {
      const vazio = document.createElement('p');
      vazio.className = 'itens__vazio';
      vazio.textContent = 'Nenhum item adicionado. Toda requisição precisa de pelo menos um.';
      container.appendChild(vazio);
    } else {
      const rotulos = document.createElement('div');
      rotulos.className = 'item__rotulos';
      rotulos.innerHTML =
        '<span>Descrição</span><span>Qtd.</span><span>Valor unit.</span><span></span>';
      container.appendChild(rotulos);
    }

    estado.itens.forEach((item, indice) => {
      const linha = document.createElement('div');
      linha.className = 'item';

      const descricao = document.createElement('input');
      descricao.type = 'text';
      descricao.value = item.descricao;
      descricao.placeholder = 'O que será comprado';
      descricao.setAttribute('aria-label', `Descrição do item ${indice + 1}`);
      descricao.addEventListener('input', (e) => {
        estado.itens[indice].descricao = e.target.value;
      });

      const quantidade = document.createElement('input');
      quantidade.type = 'number';
      quantidade.min = '1';
      quantidade.step = '1';
      quantidade.value = item.quantidade;
      quantidade.placeholder = '0';
      quantidade.setAttribute('aria-label', `Quantidade do item ${indice + 1}`);
      quantidade.addEventListener('input', (e) => {
        estado.itens[indice].quantidade = e.target.value;
        atualizarTotalFormulario();
      });

      const valor = document.createElement('input');
      valor.type = 'number';
      valor.min = '0';
      valor.step = '0.01';
      valor.value = item.valorUnitario;
      valor.placeholder = '0,00';
      valor.setAttribute('aria-label', `Valor unitário do item ${indice + 1}`);
      valor.addEventListener('input', (e) => {
        estado.itens[indice].valorUnitario = e.target.value;
        atualizarTotalFormulario();
      });

      const remover = document.createElement('button');
      remover.type = 'button';
      remover.className = 'item__remover';
      remover.textContent = '×';
      remover.title = 'Remover item';
      remover.setAttribute('aria-label', `Remover item ${indice + 1}`);
      remover.addEventListener('click', () => {
        estado.itens.splice(indice, 1);
        desenharItens();
        atualizarTotalFormulario();
      });

      linha.append(descricao, quantidade, valor, remover);
      container.appendChild(linha);
    });
  }

  function atualizarTotalFormulario() {
    el('totalFormulario').textContent = moeda.format(totalRequisicao(estado.itens));
  }

  /* ---------------------------- Validação ---------------------------- */

  function marcarErro(idCampo, mensagem) {
    const campo = el(idCampo);
    const erro = el('erro' + idCampo.charAt(0).toUpperCase() + idCampo.slice(1));
    campo.closest('.campo').classList.add('campo--invalido');
    erro.textContent = mensagem;
    erro.hidden = false;
  }

  function limparErros() {
    document
      .querySelectorAll('.campo--invalido')
      .forEach((c) => c.classList.remove('campo--invalido'));
    document.querySelectorAll('.erro').forEach((e) => {
      e.hidden = true;
      e.textContent = '';
    });
  }

  function validar() {
    limparErros();
    let valido = true;

    const solicitante = el('solicitante').value.trim();
    if (solicitante.length < 3) {
      marcarErro('solicitante', 'Informe o nome do solicitante.');
      valido = false;
    }

    if (!el('centroCusto').value) {
      marcarErro('centroCusto', 'Escolha um centro de custo.');
      valido = false;
    }

    if (!el('categoria').value) {
      marcarErro('categoria', 'Escolha uma categoria.');
      valido = false;
    }

    const data = el('dataNecessidade').value;
    if (!data) {
      marcarErro('dataNecessidade', 'Informe a data em que a compra é necessária.');
      valido = false;
    } else if (data < new Date().toISOString().slice(0, 10)) {
      marcarErro('dataNecessidade', 'A data não pode ser anterior a hoje.');
      valido = false;
    }

    if (el('justificativa').value.trim().length < 10) {
      marcarErro('justificativa', 'Descreva a justificativa com pelo menos 10 caracteres.');
      valido = false;
    }

    const itensValidos = estado.itens.filter(
      (i) => i.descricao.trim() && Number(i.quantidade) > 0 && Number(i.valorUnitario) > 0
    );

    if (itensValidos.length === 0) {
      const erro = el('erroItens');
      erro.textContent = 'Adicione ao menos um item com descrição, quantidade e valor.';
      erro.hidden = false;
      valido = false;
    }

    return { valido, itensValidos };
  }

  /* ---------------------------- Envio ---------------------------- */

  function enviar() {
    const { valido, itensValidos } = validar();
    if (!valido) {
      document.querySelector('.campo--invalido, .erro:not([hidden])')?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
      return;
    }

    const nova = Dados.criarRequisicao({
      solicitante: el('solicitante').value.trim(),
      centroCusto: el('centroCusto').value,
      categoria: el('categoria').value,
      dataNecessidade: el('dataNecessidade').value,
      justificativa: el('justificativa').value.trim(),
      itens: itensValidos.map((i) => ({
        descricao: i.descricao.trim(),
        quantidade: Number(i.quantidade),
        valorUnitario: Number(i.valorUnitario),
      })),
    });

    const aviso = el('confirmacao');
    aviso.innerHTML = `Requisição <strong>${nova.numero}</strong> enviada para aprovação — ${moeda.format(
      totalRequisicao(nova.itens)
    )}.`;
    aviso.hidden = false;

    limpar(false);
    desenharLista();
    atualizarResumo();
  }

  function limpar(esconderAviso = true) {
    ['solicitante', 'centroCusto', 'categoria', 'dataNecessidade', 'justificativa'].forEach(
      (id) => (el(id).value = '')
    );
    estado.itens = [{ descricao: '', quantidade: '', valorUnitario: '' }];
    limparErros();
    desenharItens();
    atualizarTotalFormulario();
    if (esconderAviso) el('confirmacao').hidden = true;
  }

  /* ---------------------------- Listagem ---------------------------- */

  function desenharLista() {
    const container = el('listaRequisicoes');
    container.innerHTML = '';

    const requisicoes = Dados.listarRequisicoes().filter(
      (r) => estado.filtro === 'todas' || r.status === estado.filtro
    );

    if (requisicoes.length === 0) {
      const vazio = document.createElement('p');
      vazio.className = 'lista__vazia';
      vazio.textContent = 'Nenhuma requisição nesta situação.';
      container.appendChild(vazio);
      return;
    }

    requisicoes.forEach((r) => container.appendChild(montarLinha(r)));
  }

  function montarLinha(r) {
    const bloco = document.createElement('article');
    bloco.className = `requisicao requisicao--${r.status}`;

    const topo = document.createElement('div');
    topo.className = 'requisicao__topo';

    const identificacao = document.createElement('div');
    identificacao.innerHTML = `
      <div class="requisicao__numero">${r.numero}</div>
      <div class="requisicao__meta">Aberta em ${dataBR(r.criadaEm)}</div>`;

    const resumo = document.createElement('div');
    resumo.className = 'requisicao__resumo';
    resumo.innerHTML = `
      <div class="requisicao__solicitante">${r.solicitante}</div>
      <div class="requisicao__meta">${nomeCentroCusto(r.centroCusto)} · ${r.categoria}</div>`;

    const valor = document.createElement('div');
    valor.className = 'requisicao__valor';
    valor.textContent = moeda.format(totalRequisicao(r.itens));

    const situacao = document.createElement('span');
    situacao.className = `situacao situacao--${r.status}`;
    situacao.textContent = ROTULO_SITUACAO[r.status];

    topo.append(identificacao, resumo, valor, situacao);

    const detalhe = document.createElement('div');
    detalhe.className = 'requisicao__detalhe';
    detalhe.hidden = true;
    detalhe.innerHTML = `
      <p class="requisicao__justificativa">
        <strong>Necessário até ${dataBR(r.dataNecessidade)}.</strong> ${r.justificativa}
      </p>
      <table class="tabela-itens">
        <thead>
          <tr>
            <th>Item</th>
            <th class="numero">Qtd.</th>
            <th class="numero">Valor unit.</th>
            <th class="numero">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${r.itens
            .map(
              (i) => `
            <tr>
              <td>${i.descricao}</td>
              <td class="numero">${i.quantidade}</td>
              <td class="numero">${moeda.format(i.valorUnitario)}</td>
              <td class="numero">${moeda.format(i.quantidade * i.valorUnitario)}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>`;

    const expandir = document.createElement('button');
    expandir.type = 'button';
    expandir.className = 'expandir';
    expandir.textContent = 'Ver itens';
    expandir.setAttribute('aria-expanded', 'false');
    expandir.addEventListener('click', () => {
      const aberto = !detalhe.hidden;
      detalhe.hidden = aberto;
      expandir.textContent = aberto ? 'Ver itens' : 'Ocultar itens';
      expandir.setAttribute('aria-expanded', String(!aberto));
    });

    topo.appendChild(expandir);
    bloco.append(topo, detalhe);
    return bloco;
  }

  function atualizarResumo() {
    const pendentes = Dados.listarRequisicoes().filter((r) => r.status === 'pendente');
    el('resumoPendentes').textContent = String(pendentes.length);
    el('resumoValor').textContent = moeda.format(
      pendentes.reduce((soma, r) => soma + totalRequisicao(r.itens), 0)
    );
  }

  /* ---------------------------- Ligações ---------------------------- */

  function ligarEventos() {
    el('adicionarItem').addEventListener('click', () => {
      estado.itens.push({ descricao: '', quantidade: '', valorUnitario: '' });
      desenharItens();
      el('listaItens').querySelector('.item:last-child input')?.focus();
    });

    el('enviarRequisicao').addEventListener('click', enviar);
    el('limparFormulario').addEventListener('click', () => limpar());

    document.querySelectorAll('.filtro').forEach((botao) => {
      botao.addEventListener('click', () => {
        document.querySelectorAll('.filtro').forEach((b) => b.classList.remove('filtro--ativo'));
        botao.classList.add('filtro--ativo');
        estado.filtro = botao.dataset.filtro;
        desenharLista();
      });
    });
  }

  /* ---------------------------- Início ---------------------------- */

  popularSelects();
  desenharItens();
  atualizarTotalFormulario();
  desenharLista();
  atualizarResumo();
  ligarEventos();
})();
