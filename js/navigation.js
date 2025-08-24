/* -----------------------------
   Navigation & View Management
----------------------------- */

function showView(viewId) {
  // Hide all views
  const views = document.querySelectorAll('.view');
  views.forEach(view => view.classList.remove('active'));
  
  // Show target view
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update nav active state
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  const activeNav = document.querySelector(`[data-view="${viewId}"]`);
  if (activeNav) {
    activeNav.classList.add('active');
  }
}

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  // Navigation click handlers
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = item.getAttribute('data-view');
      showView(viewId);
    });
  });
}