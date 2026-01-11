/* -----------------------------
   Utilities
----------------------------- */

function isSecureContextOk(){
  const h = location.hostname;
  return location.protocol === 'https:' || h === 'localhost' || h === '127.0.0.1';
}

function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/[<>]/g, '');
}

function speak(text){
  const sanitized = sanitizeText(text);
  if (!sanitized) return;
  const u = new SpeechSynthesisUtterance(sanitized);
  speechSynthesis.speak(u);
}

function addToLog(msg){
  const logEl = document.getElementById('log');
  if (!logEl) return;
  
  const sanitized = sanitizeText(msg);
  const t = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const line = `[${t}] ${sanitized}`;
  const d = document.createElement('div');
  d.className = 'log-entry';
  d.textContent = line;
  logEl.appendChild(d);
  logEl.scrollTop = logEl.scrollHeight;
  
  try {
    const logs = JSON.parse(localStorage.getItem('logs')||'[]');
    if (Array.isArray(logs)) {
      logs.push(line);
      // Keep only last 100 log entries to prevent storage overflow
      if (logs.length > 100) logs.splice(0, logs.length - 100);
      localStorage.setItem('logs', JSON.stringify(logs));
    }
  } catch(e) {
    console.warn('Failed to save log to localStorage:', e);
  }
  
  // Save to Supabase if user is signed in
  if (typeof saveLogToDb === 'function') {
    saveLogToDb(sanitized);
  }
}

function clearConversationLog() {
  const logEl = document.getElementById('log');
  if (logEl) {
    logEl.innerHTML = '';
  }
  
  try {
    localStorage.removeItem('logs');
  } catch(e) {
    console.warn('Failed to clear logs from localStorage:', e);
  }
  
  // Note: Logs are kept in database for record-keeping
  // Only clearing from user's view and localStorage
  
  showNotification('Conversation log cleared', 'success');
}

async function loadComponent(url) {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error(`Failed to load component: ${url}`, error);
    return '';
  }
}