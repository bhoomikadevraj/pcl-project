/* -----------------------------
   Sign Recognition (Webcam + MediaPipe Hands)
----------------------------- */

let hands = null;
let rafId = null;
let stream = null;
let processing = false;
let lastSign = ''; 
let lastAt = 0; // debounce repeated detections
let handsInitialized = false;

function initSignRecognition() {
  const video = document.getElementById('webcam');
  const startCamBtn = document.getElementById('startCam');
  const stopCamBtn = document.getElementById('stopCam');
  const signStatus = document.getElementById('signStatus');
  const cameraHelp = document.getElementById('cameraHelp');
  
  if (!video || !startCamBtn || !stopCamBtn || !signStatus) return;
  
  // Add accessibility attributes
  video.setAttribute('aria-label', 'Webcam feed for sign language recognition');
  startCamBtn.setAttribute('aria-label', 'Start camera for sign recognition');
  stopCamBtn.setAttribute('aria-label', 'Stop camera');
  if (signStatus) {
    signStatus.setAttribute('role', 'status');
    signStatus.setAttribute('aria-live', 'polite');
    signStatus.setAttribute('aria-atomic', 'true');
  }
  
  // Initialize MediaPipe Hands only once
  if (!handsInitialized) {
    hands = new Hands({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
    hands.setOptions({ 
      maxNumHands:1, 
      modelComplexity:1, 
      minDetectionConfidence:0.8,  // Increased from 0.7 for better accuracy
      minTrackingConfidence:0.8    // Increased from 0.7 for better accuracy
    });
    handsInitialized = true;
  }

  hands.onResults(results => {
    // Don't process if camera is stopped
    if(!processing) return;
    
    if(results.multiHandLandmarks && results.multiHandLandmarks.length){
      const lm = results.multiHandLandmarks[0];
      
      // More strict detection logic with multiple conditions
      // Thumb up: thumb tip above all other finger tips, other fingers closed
      const thumbUp = lm[4].y < lm[3].y - 0.05 && 
                      lm[4].y < lm[2].y - 0.05 &&
                      lm[4].y < lm[8].y &&  // thumb above index
                      lm[8].y > lm[6].y &&  // index finger closed
                      lm[12].y > lm[10].y && // middle finger closed
                      lm[16].y > lm[14].y && // ring finger closed
                      lm[20].y > lm[18].y;   // pinky closed
      
      // Thumb down: thumb tip below all other finger tips, other fingers closed
      const thumbDown = lm[4].y > lm[3].y + 0.05 && 
                        lm[4].y > lm[2].y + 0.05 &&
                        lm[4].y > lm[8].y &&  // thumb below index
                        lm[8].y > lm[6].y &&  // index finger closed
                        lm[12].y > lm[10].y && // middle finger closed
                        lm[16].y > lm[14].y && // ring finger closed
                        lm[20].y > lm[18].y;   // pinky closed
      
      // Open palm: all fingers extended upward with good spacing
      const openPalm = lm[8].y < lm[6].y - 0.03 &&   // index extended
                       lm[12].y < lm[10].y - 0.03 &&  // middle extended
                       lm[16].y < lm[14].y - 0.03 &&  // ring extended
                       lm[20].y < lm[18].y - 0.03 &&  // pinky extended
                       Math.abs(lm[8].x - lm[12].x) > 0.02 && // fingers spread
                       lm[4].y < lm[3].y; // thumb also up
      
      let label = '';
      if(thumbUp) label = '👍 Yes'; 
      else if(thumbDown) label = '👎 No'; 
      else if(openPalm) label = '👋 Hello';
      
      if(label){
        const now = Date.now();
        // Increased debounce to 3 seconds to prevent rapid repetition
        if(label !== lastSign || (now - lastAt) > 3000){
          lastSign = label; lastAt = now;
          signStatus.textContent = 'Sign: ' + label;
          const phrase = /👍/.test(label) 
            ? 'Yes' 
            : /👎/.test(label) 
              ? 'No' 
              : /👋/.test(label)
                ? 'Hello'
                : '';
          speak(phrase); 
          addToLog(phrase);
        } else {
          // Show detected but not speaking due to debounce
          signStatus.textContent = 'Sign: ' + label + ' (cooldown)';
        }
      } else {
        signStatus.textContent = 'Sign: (show clear hand gesture)';
        // Clear last sign if nothing detected for more than 2 seconds
        const now = Date.now();
        if(now - lastAt > 2000) {
          lastSign = '';
        }
      }
    } else {
      signStatus.textContent = 'Sign: (no hand detected)';
      lastSign = '';
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
    lastSign = '';
    lastAt = 0;
    
    // Cancel any ongoing speech
    if(window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }
  
  // Cleanup function for when view is destroyed
  function cleanupSignRecognition() {
    stopCamera();
    if (hands) {
      try {
        hands.close();
      } catch(e) {
        console.warn('Error closing MediaPipe Hands:', e);
      }
      hands = null;
      handsInitialized = false;
    }
  }
  
  // Expose cleanup function globally for cleanup-observer
  window.cleanupSignRecognition = cleanupSignRecognition;

  function showHelp(message){
    if (cameraHelp) {
      cameraHelp.hidden = false; 
      cameraHelp.innerHTML = `<strong>Camera problem:</strong> ${message}`;
    }
  }

  startCamBtn.addEventListener('click', startCamera);
  stopCamBtn.addEventListener('click', stopCamera);
}