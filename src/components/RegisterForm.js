// components/RegisterForm.jsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Adjust path as needed

export default function RegisterForm({ isOpen, onClose, onSuccess, onSwitchToLogin }) {
  const { register, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUserData, setRegisteredUserData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Användarnamn krävs';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Användarnamnet måste vara minst 3 tecken';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-postadress krävs';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Vänligen ange en giltig e-postadress';
    }

    if (!formData.password) {
      newErrors.password = 'Lösenord krävs';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Lösenordet måste vara minst 6 tecken';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vänligen bekräfta ditt lösenord';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Lösenorden stämmer inte överens';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Du måste godkänna användarvillkoren och integritetspolicyn';
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Use the register function from useAuth
    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: formData.phone || undefined
    });

    if (result) {
      // Store user data before resetting form
      setRegisteredUserData({
        username: formData.username,
        email: formData.email
      });
      
      // Reset form on success
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        agreeToTerms: false
      });
      setValidationErrors({});
      
      // Show custom success modal
      setShowSuccessModal(true);
    }
    // Error handling is done automatically by the AuthProvider
    // The error will be available in the `error` variable from useAuth
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose(); // Close registration modal
    
    // Switch to login modal
    if (onSwitchToLogin) {
      setTimeout(() => {
        onSwitchToLogin();
      }, 300);
    }
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (showSuccessModal) {
        handleSuccessModalClose();
      } else {
        onClose();
      }
    }
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-bounce-in"
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(34, 197, 94, 0.1)',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Success Icon */}
        <div className="text-center pt-8 pb-4">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-b from-green-400 to-green-500 rounded-full mx-auto mb-4"
            style={{
              boxShadow: '0 8px 16px -4px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            }}
          >
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2))' }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Välkommen till SwapDeals! 🎉
          </h3>
          <p className="text-gray-600 px-6 leading-relaxed">
            Ditt konto har skapats framgångsrikt. Du kan nu logga in och börja din handelsresa.
          </p>
        </div>

        {/* User Info Display */}
        <div className="px-6 py-4">
          <div 
            className="bg-white bg-opacity-60 rounded-lg p-4 border border-green-200"
            style={{
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center text-sm text-gray-700">
              <span className="font-medium text-gray-800">Konto skapat för:</span>
              <span className="ml-2 font-semibold text-green-700">{registeredUserData?.username}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-8">
          <button
            onClick={handleSuccessModalClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5"
            style={{
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
              textShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
            }}
          >
            Fortsätt till inloggning
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Du kommer att omdirigeras till inloggningssidan
          </p>
        </div>
      </div>
    </div>
  );

  if (!isOpen && !showSuccessModal) return null;

  // Show success modal if registration was successful
  if (showSuccessModal) {
    return <SuccessModal />;
  }

  // Combine validation errors with auth errors
  const displayError = error || validationErrors.submit;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="flex items-center justify-center mr-3 bg-gradient-to-b from-green-100 to-green-200 rounded-full p-2"
                style={{
                  boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                }}
              >
                <span className="text-2xl" role="img" aria-label="User">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Gå med i SwapDeals</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
          <p className="text-gray-600 mt-2">Skapa ditt konto för att börja handla</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {displayError}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Användarnamn *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                validationErrors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Välj ett användarnamn"
            />
            {validationErrors.username && <p className="text-red-600 text-sm mt-1">{validationErrors.username}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-postadress *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ange din e-postadress"
            />
            {validationErrors.email && <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Lösenord *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Skapa ett lösenord"
            />
            {validationErrors.password && <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Bekräfta lösenord *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Bekräfta ditt lösenord"
            />
            {validationErrors.confirmPassword && <p className="text-red-600 text-sm mt-1">{validationErrors.confirmPassword}</p>}
          </div>

          <div>
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className={`mt-1 mr-2 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 ${
                  validationErrors.agreeToTerms ? 'border-red-300' : ''
                }`}
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                Jag godkänner{' '}
                <a href="/terms" className="text-green-600 hover:text-green-700 underline">
                  användarvillkoren
                </a>{' '}
                och{' '}
                <a href="/privacy" className="text-green-600 hover:text-green-700 underline">
                  integritetspolicyn
                </a>{' '}
                *
              </label>
            </div>
            {validationErrors.agreeToTerms && (
              <p className="text-red-600 text-sm mt-1 ml-6">{validationErrors.agreeToTerms}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 ${
                isLoading 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5'
              }`}
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
                textShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="mr-2">Skapar konto...</span>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-b-transparent"></div>
                </span>
              ) : (
                'Skapa konto'
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <p className="text-sm text-gray-600 text-center">
            Har du redan ett konto?{' '}
            <button 
              onClick={() => {
                onClose();
                if (onSwitchToLogin) {
                  setTimeout(() => {
                    onSwitchToLogin();
                  }, 100);
                }
              }} 
              className="text-green-600 hover:text-green-700 font-medium underline"
            >
              Logga in här
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}