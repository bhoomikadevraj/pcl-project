/* -----------------------------
   Tiles Management
----------------------------- */

const defaultTiles = {
  basic: [
    { emoji: "👋", label: "Hello", phrase: "Hello!" },
    { emoji: "👍", label: "Yes", phrase: "Yes" },
    { emoji: "👎", label: "No", phrase: "No" },
    { emoji: "🙏", label: "Please", phrase: "Please" },
    { emoji: "😊", label: "Thank You", phrase: "Thank you" },
    { emoji: "👌", label: "OK", phrase: "Okay" },
  ],
  emotions: [
    { emoji: "❤️", label: "I Love You", phrase: "I love you" },
    { emoji: "😢", label: "Sorry", phrase: "I'm sorry" },
    { emoji: "🙂", label: "I'm Fine", phrase: "I'm fine" },
  ],
  actions: [
    { emoji: "⏰", label: "Wait", phrase: "Please wait" },
    { emoji: "🚫", label: "Stop", phrase: "Stop" },
    { emoji: "👋", label: "Goodbye", phrase: "Goodbye" },
  ],
  needs: [
    { emoji: "🆘", label: "Help", phrase: "I need help" },
    { emoji: "🍽️", label: "Hungry", phrase: "I'm hungry" },
    { emoji: "💧", label: "Thirsty", phrase: "I'm thirsty" },
    { emoji: "😴", label: "Tired", phrase: "I'm tired" },
    { emoji: "🤒", label: "Sick", phrase: "I don't feel well" },
    { emoji: "🚻", label: "Bathroom", phrase: "I need the bathroom" },
  ]
};

const categoryLabels = {
  basic: "Basic",
  emotions: "Emotions",
  actions: "Actions",
  needs: "Needs",
  custom: "Custom Phrases"
};

let userCustomPhrases = [];

function loadTilesFromStorage() {
  try {
    const stored = localStorage.getItem('tiles');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        userCustomPhrases = parsed.filter(t => t.id); // Only custom phrases have IDs
      }
    }
  } catch(e) {
    console.warn('Failed to load tiles from storage:', e);
  }
}

function renderTiles(){
  const grid = document.getElementById('grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  // Render default tiles by category
  ['basic', 'emotions', 'actions', 'needs'].forEach(category => {
    // Create category heading
    const heading = document.createElement('div');
    heading.className = 'category-heading';
    heading.textContent = categoryLabels[category];
    grid.appendChild(heading);
    
    // Create category tiles
    defaultTiles[category].forEach((t) => {
      const btn = createTileButton(t);
      grid.appendChild(btn);
    });
  });
  
  // Render user custom phrases if any
  if (userCustomPhrases.length > 0) {
    const heading = document.createElement('div');
    heading.className = 'category-heading';
    heading.textContent = categoryLabels.custom;
    grid.appendChild(heading);
    
    userCustomPhrases.forEach((t) => {
      const btn = createTileButton(t);
      grid.appendChild(btn);
    });
  }
}

function createTileButton(t) {
  const btn = document.createElement('button');
  btn.className = 'tile';
  btn.setAttribute('aria-label', `${t.label}: ${t.phrase}`);
  btn.setAttribute('type', 'button');
  btn.innerHTML = `<div class='tile-emoji' aria-hidden='true'>${t.emoji}</div><div class='tile-label'>${t.label}</div>`;
  
  const handleActivation = () => { 
    speak(t.phrase); 
    addToLog(t.phrase);
  };
  
  btn.onclick = handleActivation;
  btn.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivation();
    }
  };
  
  return btn;
}

function addCustomPhrase(tile) {
  userCustomPhrases.push(tile);
  saveTilesToStorage();
  renderTiles();
}

function saveTilesToStorage() {
  try {
    localStorage.setItem('tiles', JSON.stringify(userCustomPhrases));
  } catch(e) {
    console.warn('Failed to save tiles to localStorage:', e);
  }
}

function initTiles() {
  loadTilesFromStorage();
  renderTiles();
  
  // Restore old log
  const logEl = document.getElementById('log');
  if (logEl) {
    logEl.setAttribute('role', 'log');
    logEl.setAttribute('aria-live', 'polite');
    logEl.setAttribute('aria-label', 'Conversation log');
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