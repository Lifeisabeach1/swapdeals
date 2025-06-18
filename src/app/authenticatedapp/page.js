'use client';

import { useState } from 'react';
import RegisterForm from '@/components/RegisterForm';
import LoginForm from '@/components/LoginForm';
import UserAvatar from '@/components/UserAvatar';
import UserDropdown from '@/components/UserDropdown';

export default function AuthenticatedApp({ onLoginSuccess }) {
  const [user, setUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginForm(false);
    
    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setDropdownOpen(false);
  };

  return (
    <>
      {/* User authentication components only - no navigation bar */}
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="relative">
            <UserAvatar 
              user={user}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            <UserDropdown 
              user={user}
              onLogout={handleLogout}
              isOpen={dropdownOpen}
              onClose={() => setDropdownOpen(false)}
            />
          </div>
        ) : (
          <>
            {/* Register Button */}
            <button 
              onClick={() => setShowRegisterForm(true)}
              className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:-translate-y-0.5"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
                borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                borderRight: '1px solid rgba(34, 197, 94, 0.1)',
                borderBottom: '1px solid rgba(34, 197, 94, 0.2)',
                textShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
              }}
            >
              {/* Plus Emoji */}
              <div 
                className="flex items-center justify-center mr-1 bg-green-500/20 rounded-full p-0.5"
              >
                <span className="text-lg" role="img" aria-label="Register">➕</span>
              </div>
              <span>Registrera</span>
            </button>
            
            {/* Login Button */}
            <button 
              onClick={() => setShowLoginForm(true)}
              className="flex items-center hover:text-green-700 transition-all duration-200 transform hover:-translate-y-0.5 px-3 py-1.5 rounded-md"
              style={{
                textShadow: '0 0.5px 0 rgba(255, 255, 255, 0.5)'
              }}
            >
              {/* User Emoji */}
              <div 
                className="flex items-center justify-center mr-1 bg-gradient-to-b from-blue-100/30 to-blue-100/10 rounded-full p-0.5"
              >
                <span className="text-lg" role="img" aria-label="User">👤</span>
              </div>
              <span className="bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent">
                Logga in
              </span>
            </button>
          </>
        )}
      </div>

      {/* Register Form Modal */}
      <RegisterForm 
        isOpen={showRegisterForm}
        onClose={() => setShowRegisterForm(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Login Form Modal */}
      <LoginForm 
        isOpen={showLoginForm}
        onClose={() => setShowLoginForm(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}