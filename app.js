// ==========================================
// EcoAlerta Floripa - Lógica Principal
// ==========================================

// Configuração
const STORAGE_KEY_CONFIG = 'ecoalerta.config';
const STORAGE_KEY_REPORTS = 'ecoalerta.reports';

// ==========================================
// Funções Utilitárias Puras (Testáveis)
// ==========================================

/**
 * Carrega configuração do usuário do LocalStorage
 * @returns {Object|null} { bairro: string, dias: ["2ª 07:00", ...] } ou null
 */
function loadConfig() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CONFIG);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Erro ao carregar config:', e);
    return null;
  }
}

/**
 * Salva configuração do usuário no LocalStorage
 * @param {Object} cfg - { bairro: string, dias: ["2ª 07:00", ...] }
 */
function saveConfig(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(cfg));
    return true;
  } catch (e) {
    console.error('Erro ao salvar config:', e);
    return false;
  }
}

/**
 * Converte texto de dia da semana para número (0-6, domingo=0)
 * @param {string} diaTexto - Ex: "2ª", "3ª", "Sábado"
 * @returns {number} - 0 a 6
 */
function parseDiaSemana(diaTexto) {
  const mapa = {
    'domingo': 0, 'dom': 0,
    '2ª': 1, 'segunda': 1, 'seg': 1,
    '3ª': 2, 'terça': 2, 'ter': 2,
    '4ª': 3, 'quarta': 3, 'qua': 3,
    '5ª': 4, 'quinta': 4, 'qui': 4,
    '6ª': 5, 'sexta': 5, 'sex': 5,
    'sábado': 6, 'sab': 6, 'sabado': 6
  };
  
  const key = diaTexto.toLowerCase().trim();
  return mapa[key] !== undefined ? mapa[key] : -1;
}

/**
 * Extrai dia da semana e hora de string "2ª 07:00"
 * @param {string} diaHora - Ex: "2ª 07:00"
 * @returns {Object} { diaSemana: number, hora: number, minuto: number }
 */
function parseDiaHora(diaHora) {
  const partes = diaHora.trim().split(/\s+/);
  const diaTexto = partes[0];
  const horaTexto = partes[1] || '07:00';
  
  const [horaStr, minStr] = horaTexto.split(':');
  
  return {
    diaSemana: parseDiaSemana(diaTexto),
    hora: parseInt(horaStr, 10),
    minuto: parseInt(minStr, 10)
  };
}

/**
 * Calcula próxima ocorrência de coleta
 * @param {Date} now - Data/hora atual
 * @param {Object} cfg - Config do usuário { bairro, dias }
 * @param {Object} calendarJson - Mapa de bairro -> dias
 * @returns {Object|null} { diaTexto, date, horasRestantes } ou null
 */
function nextCollection(now, cfg, calendarJson) {
  if (!cfg || !cfg.bairro) return null;
  
  // Usar dias da config se existirem, senão do calendar
  let diasColeta = cfg.dias && cfg.dias.length > 0 
    ? cfg.dias 
    : (calendarJson[cfg.bairro] || []);
  
  if (diasColeta.length === 0) return null;
  
  // Converter todos os dias/horas em objetos
  const coletas = diasColeta.map(dh => {
    const parsed = parseDiaHora(dh);
    return { original: dh, ...parsed };
  }).filter(c => c.diaSemana >= 0);
  
  if (coletas.length === 0) return null;
  
  // Encontrar próxima coleta
  const nowTime = now.getTime();
  let proximaColeta = null;
  let menorDiff = Infinity;
  
  // Verificar próximas 2 semanas (14 dias)
  for (let i = 0; i < 14; i++) {
    const dataCandidata = new Date(now);
    dataCandidata.setDate(now.getDate() + i);
    
    const diaSemana = dataCandidata.getDay();
    
    // Ver se alguma coleta cai nesse dia
    for (const coleta of coletas) {
      if (coleta.diaSemana === diaSemana) {
        const dataColeta = new Date(dataCandidata);
        dataColeta.setHours(coleta.hora, coleta.minuto, 0, 0);
        
        const diff = dataColeta.getTime() - nowTime;
        
        // Só considerar futuras
        if (diff > 0 && diff < menorDiff) {
          menorDiff = diff;
          proximaColeta = {
            diaTexto: coleta.original,
            date: dataColeta,
            horasRestantes: Math.round(diff / (1000 * 60 * 60))
          };
        }
      }
    }
  }
  
  return proximaColeta;
}

/**
 * Verifica se é véspera de coleta (20h do dia anterior em diante)
 * @param {Date} now - Data/hora atual
 * @param {Object} proximaColeta - Resultado de nextCollection
 * @returns {boolean}
 */
function isVesperaColeta(now, proximaColeta) {
  if (!proximaColeta || !proximaColeta.date) return false;
  
  const diff = proximaColeta.date.getTime() - now.getTime();
  const horas = diff / (1000 * 60 * 60);
  
  // Véspera = entre 4 e 24 horas antes
  return horas > 4 && horas <= 24;
}

/**
 * Carrega histórico de relatórios
 * @returns {Array} Array de relatórios
 */
function loadReports() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_REPORTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Erro ao carregar relatórios:', e);
    return [];
  }
}

/**
 * Adiciona um relatório ao histórico
 * @param {Object} report - { motivo, obs, ts }
 * @returns {Object} { protocolo, success }
 */
function addReport(report) {
  try {
    const reports = loadReports();
    const ts = report.ts || Date.now();
    const protocolo = `ECO-${ts}`;
    
    const novoReport = {
      protocolo,
      motivo: report.motivo,
      obs: report.obs || '',
      timestamp: ts,
      data: new Date(ts).toLocaleString('pt-BR')
    };
    
    reports.push(novoReport);
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    
    return { protocolo, success: true };
  } catch (e) {
    console.error('Erro ao adicionar relatório:', e);
    return { protocolo: null, success: false };
  }
}

/**
 * Formata data para exibição
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const dia = dias[date.getDay()];
  const hora = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const dataStr = date.toLocaleDateString('pt-BR');
  
  return `${dia}, ${dataStr} às ${hora}:${min}`;
}

/**
 * Formata diferença de horas de forma amigável
 * @param {number} horas
 * @returns {string}
 */
function formatHorasRestantes(horas) {
  if (horas < 1) return 'menos de 1 hora';
  if (horas === 1) return '1 hora';
  if (horas < 24) return `${horas} horas`;
  
  const dias = Math.floor(horas / 24);
  const horasResto = horas % 24;
  
  if (dias === 1 && horasResto === 0) return '1 dia';
  if (dias === 1) return `1 dia e ${horasResto}h`;
  if (horasResto === 0) return `${dias} dias`;
  return `${dias} dias e ${horasResto}h`;
}

// ==========================================
// Funções de UI (dependem do DOM)
// ==========================================

/**
 * Mostra toast temporário
 * @param {string} message
 * @param {number} duration - em ms
 */
function showToast(message, duration = 3000) {
  // Remove toast anterior se existir
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Adiciona classe para animação
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Exporta dados como JSON (download)
 * @param {*} data - Dados para exportar
 * @param {string} filename - Nome do arquivo
 */
function exportJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
}

