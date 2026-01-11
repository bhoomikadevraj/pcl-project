/* -----------------------------
   Speech-to-Text (Captions)
----------------------------- */

let recognizing = false;
let recognition;

function initSpeechRecognition() {
  const toggleSTT = document.getElementById('toggleSTT');
  const sttLang = document.getElementById('sttLang');
  const captions = document.getElementById('captions');
  
  if (!toggleSTT || !sttLang || !captions) return;
  
  if('SpeechRecognition' in window || 'webkitSpeechRecognition' in window){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = sttLang.value;
    
    sttLang.addEventListener('change', ()=>{ 
      if(recognition){ recognition.lang = sttLang.value; } 
    });

    recognition.onresult = (event)=>{
      let interim=''; let final='';
      for(let i=event.resultIndex;i<event.results.length;i++){
        const t = event.results[i][0].transcript;
        if(event.results[i].isFinal){ final += t + ' '; } else { interim += t; }
      }
      // Use textContent to prevent XSS
      const finalDiv = document.createElement('div');
      finalDiv.style.marginBottom = '8px';
      finalDiv.innerHTML = '<strong>Final:</strong> ';
      const finalText = document.createTextNode(final);
      finalDiv.appendChild(finalText);
      
      const interimDiv = document.createElement('div');
      interimDiv.innerHTML = '<em>Interim:</em> ';
      const interimText = document.createTextNode(interim);
      interimDiv.appendChild(interimText);
      
      captions.innerHTML = '';
      captions.appendChild(finalDiv);
      captions.appendChild(interimDiv);
    };
    
    recognition.onerror = (e)=>{
      captions.innerHTML = `<div style="color:var(--error);">STT error: ${e.error || e.message || e}</div>`;
    };
    
    recognition.onend = ()=>{ 
      recognizing=false; 
      toggleSTT.textContent='🎤 Start Speech Recognition'; 
    };
  } else {
    toggleSTT.disabled = true;
    captions.textContent = 'Speech recognition not supported in this browser.';
  }

  toggleSTT.onclick = ()=>{
    if(!recognition) return;
    if(recognizing){ 
      recognition.stop(); 
      recognizing=false; 
      toggleSTT.textContent='🎤 Start Speech Recognition'; 
    } else { 
      recognition.start(); 
      recognizing=true; 
      toggleSTT.textContent='⏹ Stop Speech Recognition'; 
    }
  };
}