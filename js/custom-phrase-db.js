/* -----------------------------
   Custom Phrase Database Operations
----------------------------- */

// Clear user's custom phrases (reset to default tiles)
function clearUserPhrases() {
  console.log('Clearing user custom phrases');
  const defaultTiles = [
    { emoji: "👋", label: "Hello", phrase: "Hello!" },
    { emoji: "👍", label: "Yes", phrase: "Yes" },
    { emoji: "👎", label: "No", phrase: "No" },
    { emoji: "🙏", label: "Please", phrase: "Please" },
    { emoji: "😊", label: "Thank You", phrase: "Thank you" },
    { emoji: "❤️", label: "I Love You", phrase: "I love you" },
    { emoji: "🆘", label: "Help", phrase: "I need help" },
    { emoji: "😢", label: "Sorry", phrase: "I'm sorry" },
    { emoji: "👌", label: "OK", phrase: "Okay" },
    { emoji: "⏰", label: "Wait", phrase: "Please wait" },
    { emoji: "🚫", label: "Stop", phrase: "Stop" },
    { emoji: "🍽️", label: "Hungry", phrase: "I'm hungry" },
    { emoji: "💧", label: "Thirsty", phrase: "I'm thirsty" },
    { emoji: "😴", label: "Tired", phrase: "I'm tired" },
    { emoji: "🤒", label: "Sick", phrase: "I don't feel well" },
    { emoji: "🚻", label: "Bathroom", phrase: "I need the bathroom" },
    { emoji: "👋", label: "Goodbye", phrase: "Goodbye" },
    { emoji: "🙂", label: "I'm Fine", phrase: "I'm fine" },
  ];
  tiles = [...defaultTiles];
  renderTiles();
  localStorage.removeItem('tiles'); // Clear saved custom tiles
}

// Load user's custom phrases from Supabase
async function loadUserPhrases() {
  if (!currentUser) {
    console.log('No user logged in, skipping phrase load');
    return;
  }
  
  if (!supabaseClient) {
    console.error('Supabase not initialized');
    return;
  }
  
  try {
    console.log('Loading phrases for user:', currentUser.id);
    
    const { data, error } = await supabaseClient
      .from('custom_phrases')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });
    
    console.log('Load phrases response:', { data, error });
    
    if (error) {
      // Check if table doesn't exist
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.error('Table "custom_phrases" does not exist. Please run the SQL schema from SUPABASE_SETUP.md');
        showNotification('Database not set up. Please check setup instructions.', 'error');
      }
      throw error;
    }
    
    // Convert database format to tiles format
    if (data && data.length > 0) {
      const userPhrases = data.map(p => ({
        emoji: p.emoji || '💬',
        label: p.label,
        phrase: p.phrase,
        id: p.id
      }));
      
      // Merge with default tiles
      const defaultTiles = [
        { emoji: "👋", label: "Hello", phrase: "Hello!" },
        { emoji: "👍", label: "Yes", phrase: "Yes" },
        { emoji: "👎", label: "No", phrase: "No" },
        { emoji: "🙏", label: "Please", phrase: "Please" },
        { emoji: "😊", label: "Thank You", phrase: "Thank you" },
        { emoji: "❤️", label: "I Love You", phrase: "I love you" },
        { emoji: "🆘", label: "Help", phrase: "I need help" },
        { emoji: "😢", label: "Sorry", phrase: "I'm sorry" },
        { emoji: "👌", label: "OK", phrase: "Okay" },
        { emoji: "⏰", label: "Wait", phrase: "Please wait" },
        { emoji: "🚫", label: "Stop", phrase: "Stop" },
        { emoji: "🍽️", label: "Hungry", phrase: "I'm hungry" },
        { emoji: "💧", label: "Thirsty", phrase: "I'm thirsty" },
        { emoji: "😴", label: "Tired", phrase: "I'm tired" },
        { emoji: "🤒", label: "Sick", phrase: "I don't feel well" },
        { emoji: "🚻", label: "Bathroom", phrase: "I need the bathroom" },
        { emoji: "👋", label: "Goodbye", phrase: "Goodbye" },
        { emoji: "🙂", label: "I'm Fine", phrase: "I'm fine" },
      ];
      
      tiles = [...defaultTiles, ...userPhrases];
      renderTiles();
    }
  } catch (error) {
    console.error('Error loading user phrases:', error);
    showNotification('Failed to load custom phrases', 'error');
  }
}

// Save custom phrase to Supabase
async function saveCustomPhraseToDb(phrase, label, emoji = '💬') {
  if (!currentUser) {
    showNotification('Please sign in to save custom phrases', 'error');
    return { success: false };
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('custom_phrases')
      .insert([
        {
          user_id: currentUser.id,
          phrase: phrase,
          label: label,
          emoji: emoji
        }
      ])
      .select();
    
    if (error) throw error;
    
    showNotification('Phrase saved successfully!', 'success');
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error saving phrase:', error);
    showNotification('Failed to save phrase', 'error');
    return { success: false, error };
  }
}

// Delete custom phrase from Supabase
async function deleteCustomPhraseFromDb(phraseId) {
  if (!currentUser) return { success: false };
  
  try {
    const { error } = await supabaseClient
      .from('custom_phrases')
      .delete()
      .eq('id', phraseId)
      .eq('user_id', currentUser.id);
    
    if (error) throw error;
    
    showNotification('Phrase deleted', 'success');
    return { success: true };
  } catch (error) {
    console.error('Error deleting phrase:', error);
    showNotification('Failed to delete phrase', 'error');
    return { success: false, error };
  }
}

// Real-time subscription for custom phrases
function subscribeToUserPhrases() {
  if (!currentUser) return;
  
  const subscription = supabaseClient
    .channel('custom_phrases_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'custom_phrases',
        filter: `user_id=eq.${currentUser.id}`
      },
      (payload) => {
        console.log('Phrase changed:', payload);
        loadUserPhrases(); // Reload phrases on any change
      }
    )
    .subscribe();
  
  return subscription;
}
