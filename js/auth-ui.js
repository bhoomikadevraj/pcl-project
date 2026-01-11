/* -----------------------------
   Authentication UI Handlers
----------------------------- */

function initAuthUI() {
  console.log('Initializing Auth UI...');
  
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');
  const signinModal = document.getElementById('signin-modal');
  const signupModal = document.getElementById('signup-modal');
  const showSigninBtn = document.getElementById('show-signin-btn');
  const showSignupBtn = document.getElementById('show-signup-btn');
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToSignin = document.getElementById('switch-to-signin');
  
  console.log('Auth UI elements found:', {
    profileBtn: !!profileBtn,
    profileDropdown: !!profileDropdown,
    signinModal: !!signinModal,
    signupModal: !!signupModal,
    showSigninBtn: !!showSigninBtn,
    showSignupBtn: !!showSignupBtn
  });
  
  if (!profileBtn || !profileDropdown || !signinModal || !signupModal) {
    console.error('Auth UI elements not found! Waiting for DOM...');
    // Try again after a delay
    setTimeout(initAuthUI, 500);
    return;
  }
  
  // Toggle profile dropdown
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      console.log('Profile button clicked');
      e.stopPropagation();
      const isVisible = profileDropdown.style.display === 'block';
      profileDropdown.style.display = isVisible ? 'none' : 'block';
      console.log('Dropdown display:', profileDropdown.style.display);
    });
  } else {
    console.error('Profile button or dropdown not found');
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (profileDropdown && !e.target.closest('.profile-menu')) {
      profileDropdown.style.display = 'none';
    }
  });
  
  // Show sign in modal
  if (showSigninBtn && signinModal) {
    showSigninBtn.addEventListener('click', () => {
      console.log('Show signin button clicked');
      profileDropdown.style.display = 'none';
      openModal(signinModal);
    });
  } else {
    console.error('Show signin button or modal not found');
  }
  
  // Show sign up modal
  if (showSignupBtn && signupModal) {
    showSignupBtn.addEventListener('click', () => {
      console.log('Show signup button clicked');
      profileDropdown.style.display = 'none';
      openModal(signupModal);
    });
  } else {
    console.error('Show signup button or modal not found');
  }
  
  // Switch between modals
  if (switchToSignup && signupModal && signinModal) {
    switchToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(signinModal);
      openModal(signupModal);
    });
  }
  
  if (switchToSignin && signinModal && signupModal) {
    switchToSignin.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(signupModal);
      openModal(signinModal);
    });
  }
  
  // Close modal buttons
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', () => {
      closeModal(signinModal);
      closeModal(signupModal);
    });
  });
  
  // Sign in form handler
  const signinForm = document.getElementById('signin-form');
  if (signinForm) {
    console.log('Signin form found, adding submit handler');
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Signin form submitted');
      
      const email = document.getElementById('signin-email').value.trim();
      const password = document.getElementById('signin-password').value;
      
      console.log('Signin attempt:', { email });
      
      if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
      }
      
      const result = await signIn(email, password);
      
      if (result.success) {
        signinForm.reset();
        closeModal(signinModal);
      }
    });
  } else {
    console.error('Signin form not found');
  }
  
  // Sign up form handler
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    console.log('Signup form found, adding submit handler');
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Signup form submitted');
      
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-password-confirm').value;
      
      console.log('Signup attempt:', { email });
      
      if (!email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
      }
      
      if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
      }
      
      const result = await signUp(email, password);
      
      if (result.success) {
        signupForm.reset();
        closeModal(signupModal);
      }
    });
  } else {
    console.error('Signup form not found');
  }
  
  // Sign out button handler
  const signoutBtnMenu = document.getElementById('signout-btn-menu');
  if (signoutBtnMenu) {
    signoutBtnMenu.addEventListener('click', () => {
      profileDropdown.style.display = 'none';
      signOut();
    });
  }
  
  console.log('Auth UI initialization complete');
}

// Modal helper functions
function openModal(modal) {
  if (modal) {
    console.log('Opening modal:', modal.id);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  } else {
    console.error('Modal is null');
  }
}

function closeModal(modal) {
  if (modal) {
    console.log('Closing modal:', modal.id);
    modal.style.display = 'none';
    document.body.style.overflow = '';
  } else {
    console.error('Modal is null');
  }
}

// Make functions globally accessible
window.initAuthUI = initAuthUI;
window.openModal = openModal;
window.closeModal = closeModal;
