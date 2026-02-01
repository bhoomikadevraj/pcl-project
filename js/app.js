/* -----------------------------
   Main Application Initialization
----------------------------- */

function showError(message) {
  const body = document.body;
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#ef4444;color:white;padding:16px 24px;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);z-index:9999;max-width:90%;text-align:center;';
  errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
  body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

function showLoading(show) {
  let loader = document.getElementById('app-loader');
  if (show && !loader) {
    loader = document.createElement('div');
    loader.id = 'app-loader';
    loader.style.cssText = 'position:fixed;inset:0;background:rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center;z-index:9999;';
    loader.innerHTML = '<div style="text-align:center;"><div style="width:48px;height:48px;border:4px solid #e2e8f0;border-top-color:#10b981;border-radius:50%;animation:spin 1s linear infinite;"></div><p style="margin-top:16px;color:#475569;font-weight:500;">Loading...</p></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>';
    document.body.appendChild(loader);
  } else if (!show && loader) {
    loader.remove();
  }
}

async function initApp() {
  try {
    showLoading(true);
    
    // Load components with error tracking
    const components = await Promise.all([
      loadComponent('components/header.html').catch(e => { throw new Error('Failed to load header'); }),
      loadComponent('components/sidebar.html').catch(e => { throw new Error('Failed to load sidebar'); }),
      loadComponent('components/auth.html').catch(e => { throw new Error('Failed to load auth'); }),
      loadComponent('components/views/dashboard.html').catch(e => { throw new Error('Failed to load dashboard'); }),
      loadComponent('components/views/custom-phrase.html').catch(e => { throw new Error('Failed to load custom phrase view'); }),
      loadComponent('components/views/live-captions.html').catch(e => { throw new Error('Failed to load live captions view'); }),
      loadComponent('components/views/sign-recognition.html').catch(e => { throw new Error('Failed to load sign recognition view'); }),
      loadComponent('components/views/environment-tests.html').catch(e => { throw new Error('Failed to load environment tests view'); })
    ]);
    
    const [headerHtml, sidebarHtml, authHtml, dashboardHtml, customPhraseHtml, liveCaptionsHtml, signRecognitionHtml, environmentTestsHtml] = components;
    
    // Insert components into containers
    const headerContainer = document.getElementById('header-container');
    const sidebarContainer = document.getElementById('sidebar-container');
    const mainContentContainer = document.getElementById('main-content-container');
    
    if (!headerContainer || !sidebarContainer || !mainContentContainer) {
      throw new Error('Required containers not found in DOM');
    }
    
    // Add auth to header
    headerContainer.innerHTML = headerHtml + authHtml;
    sidebarContainer.innerHTML = sidebarHtml;
    mainContentContainer.setAttribute('id', 'main-content-container');
    mainContentContainer.innerHTML = `
      <main class="main-content" role="main" aria-label="Main content">
        ${dashboardHtml}
        ${customPhraseHtml}
        ${liveCaptionsHtml}
        ${signRecognitionHtml}
        ${environmentTestsHtml}
      </main>
    `;
    
    // Initialize all modules with error handling
    try { initAuth(); } catch(e) { console.error('Auth init failed:', e); }
    try { initAuthUI(); } catch(e) { console.error('Auth UI init failed:', e); }
    try { initNavigation(); } catch(e) { console.error('Navigation init failed:', e); }
    try { initTiles(); } catch(e) { console.error('Tiles init failed:', e); }
    try { initCustomPhrase(); } catch(e) { console.error('Custom phrase init failed:', e); }
    try { initSpeechRecognition(); } catch(e) { console.error('Speech recognition init failed:', e); }
    try { initSignRecognition(); } catch(e) { console.error('Sign recognition init failed:', e); }
    try { initEnvironmentTests(); } catch(e) { console.error('Environment tests init failed:', e); }
    
    showLoading(false);
  } catch (error) {
    showLoading(false);
    console.error('App initialization failed:', error);
    showError(error.message || 'Failed to initialize app. Please refresh the page.');
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}