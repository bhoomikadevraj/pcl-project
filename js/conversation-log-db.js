/* -----------------------------
   Conversation Log Database Operations
----------------------------- */

// Save conversation log to Supabase
async function saveLogToDb(phrase) {
  if (!currentUser || !supabaseClient) {
    return; // Silently skip if not signed in
  }
  
  try {
    const { error } = await supabaseClient
      .from('conversation_logs')
      .insert([
        {
          user_id: currentUser.id,
          phrase: phrase,
          timestamp: new Date().toISOString()
        }
      ]);
    
    if (error) {
      // Only log errors, don't show notifications for log saves
      console.error('Error saving log to database:', error);
    }
  } catch (error) {
    console.error('Error saving log:', error);
  }
}

// Load recent conversation logs from Supabase
async function loadLogsFromDb(limit = 50) {
  if (!currentUser || !supabaseClient) {
    console.log('No user logged in, skipping log load');
    return;
  }
  
  try {
    console.log('Loading conversation logs for user:', currentUser.id);
    
    const { data, error } = await supabaseClient
      .from('conversation_logs')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      // Check if table doesn't exist
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.warn('Table "conversation_logs" does not exist. Run SQL to create it.');
      } else {
        throw error;
      }
      return;
    }
    
    // Display logs in reverse order (oldest first)
    if (data && data.length > 0) {
      const logEl = document.getElementById('log');
      if (logEl) {
        // Clear existing logs
        logEl.innerHTML = '';
        
        // Add logs from database
        data.reverse().forEach(log => {
          const d = document.createElement('div');
          d.className = 'log-entry';
          const time = new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
          d.textContent = `[${time}] ${log.phrase}`;
          logEl.appendChild(d);
        });
        
        logEl.scrollTop = logEl.scrollHeight;
      }
    }
  } catch (error) {
    console.error('Error loading logs:', error);
  }
}

// Clear all conversation logs from database
async function clearLogsFromDb() {
  if (!currentUser || !supabaseClient) {
    return;
  }
  
  try {
    const { error } = await supabaseClient
      .from('conversation_logs')
      .delete()
      .eq('user_id', currentUser.id);
    
    if (error) throw error;
    
    console.log('Database logs cleared successfully');
  } catch (error) {
    console.error('Error clearing database logs:', error);
  }
}
