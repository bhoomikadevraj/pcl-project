/* -----------------------------
   Main Application Initialization
----------------------------- */

async function initApp() {
  // Load components
  const headerHtml = await loadComponent('components/header.html');
  const sidebarHtml = await loadComponent('components/sidebar.html');
  
  // Load all view components
  const dashboardHtml = await loadComponent('components/views/dashboard.html');
  const customPhraseHtml = await loadComponent('components/views/custom-phrase.html');
  const liveCaptionsHtml = await loadComponent('components/views/live-captions.html');
  const signRecognitionHtml = await loadComponent('components/views/sign-recognition.html');
  const environmentTestsHtml = await loadComponent('components/views/environment-tests.html');
  
  // Insert components into containers
  const headerContainer = document.getElementById('header-container');
  const sidebarContainer = document.getElementById('sidebar-container');
  const mainContentContainer = document.getElementById('main-content-container');
  
  if (headerContainer) headerContainer.innerHTML = headerHtml;
  if (sidebarContainer) sidebarContainer.innerHTML = sidebarHtml;
  
  if (mainContentContainer) {
    mainContentContainer.innerHTML = `
      <main class="main-content">
        ${dashboardHtml}
        ${customPhraseHtml}
        ${liveCaptionsHtml}
        ${signRecognitionHtml}
        ${environmentTestsHtml}
      </main>
    `;
  }
  
  // Initialize all modules
  initNavigation();
  initTiles();
  initCustomPhrase();
  initSpeechRecognition();
  initSignRecognition();
  initEnvironmentTests();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);