// components/LoginForm.jsx - Production Improvements
'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Lock, X, User, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginForm({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onSwitchToRegister,
  className = '',
  'aria-labelledby': ariaLabelledBy = 'login-modal-title'
}) {
  const { login, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Refs for focus management
  const firstFocusableRef = useRef(null);
  const emailInputRef = useRef(null);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && emailInputRef.current) {
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clear errors when modal closes
  useEffect(() => {
    if (!isOpen) {
      clearError?.();
      setValidationErrors({});
      setAttemptCount(0);
    }
  }, [isOpen, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim() // Trim whitespace
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error when user modifies form
    if (error) {
      clearError?.();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation with better regex
    if (!formData.email) {
      newErrors.email = 'E-postadress krävs';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Vänligen ange en giltig e-postadress';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Lösenord krävs';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Lösenordet måste vara minst 6 tecken';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    // Rate limiting check
    if (attemptCount >= 5) {
      setValidationErrors({ 
        submit: 'För många inloggningsförsök. Vänligen vänta innan du försöker igen.' 
      });
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setAttemptCount(prev => prev + 1);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe
      });

      if (result) {
        setLoggedInUser({
          email: formData.email,
          username: result.user?.username || result.user?.name || formData.email.split('@')[0],
          user: result.user
        });
        
        // Reset form
        setFormData({ email: '', password: '' });
        setValidationErrors({});
        setAttemptCount(0);
        
        setShowSuccessModal(true);
      }
    } catch (err) {
      // Error is handled by useAuth hook
      console.error('Login error:', err);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
    
    if (onSuccess && loggedInUser) {
      onSuccess(loggedInUser.user);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (showSuccessModal) {
        handleSuccessModalClose();
      } else {
        onClose();
      }
    }
    
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-in slide-in-from-bottom-4 duration-300"
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        }}
      >
        <div className="text-center pt-8 pb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-b from-green-400 to-green-500 rounded-full mx-auto mb-4 shadow-lg">
            <User className="w-10 h-10 text-white" aria-hidden="true" />
          </div>
          
          <h3 id="success-modal-title" className="text-2xl font-bold text-gray-800 mb-2">
            Välkommen tillbaka!
          </h3>
          <p className="text-gray-600 px-6 leading-relaxed">
            Du har loggat in på ditt konto. Redo att börja byta?
          </p>
        </div>

        <div className="px-6 py-4">
          <div className="bg-white/70 rounded-lg p-4 border border-green-200">
            <div className="flex items-center text-sm text-gray-700">
              <span className="font-medium text-gray-800">Inloggad som:</span>
              <span className="ml-2 font-semibold text-green-700">{loggedInUser?.username}</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8">
          <button
            onClick={handleSuccessModalClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 shadow-md"
            autoFocus
          >
            Gå vidare
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Välkommen till din bytes plattform
          </p>
        </div>
      </div>
    </div>
  );

  if (!isOpen && !showSuccessModal) return null;

  if (showSuccessModal) {
    return <SuccessModal />;
  }

  const displayError = error || validationErrors.submit;

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${className}`}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center mr-3 bg-gradient-to-b from-green-100 to-green-200 rounded-full p-2 shadow-sm">
              <Lock className="w-5 h-5 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <h2 id={ariaLabelledBy} className="text-2xl font-bold text-gray-800">
                Välkommen tillbaka
              </h2>
              <p className="text-gray-600 text-sm mt-1">Logga in på ditt konto</p>
            </div>
          </div>
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Stäng dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {displayError && (
            <div 
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span>{displayError}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-postadress <span className="text-red-500" aria-label="obligatorisk">*</span>
            </label>
            <input
              ref={emailInputRef}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ange din e-postadress"
              autoComplete="email"
              required
              aria-describedby={validationErrors.email ? 'email-error' : undefined}
              aria-invalid={validationErrors.email ? 'true' : 'false'}
            />
            {validationErrors.email && (
              <p id="email-error" className="text-red-600 text-sm mt-1" role="alert">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Lösenord <span className="text-red-500" aria-label="obligatorisk">*</span>
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
              placeholder="Ange ditt lösenord"
              autoComplete="current-password"
              required
              aria-describedby={validationErrors.password ? 'password-error' : undefined}
              aria-invalid={validationErrors.password ? 'true' : 'false'}
            />
            {validationErrors.password && (
              <p id="password-error" className="text-red-600 text-sm mt-1" role="alert">
                {validationErrors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Kom ihåg mig
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-green-600 hover:text-green-700 underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
            >
              Glömt lösenord?
            </button>
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
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-md ${
                isLoading 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  <span>Loggar in...</span>
                </span>
              ) : (
                'Logga in'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <p className="text-sm text-gray-600 text-center">
            Har du inget konto?{' '}
            <button 
              onClick={() => {
                onClose();
                if (onSwitchToRegister) {
                  setTimeout(() => onSwitchToRegister(), 100);
                }
              }}
              className="text-green-600 hover:text-green-700 font-medium underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
            >
              Skapa ett här
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}