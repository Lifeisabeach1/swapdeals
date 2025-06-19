export async function trackAnonymousVisit() {
  try {
    console.log('🎯 Tracking anonymous visit...');
    
    const response = await fetch('/api/platform-stats', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'visit'
      })
    });

    const data = await response.json();
    console.log('🎯 Visit tracking response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error tracking visit:', error);
    return { success: false, error: error.message };
  }
}

export async function trackUserLogin(userId) {
  try {
    console.log(`👤 Tracking login for user: ${userId}`);
    
    const response = await fetch('/api/platform-stats', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        user_id: userId
      })
    });

    const data = await response.json();
    console.log('👤 Login tracking response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error tracking login:', error);
    return { success: false, error: error.message };
  }
}

export async function trackUserLogout(userId) {
  try {
    console.log(`👋 Tracking logout for user: ${userId}`);
    
    const response = await fetch('/api/platform-stats', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'logout',
        user_id: userId
      })
    });

    const data = await response.json();
    console.log('👋 Logout tracking response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error tracking logout:', error);
    return { success: false, error: error.message };
  }
}