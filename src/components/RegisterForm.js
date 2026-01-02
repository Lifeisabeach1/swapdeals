// components/RegisterForm.jsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { X, CheckCircle, Loader2 } from 'lucide-react';

export default function RegisterForm({ isOpen, onClose, onSwitchToLogin }) {
  const { register, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear API error
    clearError();
  };

  const validate = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Användarnamn krävs';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Minst 3 tecken krävs';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Max 20 tecken';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Endast bokstäver, siffror, _ och -';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'E-post krävs';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Giltig e-post krävs';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Lösenord krävs';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minst 6 tecken krävs';
    } else if (formData.password.length > 100) {
      newErrors.password = 'Max 100 tecken';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Bekräfta lösenord';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Lösenorden matchar inte';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Du måste godkänna villkoren';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    // Validate form
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit registration
    const result = await register({
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    });

    if (result) {
      // Registration successful - user is now auto-logged in
      setShowSuccess(true);
      setFormData({ 
        username: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        agreeToTerms: false 
      });
      setErrors({});
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen && !showSuccess) return null;

  // Success Modal
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-300">
          <div className="text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-lg animate-in zoom-in duration-500">
              <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            
            {/* Success Message */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Välkommen till SwapDeals! 🎉
            </h3>
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              Ditt konto har skapats och du är nu inloggad. <br />
              Du kan börja byta dina saker direkt!
            </p>

            {/* Close Button */}
            <button
              onClick={handleSuccessClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Börja utforska
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Skapa konto</h2>
            <p className="text-sm text-gray-600 mt-1">Börja byta dina saker idag</p>
          </div>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* API Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top duration-300">
              <span className="text-red-500 font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Användarnamn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="välj_ditt_namn"
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <span>•</span> {errors.username}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              E-postadress <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="din@email.se"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <span>•</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lösenord <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Minst 6 tecken"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <span>•</span> {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bekräfta lösenord <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Skriv lösenordet igen"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <span>•</span> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="pt-2">
            <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
              errors.agreeToTerms ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
            }`}>
              <input
                type="checkbox"
                name="agreeToTerms"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-0.5 h-4 w-4 text-green-600 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border-gray-300 disabled:cursor-not-allowed"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                Jag godkänner{' '}
                <a 
                  href="/terms" 
                  className="text-green-600 hover:text-green-700 font-medium underline decoration-green-300 hover:decoration-green-500" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  användarvillkoren
                </a>
                {' '}och{' '}
                <a 
                  href="/privacy" 
                  className="text-green-600 hover:text-green-700 font-medium underline decoration-green-300 hover:decoration-green-500" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  integritetspolicyn
                </a>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <span>•</span> {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Skapar konto...</span>
                </>
              ) : (
                'Skapa konto'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <p className="text-sm text-gray-600 text-center">
            Har redan ett konto?{' '}
            <button
              onClick={() => {
                onClose();
                setTimeout(() => onSwitchToLogin?.(), 100);
              }}
              disabled={isLoading}
              className="text-green-600 hover:text-green-700 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Logga in här
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}