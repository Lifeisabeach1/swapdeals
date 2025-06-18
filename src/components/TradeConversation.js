import { useState, useEffect, useRef } from 'react';
import { X, Send, Phone, Mail, MapPin, Package, Clock, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import useApi from '@/hooks/useApi';
import Image from 'next/image';

export default function TradeConversation({ 
  isOpen, 
  onClose, 
  trade, 
  otherUser, 
  listing 
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  
  // Add state for enhanced other user data
  const [enhancedOtherUser, setEnhancedOtherUser] = useState(otherUser || null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  
  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'info',
    title: null
  });
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { user, token } = useAuth();
  const api = useApi(token);

  // Fetch enhanced user data
  const fetchOtherUserData = async () => {
    if (!trade?.id || enhancedOtherUser?.first_name) {
      return; // Already have complete data
    }

    try {
      setLoadingUserData(true);
      
      // Get the other user's ID from the trade
      const otherUserId = trade.buyer_id === user.id ? trade.seller_id : trade.buyer_id;
      
      if (!otherUserId) return;

      const response = await api.get(`/api/users/${otherUserId}`);
      
      if (response.success && response.data) {
        setEnhancedOtherUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching other user data:', error);
    } finally {
      setLoadingUserData(false);
    }
  };

  // Show alert helper function
  const showAlert = (message, type = 'info', title = null) => {
    setAlert({
      show: true,
      message,
      type,
      title
    });
  };

  // Hide alert
  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation messages and user data
  useEffect(() => {
    if (isOpen && trade?.id) {
      loadMessages();
      fetchOtherUserData();
    }
  }, [isOpen, trade?.id]);

  // Update enhanced user when otherUser prop changes
  useEffect(() => {
    if (otherUser) {
      setEnhancedOtherUser(otherUser);
    }
  }, [otherUser]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the correct endpoint - /api/trades/ for messages
      const response = await api.get(`/api/traderoom/${trade.id}/messages`);
      
      if (response.success) {
        setMessages(response.data || []);
      } else {
        setError(response.message || 'Kunde inte ladda meddelanden');
        showAlert(
          response.message || 'Kunde inte ladda meddelanden. Försök igen.',
          'error',
          'Laddningsfel'
        );
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      const errorMessage = 'Kunde inte ladda meddelanden. Kontrollera din anslutning.';
      setError(errorMessage);
      showAlert(errorMessage, 'error', 'Anslutningsfel');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setSending(true);
    
    // Clear the input immediately after capturing the message
    setNewMessage('');

    // Create optimistic message with preserved message text
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMessage = {
      id: tempId,
      message: messageText, // Preserve the original message text
      text: messageText, // Add alternative field name
      content: messageText, // Add another alternative
      sender_id: user.id,
      sender: {
        id: user.id,
        username: user.username || user.name || 'Du',
        first_name: user.first_name,
        last_name: user.last_name,
        name: getUserDisplayName(user),
        avatar_url: user.avatar_url
      },
      created_at: new Date().toISOString(),
      status: 'sending',
      isOptimistic: true
    };
    
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      // Use the correct endpoint - /api/trades/ for sending messages
      const response = await api.post(`/api/traderoom/${trade.id}/messages`, {
        message: messageText,
        message_type: 'text'
      });

      if (response.success) {
        // Replace optimistic message with real message, preserving message text
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId 
              ? { 
                  ...response.data,
                  // Ensure message text is preserved from multiple possible fields
                  message: response.data.message || response.data.text || response.data.content || messageText,
                  text: response.data.text || response.data.message || response.data.content || messageText,
                  content: response.data.content || response.data.message || response.data.text || messageText,
                  status: 'sent',
                  isOptimistic: false,
                  sender: response.data.sender || msg.sender
                }
              : msg
          )
        );
        
        // Show success feedback for message sent
        showAlert('Meddelandet skickades!', 'success', null);
      } else {
        throw new Error(response.message || 'Kunde inte skicka meddelandet');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      // Show error and restore message to input
      setNewMessage(messageText);
      showAlert(
        'Kunde inte skicka meddelandet. Kontrollera din anslutning och försök igen.',
        'error',
        'Skickandet misslyckades'
      );
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setNewMessage(e.target.value);
  };

  const handleQuickMessage = (messageText) => {
    setNewMessage(messageText);
    // Focus the input after setting the message
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(messageText.length, messageText.length);
      }
    }, 10);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) {
      return 'Just nu';
    }
    
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} min sedan`;
    }
    
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} tim sedan`;
    }
    
    return date.toLocaleDateString('sv-SE');
  };

  const getUserDisplayName = (user) => {
    if (!user) return 'Okänd användare';
    
    const firstName = user.first_name;
    const lastName = user.last_name;
    const name = user.name;
    const username = user.username;
    
    console.log('getUserDisplayName called with:', { 
      firstName, 
      lastName, 
      name, 
      username,
      fullUser: user 
    }); // Debug log
    
    if (name && name.trim()) {
      return name;
    }
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }
    
    return username || user.display_name || 'Anonym användare';
  };

  const getUserInitial = (user) => {
    const displayName = getUserDisplayName(user);
    return displayName && displayName.length > 0 ? displayName.charAt(0).toUpperCase() : 'A';
  };

  const getMessageStatus = (message) => {
    if (message.status === 'sending') {
      return <Clock className="w-3 h-3 text-white/70" />;
    } else if (message.status === 'sent') {
      return <Check className="w-3 h-3 text-white/70" />;
    } else if (message.status === 'delivered') {
      return <CheckCheck className="w-3 h-3 text-white/70" />;
    } else if (message.status === 'read') {
      return <CheckCheck className="w-3 h-3 text-green-300" />;
    }
    return null;
  };

  // Helper function to safely get message text from various possible fields
  const getMessageText = (message) => {
    return message.message || message.text || message.content || '';
  };

  const handleRetryLoadMessages = () => {
    setError(null);
    loadMessages();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-gradient-to-br from-green-100 to-green-200 text-green-800 border border-green-300/50';
      case 'completed':
        return 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 border border-blue-300/50';
      case 'cancelled':
        return 'bg-gradient-to-br from-red-100 to-red-200 text-red-800 border border-red-300/50';
      case 'pending':
        return 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300/50';
      default:
        return 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 border border-gray-300/50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return '🔥 Aktiv';
      case 'completed':
        return '✅ Slutförd';
      case 'cancelled':
        return '❌ Avbruten';
      case 'pending':
        return '⏳ Väntar';
      default:
        return status;
    }
  };

  // Use enhancedOtherUser instead of otherUser for display
  const currentOtherUser = enhancedOtherUser || otherUser;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        {/* Premium light effect overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/10 to-transparent pointer-events-none"></div>
        
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-200/50 w-full max-w-5xl h-[85vh] flex flex-col relative">
          {/* Enhanced Header with SwapDeals branding */}
          <div className="flex items-center justify-between p-6 border-b border-green-200/50 bg-gradient-to-r from-green-50/80 via-white/90 to-green-50/80 backdrop-blur-lg rounded-t-3xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-xl shadow-lg flex items-center justify-center mr-4">
                <Image
                  src="/Swapdealsemoji.png"
                  alt="SwapDeals Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
                   {listing?.title || trade?.listing_title || 'Bytes konversation'}
                </h2>
                <div className="text-gray-600 font-medium flex items-center">
                  Byter med {loadingUserData ? (
                    <span className="ml-1 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent mr-2"></div>
                      Laddar...
                    </span>
                  ) : (
                    getUserDisplayName(currentOtherUser)
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-200 backdrop-blur-sm border border-gray-200/50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Enhanced Trade Info Bar */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50/80 via-white/90 to-blue-50/80 backdrop-blur-lg border-b border-blue-200/50 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 shadow-md">
                <Package className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-semibold">Bytes status: </span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-bold shadow-sm ${getStatusColor(trade?.status)}`}>
                  {getStatusText(trade?.status)}
                </span>
              </div>
              
             
            </div>
            
            {(listing?.location || trade?.location) && (
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 shadow-md">
                <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-gray-700 font-medium">{listing?.location || trade?.location}</span>
              </div>
            )}
          </div>

          {/* Enhanced Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-green-50/20 via-white/50 to-green-50/20">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src="/Swapdealsemoji.png"
                        alt="SwapDeals Logo"
                        width={24}
                        height={24}
                        className="object-contain opacity-70"
                      />
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium">Laddar meddelanden...</p>
                  <div className="mt-2 flex justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-red-200/50 p-8 max-w-md mx-auto">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h4 className="text-xl font-bold text-red-700 mb-3">Fel vid laddning av meddelanden</h4>
                  <p className="text-red-600 mb-6 leading-relaxed">{error}</p>
                  <button
                    onClick={handleRetryLoadMessages}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    🔄 Försök igen
                  </button>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-green-200/50 p-12 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">💬</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">Starta konversationen!</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Skicka ett meddelande till <strong className="text-green-700">{getUserDisplayName(currentOtherUser)}</strong> för att arrangera er handel.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isMyMessage = message.sender_id === user.id;
                const messageText = getMessageText(message);
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5 ${
                      isMyMessage 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-br-sm border-green-400/50' 
                        : 'bg-white/90 text-gray-900 rounded-bl-sm border-gray-200/50'
                    }`}>
                      {/* Display message text with fallback */}
                      <p className="text-sm break-words whitespace-pre-wrap leading-relaxed font-medium">
                        {messageText || '[Meddelandeinnehåll inte tillgängligt]'}
                      </p>
                      <div className={`flex items-center justify-between mt-2 ${
                        isMyMessage ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        <span className="text-xs font-medium">{formatTime(message.created_at)}</span>
                        {isMyMessage && (
                          <div className="ml-3">
                            {getMessageStatus(message)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Message Input */}
          <div className="p-6 border-t border-green-200/50 bg-gradient-to-r from-green-50/80 via-white/90 to-green-50/80 backdrop-blur-lg rounded-b-3xl">
            <form onSubmit={handleSendMessage} className="flex space-x-3 mb-4">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder={`💬 Meddelande till ${getUserDisplayName(currentOtherUser)}...`}
                className="flex-1 px-5 py-3 border border-green-200/50 rounded-2xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none text-gray-900 bg-white/90 backdrop-blur-sm font-medium shadow-md transition-all duration-200"
                disabled={sending}
                autoComplete="off"
                spellCheck="true"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </button>
            </form>
            
            {/* Enhanced Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleQuickMessage("Hej! Låt oss bestämma tid och plats för träffen och bytet.")}
                className="text-sm bg-white/80 hover:bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full transition-all duration-200 border border-gray-200/50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
              >
                📍 Föreslå träff
              </button>
              <button
                onClick={() => handleQuickMessage("Är föremålet fortfarande i bra skick som beskrivs?")}
                className="text-sm bg-white/80 hover:bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full transition-all duration-200 border border-gray-200/50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
              >
                ❓ Fråga om skick
              </button>
              <button
                onClick={() => handleQuickMessage("Vilken dag kan vi träffas och göra bytet?")}
                className="text-sm bg-white/80 hover:bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full transition-all duration-200 border border-gray-200/50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
              >
                📅 Planera träff
              </button>
             <button                 
             onClick={() => handleQuickMessage("Funkar det bra för dig att vi skickar sakerna med posten??")}                 
             className="text-sm bg-white/80 hover:bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full transition-all duration-200 border border-gray-200/50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"               
             >                 
              ✉️ Skicka sakerna med posten               
                </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}