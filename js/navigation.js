/* -----------------------------
   Navigation & View Management
----------------------------- */

function showView(viewId) {
  // Check if custom phrase requires auth
  if (viewId === 'custom-phrase' && !currentUser) {
    showNotification('You need to sign in to use this feature', 'error');
    return; // Don't change view, stay on current view
  }
  
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
  const sidebar = document.querySelector('.sidebar');
  
  // Add ARIA attributes to navigation
  if (sidebar) {
    sidebar.setAttribute('role', 'navigation');
    sidebar.setAttribute('aria-label', 'Main navigation');
  }
  
  // Navigation click and keyboard handlers
  navItems.forEach(item => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    
    const handleActivation = (e) => {
      e.preventDefault();
      const viewId = item.getAttribute('data-view');
      showView(viewId);
    };
    
    item.addEventListener('click', handleActivation);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleActivation(e);
      }
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
  const sidebar = document.querySelector('.sidebar');
  
  document.body.classList.add('sidebar-open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
  if (backdrop) {
    backdrop.hidden = false;
    backdrop.setAttribute('aria-hidden', 'false');
  }
  
  // Focus first nav item when sidebar opens on mobile
  if (window.innerWidth <= 1024 && sidebar) {
    const firstNavItem = sidebar.querySelector('.nav-item');
    if (firstNavItem) {
      setTimeout(() => firstNavItem.focus(), 100);
    }
  }
}

function closeSidebar() {
  const menuBtn = document.getElementById('sidebarToggle');
  const backdrop = document.getElementById('sidebar-backdrop');
  
  document.body.classList.remove('sidebar-open');
  if (menuBtn) {
    menuBtn.setAttribute('aria-expanded', 'false');
    // Return focus to menu button on mobile when closing
    if (window.innerWidth <= 1024) {
      menuBtn.focus();
    }
  }
  if (backdrop) {
    backdrop.hidden = true;
    backdrop.setAttribute('aria-hidden', 'true');
  }
}

function toggleSidebar() {
  if (document.body.classList.contains('sidebar-open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}