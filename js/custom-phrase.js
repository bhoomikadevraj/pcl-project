/* -----------------------------
   Custom Phrase Management
----------------------------- */

function initCustomPhrase() {
  const speakBtn = document.getElementById('speakCustom');
  const saveBtn = document.getElementById('saveCustom');
  const textInput = document.getElementById('customText');
  
  // Add accessibility attributes
  if (textInput) {
    textInput.setAttribute('aria-label', 'Enter custom phrase to speak');
  }
  if (speakBtn) {
    speakBtn.setAttribute('aria-label', 'Speak the entered phrase');
  }
  if (saveBtn) {
    saveBtn.setAttribute('aria-label', 'Save phrase as a tile on dashboard');
  }
  
  if (speakBtn) {
    speakBtn.onclick = () => {
      const text = textInput?.value.trim();
      if (text) { 
        speak(text); 
        addToLog(text); 
      }
    };
  }
  
  if (saveBtn) {
    saveBtn.onclick = () => {
      const text = textInput?.value.trim();
      if (text) { 
        tiles.push({ emoji:'💬', label:text.slice(0,12), phrase:text }); 
        renderTiles(); 
        if (textInput) textInput.value = '';
        showView('dashboard'); // Navigate back to dashboard
      }
    };
  }
}