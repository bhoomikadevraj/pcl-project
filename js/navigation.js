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

  // Close sidebar after navigation on small screens
  closeSidebar();
}

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const menuBtn = document.getElementById('sidebarToggle');
  const backdrop = document.getElementById('sidebar-backdrop');
  
  // Navigation click handlers
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = item.getAttribute('data-view');
      showView(viewId);
    });
  });

  // Toggle sidebar with header button
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      toggleSidebar();
    });
  }

  // Click on backdrop closes sidebar
  if (backdrop) {
    backdrop.addEventListener('click', () => closeSidebar());
  }

  // ESC closes sidebar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });
}

function openSidebar() {
  const menuBtn = document.getElementById('sidebarToggle');
  const backdrop = document.getElementById('sidebar-backdrop');
  document.body.classList.add('sidebar-open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
  if (backdrop) backdrop.hidden = false;
}

function closeSidebar() {
  const menuBtn = document.getElementById('sidebarToggle');
  const backdrop = document.getElementById('sidebar-backdrop');
  document.body.classList.remove('sidebar-open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  if (backdrop) backdrop.hidden = true;
}

function toggleSidebar() {
  if (document.body.classList.contains('sidebar-open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}