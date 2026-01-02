'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import RegisterForm from '@/components/RegisterForm';
import LoginForm from '@/components/LoginForm';

export default function MyTradesPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const router = useRouter();
  const { user, isAuthenticated, token, isLoading: authLoading } = useAuth();

  // FIXED: Removed api from dependencies, using fetch directly
  const loadTrades = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/trades/my-trades', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch trades');
      }
      
      const data = await response.json();
      setTrades(data.success ? data.data || [] : []);
      setError(null);
    } catch (error) {
      setError('Kunde inte ladda bytesaffärer');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadTrades();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [token, isAuthenticated, authLoading, loadTrades]);

  const filteredTrades = trades.filter(trade => {
    if (filter === 'all') return true;
    if (filter === 'active') return trade.status === 'accepted';
    if (filter === 'completed') return trade.status === 'completed';
    if (filter === 'cancelled') return trade.status === 'cancelled';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Aktiv';
      case 'completed': return 'Avslutad';
      case 'cancelled': return 'Avbruten';
      case 'pending': return 'Väntande';
      default: return status;
    }
  };

  const getOtherUserName = (trade) => {
    if (!user) return 'Okänd';
    const isbuyer = trade.buyer_id === user.id;
    return isbuyer 
      ? (trade.seller_first_name || trade.seller_username || 'Okänd')
      : (trade.buyer_first_name || trade.buyer_username || 'Okänd');
  };

  // Loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
        <div className="container mx-auto max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤝</span>
            </div>
            <h1 className="text-2xl font-bold mb-4">Kom åt dina byten</h1>
            <p className="text-gray-600 mb-6">Logga in för att se dina bytesaffärer</p>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
              >
                Logga in
              </button>
              <button
                onClick={() => setShowRegisterForm(true)}
                className="w-full border-2 border-green-200 hover:border-green-300 text-gray-700 py-3 rounded-xl font-semibold"
              >
                Registrera dig
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full text-gray-600 hover:text-gray-800 py-3"
              >
                Gå tillbaka hem
              </button>
            </div>
          </div>
        </div>

        <RegisterForm 
          isOpen={showRegisterForm}
          onClose={() => setShowRegisterForm(false)}
          onSuccess={() => { setShowRegisterForm(false); loadTrades(); }}
          onSwitchToLogin={() => { setShowRegisterForm(false); setShowLoginForm(true); }}
        />
        <LoginForm 
          isOpen={showLoginForm}
          onClose={() => setShowLoginForm(false)}
          onSuccess={() => { setShowLoginForm(false); loadTrades(); }}
          onSwitchToRegister={() => { setShowLoginForm(false); setShowRegisterForm(true); }}
        />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-3">Fel vid inläsning</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={loadTrades}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-3">
              <Image src="/Swapdealsemoji.png" alt="Logo" width={24} height={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Mina bytesaffärer</h1>
              <p className="text-gray-600 text-sm">Hantera dina bytes</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Alla byten</option>
              <option value="active">Aktiva</option>
              <option value="completed">Avslutade</option>
              <option value="cancelled">Avbrutna</option>
            </select>
            <button
              onClick={loadTrades}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              🔄 Uppdatera
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-2xl font-bold">{trades.length}</div>
            <div className="text-sm text-gray-600">Totalt</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-2xl font-bold text-green-600">
              {trades.filter(t => t.status === 'accepted').length}
            </div>
            <div className="text-sm text-gray-600">Aktiva</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-2xl font-bold text-blue-600">
              {trades.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Avslutade</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-2xl font-bold text-red-600">
              {trades.filter(t => t.status === 'cancelled').length}
            </div>
            <div className="text-sm text-gray-600">Avbrutna</div>
          </div>
        </div>

        {/* Trades List */}
        {filteredTrades.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold mb-2">Inga bytesaffärer</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Du har inga bytesaffärer ännu' 
                : `Inga ${filter} bytesaffärer`}
            </p>
            <button
              onClick={() => router.push('/tradelistingpage')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Utforska byten
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrades.map((trade) => (
              <div key={trade.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">
                      {trade.listing_title || `Byte #${trade.id}`}
                    </h3>
                    <div className="text-sm text-gray-600">
                      Med: <strong>{getOtherUserName(trade)}</strong>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trade.status)}`}>
                    {getStatusText(trade.status)}
                  </span>
                </div>

                {trade.offer_message && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700 italic">{trade.offer_message}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-500">
                    Skapad: {new Date(trade.created_at).toLocaleDateString('sv-SE')}
                  </div>
                  <button
                    onClick={() => router.push(`/traderoom/${trade.id}`)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    Visa →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            ← Tillbaka hem
          </button>
        </div>
      </div>
    </div>
  );
}