/* -----------------------------
   Sign Recognition (Webcam + MediaPipe Hands)
----------------------------- */

let hands;
let rafId = null;
let stream = null;
let processing = false;
let lastSign = ''; 
let lastAt = 0; // debounce repeated detections

function initSignRecognition() {
  const video = document.getElementById('webcam');
  const startCamBtn = document.getElementById('startCam');
  const stopCamBtn = document.getElementById('stopCam');
  const signStatus = document.getElementById('signStatus');
  const cameraHelp = document.getElementById('cameraHelp');
  
  if (!video || !startCamBtn || !stopCamBtn || !signStatus) return;
  
  // Initialize MediaPipe Hands
  hands = new Hands({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
  hands.setOptions({ 
    maxNumHands:1, 
    modelComplexity:1, 
    minDetectionConfidence:0.7, 
    minTrackingConfidence:0.7 
  });

  hands.onResults(results => {
    if(results.multiHandLandmarks && results.multiHandLandmarks.length){
      const lm = results.multiHandLandmarks[0];
      const thumbUp   = lm[4].y < lm[3].y && lm[4].y < lm[2].y;
      const thumbDown = lm[4].y > lm[3].y && lm[4].y > lm[2].y;
      const openPalm  = lm[8].y < lm[6].y && lm[12].y < lm[10].y && lm[16].y < lm[14].y && lm[20].y < lm[18].y;
      
      let label = '';
      if(thumbUp) label = '👍 Yes'; 
      else if(thumbDown) label = '👎 No'; 
      else if(openPalm) label = '👋 Hello';
      
      if(label){
        const now = Date.now();
        if(label !== lastSign || (now - lastAt) > 1500){
          lastSign = label; lastAt = now;
          signStatus.textContent = 'Sign: ' + label;
          const phrase = /Yes/.test(label) ? 'Yes' : /No/.test(label) ? 'No' : 'Hello!';
          speak(phrase); 
          addToLog(phrase);
        }
      } else {
        signStatus.textContent = 'Sign: (unrecognized)';
      }
    } else {
      signStatus.textContent = 'Sign: (no hand)';
    }
  });

  async function processFrame(){
    if(!processing) return;
    try{ await hands.send({ image: video }); }
    catch(e){ /* ignore transient errors */ }
    rafId = requestAnimationFrame(processFrame);
  }

  async function startCamera(){
    if(!('mediaDevices' in navigator) || !navigator.mediaDevices.getUserMedia){
      showHelp('Your browser does not support getUserMedia (camera). Try Chrome/Edge.');
      return;
    }
    if(!isSecureContextOk()){
      showHelp('Camera requires HTTPS or http://localhost. Please host over HTTPS or use a local dev server.');
      return;
    }
    try{
      if (cameraHelp) cameraHelp.hidden = true;
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode:'user', width:{ideal:640}, height:{ideal:480} }, 
        audio:false 
      });
      video.srcObject = stream;
      await video.play();
      processing = true;
      processFrame();
    }catch(err){
      console.error('Failed to acquire camera feed:', err);
      const msg = (err && err.name === 'NotAllowedError')
        ? 'Permission denied. Click the lock icon → allow Camera → reload this page.'
        : (err && err.message) || String(err);
      showHelp(msg);
    }
  }

  function stopCamera(){
    processing = false;
    if(rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if(stream){ stream.getTracks().forEach(t=>t.stop()); stream = null; }
    video.srcObject = null;
    signStatus.textContent = 'Sign: (stopped)';
  }

  function showHelp(message){
    if (cameraHelp) {
      cameraHelp.hidden = false; 
      cameraHelp.innerHTML = `<strong>Camera problem:</strong> ${message}`;
    }
  }

  startCamBtn.addEventListener('click', startCamera);
  stopCamBtn.addEventListener('click', stopCamera);
}