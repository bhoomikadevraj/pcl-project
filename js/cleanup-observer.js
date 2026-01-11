/* -----------------------------
   Cleanup & Accessibility Observer
   - Persists STT language selection
   - Adds aria attributes for captions
   - Stops camera/STT when navigating away from their views
----------------------------- */

(function(){
  function safeClick(el){ try { el && el.click && el.click(); } catch(_){} }

  function initAccessibilityAndPersistence(){
    // Add aria attrs for captions live region
    const captions = document.getElementById('captions');
    if (captions) {
      captions.setAttribute('role', 'region');
      captions.setAttribute('aria-live', 'polite');
      captions.setAttribute('aria-atomic', 'false');
      if (!captions.getAttribute('aria-label')) {
        captions.setAttribute('aria-label', 'Live captions');
      }
    }

    // Persist STT language
    const sttLang = document.getElementById('sttLang');
    if (sttLang) {
      try {
        const saved = localStorage.getItem('sttLang');
        if (saved && Array.from(sttLang.options).some(o => o.value === saved)) {
          sttLang.value = saved;
        }
      } catch(_){}
      sttLang.addEventListener('change', () => {
        try { localStorage.setItem('sttLang', sttLang.value); } catch(_){}
      });
    }
  }

  function initViewObserver(){
    const mainEl = document.querySelector('.main-content');
    if (!mainEl) return;

    let lastActive = (document.querySelector('.view.active') || {}).id;
    const obs = new MutationObserver(() => {
      const currentActive = document.querySelector('.view.active');
      const currentId = currentActive ? currentActive.id : undefined;
      if (lastActive && lastActive !== currentId) {
        // Leaving Sign view → stop camera by clicking Stop button
        if (lastActive === 'sign') {
          const stopCam = document.getElementById('stopCam');
          safeClick(stopCam);
        }
        // Leaving Captions view → stop STT if running by toggling button
        if (lastActive === 'captions-sign') {
          const toggle = document.getElementById('toggleSTT');
          if (toggle && /Stop/i.test(toggle.textContent || '')) {
            safeClick(toggle);
          }
        }
      }
      lastActive = currentId;
    });
    obs.observe(mainEl, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => {
      initAccessibilityAndPersistence();
      initViewObserver();
    });
  } else {
    initAccessibilityAndPersistence();
    initViewObserver();
  }
})();
