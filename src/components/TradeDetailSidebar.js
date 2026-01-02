import { useState, useEffect } from 'react';
import { Printer, Star, Trash2, MapPin, Calendar, MessageCircle, Share2 } from 'lucide-react';

// Alert Component
const Alert = ({ type = 'info', message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: 'from-emerald-500/20 to-green-500/20 border-emerald-400/30 text-emerald-800',
    error: 'from-red-500/20 to-rose-500/20 border-red-400/30 text-red-800',
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`backdrop-blur-xl bg-gradient-to-br ${styles[type]} border rounded-2xl p-4 shadow-2xl`}>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

// Time calculation
const getTimeSince = (date) => {
  const ms = new Date() - new Date(date);
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);
  
  if (years > 0) return `${years} år sedan`;
  if (months > 0) return `${months} månad${months > 1 ? 'er' : ''} sedan`;
  if (days > 0) return `${days} dag${days > 1 ? 'ar' : ''} sedan`;
  if (hours > 0) return `${hours} timm${hours > 1 ? 'ar' : 'e'} sedan`;
  if (minutes > 0) return `${minutes} minut${minutes > 1 ? 'er' : ''} sedan`;
  return 'Just nu';
};

// Delete Dialog
const DeleteDialog = ({ isVisible, onConfirm, onCancel, isLoading }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Trash2 className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Ta bort annons</h3>
          <p className="text-gray-600 mb-8">Är du säker? Denna åtgärd kan inte ångras.</p>
          
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium"
            >
              Avbryt
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-xl font-medium disabled:opacity-50"
            >
              {isLoading ? 'Tar bort...' : 'Ta bort'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TradeDetailSidebar({ 
  listing, 
  tradeOffers = [], 
  currentUser = null,
  onDelete = null,
  authToken = null
}) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  // Check if current user is creator
  const isCreator = (() => {
    if (!currentUser || !listing) return false;
    const userId = currentUser.id || currentUser.user_id;
    const listingUserId = listing.user_id || listing.seller?.id;
    return userId && listingUserId && String(userId) === String(listingUserId);
  })();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: `Kolla in detta byte: ${listing.title}`,
          url: window.location.href
        });
        showAlert('success', 'Byte delat!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showAlert('success', 'Länk kopierad!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        showAlert('error', 'Misslyckades att dela');
      }
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      onDelete(listing);
      return;
    }

    const token = authToken || currentUser?.token;
    if (!token) {
      showAlert('error', 'Vänligen logga in');
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/trades/${listing.slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showAlert('success', 'Annons borttagen!');
        setTimeout(() => window.location.href = '/trades', 2000);
      } else {
        throw new Error('Misslyckades');
      }
    } catch (error) {
      showAlert('error', 'Kunde inte ta bort annonsen');
    } finally {
      setDeleteLoading(false);
    }
  };

  const seller = listing?.seller || {};
  const sellerName = seller.name || 'Anonym';
  const sellerInitial = sellerName.charAt(0).toUpperCase();
  const joinedDate = seller.joinedDate || seller.joined_date || seller.created_at;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-md mx-auto space-y-6">
        <Alert
          type={alert.type}
          message={alert.message}
          isVisible={alert.show}
          onClose={() => setAlert({ ...alert, show: false })}
        />

        <DeleteDialog
          isVisible={showDeleteConfirm}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            handleDelete();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={deleteLoading}
        />

        {isCreator && (
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4">
                <Star className="w-5 h-5 text-white" />
              </div>
              <p className="text-blue-800 font-semibold">Detta är din annons</p>
            </div>
          </div>
        )}

        {/* Seller Card */}
        <div className="bg-white/95 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Säljare information</h2>
          
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-xl">{sellerInitial}</span>
            </div>
            <div className="ml-4">
              <h3 className="font-bold text-xl text-gray-800">{sellerName}</h3>
              <p className="text-gray-600 text-sm">Medlem sedan {getTimeSince(joinedDate)}</p>
            </div>
          </div>

          {seller.bio && (
            <div className="mb-6 p-4 bg-gray-50/80 rounded-2xl">
              <p className="text-gray-700 text-sm">{seller.bio}</p>
            </div>
          )}

          {seller.location && (
            <div className="flex items-center text-gray-600 bg-gray-50/80 rounded-xl px-4 py-2">
              <MapPin className="w-4 h-4 mr-2 text-green-500" />
              <span className="text-sm font-medium">{seller.location}</span>
            </div>
          )}
        </div>

        {/* Trade Details */}
        <div className="bg-white/95 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Bytesdetaljer</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-gray-600 text-sm font-medium">Publicerad</span>
              </div>
              <span className="font-semibold text-gray-800">
                {new Date(listing.created_at).toLocaleDateString('sv-SE')}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
              <span className="text-gray-600 text-sm font-medium">Status</span>
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                {listing.status || 'Aktiv'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
              <span className="text-gray-600 text-sm font-medium">Kategori</span>
              <span className="font-semibold text-gray-800">{listing.category}</span>
            </div>
            
            {tradeOffers.length > 0 && (
              <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl">
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-gray-600 text-sm font-medium">Byteserbjudanden</span>
                </div>
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {tradeOffers.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/95 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Snabbåtgärder</h3>
          <div className="space-y-3">
            <button 
              onClick={handleShare}
              className="w-full flex items-center p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 hover:from-green-100/80 hover:to-emerald-100/80 rounded-xl transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-green-800">Dela</span>
            </button>
            
            <button 
              onClick={() => window.print()}
              className="w-full flex items-center p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 hover:from-blue-100/80 hover:to-cyan-100/80 rounded-xl transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-blue-800">Skriv ut detaljer</span>
            </button>
            
            {isCreator && (
              <>
                <div className="border-t border-gray-200/50 my-4"></div>
                
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteLoading}
                  className="w-full flex items-center p-4 bg-gradient-to-r from-red-50/80 to-rose-50/80 hover:from-red-100/80 hover:to-rose-100/80 rounded-xl transition-all disabled:opacity-50"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-rose-600 rounded-full flex items-center justify-center mr-3">
                    <Trash2 className="w-5 h-5 text-white" />
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