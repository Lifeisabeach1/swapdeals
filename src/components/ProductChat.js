import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

export default function ProductChat({ 
  isOpen, 
  onClose, 
  listing,
  currentUser,
  token,
  isAuthenticated,
  onUnreadChange // NEW: callback to notify parent of unread count
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadTimestamp, setLastReadTimestamp] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load last read timestamp from localStorage
  useEffect(() => {
    if (listing?.id && currentUser?.id) {
      const key = `chat_last_read_${listing.id}_${currentUser.id}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        setLastReadTimestamp(new Date(stored));
      }
    }
  }, [listing?.id, currentUser?.id]);

  // Mark as read when modal opens
  useEffect(() => {
    if (isOpen && listing?.id && currentUser?.id) {
      const key = `chat_last_read_${listing.id}_${currentUser.id}`;
      const now = new Date().toISOString();
      localStorage.setItem(key, now);
      setLastReadTimestamp(new Date(now));
      setUnreadCount(0);
    }
  }, [isOpen, listing?.id, currentUser?.id]);

  // Calculate unread count
  useEffect(() => {
    if (!isOpen && messages.length > 0 && lastReadTimestamp && currentUser?.id) {
      const unread = messages.filter(msg => {
        const msgDate = new Date(msg.created_at);
        return msgDate > lastReadTimestamp && msg.user?.id !== currentUser.id;
      }).length;
      setUnreadCount(unread);
    }
  }, [messages, lastReadTimestamp, isOpen, currentUser?.id]);

  // Notify parent of unread count changes
  useEffect(() => {
    if (onUnreadChange) {
      onUnreadChange(unreadCount);
    }
  }, [unreadCount, onUnreadChange]);

  const loadMessages = useCallback(async (silent = false) => {
    if (!listing?.id) return;
    
    try {
      if (!silent) setLoadingMessages(true);
      
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/trades/${listing.id}/questions`, {
        headers,
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(data.data || []);
        }
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, [listing?.id, token]);

  // Load messages when modal opens
  useEffect(() => {
    if (isOpen && listing?.id) {
      loadMessages();
    }
  }, [isOpen, listing?.id, loadMessages]);

  // Poll for new messages when modal is closed
  useEffect(() => {
    if (!isOpen && listing?.id) {
      const interval = setInterval(() => {
        loadMessages(true); // Silent load
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isOpen, listing?.id, loadMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || loading) return;
    
    if (!isAuthenticated) {
      alert('Logga in för att skicka meddelanden');
      return;
    }

    if (!token) {
      console.error('❌ NO TOKEN AVAILABLE!');
      alert('Autentiseringsfel: Token saknas. Försök logga in igen.');
      return;
    }

    if (!listing?.id) {
      console.error('❌ NO LISTING ID!');
      alert('Kan inte skicka meddelande: Listing ID saknas.');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`/api/trades/${listing.id}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: newMessage.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const sentMessage = {
          id: data.data.id,
          message: newMessage.trim(),
          user: {
            id: currentUser.id,
            name: currentUser.username || currentUser.name,
            avatar: currentUser.avatar_url
          },
          created_at: new Date().toISOString(),
          is_owner: currentUser.id === listing.user_id
        };
        
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
      } else {
        alert(`Misslyckades att skicka meddelande: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Misslyckades att skicka meddelande: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isOwner = currentUser?.id === listing?.user_id;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl h-[90vh] sm:h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 sm:p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <MessageCircle className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                Produktfrågor
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs bg-red-500 px-2 py-1 rounded-full">
                    {unreadCount} ny{unreadCount !== 1 ? 'a' : ''}
                  </span>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-green-100">
                {listing?.title || 'Annons'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-200 border-t-green-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">Inga frågor ännu</p>
              <p className="text-sm text-gray-400 mt-1">
                Var den första att ställa en fråga!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.user?.id === currentUser?.id;
              const isListingOwner = msg.is_owner;
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                    {/* User info */}
                    <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                        {(msg.user?.name || 'U')[0].toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {msg.user?.name || 'Användare'}
                        {isListingOwner && (
                          <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                            Säljare
                          </span>
                        )}
                      </span>
                    </div>
                    
                    {/* Message bubble */}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.message}
                      </p>
                    </div>
                    
                    {/* Timestamp */}
                    <p className={`text-xs text-gray-400 mt-1 ${isCurrentUser ? 'text-right' : ''}`}>
                      {new Date(msg.created_at).toLocaleString('sv-SE', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4">
          {isAuthenticated ? (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isOwner ? "Svara på frågor..." : "Ställ en fråga..."}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full p-2 transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-2">
              <p className="text-gray-600 text-sm">
                Logga in för att ställa frågor
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
