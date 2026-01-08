//Navbar.js
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, X, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import useApi from '@/hooks/useApi';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated, token } = useAuth();
  const api = useApi(token);
  
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navDropdown, setNavDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadUnreadCount = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await api.get('/api/user/conversations');
      if (response.success && response.data) {
        const totalUnread = response.data.reduce((total, conversation) => {
          return total + (conversation.unread_count || 0);
        }, 0);
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, [api, token]);

  useEffect(() => {
    if (isAuthenticated && user && token) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated, user, token, loadUnreadCount]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          mobileMenuButtonRef.current &&
          !mobileMenuButtonRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
    setTimeout(loadUnreadCount, 1000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      setUnreadCount(0);
    } catch (error) {
      console.error('Logout error:', error);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleSwitchToLogin = () => {
    setShowRegisterForm(false);
    setTimeout(() => {
      setShowLoginForm(true);
    }, 100);
  };

  const handleSwitchToRegister = () => {
    setShowLoginForm(false);
    setTimeout(() => {
      setShowRegisterForm(true);
    }, 100);
  };

  const toggleNavDropdown = (key) => {
    if (navDropdown === key) {
      setNavDropdown(null);
    } else {
      setNavDropdown(key);
    }
  };

  const closeNavDropdowns = () => {
    setNavDropdown(null);
  };

  const handleLogoClick = () => {
    router.push('/');
    closeNavDropdowns();
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    router.push(path);
    closeNavDropdowns();
    setMobileMenuOpen(false);
  };

  const handleAuthenticatedNavigation = (path) => {
    if (isAuthenticated) {
      router.push(path);
      closeNavDropdowns();
      setMobileMenuOpen(false);
    } else {
      setShowLoginForm(true);
      closeNavDropdowns();
      setMobileMenuOpen(false);
    }
  };

  const handleNotificationClick = () => {
    if (isAuthenticated) {
      router.push('/conversations');
      setTimeout(loadUnreadCount, 1000);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const getNavigationItems = () => [
   
    {
      key: 'conversations',
      label: 'Konversationer',
      icon: '💬',
      isButton: true,
      onClick: () => handleAuthenticatedNavigation('/conversations'),
      requiresAuth: true,
      title: 'Mina konversationer'
    },
    {
      key: 'trades',
      label: 'Mina Byten',
      icon: 'logo',
      isButton: true,
      onClick: () => handleAuthenticatedNavigation('/my-trades'),
      requiresAuth: true,
      title: 'Mina Byten'
    },
     {
      key: 'blog',
      label: 'Blogg',
      icon: '📝',
      isButton: true,
      onClick: () => handleNavigation('/blogg'),
      title: 'Blogg - Läs om hållbarhet'
    },
    {
      key: 'community',
      label: 'Community',
      icon: '👥',
      title: 'Community',
      dropdownItems: [
        { label: 'Forums<br>(Coming Soon)', icon: '💬', path: '/community/forums' },
        { label: 'Events<br>(Coming Soon)', icon: '📅', path: '/community/events' },
        { label: 'Groups<br>(Coming Soon)', icon: '👪', path: '/community/groups' }
      ]
    }
  ];

  const handleLoginSuccessWithNavigation = (userData) => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
    setTimeout(loadUnreadCount, 1000);
    
    setTimeout(() => {
      console.log(`Welcome back, ${userData?.username || 'user'}!`);
    }, 500);
  };

  if (!isClient) {
    return (
      <header className="bg-white/95 backdrop-blur-lg sticky top-0 z-50 border-b border-green-200/30 shadow-lg">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
        
        <div className="mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center cursor-pointer">
              <div className="relative mr-2 sm:mr-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-100 rounded"></div>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
                SwapDeals
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-full opacity-50"></div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const navigationItems = getNavigationItems();

  return (
    <>
      <header className="bg-white/95 backdrop-blur-lg sticky top-0 z-50 border-b border-green-200/30 shadow-lg">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
        
        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Mobile-First Logo */}
            <div 
              className="flex items-center transform active:scale-95 transition-all duration-200 cursor-pointer group touch-manipulation"
              onClick={handleLogoClick}
            >
              <div className="relative mr-2 sm:mr-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <Image
                    src="/Swapdealsemoji.webp"
                    alt="SwapDeals Logo"
                    width={24}
                    height={24}
                    className="object-contain w-5 h-5 sm:w-6 sm:h-6"
                    priority
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-sm"></div>
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
                SwapDeals
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-2 bg-green-50/30 rounded-full px-3 py-1.5 border border-green-200/50">
              {navigationItems.map((item) => (
                <div key={item.key} className="relative">
                  {item.isButton ? (
                    <button 
                      onClick={item.onClick}
                      className={`flex items-center hover:bg-white hover:shadow-md transition-all duration-200 px-5 py-2.5 rounded-full font-medium text-sm group ${
                        item.requiresAuth && !isAuthenticated 
                          ? 'text-gray-500 hover:text-green-600' 
                          : 'text-gray-700 hover:text-green-800'
                      }`}
                      title={item.title}
                    >
                      <div className={`flex items-center justify-center mr-2.5 bg-gradient-to-br from-green-100 to-green-200 rounded-lg group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200 ${item.icon === 'logo' ? 'p-2' : 'p-1.5'}`}>
                        {item.icon === 'logo' ? (
                          <Image
                            src="/Swapdealsemoji.webp"
                            alt="SwapDeals Logo"
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-lg" role="img" aria-label={item.label}>{item.icon}</span>
                        )}
                      </div>
                      <span>{item.label}</span>
                      {item.requiresAuth && !isAuthenticated && (
                        <span className="ml-2 text-xs">🔒</span>
                      )}
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => toggleNavDropdown(item.key)}
                        className="flex items-center hover:bg-white hover:shadow-md transition-all duration-200 px-5 py-2.5 rounded-full text-gray-700 hover:text-green-800 font-medium text-sm group"
                        title={item.title}
                      >
                        <div className="flex items-center justify-center mr-2.5 bg-gradient-to-br from-green-100 to-green-200 rounded-lg group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200 p-1.5">
                          <span className="text-lg" role="img" aria-label={item.label}>{item.icon}</span>
                        </div>
                        <span>{item.label}</span>
                        <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${navDropdown === item.key ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {navDropdown === item.key && (
                        <div className="absolute mt-2 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden min-w-[220px] border border-green-200/50 z-50">
                          {item.dropdownItems.map((dropdownItem, idx) => (
                            <button 
                              key={idx}
                              onClick={() => handleNavigation(dropdownItem.path)}
                              className="w-full text-left flex items-center px-5 py-3.5 text-gray-700 hover:bg-green-50/80 group transition-all duration-200"
                            >
                              <span className="flex items-center justify-center mr-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2 text-lg group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200">
                                {dropdownItem.icon}
                              </span>
                              <span 
                                className="text-sm font-medium group-hover:text-green-800 transition-colors"
                                dangerouslySetInnerHTML={{ __html: dropdownItem.label }}
                              ></span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Mobile-First Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Touch-Optimized Notification Bell */}
              <button 
                onClick={handleNotificationClick}
                disabled={!isAuthenticated}
                className={`relative flex items-center transition-all duration-200 p-2.5 sm:p-3 rounded-full touch-manipulation ${
                  isAuthenticated 
                    ? 'hover:bg-green-100 active:bg-green-200 hover:shadow-md cursor-pointer text-gray-700 hover:text-green-800' 
                    : 'opacity-50 cursor-not-allowed text-gray-400'
                }`}
                title={isAuthenticated ? 'Visa konversationer' : 'Logga in för att se meddelanden'}
              >
                <div className="flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2">
                  <span className="text-xl sm:text-2xl" role="img" aria-label="Notifications">🔔</span>
                </div>
                {isAuthenticated && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shadow-lg animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* User Section */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 sm:space-x-3 text-gray-700 hover:text-green-800 transition-all duration-200 hover:bg-green-100 active:bg-green-200 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full touch-manipulation"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                      {user?.avatar || '👤'}
                    </div>
                    <span className="font-medium hidden md:block text-sm lg:text-base">{user?.username}</span>
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-green-200/50 z-50">
                      <div className="px-5 py-4 border-b border-green-200/50 bg-gradient-to-r from-green-50/50 to-transparent">
                        <p className="text-base font-semibold text-gray-800">{user?.username}</p>
                        <p className="text-sm text-gray-500 truncate mt-1">{user?.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <button 
                          onClick={() => {
                            handleNavigation('/profile');
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left flex items-center px-5 py-4 text-sm text-gray-700 hover:bg-green-50/80 hover:text-green-800 transition-colors touch-manipulation"
                        >
                          <span className="mr-4 text-xl">👤</span>
                          <div>
                            <div className="font-medium">Profil</div>
                            <div className="text-xs text-gray-500">(Kommer snart)</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-5 py-4 text-sm text-red-600 hover:bg-red-50/80 transition-colors touch-manipulation"
                        >
                          <span className="mr-4 text-xl">🚪</span>
                          <span className="font-medium">Logga ut</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Desktop Auth Buttons */}
                  <button 
                    onClick={() => setShowRegisterForm(true)}
                    className="hidden lg:flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-full transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="text-base mr-2">➕</span>
                    <span className="text-sm">Registrera</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowLoginForm(true)}
                    className="hidden lg:flex items-center text-gray-700 hover:text-green-800 transition-all duration-200 px-5 py-2.5 rounded-full border border-green-200 hover:border-green-300 hover:bg-green-50 font-medium"
                  >
                    <span className="text-base mr-2">👤</span>
                    <span className="text-sm">Logga in</span>
                  </button>

                  {/* Mobile Quick Login */}
                  <button 
                    onClick={() => setShowLoginForm(true)}
                    className="lg:hidden flex items-center text-gray-700 hover:text-green-800 transition-all duration-200 p-2.5 sm:p-3 rounded-full border border-green-200 hover:border-green-300 hover:bg-green-50 active:bg-green-100 touch-manipulation"
                    title="Logga in"
                  >
                    <div className="flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2">
                      <span className="text-xl" role="img" aria-label="Login">👤</span>
                    </div>
                  </button>
                </>
              )}
              
              {/* Touch-Optimized Mobile Menu Button */}
              <button 
                ref={mobileMenuButtonRef}
                onClick={toggleMobileMenu}
                className="lg:hidden text-gray-700 p-2.5 sm:p-3 bg-green-100 hover:bg-green-200 active:bg-green-300 rounded-full transform active:scale-95 transition-all duration-200 shadow-md touch-manipulation"
                aria-label={mobileMenuOpen ? 'Stäng meny' : 'Öppna meny'}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-First Navigation Menu */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="lg:hidden bg-white/98 backdrop-blur-lg border-t border-green-200/50 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <div className="px-4 sm:px-6 py-5 space-y-2">
              {navigationItems.map((item) => (
                <div key={item.key}>
                  {item.isButton ? (
                    <button 
                      onClick={item.onClick}
                      className={`w-full text-left flex items-center transition-all duration-200 px-4 py-4 rounded-xl touch-manipulation ${
                        item.requiresAuth && !isAuthenticated 
                          ? 'text-gray-500 hover:text-green-600 active:bg-green-50/50' 
                          : 'text-gray-700 hover:text-green-800 hover:bg-green-50/80 active:bg-green-100'
                      }`}
                    >
                      <div className={`flex items-center justify-center mr-4 bg-gradient-to-br from-green-100 to-green-200 rounded-lg transition-all duration-200 ${item.icon === 'logo' ? 'p-2.5' : 'p-2.5'}`}>
                        {item.icon === 'logo' ? (
                          <Image
                            src="/Swapdealsemoji.webp"
                            alt="SwapDeals Logo"
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-xl" role="img" aria-label={item.label}>{item.icon}</span>
                        )}
                      </div>
                      <span className="font-medium flex-1 text-base">{item.label}</span>
                      {item.requiresAuth && !isAuthenticated && (
                        <span className="text-sm bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                          🔒
                        </span>
                      )}
                    </button>
                  ) : (
                    <div>
                      <button 
                        onClick={() => toggleNavDropdown(item.key)}
                        className="w-full text-left flex items-center justify-between text-gray-700 hover:text-green-800 transition-all duration-200 px-4 py-4 rounded-xl hover:bg-green-50/80 active:bg-green-100 touch-manipulation"
                      >
                        <div className="flex items-center">
                          <div className="flex items-center justify-center mr-4 bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2.5">
                            <span className="text-xl" role="img" aria-label={item.label}>{item.icon}</span>
                          </div>
                          <span className="font-medium text-base">{item.label}</span>
                        </div>
                        <ChevronDown className={`h-5 w-5 transition-transform ${navDropdown === item.key ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {navDropdown === item.key && (
                        <div className="ml-6 mt-2 space-y-1">
                          {item.dropdownItems.map((dropdownItem, idx) => (
                            <button 
                              key={idx}
                              onClick={() => handleNavigation(dropdownItem.path)}
                              className="w-full text-left flex items-center text-gray-600 hover:text-green-700 transition-colors px-4 py-3.5 rounded-lg hover:bg-green-50/60 active:bg-green-100 touch-manipulation"
                            >
                              <span className="flex items-center justify-center mr-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2 text-lg">
                                {dropdownItem.icon}
                              </span>
                              <span 
                                className="text-sm font-medium"
                                dangerouslySetInnerHTML={{ __html: dropdownItem.label }}
                              ></span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {!isAuthenticated && (
                <>
                  <div className="border-t border-green-200/50 my-4"></div>
                  
                  <button 
                    onClick={() => {
                      setShowRegisterForm(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white px-4 py-4 rounded-xl transition-all duration-200 font-medium shadow-lg touch-manipulation"
                  >
                    <div className="flex items-center justify-center mr-4 bg-green-400/30 rounded-lg p-2.5">
                      <span className="text-xl" role="img" aria-label="Register">➕</span>
                    </div>
                    <span className="text-base">Registrera dig</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowLoginForm(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center text-gray-700 hover:text-green-800 transition-colors px-4 py-4 rounded-xl hover:bg-green-50/80 active:bg-green-100 border border-green-200/50 font-medium touch-manipulation"
                  >
                    <div className="flex items-center justify-center mr-4 bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2.5">
                      <span className="text-xl" role="img" aria-label="Login">👤</span>
                    </div>
                    <span className="text-base">Logga in</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <RegisterForm 
        isOpen={showRegisterForm} 
        onClose={() => setShowRegisterForm(false)}
        onSuccess={handleLoginSuccessWithNavigation}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <LoginForm 
        isOpen={showLoginForm} 
        onClose={() => setShowLoginForm(false)}
        onSuccess={handleLoginSuccessWithNavigation}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </>
  );
}