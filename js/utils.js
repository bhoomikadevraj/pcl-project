/* -----------------------------
   Utilities
----------------------------- */

function isSecureContextOk(){
  const h = location.hostname;
  return location.protocol === 'https:' || h === 'localhost' || h === '127.0.0.1';
}

function speak(text){
  const u = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(u);
}

function addToLog(msg){
  const logEl = document.getElementById('log');
  if (!logEl) return;
  
  const t = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const line = `[${t}] ${msg}`;
  const d = document.createElement('div');
  d.className = 'log-entry';
  d.textContent = line;
  logEl.appendChild(d);
  logEl.scrollTop = logEl.scrollHeight;
  
  const logs = JSON.parse(localStorage.getItem('logs')||'[]');
  logs.push(line);
  localStorage.setItem('logs', JSON.stringify(logs));
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