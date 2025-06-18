// Enhanced Platform Data Component with Mobile Button Fix
'use client';

import { RefreshCw, User, Package, Camera, BookOpen, Users, Eye, TrendingUp, ArrowLeftRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PlatformData() {
  // Initialize with null to prevent hydration mismatch
  const [platformStats, setPlatformStats] = useState({
    trades: null,
    users: null,
    items: null
  });
  const [loading, setLoading] = useState(true); // Start with loading true
  const [lastUpdated, setLastUpdated] = useState(null);
  const [mounted, setMounted] = useState(false); // Track if component is mounted
  const [dataLoaded, setDataLoaded] = useState(false); // Track if data has been loaded

  const handleLogoClick = () => {
    // Handle logo click navigation
    window.location.href = '/';
  };

  const fetchPlatformStats = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/platform-stats');
      const data = await response.json();
      
      if (data.success) {
        setPlatformStats({
          trades: data.data.deals_made,
          users: data.data.registered_users,
          items: data.data.total_visits
        });
        setLastUpdated(new Date());
        setDataLoaded(true); // Mark data as loaded
      } else {
        // Set fallback values on error
        setPlatformStats({
          trades: 49,
          users: 26,
          items: 123
        });
        setDataLoaded(true); // Still mark as loaded even with fallback data
      }
    } catch (error) {
      // Set fallback values on error
      setPlatformStats({
        trades: 49,
        users: 26,
        items: 123
      });
      setDataLoaded(true); // Still mark as loaded even with fallback data
    } finally {
      setLoading(false);
    }
  };

  // Set mounted flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load stats on component mount
  useEffect(() => {
    if (mounted) {
      fetchPlatformStats();
    }
  }, [mounted]);

  // Auto-refresh stats every 30 seconds (only after mounted)
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(fetchPlatformStats, 30000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Show placeholder values immediately to prevent hydration mismatch
  const displayStats = {
    trades: platformStats.trades ?? '—',
    users: platformStats.users ?? '—',
    items: platformStats.items ?? '—'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30">
      {/* Premium light effect overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header with SwapDeals branding */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-xl shadow-lg flex items-center justify-center mr-4">
              <Image
                src="/Swapdealsemoji.png"
                alt="SwapDeals Logotyp"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
                SwapDeals
              </h1>
            </div>
          </div>
        </div>

        {/* Platform Badge */}
        <div className="mb-8">
          <div className="inline-block">
            <span className="bg-gradient-to-r from-green-100 via-yellow-100 to-green-100 text-green-800 font-semibold px-5 py-2 rounded-full shadow-lg border border-green-300/30 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Byt det du har mot det du behöver
            </span>
          </div>
        </div>

        {/* Main Hero Section */}
        <div className="grid lg:grid-cols-5 gap-8 items-start mb-4">
          
          {/* Left Column - Content (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-5">
              <h2 className="text-4xl lg:text-3xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-800 via-green-600 to-gray-800 bg-clip-text text-transparent">
                  Låt saker leva vidare
                </span>
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Byt dina oanvända föremål mot saker du faktiskt vill ha. 
                <span className="font-semibold text-green-700"> Hållbart, ekonomiskt och enkelt.</span>
              </p>
            </div>

            {/* Enhanced Action Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/tradeform">
                <button className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 sm:py-3 px-6 rounded-2xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl flex items-center justify-center transform hover:-translate-y-1 relative overflow-hidden w-full sm:w-auto">
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <ArrowLeftRight className="w-5 h-5 mr-3" />
                  Swap Nu
                </button>
              </Link>
              
              <Link href="/tradelistingpage">
                <button className="group bg-white/90 backdrop-blur-lg border-2 border-green-300 hover:border-green-500 text-gray-800 hover:text-green-600 py-3 sm:py-3 px-6 rounded-2xl transition-all duration-300 font-semibold flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:bg-green-50/50 w-full sm:w-auto">
                  <BookOpen className="w-5 h-5 mr-3" />
                  Se vad andra byter
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column - Stats (2 columns) */}
          <div className="lg:col-span-2">
            {/* Loading State */}
            {loading && !dataLoaded && (
              <div className="space-y-4">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="text-right">
                      <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="text-right">
                      <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="text-right">
                      <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

           {/* Stats Cards */}
            {dataLoaded && (
              <div className="space-y-2 animate-in slide-in-from-right-4 fade-in duration-700 lg:relative lg:-top-20">
                
                {/* Deals Made Card */}
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-200 to-green-300 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <RefreshCw className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                        {typeof displayStats.trades === 'number' ? displayStats.trades.toLocaleString() : displayStats.trades}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Genomförda Byten</div>
                    </div>
                  </div>
                </div>

                {/* Active Traders Card */}
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-200 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                        {typeof displayStats.users === 'number' ? displayStats.users.toLocaleString() : displayStats.users}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Registrerade Användare</div>
                    </div>
                  </div>
                </div>

                {/* Platform Visits Card */}
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-green-200/50 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-200 to-green-300 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                        {typeof displayStats.items === 'number' ? displayStats.items.toLocaleString() : displayStats.items}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Plattforms besök</div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Platform Features Section */}
        <div className="mt-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-green-200/50 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent mb-3">
                Varför Välja SwapDeals?
              </h3>
              <p className="text-gray-600 font-medium">Det smarta sättet att handla utan att spendera pengar</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-green-50/50 hover:bg-green-50/80 transition-all duration-200 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🌱</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Hållbar Handel</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Ge föremål ett andra liv samtidigt som du får vad du behöver. Bra för dig, bra för planeten.</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-blue-50/50 hover:bg-blue-50/80 transition-all duration-200 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Kostnadsfri Handel</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Handla föremål utan att spendera en krona. Byt värde mot värde, rättvist och enkelt.</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-purple-50/50 hover:bg-purple-50/80 transition-all duration-200 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Säkert & Tryggt</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Handla med förtroende genom vår säkra plattform och pålitliga gemenskap av handlare.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}