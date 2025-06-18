// src/app/my-trades/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import useApi from '@/hooks/useApi';
import Image from 'next/image';
import RegisterForm from '@/components/RegisterForm';
import LoginForm from '@/components/LoginForm';

export default function MyTradesPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed, cancelled
  const [userRole, setUserRole] = useState('all'); // all, buyer, seller

  // Modal states for login/register forms
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const router = useRouter();
  const { user, isAuthenticated, token, isLoading: authLoading } = useAuth();
  const api = useApi(token);

  useEffect(() => {
    if (isAuthenticated && token && user) {
      loadTrades();
    } else if (!authLoading && !isAuthenticated) {
      // Don't redirect, just stop loading
      setLoading(false);
    }
  }, [token, isAuthenticated, user, authLoading]);

  const loadTrades = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/trades/my-trades');
      
      if (response.success) {
        setTrades(response.data || []);
      } else {
        setError(response.message || 'Misslyckades att ladda bytesaffärer');
      }
    } catch (error) {
      console.error('Failed to load trades:', error);
      setError('Misslyckades att ladda dina bytesaffärer');
    } finally {
      setLoading(false);
    }
  };

  // Handle login/register success
  const handleLoginSuccess = () => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
    // Trades will be loaded automatically by the useEffect
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

  // Filter trades based on current filters
  const filteredTrades = trades.filter(trade => {
    // Filter by status
    if (filter !== 'all') {
      if (filter === 'active' && trade.status !== 'accepted') return false;
      if (filter === 'completed' && trade.status !== 'completed') return false;
      if (filter === 'cancelled' && trade.status !== 'cancelled') return false;
    }

    // Filter by user role - add null check for user
    if (userRole !== 'all' && user) {
      if (userRole === 'buyer' && trade.buyer_id !== user.id) return false;
      if (userRole === 'seller' && trade.seller_id !== user.id) return false;
    }

    return true;
  });

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
        return 'Avslutad';
      case 'cancelled':
        return 'Avbruten';
      case 'pending':
        return 'Väntande';
      default:
        return status;
    }
  };

  const getUserRole = (trade) => {
    if (!user || !user.id) return 'Okänd';
    if (trade.buyer_id === user.id) return 'Köpare';
    if (trade.seller_id === user.id) return 'Säljare';
    return 'Okänd';
  };

  const getOtherUserName = (trade) => {
    if (!user || !user.id) return 'Okänd användare';
    
    if (trade.buyer_id === user.id) {
      return trade.seller_first_name || trade.seller_username || 'Okänd användare';
    } else {
      return trade.buyer_first_name || trade.buyer_username || 'Okänd användare';
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
                <span className="text-4xl">🤝</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg"></div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
              Komma åt dina byten
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Visa och hantera all din bytes aktivitet och spåra dina byten. 
              <span className="block mt-2 font-medium text-green-700">Logga in för att se dina byten!</span>
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-2xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center group"
              >
                <span className="mr-3 text-lg group-hover:scale-110 transition-transform">🤝</span>
                Logga in för att se byten
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

  // Loading state - wait for both user and trades to load
  if (loading || !user) {
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
          <p className="mt-6 text-gray-600 font-medium">Laddar dina byten...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Fel vid laddning av byten</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={loadTrades}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                🔄 Försök igen
              </button>
              <button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                🏠  Hem
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
                Mina bytesaffärer
              </h1>
              <p className="text-gray-600 font-medium">Visa och hantera all din bytes aktivitet</p>
            </div>
          </div>
        </div>

        {/* Enhanced Filters with Green Accents */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-green-200/50 p-6 mb-6">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-800 mb-3">Filtrera efter status:</label>
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full border border-green-200 rounded-full px-4 py-3 text-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 font-medium appearance-none cursor-pointer"
                >
                  <option value="all">🌟 Alla byten</option>
                  <option value="active">🔥 Aktiva byten</option>
                  <option value="completed">✅ Avslutade</option>
                  <option value="cancelled">❌ Avbrutna</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <span className="text-green-600">▼</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-800 mb-3">Filtrera efter roll:</label>
              <div className="relative">
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full border border-green-200 rounded-full px-4 py-3 text-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 font-medium appearance-none cursor-pointer"
                >
                  <option value="all">👥 Alla roller</option>
                   <option value="buyer">Som Köpare</option>
                  <option value="seller">Som Säljare</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <span className="text-green-600">▼</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <label className="block text-sm font-semibold text-transparent mb-3">Åtgärd:</label>
              <button
                onClick={loadTrades}
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
                {trades.length}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">Totala byten</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                {trades.filter(t => t.status === 'accepted').length}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">Aktiva byten</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                {trades.filter(t => t.status === 'completed').length}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">Avslutade</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                {trades.filter(t => t.status === 'cancelled').length}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">❌</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">Avbrutna</div>
          </div>
        </div>

        {/* Enhanced Trades List */}
        {filteredTrades.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-green-200/50 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-400">📋</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Inga bytes möjligheter hittades</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
              {filter === 'all' 
                ? "Du har inte startat några bytesaffärer ännu. Börja utforska och göra affärer!" 
                : `Inga ${filter === 'active' ? 'aktiva' : filter === 'completed' ? 'avslutade' : 'avbrutna'} bytesaffärer hittades. Prova att justera dina filter.`}
            </p>
            <button
              onClick={() => router.push('/tradelistingpage')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🌟 Utforska bytes möjligheter
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTrades.map((trade) => (
              <div key={trade.id} className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                        <span className="mr-3">🤝</span>
                        {trade.listing_title || `Bytesaffär #${trade.id}`}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center bg-green-50/80 px-3 py-1.5 rounded-full">
                          <span className="mr-2">👤</span>
                          <span>Byter med: <strong className="text-green-800">{getOtherUserName(trade)}</strong></span>
                        </div>
                        <div className="flex items-center bg-blue-50/80 px-3 py-1.5 rounded-full">
                          <span className="mr-2">🎭</span>
                          <span>Roll: <strong className="text-blue-800">{getUserRole(trade)}</strong></span>
                        </div>
                       
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getStatusColor(trade.status)}`}>
                      {getStatusText(trade.status)}
                    </span>
                  </div>

                  {trade.offer_message && (
                    <div className="mb-6">
                      <div className="bg-gradient-to-r from-green-50/80 to-blue-50/80 backdrop-blur-sm p-4 rounded-xl border border-green-200/30">
                        <div className="flex items-start">
                          <span className="text-xl mr-3 flex-shrink-0">💬</span>
                          <p className="text-gray-700 font-medium italic leading-relaxed">
                            {trade.offer_message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="mr-2">📅</span>
                        <span>Skapad: <strong>{new Date(trade.created_at).toLocaleDateString('sv-SE')}</strong></span>
                      </div>
                      {trade.accepted_at && (
                        <div className="flex items-center">
                          <span className="mr-2">✅</span>
                          <span>Accepterad: <strong>{new Date(trade.accepted_at).toLocaleDateString('sv-SE')}</strong></span>
                        </div>
                      )}
                      {trade.completed_at && (
                        <div className="flex items-center">
                          <span className="mr-2">🎉</span>
                          <span>Avslutad: <strong>{new Date(trade.completed_at).toLocaleDateString('sv-SE')}</strong></span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {trade.status === 'accepted' && (
                        <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-300/50 flex items-center shadow-md">
                          <span className="mr-1">🔥</span>
                          PÅGÅENDE
                        </span>
                      )}
                      <button
                        onClick={() => router.push(`/traderoom/${trade.id}`)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm flex items-center"
                      >
                   
                        Visa bytesaffär
                        <span className="ml-2">→</span>
                      </button>
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