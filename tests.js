const testResults = [];
let currentTest = null;

function test(name, fn) {
  currentTest = { name, passed: false, error: null };
  
  try {
    fn();
    currentTest.passed = true;
  } catch (error) {
    currentTest.passed = false;
    currentTest.error = error.message;
  }
  
  testResults.push(currentTest);
  currentTest = null;
}

function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(
      message || `Expected ${expected}, but got ${actual}`
    );
  }
}

function assertDeepEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  
  if (actualStr !== expectedStr) {
    throw new Error(
      message || `Expected ${expectedStr}, but got ${actualStr}`
    );
  }
}

function assertTruthy(value, message) {
  if (!value) {
    throw new Error(message || `Expected truthy value, but got ${value}`);
  }
}

function assertFalsy(value, message) {
  if (value) {
    throw new Error(message || `Expected falsy value, but got ${value}`);
  }
}

test('parseDiaSemana: converte "2ª" para 1', () => {
  assertEqual(parseDiaSemana('2ª'), 1);
});

test('parseDiaSemana: converte "sábado" para 6', () => {
  assertEqual(parseDiaSemana('sábado'), 6);
});

test('parseDiaSemana: converte "Sábado" (maiúscula) para 6', () => {
  assertEqual(parseDiaSemana('Sábado'), 6);
});

test('parseDiaSemana: retorna -1 para valor inválido', () => {
  assertEqual(parseDiaSemana('dia inválido'), -1);
});

test('parseDiaHora: extrai corretamente "2ª 07:00"', () => {
  const result = parseDiaHora('2ª 07:00');
  assertDeepEqual(result, { diaSemana: 1, hora: 7, minuto: 0 });
});

test('parseDiaHora: extrai corretamente "Sábado 08:30"', () => {
  const result = parseDiaHora('Sábado 08:30');
  assertDeepEqual(result, { diaSemana: 6, hora: 8, minuto: 30 });
});

test('nextCollection: calcula próxima coleta quando hoje é antes do horário', () => {
  const config = { bairro: 'Trindade', dias: ['2ª 15:00'] };
  const calendar = { Trindade: ['2ª 15:00'] };
  const now = new Date('2024-01-08 10:00:00');
  
  const result = nextCollection(now, config, calendar);
  
  assertTruthy(result, 'Deve retornar resultado');
  assertEqual(result.diaTexto, '2ª 15:00');
  assert(result.horasRestantes > 0 && result.horasRestantes < 24, 
    'Horas restantes deve ser entre 0 e 24');
});

test('nextCollection: pula para próxima semana se horário já passou', () => {
  const config = { bairro: 'Trindade', dias: ['2ª 15:00'] };
  const calendar = { Trindade: ['2ª 15:00'] };
  const now = new Date('2024-01-08 16:00:00');
  
  const result = nextCollection(now, config, calendar);
  
  assertTruthy(result, 'Deve retornar resultado');
  assertEqual(result.diaTexto, '2ª 15:00');
  assert(result.horasRestantes > 24, 
    'Horas restantes deve ser mais de 24 (próxima semana)');
});

test('nextCollection: calcula corretamente quando é véspera', () => {
  const config = { bairro: 'Trindade', dias: ['2ª 07:00'] };
  const calendar = { Trindade: ['2ª 07:00'] };
  const now = new Date('2024-01-07 20:00:00');
  
  const result = nextCollection(now, config, calendar);
  
  assertTruthy(result, 'Deve retornar resultado');
  assertEqual(result.diaTexto, '2ª 07:00');
  assert(result.horasRestantes >= 10 && result.horasRestantes <= 12, 
    'Horas restantes deve ser ~11 horas');
});

test('nextCollection: retorna null quando config é null', () => {
  const result = nextCollection(new Date(), null, {});
  assertEqual(result, null);
});

test('nextCollection: retorna null quando não há bairro', () => {
  const result = nextCollection(new Date(), { dias: [] }, {});
  assertEqual(result, null);
});

test('nextCollection: usa calendar.json quando config.dias está vazio', () => {
  const config = { bairro: 'Centro', dias: [] };
  const calendar = { Centro: ['3ª 07:00', '6ª 07:00'] };
  const now = new Date('2024-01-08 10:00:00');
  
  const result = nextCollection(now, config, calendar);
  
  assertTruthy(result, 'Deve usar dias do calendar.json');
  assert(result.diaTexto === '3ª 07:00' || result.diaTexto === '6ª 07:00',
    'Deve retornar um dos dias do calendar');
});

test('isVesperaColeta: retorna true quando faltam 12 horas', () => {
  const now = new Date('2024-01-08 19:00:00');
  const proxima = {
    date: new Date('2024-01-09 07:00:00'),
    diaTexto: '2ª 07:00',
    horasRestantes: 12
  };
  
  const result = isVesperaColeta(now, proxima);
  assertEqual(result, true);
});

test('isVesperaColeta: retorna false quando faltam mais de 24 horas', () => {
  const now = new Date('2024-01-08 10:00:00');
  const proxima = {
    date: new Date('2024-01-10 07:00:00'),
    diaTexto: '4ª 07:00',
    horasRestantes: 45
  };
  
  const result = isVesperaColeta(now, proxima);
  assertEqual(result, false);
});

test('isVesperaColeta: retorna false quando faltam menos de 4 horas', () => {
  const now = new Date('2024-01-09 05:00:00');
  const proxima = {
    date: new Date('2024-01-09 07:00:00'),
    diaTexto: '2ª 07:00',
    horasRestantes: 2
  };
  
  const result = isVesperaColeta(now, proxima);
  assertEqual(result, false);
});

test('addReport: gera protocolo com prefixo ECO-', () => {
  localStorage.removeItem('ecoalerta.reports');
  
  const report = {
    motivo: 'Coleta não passou',
    obs: 'Teste',
    ts: 1234567890000
  };
  
  const result = addReport(report);
  
  assertEqual(result.success, true);
  assertEqual(result.protocolo, 'ECO-1234567890000');
});

test('addReport: salva no array do histórico', () => {
  localStorage.removeItem('ecoalerta.reports');
  
  const report1 = {
    motivo: 'Coleta não passou',
    obs: 'Primeiro',
    ts: 1000000000000
  };
  
  const report2 = {
    motivo: 'Descarte irregular',
    obs: 'Segundo',
    ts: 2000000000000
  };
  
  addReport(report1);
  addReport(report2);
  
  const reports = loadReports();
  
  assertEqual(reports.length, 2);
  assertEqual(reports[0].protocolo, 'ECO-1000000000000');
  assertEqual(reports[1].protocolo, 'ECO-2000000000000');
  
  localStorage.removeItem('ecoalerta.reports');
});

test('addReport: usa timestamp atual quando não fornecido', () => {
  localStorage.removeItem('ecoalerta.reports');
  
  const report = {
    motivo: 'Outro',
    obs: 'Teste timestamp'
  };
  
  const result = addReport(report);
  
  assertEqual(result.success, true);
  assertTruthy(result.protocolo.startsWith('ECO-'), 'Protocolo deve começar com ECO-');
  
  localStorage.removeItem('ecoalerta.reports');
});

test('formatHorasRestantes: formata horas corretamente', () => {
  assertEqual(formatHorasRestantes(0), 'menos de 1 hora');
  assertEqual(formatHorasRestantes(1), '1 hora');
  assertEqual(formatHorasRestantes(5), '5 horas');
  assertEqual(formatHorasRestantes(24), '1 dia');
  assertEqual(formatHorasRestantes(25), '1 dia e 1h');
  assertEqual(formatHorasRestantes(48), '2 dias');
  assertEqual(formatHorasRestantes(50), '2 dias e 2h');
});

test('saveConfig e loadConfig: salvam e carregam configuração', () => {
  const config = {
    bairro: 'Trindade',
    dias: ['2ª 07:00', '5ª 07:00']
  };
  
  const saved = saveConfig(config);
  assertEqual(saved, true);
  
  const loaded = loadConfig();
  assertDeepEqual(loaded, config);
  
  localStorage.removeItem('ecoalerta.config');
});

test('loadConfig: retorna null quando não há configuração', () => {
  localStorage.removeItem('ecoalerta.config');
  
  const result = loadConfig();
  assertEqual(result, null);
});

function renderTestResults() {
  const container = document.getElementById('testResults');
  if (!container) {
    console.error('Container #testResults não encontrado');
    return;
  }
  
  const passed = testResults.filter(t => t.passed).length;
  const failed = testResults.filter(t => !t.passed).length;
  const total = testResults.length;
  
  const summaryClass = failed === 0 ? 'success' : 'danger';
  const summaryHTML = `
    <div class="test-summary card ${summaryClass}">
      <h3 style="color: white; margin: 0;">
        ${failed === 0 ? '✅' : '⚠️'} 
        ${passed}/${total} testes passaram
      </h3>
      ${failed > 0 ? `<p style="color: white; margin: 0.5rem 0 0 0;">${failed} teste(s) falharam</p>` : ''}
    </div>
  `;
  
  const testsHTML = testResults.map(test => {
    const icon = test.passed ? '✅' : '❌';
    const className = test.passed ? 'pass' : 'fail';
    const errorHTML = test.error ? `<br><small>Erro: ${test.error}</small>` : '';
    
    return `
      <div class="test-result ${className}">
        ${icon} ${test.name}${errorHTML}
      </div>
    `;
  }).join('');
  
  container.innerHTML = summaryHTML + testsHTML;
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Testes: ${passed}/${total} passaram`);
  console.log(`${'='.repeat(50)}`);
  testResults.forEach(test => {
    const status = test.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}: ${test.name}`);
    if (test.error) {
      console.log(`  Erro: ${test.error}`);
    }
  });
  console.log(`${'='.repeat(50)}\n`);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTestResults);
  } else {
    renderTestResults();
  }
}

