'use client';

import { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { Package, MapPin, Calendar, ArrowRightLeft, Search, X, Filter, TrendingUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateString) => {
  if (!dateString) return 'Nyligen';
  const days = Math.ceil((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
  if (days <= 1) return 'Idag';
  if (days <= 7) return `${days}d`;
  if (days <= 30) return `${Math.ceil(days / 7)}v`;
  return new Date(dateString).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
};

const getWantedText = (itemsWanted) => {
  if (!itemsWanted?.length) return 'Alla erbjudanden';
  const first = itemsWanted[0];
  if (typeof first === 'string' && first.trim()) return first;
  return first?.description?.trim() || first?.title?.trim() || 'Alla erbjudanden';
};

// ─── Debounce hook ───────────────────────────────────────────────────────────

function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Trade Card (memoised so it only re-renders when its listing changes) ────

const TradeCard = memo(function TradeCard({ listing }) {
  const imageUrl = listing.images?.[0]?.url || listing.imageUrl;
  const wantedItemText = getWantedText(listing.itemsWanted);

  return (
    <Link
      href={`/tradedetailpage/${listing.slug || listing.id}`}
      className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl active:scale-[0.98] transition-all duration-200 overflow-hidden border border-gray-100 hover:border-green-300"
    >
      {/* Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Bytesannons: ${listing.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
            <Package className="w-16 h-16 text-green-500" />
          </div>
        )}
        {listing.category && (
          <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-bold text-green-700 shadow">
            {listing.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors leading-snug">
          {listing.title || 'Namnlös annons'}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100">
            <MapPin className="w-3 h-3 shrink-0" />
            {listing.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 shrink-0" />
            {formatDate(listing.created_at)}
          </span>
        </div>

        {listing.description && (
          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        )}

        {/* Wanted */}
        <div className="mt-auto pt-2 bg-amber-50 rounded-xl px-3 py-2.5 border border-amber-100">
          <p className="text-xs font-bold text-amber-600 flex items-center gap-1 mb-0.5">
            <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
            Vill byta mot:
          </p>
          <p className="text-amber-900 text-xs font-semibold line-clamp-1">{wantedItemText}</p>
        </div>
      </div>
    </Link>
  );
});

// ─── Skeleton loader ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-10 bg-amber-100 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function TradeListingsPage() {
  const [listings, setListings] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const searchTerm = useDebounce(searchInput);

  // Fetch once
  useEffect(() => {
    let cancelled = false;
    fetch('/api/trades')
      .then(r => r.json())
      .then(data => {
        if (!cancelled && data.success) setListings(data.data.listings || []);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Derived – computed only when deps change, no extra state/effects
  const { regions, categories } = useMemo(() => ({
    regions: ['all', ...new Set(listings.map(l => l.location).filter(Boolean))],
    categories: ['all', ...new Set(listings.map(l => l.category).filter(Boolean))],
  }), [listings]);

  const filteredListings = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return listings.filter(l => {
      if (s && !l.title?.toLowerCase().includes(s) &&
               !l.description?.toLowerCase().includes(s) &&
               !l.location?.toLowerCase().includes(s)) return false;
      if (selectedRegion !== 'all' && l.location !== selectedRegion) return false;
      if (selectedCategory !== 'all' && l.category !== selectedCategory) return false;
      return true;
    });
  }, [listings, searchTerm, selectedRegion, selectedCategory]);

  const isFiltered = searchInput || selectedRegion !== 'all' || selectedCategory !== 'all';

  const clearFilters = useCallback(() => {
    setSearchInput('');
    setSelectedRegion('all');
    setSelectedCategory('all');
  }, []);

  // ── Shared filter controls (used in both sidebar + mobile drawer) ──────────
  const FilterControls = (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Sök prylar att byta..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
        />
        {searchInput && (
          <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Region */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-green-600" /> Plats
        </label>
        <select
          value={selectedRegion}
          onChange={e => setSelectedRegion(e.target.value)}
          className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white cursor-pointer"
        >
          <option value="all">Alla platser</option>
          {regions.filter(r => r !== 'all').map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-green-600" /> Kategori
        </label>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white cursor-pointer"
        >
          <option value="all">Alla kategorier</option>
          {categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {isFiltered && (
        <button
          onClick={clearFilters}
          className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" /> Rensa filter
        </button>
      )}

      {/* Stats */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wide">Aktivitet</span>
        </div>
        <p className="text-2xl font-extrabold">{listings.length}</p>
        <p className="text-green-100 text-xs">Aktiva bytesannonser</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base font-extrabold text-gray-900 truncate leading-tight">
              Bytesannonser <span className="text-green-600">Second Hand</span>
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">Byt prylar i hela Sverige</p>
          </div>

          {/* Mobile: filter button + result count */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            {isFiltered && (
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full">
                {filteredListings.length}
              </span>
            )}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-bold px-3 py-2 rounded-xl transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filter
              {isFiltered && <span className="bg-white text-green-700 rounded-full w-4 h-4 text-xs flex items-center justify-center font-black">!</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Filter Drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85dvh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-extrabold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-green-600" /> Filtrera
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto p-5 flex-1">
              {FilterControls}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-xl font-bold text-sm transition-colors"
              >
                Visa {filteredListings.length} {filteredListings.length === 1 ? 'annons' : 'annonser'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 py-5 lg:py-8">
        <div className="flex gap-7">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sticky top-20">
              <div className="flex items-center gap-2 mb-5">
                <Filter className="w-4 h-4 text-green-600" />
                <h2 className="font-bold text-gray-900">Filtrera</h2>
              </div>
              {FilterControls}
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Result header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  {loading ? '…' : filteredListings.length} {filteredListings.length === 1 ? 'Annons' : 'Annonser'}
                </h2>
                <p className="text-xs text-gray-500">Begagnade varor redo för byte</p>
              </div>
              {isFiltered && !loading && (
                <button onClick={clearFilters} className="text-xs text-red-500 font-semibold hover:underline flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Rensa
                </button>
              )}
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {filteredListings.map(listing => (
                  <TradeCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-bold text-gray-700 mb-2">Inga annonser hittades</h3>
                <p className="text-sm text-gray-500 mb-5">Prova att justera eller rensa dina filter.</p>
                <button
                  onClick={clearFilters}
                  className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors"
                >
                  Visa alla annonser
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
