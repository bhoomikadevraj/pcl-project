/* -----------------------------
   Custom Phrase Management
----------------------------- */

function initCustomPhrase() {
  const speakBtn = document.getElementById('speakCustom');
  const saveBtn = document.getElementById('saveCustom');
  const textInput = document.getElementById('customText');
  
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