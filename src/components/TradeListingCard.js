//components/TradeListingCard.js
'use client';
import React, { useState } from 'react';
import { MapPin, Package, ArrowRightLeft, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Alert from './Alert'; // Justera sökväg vid behov

export default function TradeListingCard({ listing }) {
  // Hantering av varningsmeddelanden
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'info',
    title: null
  });

  // Hjälpfunktion för att visa varningar
  const showAlert = (message, type = 'info', title = null) => {
    setAlert({
      show: true,
      message,
      type,
      title
    });
  };

  // Hjälpfunktion för att stänga varningar
  const closeAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  // Hjälpfunktion för att visa önskade föremål
  const getWantedItemsDisplay = (listing) => {
    // Först, kontrollera om vi har föremål med typ 'wanting'
    if (listing.items && Array.isArray(listing.items)) {
      const wantedItems = listing.items.filter(item => item.type === 'wanting');
      if (wantedItems.length > 0) {
        return wantedItems;
      }
    }
    
    // Reservlösning till äldre fält
    if (listing.itemsWantedDetails && Array.isArray(listing.itemsWantedDetails)) {
      return listing.itemsWantedDetails;
    }
    
    if (listing.itemsWanted && Array.isArray(listing.itemsWanted)) {
      return listing.itemsWanted.map(item => ({ description: item }));
    }
    
    // Standard reservlösning
    return [{ description: "Alla erbjudanden" }];
  };

  // Hjälpfunktion för att kontrollera om beskrivning är meningsfull
  const isMeaningfulDescription = (desc) => {
    if (!desc) return false;
    if (typeof desc !== 'string' && typeof desc !== 'number') return false;
    
    const trimmed = desc.toString().trim();
    
    // Filtrera bort tomma, meningslösa eller testbeskrivningar
    if (trimmed === '' || 
        trimmed === '0' || 
        trimmed.length < 3 ||
        /^[äöüjkh]+$/.test(trimmed) || // Testdatamönster
        /^[a-z]\1+$/.test(trimmed) || // Upprepade tecken som 'jjjj', 'kkkk'
        trimmed === 'null' ||
        trimmed === 'undefined') {
      return false;
    }
    
    return true;
  };

  // Hjälpfunktion för att hämta bild-URL
  const getImageUrl = (listing) => {
    // Kontrollera för beräknad imageUrl-egenskap
    if (listing.imageUrl) {
      return listing.imageUrl;
    }
    
    // Kontrollera för bilder-array
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
      // Filtrera bort ogiltiga bilder och hämta den första giltiga
      const validImages = listing.images.filter(img => 
        img && 
        (img.url || img.src || img.path) && 
        img.url !== '' && 
        img.src !== '' && 
        img.path !== ''
      );
      
      if (validImages.length > 0) {
        return validImages[0].url || validImages[0].src || validImages[0].path;
      }
    }
    
    // Äldre reservlösningar
    if (listing.imagePreview) {
      return listing.imagePreview;
    }
    
    return null;
  };

  // Hjälpfunktion för att få bildräkning
  const getImageCount = (listing) => {
    // Kontrollera för beräknad imageCount-egenskap först
    if (typeof listing.imageCount === 'number') {
      return listing.imageCount;
    }
    
    // Kontrollera för bilder-array
    if (listing.images && Array.isArray(listing.images)) {
      // Filtrera bort null, undefined eller ogiltiga poster
      const validImages = listing.images.filter(img => {
        if (!img) {
          return false;
        }
        
        // Kontrollera om bilden har en giltig URL/src/path
        const hasValidUrl = (img.url && img.url !== '') || 
                           (img.src && img.src !== '') || 
                           (img.path && img.path !== '');
        
        return hasValidUrl;
      });
      
      // Ta bort dubbletter baserat på URL
      const seenUrls = new Set();
      const uniqueImages = validImages.filter(img => {
        const url = img.url || img.src || img.path;
        const normalizedUrl = url?.toLowerCase().trim();
        
        if (seenUrls.has(normalizedUrl)) {
          return false;
        }
        
        seenUrls.add(normalizedUrl);
        return true;
      });
      
      return uniqueImages.length;
    }
    
    // Äldre reservlösning
    if (typeof listing.images === 'number') {
      return listing.images;
    }
    
    return 0;
  };

  // Hämta unika bilder för visningsändamål
  const getUniqueImages = (listing) => {
    if (!listing.images || !Array.isArray(listing.images)) {
      return [];
    }
    
    const validImages = listing.images.filter(img => 
      img && 
      (img.url || img.src || img.path) && 
      img.url !== '' && 
      img.src !== '' && 
      img.path !== ''
    );
    
    // Ta bort dubbletter baserat på URL
    const seenUrls = new Set();
    return validImages.filter(img => {
      const url = img.url || img.src || img.path;
      const normalizedUrl = url?.toLowerCase().trim();
      
      if (seenUrls.has(normalizedUrl)) {
        return false;
      }
      
      seenUrls.add(normalizedUrl);
      return true;
    });
  };

  // Hjälpfunktion för att formatera datum för visning (kortare format)
  const formatDate = (dateString) => {
    if (!dateString) return 'Nyligen';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Visa relativ tid för senaste datum
      if (diffDays <= 1) return 'Idag';
      if (diffDays <= 7) return `${diffDays}d sedan`;
      if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}v sedan`;
      
      // Visa kort datumformat för äldre datum
      return date.toLocaleDateString('sv-SE', { 
        month: 'short', 
        day: 'numeric'
      });
    } catch (error) {
      return 'Nyligen';
    }
  };

  // Hantera bildladdningsfel med varning
  const handleImageError = (e) => {
    console.warn('Bild kunde inte laddas:', e.target.src);
    
    // Visa användarvänlig varning för bildladdningsproblem
    showAlert(
      'Vissa bilder kanske inte är tillgängliga just nu. Prova att uppdatera sidan.',
      'warning',
      'Problem med bildladdning'
    );
  };

  // Hantera kortklick med felhantering
  const handleCardClick = (e) => {
    try {
      // Validera annonsdata innan navigering
      if (!listing || !listing.id) {
        e.preventDefault();
        showAlert(
          'Denna annons verkar vara ofullständig. Försök igen eller kontakta support.',
          'error',
          'Annonsfel'
        );
        return;
      }

      // Kontrollera om annonslänk är giltig
      if (!listingSlug || listingSlug === 'undefined' || listingSlug === 'null') {
        e.preventDefault();
        showAlert(
          'Kan inte visa denna annons. Annonsen kan ha tagits bort eller är tillfälligt otillgänglig.',
          'warning',
          'Navigationsproblem'
        );
        return;
      }

      // Ytterligare validering kan läggas till här
      console.log('Navigerar till annons:', listingSlug);
      
    } catch (error) {
      e.preventDefault();
      console.error('Fel vid hantering av kortklick:', error);
      showAlert(
        'Ett oväntat fel inträffade. Försök igen.',
        'error',
        'Navigationsfel'
      );
    }
  };

  // Generera en slug från antingen befintlig slug-egenskap eller från titeln
  const listingSlug = listing.slug || listing.id || listing.title?.toLowerCase().replace(/\s+/g, '-');
  const imageUrl = getImageUrl(listing);
  const imageCount = getImageCount(listing);
  const uniqueImages = getUniqueImages(listing);
  const wantedItems = getWantedItemsDisplay(listing);

  // Validera väsentlig annonsdata
  if (!listing) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/30">
        <div className="text-center text-gray-500">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4 shadow-lg">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium">Annons ej tillgänglig</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Link 
        href={`/tradedetailpage/${listingSlug}`} 
        key={listing.id || Math.random().toString(36).substr(2, 9)}
        className="group block bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:translate-y-[-8px] border border-green-200/30 hover:border-green-300/50 overflow-hidden transform hover:scale-[1.02]"
        onClick={handleCardClick}
      >
        <div className="relative">
          {/* Förbättrad bildsektion */}
          {imageUrl ? (
            <div className="h-56 rounded-t-2xl overflow-hidden relative">
              {/* Premium gradientöverlagring */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
              
              <Image 
                src={imageUrl} 
                alt={listing.title || 'Handelsföremål'}
                width={400}
                height={224}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={handleImageError}
                unoptimized={imageUrl.startsWith('data:') || imageUrl.includes('blob:')}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              
              {/* Reservplats med förbättrad styling */}
              <div className="h-56 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 rounded-t-2xl items-center justify-center absolute inset-0 hidden">
                <div className="text-center text-green-600">
                  <div className="bg-white/80 backdrop-blur-sm rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3 shadow-lg">
                    <Package className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-medium">
                    {imageCount === 0 ? 'Inga bilder' : `${imageCount} ${imageCount === 1 ? 'bild' : 'bilder'}`}
                  </span>
                </div>
              </div>
              
              {/* Förbättrat bildräkningsbricka */}
              {uniqueImages.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-lg text-white text-xs px-3 py-2 rounded-full shadow-lg border border-white/20 z-20">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span className="font-medium">{uniqueImages.length}</span>
                  </div>
                </div>
              )}

              {/* Premium hover-överlagring */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-600/0 via-transparent to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            </div>
          ) : (
            <div className="h-56 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
              {/* Subtil mönsteröverlagring */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-4 left-4 w-8 h-8 bg-green-200/50 rounded-full"></div>
                <div className="absolute bottom-6 right-6 w-12 h-12 bg-emerald-200/50 rounded-full"></div>
                <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-green-300/50 rounded-full"></div>
              </div>
              
              <div className="text-center text-green-600 relative z-10">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl w-20 h-20 mx-auto flex items-center justify-center mb-4 shadow-xl border border-green-200/50">
                  <Package className="w-10 h-10" />
                </div>
                <p className="text-sm font-medium">Inga bilder tillgängliga</p>
              </div>
            </div>
          )}
          
          {/* Förbättrad innehållssektion */}
          <div className="p-6 relative">
            {/* Premium bakgrundsmönster */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-50/50 to-transparent rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              {/* Förbättrad titelsektion */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors duration-300">
                  {listing.title || 'Namnlös annons'}
                </h3>
              </div>
              
              {/* Förbättrad plats och datum - Fixad för enkel rad */}
              <div className="flex items-center text-sm text-gray-600 mb-4 space-x-3 flex-wrap">
                <div className="flex items-center space-x-1 bg-green-50/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-200/50 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="capitalize font-medium text-green-700 truncate">
                    {listing.location || 'Plats ej angiven'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 bg-gray-50/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 flex-shrink-0">
                  <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-gray-600 whitespace-nowrap">
                    {formatDate(listing.created_at || listing.posted || listing.createdAt)}
                  </span>
                </div>
              </div>
              
              {/* Förbättrad beskrivning */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
                {listing.description || 'Ingen beskrivning tillgänglig'}
              </p>
              
              {/* Förbättrad kategori */}
              <div className="mb-5">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-xl border border-green-200/50 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="capitalize text-green-700 font-medium text-sm">
                    {listing.category?.replace(/-/g, ' ') || 'Allmänt'}
                  </span>
                </div>
              </div>
              
              {/* Förbättrad sektion för önskade föremål */}
              <div className="bg-gradient-to-r from-yellow-50/80 to-amber-50/80 backdrop-blur-sm rounded-xl p-4 border border-yellow-200/50 shadow-sm">
                <div className="flex items-center text-sm font-semibold text-amber-700 mb-3">
                  <div className="bg-amber-100 rounded-full p-1.5 mr-2 shadow-sm">
                    <ArrowRightLeft className="w-4 h-4 text-amber-600" />
                  </div>
                  <span>Söker:</span>
                </div>
                
                <div className="space-y-2">
                  {wantedItems.map((item, index) => {
                    const description = typeof item === 'string' ? item : item.description;
                    
                    return (
                      <div key={index}>
                        {isMeaningfulDescription(description) ? (
                          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-yellow-200/50 shadow-sm">
                            <p className="text-amber-800 text-sm font-medium leading-relaxed">
                              {description}
                            </p>
                          </div>
                        ) : (
                          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 rounded-full border border-yellow-300/50 shadow-sm">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                            <span className="text-amber-700 font-medium text-sm">
                              Alla erbjudanden
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Premium hover-indikator */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Varningskomponent */}
      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          title={alert.title}
          isVisible={alert.show}
          onClose={closeAlert}
          duration={5000} // 5 sekunder
        />
      )}
    </>
  );
}