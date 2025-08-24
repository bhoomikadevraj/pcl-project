/* -----------------------------
   Environment Tests
----------------------------- */

function initEnvironmentTests() {
  const runTestsBtn = document.getElementById('runTests');
  const testResults = document.getElementById('testResults');
  
  if (!runTestsBtn || !testResults) return;
  
  runTestsBtn.addEventListener('click', async ()=>{
    const results = [];
    const addResult = (passed, label, extra='') => {
      results.push(`
        <div class="test-result">
          <span class="test-badge ${passed ? 'pass' : 'fail'}">${passed ? 'PASS' : 'FAIL'}</span>
          <span>${label}${extra ? ': ' + extra : ''}</span>
        </div>
      `);
    };

    addResult(true, 'Page loaded');
    const httpsOk = isSecureContextOk();
    addResult(httpsOk, 'Secure context (https or localhost)', location.protocol + '//' + location.host);
    const gum = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    addResult(gum, 'Camera API (getUserMedia) support');
    const sttOk = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    addResult(sttOk, 'SpeechRecognition API support');

    // Permissions (best effort)
    if(navigator.permissions){
      try{ 
        const p = await navigator.permissions.query({ name:'camera' }); 
        addResult(p.state!=='denied', 'Camera permission state', p.state); 
      }
      catch{ 
        results.push('<div class="test-result">Camera permission state: <em>unknown (browser does not expose)</em></div>'); 
      }
      try{ 
        const m = await navigator.permissions.query({ name:'microphone' }); 
        addResult(m.state!=='denied', 'Microphone permission state', m.state); 
      }
      catch{ 
        results.push('<div class="test-result">Microphone permission state: <em>unknown</em></div>'); 
      }
    } else {
      results.push('<div class="test-result">Permissions API not available for detailed checks.</div>');
    }

    testResults.innerHTML = results.join('');
  });
}