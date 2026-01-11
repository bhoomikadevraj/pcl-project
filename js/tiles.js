/* -----------------------------
   Tiles Management
----------------------------- */

const defaultTiles = [
  { emoji: "👋", label: "Hello", phrase: "Hello!" },
  { emoji: "👍", label: "Yes", phrase: "Yes" },
  { emoji: "👎", label: "No", phrase: "No" },
  { emoji: "🙏", label: "Please", phrase: "Please" },
  { emoji: "😊", label: "Thank You", phrase: "Thank you" },
  { emoji: "🆘", label: "Help", phrase: "I need help" },
];

function loadTilesFromStorage() {
  try {
    const stored = localStorage.getItem('tiles');
    if (!stored) return defaultTiles;
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.every(t => t.emoji && t.label && t.phrase)) {
      return parsed;
    }
  } catch(e) {
    console.warn('Failed to load tiles from storage, using defaults:', e);
  }
  return defaultTiles;
}

let tiles = loadTilesFromStorage();

function renderTiles(){
  const grid = document.getElementById('grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  tiles.forEach(t=>{
    const btn = document.createElement('button');
    btn.className = 'tile';
    btn.innerHTML = `<div class='tile-emoji'>${t.emoji}</div><div class='tile-label'>${t.label}</div>`;
    btn.onclick = ()=>{ speak(t.phrase); addToLog(t.phrase); };
    grid.appendChild(btn);
  });
  
  try {
    localStorage.setItem('tiles', JSON.stringify(tiles));
  } catch(e) {
    console.warn('Failed to save tiles to localStorage:', e);
  }
}

function initTiles() {
  renderTiles();
  
  // Restore old log
  const logEl = document.getElementById('log');
  if (logEl) {
    try {
      const stored = localStorage.getItem('logs');
      if (stored) {
        const logs = JSON.parse(stored);
        if (Array.isArray(logs)) {
          logs.forEach(line=>{
            if (typeof line === 'string') {
              const d = document.createElement('div');
              d.className = 'log-entry';
              d.textContent = line;
              logEl.appendChild(d);
            }
          });
        }
      }
    } catch(e) {
      console.warn('Failed to restore logs from localStorage:', e);
    }
  }
}