// /app/conversations/page.js
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle, Clock, User, Package, MapPin, Search, Filter, X, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
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
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  
  const router = useRouter();
  const { user, isAuthenticated, token, isLoading: authLoading } = useAuth();
  
  // Track last token used to prevent duplicate requests with old tokens
  const lastTokenRef = useRef(null);

  const loadConversations = useCallback(async () => {
    // Skip if no token OR if it's the same token we just used
    if (!token || token === lastTokenRef.current) return;
    
    // Mark this token as used
    lastTokenRef.current = token;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.data || []);
      } else {
        setError(data.message || 'Misslyckades med att ladda konversationer');
      }
    } catch (error) {
      setError('Misslyckades med att ladda konversationer. Kontrollera din anslutning.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token && user) {
      loadConversations();
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [token, isAuthenticated, user, authLoading, loadConversations]);

  const handleAuthSuccess = () => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
    // Reset ref so new token will load
    lastTokenRef.current = null;
  };

  const formatTime = (timestamp) => {
    const diff = new Date() - new Date(timestamp);
    if (diff < 60000) return 'Nu';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
    return new Date(timestamp).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
  };

  const getUserDisplayName = (user) => {
    if (!user) return 'Okänd användare';
    const name = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return name || user.username || 'Anonym användare';
  };

  const filteredConversations = conversations.filter(conv => {
    const searchMatch = !searchQuery || 
      conv.listing_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getUserDisplayName(conv.other_user)?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'active') {
      return searchMatch && (conv.trade_status === 'pending' || conv.trade_status === 'accepted');
    }
    if (filterType === 'unread') {
      return searchMatch && conv.unread_count > 0;
    }
    return searchMatch;
  });

  const openConversation = async (conversation) => {
    if (conversation.unread_count > 0) {
      setConversations(prev => 
        prev.map(c => c.trade_id === conversation.trade_id ? { ...c, unread_count: 0 } : c)
      );

      try {
        await fetch(`/api/user/conversations/${conversation.trade_id}/mark-read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        setConversations(prev => 
          prev.map(c => c.trade_id === conversation.trade_id ? { ...c, unread_count: conversation.unread_count } : c)
        );
      }
    }
    setSelectedConversation(conversation);
  };

  const STATUS_COLORS = {
    accepted: 'bg-gradient-to-br from-green-100 to-green-200 text-green-800 border border-green-300/50',
    completed: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 border border-blue-300/50',
    cancelled: 'bg-gradient-to-br from-red-100 to-red-200 text-red-800 border border-red-300/50',
    pending: 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300/50'
  };

  const STATUS_TEXT = {
    accepted: 'Aktiv',
    completed: 'Slutförd',
    cancelled: 'Avbruten',
    pending: 'Väntande'
  };

  const getStatColorClasses = (color) => {
    const colorMap = {
      blue: {
        text: 'bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent',
        bg: 'bg-gradient-to-br from-blue-100 to-blue-200'
      },
      green: {
        text: 'bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent',
        bg: 'bg-gradient-to-br from-green-100 to-green-200'
      },
      red: {
        text: 'bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent',
        bg: 'bg-gradient-to-br from-red-100 to-red-200'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const stats = [
    { value: conversations.length, label: 'Totala konversationer', emoji: '💬', color: 'blue' },
    { value: conversations.filter(c => ['accepted', 'pending'].includes(c.trade_status)).length, label: 'Aktiva chattar', emoji: '🔥', color: 'green' },
    { value: conversations.filter(c => c.unread_count > 0).length, label: 'Olästa chattar', emoji: '📬', color: 'red' },
    { value: conversations.reduce((total, c) => total + (c.unread_count || 0), 0), label: 'Olästa meddelanden', emoji: '📨', color: 'blue' }
  ];

  if (authLoading) return <LoadingScreen message="Kontrollerar autentisering..." />;
  
  if (!isAuthenticated) {
    return (
      <AuthScreen 
        onLogin={() => setShowLoginForm(true)}
        onRegister={() => setShowRegisterForm(true)}
        onHome={() => router.push('/')}
        showLoginForm={showLoginForm}
        showRegisterForm={showRegisterForm}
        onCloseLogin={() => setShowLoginForm(false)}
        onCloseRegister={() => setShowRegisterForm(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  if (loading) return <LoadingScreen message="Laddar dina konversationer..." />;
  
  if (error) {
    return (
      <ErrorScreen 
        error={error}
        onRetry={loadConversations}
        onHome={() => router.push('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg flex items-center justify-center mr-4">
              <Image src="/Swapdealsemoji.webp" alt="Logo" width={20} height={20} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                Bytes konversationer
              </h1>
              <p className="text-gray-600 font-medium text-sm">Hantera alla dina bytes diskussioner</p>
            </div>
          </div>
        </div>
        
        {/* Search & Filters */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-green-200/50 p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Sök konversationer:</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Sök efter användarnamn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-green-200 rounded-full focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
              />
            </div>
          </div>
          
          <div className="sm:hidden flex justify-between mb-4">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-full">
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {showFilters ? <X className="w-4 h-4 ml-2" /> : <Menu className="w-4 h-4 ml-2" />}
            </button>
            <button onClick={loadConversations} className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-full font-medium">
              🔄 Uppdatera
            </button>
          </div>
          
          <div className={`${showFilters ? 'block' : 'hidden'} sm:flex gap-3`}>
            {[
              { key: 'all', label: 'Alla', emoji: '🌟' },
              { key: 'active', label: 'Aktiva', emoji: '🔥' },
              { key: 'unread', label: 'Olästa', emoji: '📬' }
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => { setFilterType(type.key); setShowFilters(false); }}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-full font-medium ${
                  filterType === type.key
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-green-200'
                }`}
              >
                {type.emoji} {type.label}
              </button>
            ))}
            
            <button onClick={loadConversations} className="hidden sm:block bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-full font-medium">
              🔄 Uppdatera
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const colorClasses = getStatColorClasses(stat.color);
            return (
              <div key={i} className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-3xl font-bold ${colorClasses.text}`}>
                    {stat.value}
                  </div>
                  <div className={`w-10 h-10 ${colorClasses.bg} rounded-xl flex items-center justify-center`}>
                    <span className="text-xl">{stat.emoji}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-green-200/50 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-400">💬</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Inga konversationer hittades</h3>
            <p className="text-gray-600 mb-6">Börja byta för att påbörja konversationer med andra användare</p>
            <button
              onClick={() => router.push('/tradelistingpage')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full font-medium"
            >
              🌟 Börja byta
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredConversations.map((conv) => (
              <div key={conv.trade_id} onClick={() => openConversation(conv)} className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 hover:shadow-2xl transition-all cursor-pointer p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center mb-2">
                        <Package className="w-6 h-6 text-green-600 mr-2" />
                        <h3 className="text-xl font-bold text-gray-900 truncate">{conv.listing_title}</h3>
                        {conv.unread_count > 0 && (
                          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ml-2">
                            {conv.unread_count > 9 ? '9+' : conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${STATUS_COLORS[conv.trade_status] || STATUS_COLORS.pending}`}>
                      {STATUS_TEXT[conv.trade_status] || conv.trade_status || 'Aktiv'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center bg-green-50/80 px-3 py-2 rounded-full">
                      <User className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm text-gray-700">
                        Byter med: <strong className="text-green-800">{getUserDisplayName(conv.other_user)}</strong>
                      </span>
                    </div>
                    
                    {conv.location && (
                      <div className="flex items-center bg-blue-50/80 px-3 py-2 rounded-full">
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-sm"><strong className="text-blue-800">{conv.location}</strong></span>
                      </div>
                    )}
                  </div>

                  {conv.last_message && (
                    <div className="bg-gradient-to-r from-gray-50/80 to-green-50/80 p-4 rounded-xl border border-gray-200/30">
                      <div className="flex items-start">
                        <span className="text-lg mr-3">💬</span>
                        <p className="text-sm text-gray-700 font-medium">
                          <span className="text-green-700 font-semibold">
                            {user && conv.last_message.sender_id === user.id ? 'Du: ' : `${getUserDisplayName(conv.other_user)}: `}
                          </span>
                          {conv.last_message.content}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {conv.last_message && (
                      <div className="flex items-center text-gray-500 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full">
                        <Clock className="w-4 h-4 mr-2" />
                        {formatTime(conv.last_message.created_at)}
                      </div>
                    )}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-full font-medium flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Öppna Chat →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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

      {selectedConversation && (
        <TradeConversation
          isOpen={!!selectedConversation}
          onClose={() => setSelectedConversation(null)}
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

      <RegisterForm 
        isOpen={showRegisterForm}
        onClose={() => setShowRegisterForm(false)}
        onSuccess={handleAuthSuccess}
        onSwitchToLogin={() => {
          setShowRegisterForm(false);
          setShowLoginForm(true);
        }}
      />
      
      <LoginForm 
        isOpen={showLoginForm}
        onClose={() => setShowLoginForm(false)}
        onSuccess={handleAuthSuccess}
        onSwitchToRegister={() => {
          setShowLoginForm(false);
          setShowRegisterForm(true);
        }}
      />
    </div>
  );
}

// Helper Components
const LoadingScreen = ({ message }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center px-4">
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-green-200 border-t-green-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src="/Swapdealsemoji.webp" alt="Logo" width={24} height={24} className="opacity-70" />
        </div>
      </div>
      <p className="mt-6 text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

const AuthScreen = ({ onLogin, onRegister, onHome, showLoginForm, showRegisterForm, onCloseLogin, onCloseRegister, onAuthSuccess }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-6 px-4">
    <div className="container mx-auto max-w-md">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center border border-green-200/50">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
          Kom åt dina konversationer
        </h1>
        <p className="text-gray-600 mb-8">
          Anslut med dina bytes partners och hantera alla dina bytes diskussioner.
        </p>
        
        <div className="space-y-4">
          <button onClick={onLogin} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-xl">
            💬 Logga in för att visa konversationer
          </button>
          <button onClick={onRegister} className="w-full text-gray-700 hover:text-green-800 py-4 px-6 rounded-2xl font-medium border-2 border-green-200 hover:border-green-300">
            ✨ Ny användare? Registrera dig
          </button>
          <button onClick={onHome} className="w-full text-gray-600 hover:text-gray-800 py-3 px-6 rounded-2xl">
            🏠 Gå tillbaka hem
          </button>
        </div>
      </div>
    </div>
    
    <RegisterForm isOpen={showRegisterForm} onClose={onCloseRegister} onSuccess={onAuthSuccess} onSwitchToLogin={() => { onCloseRegister(); onLogin(); }} />
    <LoginForm isOpen={showLoginForm} onClose={onCloseLogin} onSuccess={onAuthSuccess} onSwitchToRegister={() => { onCloseLogin(); onRegister(); }} />
  </div>
);

const ErrorScreen = ({ error, onRetry, onHome }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/30 flex items-center justify-center px-4">
    <div className="text-center max-w-md mx-auto">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-red-200/50">
        <div className="text-red-500 text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Fel vid inläsning av konversationer</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex flex-col gap-3">
          <button onClick={onRetry} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full font-medium">
            🔄 Försök igen
          </button>
          <button onClick={onHome} className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-full font-medium">
            🏠 Gå hem
          </button>
        </div>
      </div>
    </div>
  </div>
);