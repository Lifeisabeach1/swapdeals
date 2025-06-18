// Enhanced Navbar component with green accents and SwapDeals logo - HYDRATION FIXED
'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin, ArrowRight, Home, X } from 'lucide-react';
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
  
  // Refs for dropdown and mobile menu to detect outside clicks
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  // Set client flag after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load unread message count when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && token) {
      loadUnreadCount();
      
      // Set up polling for unread count every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated, user, token]);

  // Function to load unread message count
  const loadUnreadCount = async () => {
    try {
      const response = await api.get('/api/user/conversations');
      
      if (response.success && response.data) {
        // Calculate total unread messages across all conversations
        const totalUnread = response.data.reduce((total, conversation) => {
          return total + (conversation.unread_count || 0);
        }, 0);
        
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
      // Don't reset count on error to avoid flickering
    }
  };

  // Effect to handle clicks outside the dropdown and mobile menu to close them
  useEffect(() => {
    function handleClickOutside(event) {
      // Close user dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      // Close mobile menu if clicked outside (but not on the hamburger button)
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
    // Load unread count after successful login
    setTimeout(loadUnreadCount, 1000);
  };

  // Modified logout handler to stay on same page
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

  // Modal switching functions
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

  const handleHomeClick = () => {
    router.push('/');
    closeNavDropdowns();
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    router.push('/tradelistingpage');
    closeNavDropdowns();
    setMobileMenuOpen(false);
  };

  // Navigation handlers for trade pages
  const handleTradeNavigation = (path) => {
    router.push(path);
    closeNavDropdowns();
    setMobileMenuOpen(false);
  };

  // NEW: Handle authenticated navigation - show login modal if not authenticated
  const handleAuthenticatedNavigation = (path) => {
    if (isAuthenticated) {
      router.push(path);
      closeNavDropdowns();
      setMobileMenuOpen(false);
    } else {
      // Show login modal if not authenticated
      setShowLoginForm(true);
      closeNavDropdowns();
      setMobileMenuOpen(false);
    }
  };

  // Handle notification bell click
  const handleNotificationClick = () => {
    if (isAuthenticated) {
      router.push('/conversations');
      setTimeout(loadUnreadCount, 1000);
    }
  };

  // Toggle mobile menu - this is the key fix
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  // FIXED: Create navigation items inside component to use current auth state
  const getNavigationItems = () => [
    {
      key: 'home',
      label: 'Hem',
      icon: '🏠',
      isButton: true,
      onClick: handleHomeClick,
      title: 'Hem'
    },
    {
      key: 'conversations',
      label: 'Mina konversationer',
      icon: '💬',
      isButton: true,
      onClick: () => handleAuthenticatedNavigation('/conversations'),
      requiresAuth: true,
      title: 'Mina konversationer'
    },
    {
      key: 'trades',
      label: 'Mina Byten',
      icon: 'logo', // Special marker for SwapDeals logo
      isButton: true,
      onClick: () => handleAuthenticatedNavigation('/my-trades'),
      requiresAuth: true,
      title: 'Mina Byten'
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

  // NEW: Enhanced login success handler that navigates to intended page
  const handleLoginSuccessWithNavigation = (userData) => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
    // Load unread count after successful login
    setTimeout(loadUnreadCount, 1000);
    
    // Show success message and then navigate
    setTimeout(() => {
      // You can add a toast notification here if you have one
      console.log(`Welcome back, ${userData?.username || 'user'}!`);
    }, 500);
  };

  // HYDRATION FIX: Don't render auth-dependent content until client-side
  if (!isClient) {
    return (
      <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-green-200/30 shadow-lg">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div 
              className="flex items-center transform hover:scale-105 transition-all duration-300 cursor-pointer group"
              onClick={handleLogoClick}
            >
              <div className="relative mr-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <Image
                    src="/Swapdealsemoji.png"
                    alt="SwapDeals Logo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-sm"></div>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
                  SwapDeals
                </div>
              </div>
            </div>
            
            {/* Loading skeleton for navigation */}
            <nav className="hidden md:flex space-x-1 bg-green-50/30 rounded-full px-2 py-1 border border-green-200/50 opacity-50">
              <div className="flex items-center px-4 py-2.5 rounded-full">
                <div className="w-8 h-8 bg-green-100 rounded-lg mr-2"></div>
                <div className="w-12 h-4 bg-green-100 rounded"></div>
              </div>
              <div className="flex items-center px-4 py-2.5 rounded-full">
                <div className="w-8 h-8 bg-green-100 rounded-lg mr-2"></div>
                <div className="w-20 h-4 bg-green-100 rounded"></div>
              </div>
              <div className="flex items-center px-4 py-2.5 rounded-full">
                <div className="w-8 h-8 bg-green-100 rounded-lg mr-2"></div>
                <div className="w-16 h-4 bg-green-100 rounded"></div>
              </div>
            </nav>
            
            {/* Loading skeleton for user area */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full opacity-50"></div>
              <div className="hidden sm:flex items-center space-x-3 opacity-50">
                <div className="w-20 h-10 bg-green-100 rounded-full"></div>
                <div className="w-16 h-10 bg-green-100 rounded-full"></div>
              </div>
              <div className="md:hidden w-10 h-10 bg-green-100 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const navigationItems = getNavigationItems();

  return (
    <>
      <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-green-200/30 shadow-lg">
        {/* Premium light effect overlay with green tint */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex justify-between items-center py-4">
            {/* Enhanced Logo with SwapDeals Image */}
            <div 
              className="flex items-center transform hover:scale-105 transition-all duration-300 cursor-pointer group"
              onClick={handleLogoClick}
            >
              {/* Premium logo design with SwapDeals image */}
              <div className="relative mr-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <Image
                    src="/Swapdealsemoji.png"
                    alt="SwapDeals Logo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-sm"></div>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
                  SwapDeals
                </div>
              </div>
            </div>
            
            {/* Enhanced Desktop Navigation with Green Accents */}
            <nav className="hidden md:flex space-x-1 bg-green-50/30 rounded-full px-2 py-1 border border-green-200/50">
              {navigationItems.map((item) => (
                <div key={item.key} className="relative">
                  {item.isButton ? (
                    <button 
                      onClick={item.onClick}
                      className={`flex items-center hover:bg-white hover:shadow-md transition-all duration-200 px-4 py-2.5 rounded-full font-medium text-sm group ${
                        item.requiresAuth && !isAuthenticated 
                          ? 'text-gray-500 hover:text-green-600' 
                          : 'text-gray-700 hover:text-green-800'
                      }`}
                      title={item.title}
                    >
                      <div className={`flex items-center justify-center mr-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200 ${item.icon === 'logo' ? 'p-2' : 'p-1.5'}`}>
                        {item.icon === 'logo' ? (
                          <Image
                            src="/Swapdealsemoji.png"
                            alt="SwapDeals Logo"
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-base" role="img" aria-label={item.label}>{item.icon}</span>
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
                        className="flex items-center hover:bg-white hover:shadow-md transition-all duration-200 px-4 py-2.5 rounded-full text-gray-700 hover:text-green-800 font-medium text-sm group"
                        title={item.title}
                      >
                        <div className={`flex items-center justify-center mr-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200 ${item.icon === 'logo' ? 'p-2' : 'p-1.5'}`}>
                          <span className="text-base" role="img" aria-label={item.label}>{item.icon}</span>
                        </div>
                        <span>{item.label}</span>
                        <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${navDropdown === item.key ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {navDropdown === item.key && (
                        <div className="absolute mt-2 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden min-w-[200px] border border-green-200/50 z-50">
                          {item.dropdownItems.map((dropdownItem, idx) => (
                            <button 
                              key={idx}
                              onClick={() => handleTradeNavigation(dropdownItem.path)}
                              className="w-full text-left flex items-center px-4 py-3 text-gray-700 hover:bg-green-50/80 group transition-all duration-200"
                            >
                              <span className="flex items-center justify-center mr-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2 text-base group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200">
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
            
            {/* Enhanced Login, Register or User Avatar with Green Accents */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleNotificationClick}
                disabled={!isAuthenticated}
                className={`relative flex items-center transition-all duration-200 p-2.5 rounded-full ${
                  isAuthenticated 
                    ? 'hover:bg-green-100 hover:shadow-md cursor-pointer text-gray-700 hover:text-green-800' 
                    : 'opacity-50 cursor-not-allowed text-gray-400'
                }`}
                title={isAuthenticated ? 'View conversations' : 'Login to view messages'}
              >
                <div className="flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2">
                  <span className="text-lg" role="img" aria-label="Notifications">🔔</span>
                </div>
                {isAuthenticated && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-green-800 transition-all duration-200 hover:bg-green-100 px-3 py-2.5 rounded-full"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-lg shadow-lg">
                      {user?.avatar || '👤'}
                    </div>
                    <span className="font-medium hidden sm:block text-sm">{user?.username}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-green-200/50 z-50">
                      <div className="px-4 py-4 border-b border-green-200/50 bg-gradient-to-r from-green-50/50 to-transparent">
                        <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{user?.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <button 
                          onClick={() => {
                            handleTradeNavigation('/profile');
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50/80 hover:text-green-800 transition-colors"
                        >
                          <span className="mr-3 text-base">👤</span>
                          <div>
                            <div className="font-medium">Profile</div>
                            <div className="text-xs text-gray-500">(Coming Soon)</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors"
                        >
                          <span className="mr-3 text-base">🚪</span>
                          <span className="font-medium">Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setShowRegisterForm(true)}
                    className="hidden sm:flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-full transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="text-sm mr-2">➕</span>
                    <span className="text-sm">Register</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowLoginForm(true)}
                    className="hidden sm:flex items-center text-gray-700 hover:text-green-800 transition-all duration-200 px-4 py-2.5 rounded-full border border-green-200 hover:border-green-300 hover:bg-green-50 font-medium"
                  >
                    <span className="text-sm mr-2">👤</span>
                    <span className="text-sm">Login</span>
                  </button>
                </>
              )}
              
              {/* Enhanced Mobile Menu Button with Green Accent */}
              <button 
                ref={mobileMenuButtonRef}
                onClick={toggleMobileMenu}
                className="md:hidden text-gray-700 p-2.5 bg-green-100 hover:bg-green-200 rounded-full transform hover:scale-105 transition-all duration-200 shadow-md"
              >
                <span className="text-xl" role="img" aria-label="Menu">
                  {mobileMenuOpen ? '✕' : '☰'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu with Green Accents */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden bg-white/95 backdrop-blur-lg border-t border-green-200/50 shadow-xl"
          >
            <div className="container mx-auto px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <div key={item.key}>
                  {item.isButton ? (
                    <button 
                      onClick={item.onClick}
                      className={`w-full text-left flex items-center transition-all duration-200 px-4 py-3 rounded-xl hover:bg-green-50/80 ${
                        item.requiresAuth && !isAuthenticated 
                          ? 'text-gray-500 hover:text-green-600' 
                          : 'text-gray-700 hover:text-green-800'
                      }`}
                    >
                      <div className={`flex items-center justify-center mr-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg transition-all duration-200 ${item.icon === 'logo' ? 'p-2.5' : 'p-2'}`}>
                        {item.icon === 'logo' ? (
                          <Image
                            src="/Swapdealsemoji.png"
                            alt="SwapDeals Logo"
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-lg" role="img" aria-label={item.label}>{item.icon}</span>
                        )}
                      </div>
                      <span className="font-medium flex-1">{item.label}</span>
                      {item.requiresAuth && !isAuthenticated && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          🔒
                        </span>
                      )}
                    </button>
                  ) : (
                    <div>
                      <button 
                        onClick={() => toggleNavDropdown(item.key)}
                        className="w-full text-left flex items-center justify-between text-gray-700 hover:text-green-800 transition-all duration-200 px-4 py-3 rounded-xl hover:bg-green-50/80"
                      >
                        <div className="flex items-center">
                          <div className="flex items-center justify-center mr-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2">
                            <span className="text-lg" role="img" aria-label={item.label}>{item.icon}</span>
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${navDropdown === item.key ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {navDropdown === item.key && (
                        <div className="ml-6 mt-2 space-y-1">
                          {item.dropdownItems.map((dropdownItem, idx) => (
                            <button 
                              key={idx}
                              onClick={() => handleTradeNavigation(dropdownItem.path)}
                              className="w-full text-left flex items-center text-gray-600 hover:text-green-700 transition-colors px-4 py-2.5 rounded-lg hover:bg-green-50/60"
                            >
                              <span className="flex items-center justify-center mr-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-1.5 text-sm">
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
                    className="w-full flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg"
                  >
                    <div className="flex items-center justify-center mr-3 bg-green-400/30 rounded-lg p-2">
                      <span className="text-lg" role="img" aria-label="Register">➕</span>
                    </div>
                    <span>Register</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowLoginForm(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center text-gray-700 hover:text-green-800 transition-colors px-4 py-3 rounded-xl hover:bg-green-50/80 border border-green-200/50 font-medium"
                  >
                    <div className="flex items-center justify-center mr-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2">
                      <span className="text-lg" role="img" aria-label="User">👤</span>
                    </div>
                    <span>Login</span>
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