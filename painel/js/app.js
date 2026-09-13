/**
 * Camada de apresentação.
 * Conversa apenas com o objeto `Dados` (js/data.js).
 */

(function () {
  'use strict';

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const inteiro = new Intl.NumberFormat('pt-BR');
  const AZUIS = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#0ea5e9', '#0284c7', '#1e3a8a', '#38bdf8'];
  const MESES = { '01': 'jan', '02': 'fev', '03': 'mar', '04': 'abr', '05': 'mai', '06': 'jun', '07': 'jul', '08': 'ago', '09': 'set', '10': 'out', '11': 'nov', '12': 'dez' };

  const el = (id) => document.getElementById(id);
  const graficos = {};

  const estado = {
    view: 'visao',
    busca: '',
    partido: '',
    prestacao: '',
    tipoGrafico: 'horizontalBar',
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

  function eixoReais(valor) {
    if (Math.abs(valor) >= 1e6) {
      return (valor / 1e6).toFixed(1).replace('.', ',') + ' mi';
    }
    if (Math.abs(valor) >= 1e3) {
      return (valor / 1e3).toFixed(0) + ' mil';
    }
    return String(valor);
  }

  function candidatoTemPrestacao(candidato, tipo) {
    if (!tipo) return true;
    return candidato.prestacoes.some((p) => p.tipo === tipo);
  }

  function filtrar() {
    const termo = estado.busca.trim().toLowerCase();
    return Dados.listarCandidatos()
      .filter((c) => {
        if (estado.partido && c.sg_partido !== estado.partido) return false;
        if (!candidatoTemPrestacao(c, estado.prestacao)) return false;
        if (!termo) return true;
        const alvo = `${c.nm_candidato} ${c.nr_candidato} ${c.sg_partido} ${c.nm_partido}`.toLowerCase();
        return alvo.includes(termo);
      })
      .sort((a, b) => b.total - a.total || a.nm_candidato.localeCompare(b.nm_candidato, 'pt-BR'));
  }

  function rotuloCandidato(c) {
    return c.nm_candidato.split(' ').slice(0, 2).join(' ');
  }

  function origensDoRecorte(lista) {
    const mapa = new Map();
    lista.forEach((c) => {
      c.origens.forEach((o) => {
        if (!o.origem || o.origem === '#NULO') return;
        const atual = mapa.get(o.origem) || { origem: o.origem, total: 0, lancamentos: 0 };
        atual.total += o.total;
        atual.lancamentos += o.lancamentos;
        mapa.set(o.origem, atual);
      });
    });
    return Array.from(mapa.values()).sort((a, b) => b.total - a.total);
  }

  function partidosDoRecorte(lista) {
    const mapa = new Map();
    lista.forEach((c) => {
      const atual = mapa.get(c.sg_partido) || { sigla: c.sg_partido, total: 0 };
      atual.total += c.total;
      mapa.set(c.sg_partido, atual);
    });
    return Array.from(mapa.values()).sort((a, b) => b.total - a.total);
  }

  function padraoGrafico() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => moeda.format(ctx.parsed.y ?? ctx.parsed),
          },
        },
      },
    };
  }

  function criarGraficos() {
    const carga = Dados.obterCarga();
    const mesLabels = (carga.por_mes || []).map((m) => MESES[m.mes.slice(5)] || m.mes);
    const mesValores = (carga.por_mes || []).map((m) => m.total);

    graficos.mes = new Chart(el('graficoMes'), {
      type: 'line',
      data: {
        labels: mesLabels,
        datasets: [
          {
            data: mesValores,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.12)',
            fill: true,
            tension: 0.35,
            pointRadius: 5,
            pointBackgroundColor: '#2563eb',
          },
        ],
      },
      options: {
        ...padraoGrafico(),
        scales: {
          y: {
            ticks: { callback: eixoReais },
            grid: { color: '#e5edf7' },
          },
          x: { grid: { display: false } },
        },
      },
    });

    graficos.origens = new Chart(el('graficoOrigens'), {
      type: 'doughnut',
      data: { labels: [], datasets: [{ data: [], backgroundColor: AZUIS.concat('#f97316', '#e11d48') }] },
      options: {
        ...padraoGrafico(),
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } },
          tooltip: {
            callbacks: { label: (ctx) => `${ctx.label}: ${moeda.format(ctx.parsed)}` },
          },
        },
      },
    });

    graficos.partidos = new Chart(el('graficoPartidos'), {
      type: 'bar',
      data: { labels: [], datasets: [{ data: [], backgroundColor: AZUIS }] },
      options: {
        ...padraoGrafico(),
        scales: {
          y: { ticks: { callback: eixoReais }, grid: { color: '#e5edf7' } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  function aplicarTipoCandidatos() {
    const canvas = el('graficoCandidatos');
    const lista = filtrar().filter((c) => c.total > 0).slice(0, 8);
    const labels = lista.map(rotuloCandidato);
    const valores = lista.map((c) => c.total);
    const tipo = estado.tipoGrafico;
    const horizontal = tipo === 'horizontalBar';
    const doughnut = tipo === 'doughnut';

    if (graficos.candidatos) {
      graficos.candidatos.destroy();
    }

    graficos.candidatos = new Chart(canvas, {
      type: doughnut ? 'doughnut' : 'bar',
      data: {
        labels,
        datasets: [
          {
            data: valores,
            backgroundColor: doughnut ? AZUIS.concat('#f97316', '#e11d48') : AZUIS[0],
            borderRadius: doughnut ? 0 : 6,
          },
        ],
      },
      options: doughnut
        ? {
            ...padraoGrafico(),
            plugins: {
              legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } },
              tooltip: {
                callbacks: { label: (ctx) => `${ctx.label}: ${moeda.format(ctx.parsed)}` },
              },
            },
          }
        : {
            ...padraoGrafico(),
            indexAxis: horizontal ? 'y' : 'x',
            scales: {
              x: {
                ticks: horizontal ? { callback: eixoReais } : { maxRotation: 50, font: { size: 10 } },
                grid: { display: horizontal, color: '#e5edf7' },
              },
              y: {
                ticks: horizontal ? { font: { size: 10 } } : { callback: eixoReais },
                grid: { display: !horizontal, color: '#e5edf7' },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => moeda.format(horizontal ? ctx.parsed.x : ctx.parsed.y),
                },
              },
            },
          },
    });
  }

  function atualizarGraficos() {
    const lista = filtrar();
    const total = lista.reduce((s, c) => s + c.total, 0);
    el('resumoTotal').textContent = moeda.format(total);
    el('resumoCandidatos').textContent = inteiro.format(lista.length);
    el('resumoLancamentos').textContent = inteiro.format(lista.reduce((s, c) => s + c.lancamentos, 0));

    aplicarTipoCandidatos();

    const origens = origensDoRecorte(lista).slice(0, 6);
    graficos.origens.data.labels = origens.map((o) =>
      o.origem.length > 28 ? o.origem.slice(0, 26) + '…' : o.origem
    );
    graficos.origens.data.datasets[0].data = origens.map((o) => o.total);

    const partidos = partidosDoRecorte(lista);
    graficos.partidos.data.labels = partidos.map((p) => p.sigla);
    graficos.partidos.data.datasets[0].data = partidos.map((p) => p.total);

    graficos.origens.update();
    graficos.partidos.update();
  }

  function desenharResumoFixo() {
    const carga = Dados.obterCarga();
    el('resumoGeracao').textContent = carga.dt_geracao_tse || '—';
    el('periodoDespesas').textContent =
      `${dataBR(carga.periodo_despesas.inicio)} a ${dataBR(carga.periodo_despesas.fim)}`;
  }

  function popularFiltros() {
    Dados.listarPartidos().forEach((p) => {
      const opcao = document.createElement('option');
      opcao.value = p.sigla;
      opcao.textContent = p.sigla;
      el('filtroPartido').appendChild(opcao);
    });
    Dados.listarTiposPrestacao().forEach((tipo) => {
      const opcao = document.createElement('option');
      opcao.value = tipo;
      opcao.textContent = tipo;
      el('filtroPrestacao').appendChild(opcao);
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

  function mostrarView(nome) {
    estado.view = nome;
    document.querySelectorAll('.view').forEach((secao) => {
      secao.hidden = secao.id !== `view-${nome}`;
    });
    document.querySelectorAll('.menu__item').forEach((botao) => {
      botao.classList.toggle('menu__item--ativo', botao.dataset.view === nome);
    });
    if (nome === 'visao') atualizarGraficos();
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
    const nomes = new Set([...a.origens.map((o) => o.origem), ...b.origens.map((o) => o.origem)]);
    const mapaA = Object.fromEntries(a.origens.map((o) => [o.origem, o.total]));
    const mapaB = Object.fromEntries(b.origens.map((o) => [o.origem, o.total]));
    return Array.from(nomes)
      .map((origem) => ({ origem, a: mapaA[origem] || 0, b: mapaB[origem] || 0 }))
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
    const origens = origensAlinhadas(a, b).filter((o) => o.origem !== '#NULO').slice(0, 8);
    const linhas = origens
      .map(
        (o) => `<tr><td>${o.origem}</td><td class="numero">${moeda.format(o.a)}</td><td class="numero">${moeda.format(o.b)}</td></tr>`
      )
      .join('');
    caixa.innerHTML = `
      <div class="comparacao__pares">
        <article>
          <h3>${a.nm_candidato}</h3>
          <p>${a.sg_partido} · nº ${a.nr_candidato}</p>
          <p class="comparacao__valor">${moeda.format(a.total)}</p>
        </article>
        <article>
          <h3>${b.nm_candidato}</h3>
          <p>${b.sg_partido} · nº ${b.nr_candidato}</p>
          <p class="comparacao__valor">${moeda.format(b.total)}</p>
        </article>
      </div>
      <table class="tabela-itens">
        <thead><tr><th>Origem</th><th class="numero">A</th><th class="numero">B</th></tr></thead>
        <tbody>${linhas}</tbody>
      </table>`;
    caixa.hidden = false;
  }

  function desenharLista() {
    const lista = filtrar();
    const container = el('listaCandidatos');
    const max = Math.max(0, ...lista.map((c) => c.total));
    container.innerHTML = '';
    el('contagemLista').textContent =
      lista.length === 1 ? '1 candidato neste recorte' : `${inteiro.format(lista.length)} candidatos neste recorte`;

    if (!lista.length) {
      container.innerHTML = '<p class="lista__vazia">Nenhum candidato neste filtro.</p>';
      return;
    }

    lista.forEach((c) => {
      const artigo = document.createElement('article');
      artigo.className = 'candidato';
      const pct = max > 0 ? (c.total / max) * 100 : 0;
      const tipo = c.prestacoes.map((p) => p.tipo).join(', ') || '—';
      artigo.innerHTML = `
        <div class="candidato__topo">
          <div>
            <p class="candidato__nome">${c.nm_candidato}</p>
            <p class="candidato__meta">nº ${c.nr_candidato} · ${c.sg_partido} · ${tipo}</p>
          </div>
          <div>
            <p class="candidato__valor">${moeda.format(c.total)}</p>
            <p class="candidato__meta">${rotuloLancamentos(c.lancamentos)}</p>
          </div>
        </div>
        <div class="barra" aria-hidden="true"><span style="width:${pct}%"></span></div>`;
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'expandir';
      botao.textContent = estado.aberto === c.sq_candidato ? 'Ocultar origens' : 'Ver origens';
      botao.addEventListener('click', () => {
        estado.aberto = estado.aberto === c.sq_candidato ? null : c.sq_candidato;
        desenharLista();
      });
      artigo.querySelector('.candidato__topo').appendChild(botao);

      if (estado.aberto === c.sq_candidato) {
        const origens = c.origens.filter((o) => o.origem !== '#NULO' || o.total > 0);
        const detalhe = document.createElement('div');
        detalhe.innerHTML = `<table class="tabela-itens"><thead><tr><th>Origem</th><th class="numero">Lanç.</th><th class="numero">Valor</th></tr></thead><tbody>${origens
          .map(
            (o) =>
              `<tr><td>${o.origem === '#NULO' ? 'Não informado' : o.origem}</td><td class="numero">${inteiro.format(o.lancamentos)}</td><td class="numero">${moeda.format(o.total)}</td></tr>`
          )
          .join('')}</tbody></table>`;
        artigo.appendChild(detalhe);
      }
      container.appendChild(artigo);
    });
  }

  function ligarEventos() {
    document.querySelectorAll('.menu__item').forEach((botao) => {
      botao.addEventListener('click', () => mostrarView(botao.dataset.view));
    });
    el('filtroPartido').addEventListener('change', (e) => {
      estado.partido = e.target.value;
      atualizarGraficos();
      desenharLista();
    });
    el('filtroPrestacao').addEventListener('change', (e) => {
      estado.prestacao = e.target.value;
      atualizarGraficos();
      desenharLista();
    });
    el('tipoGrafico').addEventListener('change', (e) => {
      estado.tipoGrafico = e.target.value;
      aplicarTipoCandidatos();
    });
    el('busca').addEventListener('input', (e) => {
      estado.busca = e.target.value;
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
      el('resultadoComparacao').hidden = true;
      el('resultadoComparacao').innerHTML = '';
    });
  }

  function iniciar() {
    desenharResumoFixo();
    popularFiltros();
    popularComparar();
    criarGraficos();
    ligarEventos();
    atualizarGraficos();
    desenharLista();
  }

  iniciar();
})();
