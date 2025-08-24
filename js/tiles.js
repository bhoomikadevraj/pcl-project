/* -----------------------------
   Tiles Management
----------------------------- */

let tiles = JSON.parse(localStorage.getItem('tiles')||'null') || [
  { emoji: "👋", label: "Hello", phrase: "Hello!" },
  { emoji: "👍", label: "Yes", phrase: "Yes" },
  { emoji: "👎", label: "No", phrase: "No" },
  { emoji: "🙏", label: "Please", phrase: "Please" },
  { emoji: "😊", label: "Thank You", phrase: "Thank you" },
  { emoji: "🆘", label: "Help", phrase: "I need help" },
];

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
  localStorage.setItem('tiles', JSON.stringify(tiles));
}

function initTiles() {
  renderTiles();
  
  // Restore old log
  const logEl = document.getElementById('log');
  if (logEl) {
    (JSON.parse(localStorage.getItem('logs')||'[]')).forEach(line=>{
      const d = document.createElement('div');
      d.className = 'log-entry';
      d.textContent = line;
      logEl.appendChild(d);
    });
  }
}