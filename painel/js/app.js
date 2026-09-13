/**
 * Camada de apresentação.
 * Conversa apenas com o objeto `Dados` (js/data.js) — nunca com o backend
 * diretamente. Na Sprint 2, trocar a implementação de Dados é suficiente.
 */

(function () {
  'use strict';

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const inteiro = new Intl.NumberFormat('pt-BR');

  const el = (id) => document.getElementById(id);

  const estado = {
    busca: '',
    partido: '',
    prestacao: '',
    ordenar: 'total',
    aberto: null,
    compararA: '',
    compararB: '',
  };

  function rotuloLancamentos(n) {
    return n === 1 ? '1 lançamento' : `${inteiro.format(n)} lançamentos`;
  }

  function dataBR(iso) {
    if (!iso) return '—';
    if (iso.includes('/')) return iso;
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  function candidatoTemPrestacao(candidato, tipo) {
    if (!tipo) return true;
    return candidato.prestacoes.some((p) => p.tipo === tipo);
  }

  function filtrar() {
    const termo = estado.busca.trim().toLowerCase();
    let lista = Dados.listarCandidatos().filter((c) => {
      if (estado.partido && c.sg_partido !== estado.partido) return false;
      if (!candidatoTemPrestacao(c, estado.prestacao)) return false;
      if (!termo) return true;
      const alvo = `${c.nm_candidato} ${c.nr_candidato} ${c.sg_partido} ${c.nm_partido}`.toLowerCase();
      return alvo.includes(termo);
    });

    lista.sort((a, b) => {
      if (estado.ordenar === 'nome') {
        return a.nm_candidato.localeCompare(b.nm_candidato, 'pt-BR');
      }
      if (estado.ordenar === 'lancamentos') {
        return b.lancamentos - a.lancamentos || b.total - a.total;
      }
      return b.total - a.total || a.nm_candidato.localeCompare(b.nm_candidato, 'pt-BR');
    });

    return lista;
  }

  function maximoBarra(lista) {
    return Math.max(0, ...lista.map((c) => c.total));
  }

  function desenharResumo() {
    const carga = Dados.obterCarga();
    el('resumoTotal').textContent = moeda.format(carga.total_declarado);
    el('resumoCandidatos').textContent = inteiro.format(carga.candidatos.length);
    el('resumoLancamentos').textContent = inteiro.format(carga.linhas_presidente);
    el('resumoGeracao').textContent = carga.dt_geracao_tse || '—';
    el('periodoDespesas').textContent =
      `${dataBR(carga.periodo_despesas.inicio)} a ${dataBR(carga.periodo_despesas.fim)}`;
  }

  function popularFiltros() {
    const partido = el('filtroPartido');
    Dados.listarPartidos().forEach((p) => {
      const opcao = document.createElement('option');
      opcao.value = p.sigla;
      opcao.textContent = `${p.sigla} — ${p.nome}`;
      partido.appendChild(opcao);
    });

    const prestacao = el('filtroPrestacao');
    Dados.listarTiposPrestacao().forEach((tipo) => {
      const opcao = document.createElement('option');
      opcao.value = tipo;
      opcao.textContent = tipo;
      prestacao.appendChild(opcao);
    });
  }

  function popularComparar() {
    [el('compararA'), el('compararB')].forEach((select) => {
      const atual = select.value;
      select.innerHTML = '<option value="">Selecione</option>';
      Dados.listarCandidatos()
        .slice()
        .sort((a, b) => a.nm_candidato.localeCompare(b.nm_candidato, 'pt-BR'))
        .forEach((c) => {
          const opcao = document.createElement('option');
          opcao.value = c.sq_candidato;
          opcao.textContent = `${c.nm_candidato} (${c.sg_partido})`;
          select.appendChild(opcao);
        });
      select.value = atual;
    });
  }

  function limparErrosComparacao() {
    ['erroComparar', 'erroCompararA', 'erroCompararB'].forEach((id) => {
      const no = el(id);
      no.hidden = true;
      no.textContent = '';
    });
    el('compararA').closest('.campo').classList.remove('campo--invalido');
    el('compararB').closest('.campo').classList.remove('campo--invalido');
  }

  function mostrarErro(idCampo, idErro, mensagem) {
    const erro = el(idErro);
    erro.hidden = false;
    erro.textContent = mensagem;
    if (idCampo) el(idCampo).closest('.campo').classList.add('campo--invalido');
  }

  function validarComparacao() {
    limparErrosComparacao();
    let ok = true;

    if (!estado.compararA) {
      mostrarErro('compararA', 'erroCompararA', 'Selecione o primeiro candidato.');
      ok = false;
    }
    if (!estado.compararB) {
      mostrarErro('compararB', 'erroCompararB', 'Selecione o segundo candidato.');
      ok = false;
    }
    if (estado.compararA && estado.compararB && estado.compararA === estado.compararB) {
      mostrarErro(null, 'erroComparar', 'Escolha dois candidatos diferentes.');
      ok = false;
    }
    return ok;
  }

  function origensAlinhadas(a, b) {
    const nomes = new Set([
      ...a.origens.map((o) => o.origem),
      ...b.origens.map((o) => o.origem),
    ]);
    const mapaA = Object.fromEntries(a.origens.map((o) => [o.origem, o.total]));
    const mapaB = Object.fromEntries(b.origens.map((o) => [o.origem, o.total]));
    return Array.from(nomes)
      .map((origem) => ({
        origem,
        a: mapaA[origem] || 0,
        b: mapaB[origem] || 0,
      }))
      .sort((x, y) => y.a + y.b - (x.a + x.b));
  }

  function desenharComparacao() {
    const caixa = el('resultadoComparacao');
    if (!validarComparacao()) {
      caixa.hidden = true;
      caixa.innerHTML = '';
      return;
    }

    const a = Dados.obterCandidato(estado.compararA);
    const b = Dados.obterCandidato(estado.compararB);
    const origens = origensAlinhadas(a, b).filter((o) => o.origem !== '#NULO');
    const tipoA = a.prestacoes.map((p) => p.tipo).join(', ') || '—';
    const tipoB = b.prestacoes.map((p) => p.tipo).join(', ') || '—';

    const linhas = origens
      .slice(0, 8)
      .map(
        (o) => `<tr>
          <td>${o.origem}</td>
          <td class="numero">${moeda.format(o.a)}</td>
          <td class="numero">${moeda.format(o.b)}</td>
        </tr>`
      )
      .join('');

    caixa.innerHTML = `
      <div class="comparacao__pares">
        <article>
          <h3>${a.nm_candidato}</h3>
          <p>${a.sg_partido} · nº ${a.nr_candidato} · ${tipoA}</p>
          <p class="comparacao__valor">${moeda.format(a.total)}</p>
          <p class="comparacao__meta">${rotuloLancamentos(a.lancamentos)}</p>
        </article>
        <article>
          <h3>${b.nm_candidato}</h3>
          <p>${b.sg_partido} · nº ${b.nr_candidato} · ${tipoB}</p>
          <p class="comparacao__valor">${moeda.format(b.total)}</p>
          <p class="comparacao__meta">${rotuloLancamentos(b.lancamentos)}</p>
        </article>
      </div>
      <table class="tabela-itens">
        <thead>
          <tr>
            <th>Origem da despesa</th>
            <th class="numero">A</th>
            <th class="numero">B</th>
          </tr>
        </thead>
        <tbody>${linhas || '<tr><td colspan="3">Sem origens para cruzar.</td></tr>'}</tbody>
      </table>
    `;
    caixa.hidden = false;
  }

  function desenharLista() {
    const lista = filtrar();
    const container = el('listaCandidatos');
    const max = maximoBarra(Dados.listarCandidatos());
    container.innerHTML = '';

    el('contagemLista').textContent =
      lista.length === 1
        ? '1 candidato neste recorte'
        : `${inteiro.format(lista.length)} candidatos neste recorte`;

    if (lista.length === 0) {
      const vazio = document.createElement('p');
      vazio.className = 'lista__vazia';
      vazio.textContent = 'Nenhum candidato neste filtro.';
      container.appendChild(vazio);
      return;
    }

    lista.forEach((c) => {
      const artigo = document.createElement('article');
      artigo.className = 'candidato';
      if (estado.aberto === c.sq_candidato) artigo.classList.add('candidato--aberto');

      const pct = max > 0 ? (c.total / max) * 100 : 0;
      const tipo = c.prestacoes.map((p) => p.tipo).join(', ') || '—';

      const topo = document.createElement('div');
      topo.className = 'candidato__topo';

      const identidade = document.createElement('div');
      identidade.innerHTML = `
        <p class="candidato__nome">${c.nm_candidato}</p>
        <p class="candidato__meta">nº ${c.nr_candidato} · ${c.sg_partido} · ${tipo}</p>
      `;

      const numeros = document.createElement('div');
      numeros.className = 'candidato__numeros';
      numeros.innerHTML = `
        <p class="candidato__valor">${moeda.format(c.total)}</p>
        <p class="candidato__meta">${rotuloLancamentos(c.lancamentos)}</p>
      `;

      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'expandir';
      botao.textContent = estado.aberto === c.sq_candidato ? 'Ocultar origens' : 'Ver origens';
      botao.setAttribute(
        'aria-expanded',
        estado.aberto === c.sq_candidato ? 'true' : 'false'
      );
      botao.addEventListener('click', () => {
        estado.aberto = estado.aberto === c.sq_candidato ? null : c.sq_candidato;
        desenharLista();
      });

      topo.append(identidade, numeros, botao);

      const barra = document.createElement('div');
      barra.className = 'barra';
      barra.setAttribute('aria-hidden', 'true');
      const preenchimento = document.createElement('span');
      preenchimento.style.width = `${pct}%`;
      barra.appendChild(preenchimento);

      artigo.append(topo, barra);

      if (estado.aberto === c.sq_candidato) {
        const detalhe = document.createElement('div');
        detalhe.className = 'candidato__detalhe';
        const origens = c.origens.filter((o) => o.origem !== '#NULO' || o.total > 0);
        const linhas = origens
          .map(
            (o) => `<tr>
              <td>${o.origem === '#NULO' ? 'Não informado' : o.origem}</td>
              <td class="numero">${inteiro.format(o.lancamentos)}</td>
              <td class="numero">${moeda.format(o.total)}</td>
            </tr>`
          )
          .join('');
        detalhe.innerHTML = `
          <table class="tabela-itens">
            <thead>
              <tr>
                <th>Origem</th>
                <th class="numero">Lanç.</th>
                <th class="numero">Valor</th>
              </tr>
            </thead>
            <tbody>${linhas}</tbody>
          </table>
        `;
        artigo.appendChild(detalhe);
      }

      container.appendChild(artigo);
    });
  }

  function ligarEventos() {
    el('busca').addEventListener('input', (e) => {
      estado.busca = e.target.value;
      desenharLista();
    });
    el('filtroPartido').addEventListener('change', (e) => {
      estado.partido = e.target.value;
      desenharLista();
    });
    el('filtroPrestacao').addEventListener('change', (e) => {
      estado.prestacao = e.target.value;
      desenharLista();
    });
    el('ordenar').addEventListener('change', (e) => {
      estado.ordenar = e.target.value;
      desenharLista();
    });
    el('compararA').addEventListener('change', (e) => {
      estado.compararA = e.target.value;
    });
    el('compararB').addEventListener('change', (e) => {
      estado.compararB = e.target.value;
    });
    el('botaoComparar').addEventListener('click', desenharComparacao);
    el('limparComparacao').addEventListener('click', () => {
      estado.compararA = '';
      estado.compararB = '';
      el('compararA').value = '';
      el('compararB').value = '';
      limparErrosComparacao();
      const caixa = el('resultadoComparacao');
      caixa.hidden = true;
      caixa.innerHTML = '';
    });
  }

  function iniciar() {
    desenharResumo();
    popularFiltros();
    popularComparar();
    ligarEventos();
    desenharLista();
  }

  iniciar();
})();
