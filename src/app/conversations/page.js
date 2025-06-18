// /app/conversations/page.js
'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Clock, User, Package, MapPin, Search, Filter, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import useApi from '@/hooks/useApi';
import TradeConversation from '@/components/TradeConversation';
import RegisterForm from '@/components/RegisterForm';
import LoginForm from '@/components/LoginForm';
import Image from 'next/image';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, active, unread
  
  // Modal states for login/register forms
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  
  const router = useRouter();
  const { user, isAuthenticated, token, isLoading: authLoading } = useAuth();
  const api = useApi(token);

  useEffect(() => {
    if (isAuthenticated && token && user) {
      loadConversations();
    } else if (!authLoading && !isAuthenticated) {
      // Don't redirect, just stop loading
      setLoading(false);
    }
  }, [token, isAuthenticated, user, authLoading]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all trades where user is buyer or seller
      const response = await api.get('/api/user/conversations');
      
      if (response.success) {
        setConversations(response.data || []);
      } else {
        setError(response.message || 'Misslyckades med att ladda konversationer');
      }
    } catch (error) {
      setError('Misslyckades med att ladda konversationer. Kontrollera din anslutning.');
    } finally {
      setLoading(false);
    }
  };

  // Handle login/register success
  const handleLoginSuccess = () => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
    // Conversations will be loaded automatically by the useEffect
  };

  // Handle switching between login and register forms
  const handleSwitchToLogin = () => {
    setShowRegisterForm(false);
    setShowLoginForm(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just nu';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m sedan`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h sedan`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d sedan`;
    
    return date.toLocaleDateString();
  };

  const getUserDisplayName = (user) => {
    if (!user) return 'Okänd användare';
    const name = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return name || user.username || 'Anonym användare';
  };

  const filteredConversations = conversations.filter(conv => {
    // Search filter
    const searchMatch = !searchQuery || 
      conv.listing_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getUserDisplayName(conv.other_user)?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    let typeMatch = true;
    if (filterType === 'active') {
      typeMatch = conv.trade_status === 'pending' || conv.trade_status === 'accepted';
    } else if (filterType === 'unread') {
      typeMatch = conv.unread_count > 0;
    }
    
    return searchMatch && typeMatch;
  });

  const openConversation = async (conversation) => {
    // Immediately update the unread count to 0 for this conversation in UI
    if (conversation.unread_count > 0) {
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.trade_id === conversation.trade_id 
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );

      // Mark messages as read in the database
      try {
        await api.post(`/api/user/conversations/${conversation.trade_id}/mark-read`);
      } catch (error) {
        // Optionally revert the UI change if the API call fails
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.trade_id === conversation.trade_id 
              ? { ...conv, unread_count: conversation.unread_count }
              : conv
          )
        );
      }
    }
    
    setSelectedConversation(conversation);
  };

  const closeConversation = () => {
    setSelectedConversation(null);
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
        return 'Aktiv';
      case 'completed':
        return 'Slutförd';
      case 'cancelled':
        return 'Avbruten';
      case 'pending':
        return 'Väntande';
      default:
        return status || 'Aktiv';
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-green-200 border-t-green-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/Swapdealsemoji.png"
                alt="SwapDeals Logo"
                width={40}
                height={40}
                className="object-contain opacity-70"
              />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Kontrollerar autentisering...</p>
          <div className="mt-2 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-4 max-w-md relative z-10">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center border border-green-200/50">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl shadow-xl flex items-center justify-center mx-auto transform hover:scale-105 transition-all duration-300">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg"></div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
              Kom åt dina konversationer
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Anslut med dina bytes partners och hantera alla dina bytes diskussioner. 
              <span className="block mt-2 font-medium text-green-700">Logga in för att visa dina konversationer!</span>
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-2xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center group"
              >
                <span className="mr-3 text-lg group-hover:scale-110 transition-transform">💬</span>
                Logga in för att visa konversationer
              </button>
              
              <button
                onClick={() => setShowRegisterForm(true)}
                className="w-full text-gray-700 hover:text-green-800 py-4 px-6 rounded-2xl transition-all duration-300 font-medium border-2 border-green-200 hover:border-green-300 hover:bg-green-50/80 backdrop-blur-sm flex items-center justify-center group"
              >
                <span className="mr-3 text-lg group-hover:scale-110 transition-transform">✨</span>
                Ny användare? Registrera dig
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full text-gray-600 hover:text-gray-800 py-3 px-6 rounded-2xl transition-all duration-300 font-medium hover:bg-gray-50/80 backdrop-blur-sm flex items-center justify-center group"
              >
                <span className="mr-3 text-lg group-hover:scale-110 transition-transform">🏠</span>
                Gå tillbaka hem
              </button>
            </div>
          </div>
        </div>

        {/* Login and Register Form Modals */}
        <RegisterForm 
          isOpen={showRegisterForm}
          onClose={() => setShowRegisterForm(false)}
          onSuccess={handleLoginSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
        
        <LoginForm 
          isOpen={showLoginForm}
          onClose={() => setShowLoginForm(false)}
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      </div>
    );
  }

  // Loading state - wait for conversations to load
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-green-200 border-t-green-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/Swapdealsemoji.png"
                alt="SwapDeals Logo"
                width={40}
                height={40}
                className="object-contain opacity-70"
              />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Laddar dina konversationer...</p>
          <div className="mt-2 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-red-200/50">
            <div className="text-red-500 text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Fel vid inläsning av konversationer</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={loadConversations}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                🔄 Försök igen
              </button>
              <button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                🏠 Gå hem
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30">
      {/* Premium light effect overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header with SwapDeals branding */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
                Bytes konversationer
              </h1>
              <p className="text-gray-600 font-medium">Hantera alla dina bytes diskussioner på ett ställe</p>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Bar */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-green-200/50 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6 items-end">
            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-semibold text-gray-800 mb-3">Sök konversationer:</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Sök efter användarnamn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-full focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              {[
                { key: 'all', label: '🌟 Alla', emoji: '🌟' },
                { key: 'active', label: '🔥 Aktiva', emoji: '🔥' },
                { key: 'unread', label: '📬 Olästa', emoji: '📬' }
              ].map((type) => (
                <button
                  key={type.key}
                  onClick={() => setFilterType(type.key)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center ${
                    filterType === type.key
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-50 border border-green-200'
                  }`}
                >
                  <span className="mr-2">{type.emoji}</span>
                  {type.key === 'all' ? 'Alla' : type.key === 'active' ? 'Aktiva' : 'Olästa'}
                </button>
              ))}
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={loadConversations}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm flex items-center"
              >
                <span className="mr-2">🔄</span>
                Uppdatera
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {conversations.length}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">Totala konversationer</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                {conversations.filter(c => c.trade_status === 'accepted' || c.trade_status === 'pending').length}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">Aktiva chattar</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                {conversations.filter(c => c.unread_count > 0).length}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">📬</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">Olästa chattar</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                {conversations.reduce((total, c) => total + (c.unread_count || 0), 0)}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">📨</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">Olästa meddelanden</div>
          </div>
        </div>

        {/* Enhanced Conversations List */}
        {filteredConversations.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-green-200/50 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-400">💬</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Inga konversationer hittades</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
              {searchQuery || filterType !== 'all' 
                ? 'Försök justera dina sök- eller filterkriterier'
                : 'Börja byta för att påbörja konversationer med andra användare'
              }
            </p>
            <button
              onClick={() => router.push('/tradelistingpage')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🌟 Börja byta
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredConversations.map((conversation) => (
              <div 
                key={conversation.trade_id} 
                onClick={() => openConversation(conversation)}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Package className="w-6 h-6 text-green-600 mr-3" />
                        <h3 className="text-xl font-bold text-gray-900 mr-3">
                          {conversation.listing_title}
                        </h3>
                        {conversation.unread_count > 0 && (
                          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center bg-green-50/80 px-3 py-1.5 rounded-full">
                          <User className="w-4 h-4 mr-2" />
                          <span>Byter med: <strong className="text-green-800">{getUserDisplayName(conversation.other_user)}</strong></span>
                        </div>
                        
                        {conversation.location && (
                          <div className="flex items-center bg-blue-50/80 px-3 py-1.5 rounded-full">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span><strong className="text-blue-800">{conversation.location}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Last Message Preview */}
                      {conversation.last_message && (
                        <div className="bg-gradient-to-r from-gray-50/80 to-green-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/30 mb-4">
                          <div className="flex items-start">
                            <span className="text-lg mr-3 flex-shrink-0">💬</span>
                            <p className="text-gray-700 font-medium leading-relaxed">
                              <span className="text-green-700 font-semibold">
                                {user && conversation.last_message.sender_id === user.id ? 'Du: ' : `${getUserDisplayName(conversation.other_user)}: `}
                              </span>
                              {conversation.last_message.content}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-6 flex flex-col items-end gap-3">
                      {/* Trade Status */}
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getStatusColor(conversation.trade_status)}`}>
                        {getStatusText(conversation.trade_status)}
                      </span>
                      
                      {/* Last Message Time */}
                      {conversation.last_message && (
                        <div className="flex items-center text-gray-500 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full">
                          <Clock className="w-4 h-4 mr-2" />
                          {formatTime(conversation.last_message.created_at)}
                        </div>
                      )}

                      {conversation.trade_status === 'accepted' && (
                        <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-300/50 flex items-center shadow-md">
                          <span className="mr-1">🔥</span>
                          PÅGÅENDE
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Öppna Chat
                      <span className="ml-2">→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center mx-auto"
          >
            <span className="mr-2">←</span>
            Tillbaka Hem
          </button>
        </div>
      </div>

      {/* Trade Conversation Modal */}
      {selectedConversation && (
        <TradeConversation
          isOpen={!!selectedConversation}
          onClose={closeConversation}
          trade={{
            id: selectedConversation.trade_id,
            status: selectedConversation.trade_status,
            listing_title: selectedConversation.listing_title,
            location: selectedConversation.location
          }}
          otherUser={selectedConversation.other_user}
          listing={{
            title: selectedConversation.listing_title,
            location: selectedConversation.location
          }}
        />
      )}

 {/* Login and Register Form Modals - Available when authenticated too */}
      <RegisterForm 
        isOpen={showRegisterForm}
        onClose={() => setShowRegisterForm(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
      
      <LoginForm 
        isOpen={showLoginForm}
        onClose={() => setShowLoginForm(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />


    </div>
  );
}