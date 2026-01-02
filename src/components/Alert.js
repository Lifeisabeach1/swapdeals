// src/components/Alert.js
import { useState, useEffect } from 'react';

const Alert = ({ 
  message, 
  type = 'info', 
  isVisible = true, 
  onClose,
  duration = 3000,
  title = null 
}) => {
  const [show, setShow] = useState(isVisible);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShow(false), 300);
    }
  }, [isVisible]);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setShow(false);
          onClose?.();
        }, 300);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsAnimating(false);
      setTimeout(() => {
        setShow(false);
        onClose?.();
      }, 300);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShow(false);
      onClose?.();
    }, 300);
  };

  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          iconBg: 'bg-gradient-to-b from-green-400 to-green-500',
          iconColor: 'text-white',
          borderColor: 'border-green-200',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-600',
          buttonGradient: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(34, 197, 94, 0.1)',
          iconShadow: '0 8px 16px -4px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          icon: (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      
      case 'error':
        return {
          gradient: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          iconBg: 'bg-gradient-to-b from-red-400 to-red-500',
          iconColor: 'text-white',
          borderColor: 'border-red-200',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-600',
          buttonGradient: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(239, 68, 68, 0.1)',
          iconShadow: '0 8px 16px -4px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          icon: (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      
      case 'warning':
        return {
          gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          iconBg: 'bg-gradient-to-b from-yellow-400 to-yellow-500',
          iconColor: 'text-white',
          borderColor: 'border-yellow-200',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-600',
          buttonGradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(245, 158, 11, 0.1)',
          iconShadow: '0 8px 16px -4px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          icon: (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        };
      
      case 'info':
      default:
        return {
          gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          iconBg: 'bg-gradient-to-b from-blue-400 to-blue-500',
          iconColor: 'text-white',
          borderColor: 'border-blue-200',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-600',
          buttonGradient: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)',
          iconShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          icon: (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'success': return '✅ Lyckades!';
      case 'error': return '❌ Fel!';
      case 'warning': return '⚠️ Varning!';
      case 'info':
      default: return 'ℹ️ Meddelande';
    }
  };

  if (!show) return null;

  const config = getAlertConfig();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out ${
          isAnimating 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-5 scale-95'
        }`}
        style={{
          background: config.gradient,
          boxShadow: config.boxShadow,
        }}
      >
        {/* Close button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Icon */}
        <div className="text-center pt-8 pb-4">
          <div 
            className={`inline-flex items-center justify-center w-16 h-16 ${config.iconBg} rounded-full mx-auto mb-4`}
            style={{
              boxShadow: config.iconShadow
            }}
          >
            {config.icon}
          </div>
          
          <h3 className={`text-xl font-bold ${config.titleColor} mb-2`}>
            {title || getDefaultTitle()}
          </h3>
          <p className={`${config.messageColor} px-6 leading-relaxed`}>
            {message}
          </p>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-8">
          <button
            onClick={handleClose}
            className={`w-full px-6 py-3 ${config.buttonGradient} text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5`}
            style={{
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
              textShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
            }}
          >
            Förstått
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Detta stängs automatiskt om {Math.ceil(duration / 1000)} sekunder
          </p>
        </div>
      </div>
    </div>
  );
};

export default Alert;