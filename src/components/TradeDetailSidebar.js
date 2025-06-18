import { useState, useEffect } from 'react';
import { Printer, Star, Edit3, Trash2, MapPin, Calendar, Eye, MessageCircle, Share2 } from 'lucide-react';

// Simple Share Component - just a small green button
const SimpleShareComponent = ({ listing }) => {
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: 'info', message: '' }), 3000);
  };

  const handleShare = async () => {
    try {
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: listing.title,
          text: `Kolla in detta byte: ${listing.title}`,
          url: window.location.href
        };
        
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          showAlert('success', 'Byte delat framgångsrikt!');
          return;
        }
      }
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      showAlert('success', 'Länk kopierad till urklipp!');
    } catch (error) {
      if (error.name !== 'AbortError') {
        showAlert('error', 'Misslyckades att dela. Försök igen.');
      }
    }
  };

  return (
    <>
      {/* Alert */}
      {alert.show && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className={`backdrop-blur-xl bg-gradient-to-br ${
            alert.type === 'success' 
              ? 'from-emerald-500/20 to-green-500/20 border-emerald-400/30 text-emerald-800' 
              : 'from-red-500/20 to-rose-500/20 border-red-400/30 text-red-800'
          } border rounded-2xl p-4 shadow-2xl transform transition-all duration-300`}>
            <p className="text-sm font-medium">{alert.message}</p>
          </div>
        </div>
      )}

      <button 
        onClick={handleShare}
        className="w-full group flex items-center p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 hover:from-green-100/80 hover:to-emerald-100/80 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl border border-green-200/50"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
          <Share2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-medium text-green-800">Dela</span>
      </button>
    </>
  );
};

// Alert Component
const Alert = ({ type = 'info', title, message, isVisible, onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'from-emerald-500/20 to-green-500/20 border-emerald-400/30 text-emerald-800',
    error: 'from-red-500/20 to-rose-500/20 border-red-400/30 text-red-800',
    warning: 'from-amber-500/20 to-yellow-500/20 border-amber-400/30 text-amber-800',
    info: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30 text-blue-800'
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`
        backdrop-blur-xl bg-gradient-to-br ${typeStyles[type]} 
        border rounded-2xl p-4 shadow-2xl
        transform transition-all duration-300 ease-out
        ${visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
      `}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
            <p className="text-xs opacity-90">{message}</p>
          </div>
          <button 
            onClick={() => setVisible(false)}
            className="ml-4 opacity-60 hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Utility function to calculate time difference
const getTimeSince = (date) => {
  const now = new Date();
  const joinedDate = new Date(date);
  const diffInMs = now - joinedDate;
  
  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);
  
  if (years > 0) return years === 1 ? '1 år sedan' : `${years} år sedan`;
  if (months > 0) return months === 1 ? '1 månad sedan' : `${months} månader sedan`;
  if (days > 0) return days === 1 ? '1 dag sedan' : `${days} dagar sedan`;
  if (hours > 0) return hours === 1 ? '1 timme sedan' : `${hours} timmar sedan`;
  if (minutes > 0) return minutes === 1 ? '1 minut sedan' : `${minutes} minuter sedan`;
  return seconds <= 5 ? 'Just nu' : `${seconds} sekunder sedan`;
};

// TimeSince component for real-time updates
const TimeSince = ({ date, prefix = "Medlem sedan", className = "" }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!date) return;

    const updateTime = () => setTimeAgo(getTimeSince(date));
    updateTime();
    
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [date]);

  if (!date) {
    return <span className={className}>{prefix} Okänt</span>;
  }

  return (
    <span className={className} title={new Date(date).toLocaleString()}>
      {prefix} {timeAgo || getTimeSince(date)}
    </span>
  );
};

// Delete Confirmation Dialog
const DeleteConfirmDialog = ({ isVisible, onConfirm, onCancel, isLoading }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-white/95 border border-white/20 rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-full mx-auto mb-6 shadow-xl">
            <Trash2 className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
            Ta bort annons
          </h3>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            Är du säker på att du vill ta bort denna annons? Denna åtgärd kan inte ångras.
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              Avbryt
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Tar bort...
                </div>
              ) : (
                'Ta bort för alltid'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function TradeDetailSidebar({ 
  listing, 
  tradeOffers = [], 
  uniqueImages = [],
  currentUser = null,
  onEdit = null,
  onDelete = null,
  authToken = null
}) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [alert, setAlert] = useState({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Sample data for demo
  const sampleListing = listing || {
    id: 1,
    title: "Vintage kamera byte",
    category: "Elektronik",
    status: "Aktiv",
    created_at: "2024-12-01",
    seller: {
      name: "Johan Andersson",
      joinedDate: "2024-01-15",
      location: "Stockholm, Sverige",
      bio: "Fotografi entusiast och samlare av vintage utrustning."
    }
  };

  const listingId = sampleListing?.id || sampleListing?.listing_id;

  // Check if current user is the creator
  const isCreator = (() => {
    if (!currentUser || !sampleListing) return false;

    const currentUserId = currentUser.id || currentUser.user_id || currentUser.userId;
    const listingUserId = sampleListing.user_id || sampleListing.userId || sampleListing.seller?.id || sampleListing.seller?.user_id || sampleListing.creator_id;

    if (currentUserId && listingUserId) {
      return String(currentUserId) === String(listingUserId);
    }

    if (currentUser.email && sampleListing.seller?.email) {
      return currentUser.email === sampleListing.seller.email;
    }

    if (currentUser.email && sampleListing.email) {
      return currentUser.email === sampleListing.email;
    }

    return false;
  })();

  // Get authentication token
  const getAuthToken = () => {
    return authToken || currentUser?.token || null;
  };

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const handleDeleteConfirmed = async () => {
    if (onDelete && typeof onDelete === 'function') {
      onDelete(sampleListing);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      showAlert('error', 'Autentiseringsfel', 'Vänligen logga in för att ta bort denna annons');
      return;
    }

    setDeleteLoading(true);

    try {
      const slug = sampleListing.slug;
      if (!slug) {
        throw new Error('Annons-slug hittades inte');
      }

      const response = await fetch(`/api/trades/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showAlert('success', 'Borttagen!', 'Annons borttagen framgångsrikt!');
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/trades';
          }
        }, 2000);
      } else {
        throw new Error('Misslyckades att ta bort annonsen');
      }
    } catch (error) {
      showAlert('error', 'Borttagning misslyckades', error.message || 'Misslyckades att ta bort annonsen');
    } finally {
      setDeleteLoading(false);
    }
  };

  const sellerJoinDate = sampleListing.seller?.joinedDate || 
                        sampleListing.seller?.joined_date || 
                        sampleListing.seller?.created_at;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Alert Component */}
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          isVisible={alert.show}
          onClose={() => setAlert({ ...alert, show: false })}
          duration={3000}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isVisible={showDeleteConfirm}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            handleDeleteConfirmed();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={deleteLoading}
        />

        {/* Creator Notice */}
        {isCreator && (
          <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 via-blue-400/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-blue-800 font-semibold text-sm">Detta är din annons</p>
              </div>
            </div>
          </div>
        )}

        {/* Seller Info Card */}
        <div className="backdrop-blur-xl bg-white/95 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent mb-6">
            Säljare information
          </h2>
          
          <div className="flex items-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-xl">
                  {sampleListing.seller?.name?.charAt(0).toUpperCase() || 'J'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-bold text-xl text-gray-800">
                {sampleListing.seller?.name || 'Johan Andersson'}
              </h3>
              <TimeSince 
                date={sellerJoinDate} 
                className="text-gray-600 text-sm font-medium"
              />
            </div>
          </div>

          {sampleListing.seller?.bio && (
            <div className="mb-6 p-4 bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-inner">
              <p className="text-gray-700 text-sm leading-relaxed">{sampleListing.seller.bio}</p>
            </div>
          )}

          {sampleListing.seller?.location && (
            <div className="flex items-center text-gray-600 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-xl px-4 py-2 shadow-inner">
              <MapPin className="w-4 h-4 mr-2 text-green-500" />
              <span className="text-sm font-medium">{sampleListing.seller.location}</span>
            </div>
          )}
        </div>

        {/* Trade Stats */}
        <div className="backdrop-blur-xl bg-white/95 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
            Bytesdetaljer
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-gray-600 text-sm font-medium">Publicerad</span>
              </div>
              <span className="font-semibold text-gray-800">
                {new Date(sampleListing.created_at).toLocaleDateString('sv-SE')}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl">
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-gradient-to-br from-green-400 to-green-600 rounded-full"></div>
                <span className="text-gray-600 text-sm font-medium">Status</span>
              </div>
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                {sampleListing.status || 'Aktiv'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl">
              <span className="text-gray-600 text-sm font-medium">Kategori</span>
              <span className="font-semibold text-gray-800">{sampleListing.category}</span>
            </div>
            
            {tradeOffers.length > 0 && (
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50/50 to-white/50 rounded-xl">
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-gray-600 text-sm font-medium">Byteserbjudanden</span>
                </div>
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {tradeOffers.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="backdrop-blur-xl bg-white/95 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
            Snabbåtgärder
          </h3>
          <div className="space-y-3">
            {/* Share Button - Now at the top and simplified */}
            <SimpleShareComponent listing={sampleListing} />
            
            <button 
              onClick={() => window.print()}
              className="w-full group flex items-center p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 hover:from-blue-100/80 hover:to-cyan-100/80 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl border border-blue-200/50"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-blue-800">Skriv ut detaljer</span>
            </button>
            
            {/* Creator-only actions */}
            {isCreator && (
              <>
                <div className="border-t border-gray-200/50 my-4"></div>
                
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteLoading}
                  className={`w-full group flex items-center p-4 bg-gradient-to-r from-red-50/80 to-rose-50/80 hover:from-red-100/80 hover:to-rose-100/80 rounded-xl transition-all duration-200 ${
                    !deleteLoading ? 'hover:scale-105' : ''
                  } shadow-lg hover:shadow-xl border border-red-200/50 ${
                    deleteLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br from-red-400 to-rose-600 rounded-full flex items-center justify-center mr-3 ${
                    !deleteLoading ? 'group-hover:scale-110' : ''
                  } transition-transform duration-200`}>
                    {deleteLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="font-medium text-red-800">
                    {deleteLoading ? 'Tar bort...' : 'Ta bort annons'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}