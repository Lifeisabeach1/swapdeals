// ============================================
// FIXED TradeConversation Component
// ============================================

// components/TradeConversation.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Package, MapPin, Clock, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import useApi from '@/hooks/useApi';

const Alert = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: 'from-emerald-500/20 to-green-500/20 border-emerald-400/30 text-emerald-800',
    error: 'from-red-500/20 to-rose-500/20 border-red-400/30 text-red-800',
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`bg-gradient-to-br ${styles[type]} border rounded-2xl p-4 shadow-2xl`}>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default function TradeConversation({ isOpen, onClose, trade, otherUser, listing }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get user and api from hooks
  const { user, token } = useAuth();
  const api = useApi(token);

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Wrap loadMessages in useCallback to prevent unnecessary re-renders
  const loadMessages = useCallback(async () => {
    if (!trade?.id || !token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/traderoom/${trade.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data || []);
      } else {
        throw new Error(data.message || 'Kunde inte ladda meddelanden');
      }
    } catch (error) {
      const errorMessage = 'Kunde inte ladda meddelanden';
      setError(errorMessage);
      showAlert(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [trade?.id, token]); // Removed 'api' from dependencies

  useEffect(() => {
    if (isOpen && trade?.id) {
      loadMessages();
      inputRef.current?.focus();
    }
  }, [isOpen, trade?.id, loadMessages]); // Now loadMessages is included

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending || !token) return;

    const messageText = newMessage.trim();
    setSending(true);
    setNewMessage('');

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      content: messageText,
      sender_id: user.id,
      sender: {
        id: user.id,
        username: user.username || user.name || 'Du',
        name: getUserDisplayName(user)
      },
      created_at: new Date().toISOString(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const response = await fetch(`/api/traderoom/${trade.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          message_type: 'text'
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId 
              ? { ...data.data, status: 'sent' }
              : msg
          )
        );
        showAlert('Meddelandet skickades!', 'success');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      setNewMessage(messageText);
      showAlert('Kunde inte skicka meddelandet', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickMessage = (text) => {
    setNewMessage(text);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const diff = new Date() - date;
    
    if (diff < 60000) return 'Just nu';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min sedan`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} tim sedan`;
    return date.toLocaleDateString('sv-SE');
  };

  const getUserDisplayName = (user) => {
    if (!user) return 'Okänd';
    return user.name || 
           (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null) ||
           user.first_name || 
           user.username || 
           'Anonym';
  };

  const getStatusIcon = (message) => {
    if (message.status === 'sending') return <Clock className="w-3 h-3 text-white/70" />;
    if (message.status === 'sent') return <Check className="w-3 h-3 text-white/70" />;
    if (message.status === 'read') return <CheckCheck className="w-3 h-3 text-green-300" />;
    return null;
  };

  const getStatusColor = (status) => {
    const colors = {
      accepted: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const text = {
      accepted: '🔥 Aktiv',
      completed: '✅ Slutförd',
      cancelled: '❌ Avbruten',
      pending: '⏳ Väntar',
    };
    return text[status] || status;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Alert
        message={alert.message}
        type={alert.type}
        isVisible={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />
      
      <div className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-green-200/50 bg-gradient-to-r from-green-50/80 to-white/90 rounded-t-3xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white text-2xl">💱</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {listing?.title || trade?.listing_title || 'Bytes konversation'}
              </h2>
              <p className="text-gray-600">
                Byter med {getUserDisplayName(otherUser)}
              </p>
            </div>
          </div>
          
          <button onClick={onClose} className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4 bg-gradient-to-r from-blue-50/80 to-white/90 border-b border-blue-200/50 flex items-center justify-between">
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
            <Package className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-semibold">Status: </span>
            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(trade?.status)}`}>
              {getStatusText(trade?.status)}
            </span>
          </div>
          
          {(listing?.location || trade?.location) && (
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
              <MapPin className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-gray-700">{listing?.location || trade?.location}</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-green-50/20 to-white">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Laddar meddelanden...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h4 className="text-xl font-bold text-red-700 mb-3">Fel vid laddning</h4>
                <p className="text-red-600 mb-6">{error}</p>
                <button onClick={loadMessages} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium">
                  Försök igen
                </button>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
                <div className="text-6xl mb-6">💬</div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">Starta konversationen!</h4>
                <p className="text-gray-600">
                  Skicka ett meddelande till <strong>{getUserDisplayName(otherUser)}</strong>
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isMyMessage = String(message.sender_id) === String(user?.id);
              
              return (
                <div key={message.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-lg ${
                    isMyMessage 
                      ? 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-br-sm' 
                      : 'bg-white text-gray-900 rounded-bl-sm'
                  }`}>
                    <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
                    <div className={`flex items-center justify-between mt-2 ${
                      isMyMessage ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">{formatTime(message.created_at)}</span>
                      {isMyMessage && <div className="ml-3">{getStatusIcon(message)}</div>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-green-200/50 bg-gradient-to-r from-green-50/80 to-white/90 rounded-b-3xl">
          <div className="flex gap-3 mb-4">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`💬 Meddelande till ${getUserDisplayName(otherUser)}...`}
              className="flex-1 px-5 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-white shadow-md"
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-3 rounded-2xl shadow-lg"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleQuickMessage("Hej! Låt oss bestämma tid och plats för bytet.")} className="text-sm bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full border border-gray-200 shadow-md">
              📍 Föreslå träff
            </button>
            <button onClick={() => handleQuickMessage("Är föremålet i bra skick?")} className="text-sm bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full border border-gray-200 shadow-md">
              ❓ Fråga om skick
            </button>
            <button onClick={() => handleQuickMessage("Vilken dag passar för bytet?")} className="text-sm bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full border border-gray-200 shadow-md">
              📅 Planera träff
            </button>
            <button onClick={() => handleQuickMessage("Kan vi skicka med posten?")} className="text-sm bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full border border-gray-200 shadow-md">
              ✉️ Posta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}