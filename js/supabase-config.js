/* -----------------------------
   Supabase Configuration
----------------------------- */

// TODO: Replace with your actual Supabase project credentials
const SUPABASE_URL = 'https://eagjfsjojrzjbrcmolcs.supabase.co'; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZ2pmc2pvanJ6amJyY21vbGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMjk0NzUsImV4cCI6MjA4MzcwNTQ3NX0.AIuE_yZaIkBmf0uQtKwzTxMTYoZmrxCmUQ0jIEgv8n0';

// Initialize Supabase client
let supabaseClient;

try {
  if (typeof window.supabase === 'undefined') {
    console.error('Supabase library not loaded. Please check if the CDN script is loading correctly.');
  } else {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

// Make it available globally as 'supabase' for backwards compatibility
if (typeof supabase === 'undefined') {
  var supabase = supabaseClient;
}

// Current user state
let currentUser = null;

// Initialize auth state
async function initAuth() {
  if (!supabaseClient) {
    console.error('Cannot initialize auth: Supabase client not available');
    return;
  }
  
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    currentUser = session?.user || null;
    console.log('Current user:', currentUser);
    updateAuthUI();
    
    // Listen for auth changes
    supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      currentUser = session?.user || null;
      updateAuthUI();
      
      if (event === 'SIGNED_IN') {
        showView('dashboard');
        showNotification('Welcome back!', 'success');
        loadUserPhrases();
        loadLogsFromDb();
      } else if (event === 'SIGNED_OUT') {
        showView('dashboard');
        showNotification('Signed out successfully', 'success');
        clearUserPhrases();
      }
    });
  } catch (error) {
    console.error('Auth initialization error:', error);
  }
}

// Update UI based on auth state
function updateAuthUI() {
  const authMenu = document.getElementById('auth-menu');
  const userMenu = document.getElementById('user-menu');
  const userEmailDisplay = document.querySelector('.user-email-display');
  const profileBtn = document.getElementById('profile-btn');
  const customPhraseNav = document.querySelector('[data-view="custom-phrase"]');
  
  if (currentUser) {
    // User is signed in
    if (authMenu) authMenu.style.display = 'none';
    if (userMenu) userMenu.style.display = 'block';
    if (userEmailDisplay) userEmailDisplay.textContent = currentUser.email;
    if (profileBtn) {
      profileBtn.classList.add('logged-in');
      profileBtn.querySelector('.profile-icon').textContent = '✓';
    }
    if (customPhraseNav) {
      customPhraseNav.style.pointerEvents = 'auto';
      customPhraseNav.style.opacity = '1';
      customPhraseNav.style.cursor = 'pointer';
      customPhraseNav.classList.remove('locked');
      customPhraseNav.title = '';
      // Remove lock icon if present
      const lockIcon = customPhraseNav.querySelector('.lock-icon');
      if (lockIcon) lockIcon.remove();
    }
  } else {
    // User is signed out
    if (authMenu) authMenu.style.display = 'block';
    if (userMenu) userMenu.style.display = 'none';
    if (profileBtn) {
      profileBtn.classList.remove('logged-in');
      profileBtn.querySelector('.profile-icon').textContent = '👤';
    }
    if (customPhraseNav) {
      customPhraseNav.style.pointerEvents = 'auto'; // Allow clicks to show notification
      customPhraseNav.style.opacity = '0.6';
      customPhraseNav.style.cursor = 'not-allowed';
      customPhraseNav.classList.add('locked');
      customPhraseNav.title = 'Sign in to use this feature';
      // Add lock icon if not present
      if (!customPhraseNav.querySelector('.lock-icon')) {
        const lockIcon = document.createElement('span');
        lockIcon.className = 'lock-icon';
        lockIcon.textContent = '🔒';
        customPhraseNav.querySelector('.nav-content').appendChild(lockIcon);
      }
    }
  }
}

// Sign up
async function signUp(email, password) {
  if (!supabaseClient) {
    showNotification('Supabase not initialized. Please refresh the page.', 'error');
    return { success: false, error: 'Supabase not initialized' };
  }
  
  try {
    console.log('Attempting sign up with email:', email);
    
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    
    console.log('Sign up response:', { data, error });
    
    if (error) throw error;
    
    // Check if email confirmation is required
    if (data?.user && !data.session) {
      showNotification('Account created! Please check your email to verify.', 'success');
    } else if (data?.session) {
      showNotification('Account created and logged in!', 'success');
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Sign up error:', error);
    showNotification(error.message || 'Sign up failed', 'error');
    return { success: false, error };
  }
}

// Sign in
async function signIn(email, password) {
  if (!supabaseClient) {
    showNotification('Supabase not initialized. Please refresh the page.', 'error');
    return { success: false, error: 'Supabase not initialized' };
  }
  
  try {
    console.log('Attempting sign in with email:', email);
    
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Sign in response:', { data, error });
    
    if (error) throw error;
    
    showNotification('Signed in successfully!', 'success');
    return { success: true, data };
  } catch (error) {
    console.error('Sign in error:', error);
    showNotification(error.message || 'Sign in failed', 'error');
    return { success: false, error };
  }
}

// Sign out
async function signOut() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    
    // Clear local custom phrases
    tiles = loadTilesFromStorage();
    renderTiles();
  } catch (error) {
    showNotification(error.message || 'Sign out failed', 'error');
  }
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 400px;
  `;
  
  if (type === 'success') {
    notification.style.background = '#10b981';
    notification.style.color = 'white';
  } else if (type === 'error') {
    notification.style.background = '#ef4444';
    notification.style.color = 'white';
  } else {
    notification.style.background = '#3b82f6';
    notification.style.color = 'white';
  }
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 4000);
}
