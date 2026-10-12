'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowUpDown, X, ShieldCheck, Scale, MapPin, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { FilterState } from '@/types';
import { serviceCategories } from '@/data/services';
import { performSmartProSearch } from '@/lib/search';
import { useProfessionalsList, useComparison } from '@/lib/demo-storage';
import { ProfessionalGrid } from '@/components/professionals/professional-grid';
import { FilterSidebar } from '@/components/professionals/filter-sidebar';
import { FilterDrawerMobile } from '@/components/professionals/filter-drawer-mobile';
import { ComparisonFloatingBar } from '@/components/professionals/comparison-floating-bar';
import { ComparisonModal } from '@/components/professionals/comparison-modal';
import { BookingFlowDialog } from '@/components/booking/booking-flow-dialog';
import { Professional } from '@/types/professional';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { PrototypeDisclaimer } from '@/components/ui/prototype-disclaimer';

function ProfessionalsDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const allPros = useProfessionalsList();

  const [localFilters, setLocalFilters] = useState<Partial<FilterState>>({});

  // Computed filter state merging URL searchParams with local overrides
  const filters: FilterState = useMemo(() => {
    const urlQuery = searchParams.get('query') || '';
    const urlLocation = searchParams.get('location') || '';
    const urlCategory = searchParams.get('category') || 'all';

    return {
      query: localFilters.query !== undefined ? localFilters.query : urlQuery,
      location: localFilters.location !== undefined ? localFilters.location : urlLocation,
      category: localFilters.category !== undefined ? localFilters.category : urlCategory,
      minRating: localFilters.minRating !== undefined ? localFilters.minRating : null,
      availableToday: localFilters.availableToday !== undefined ? localFilters.availableToday : false,
      priceTier: localFilters.priceTier !== undefined ? localFilters.priceTier : 'all',
      verifiedOnly: localFilters.verifiedOnly !== undefined ? localFilters.verifiedOnly : false,
      sortBy: localFilters.sortBy !== undefined ? localFilters.sortBy : 'recommended',
    };
  }, [searchParams, localFilters]);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [bookingDialogPro, setBookingDialogPro] = useState<Professional | null>(null);

  const comparisonIds = useComparison();
  const comparedPros = useMemo(() => {
    return allPros.filter((p) => comparisonIds.includes(p.id));
  }, [allPros, comparisonIds]);

  // Handle filter changes
  const handleFilterChange = (updated: Partial<FilterState>) => {
    setLocalFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setLocalFilters({
      query: '',
      location: '',
      category: 'all',
      minRating: null,
      availableToday: false,
      priceTier: 'all',
      verifiedOnly: false,
      sortBy: 'recommended',
    });
    router.replace('/professionals');
  };

  // Perform smart search with category detection, synonyms, and location coverage
  const searchResult = useMemo(() => {
    return performSmartProSearch(allPros, filters);
  }, [allPros, filters]);

  const filteredPros = searchResult.results;
  const diagnostics = searchResult.diagnostics;

  // Active filters count
  const activeFiltersCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0) +
    (filters.availableToday ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.priceTier !== 'all' ? 1 : 0) +
    (filters.query ? 1 : 0) +
    (filters.location ? 1 : 0);

  const selectedCategoryName =
    filters.category !== 'all'
      ? serviceCategories.find((c) => c.slug === filters.category)?.name
      : null;

  return (
    <div className="py-8 sm:py-12 bg-[#F7F8FA]">
      <Container>
        {/* Prototype Disclaimer Notice */}
        <div className="mb-6">
          <PrototypeDisclaimer variant="banner" className="rounded-2xl" />
        </div>

        {/* Top Header Row */}
        <div className="mb-8">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Marketplace Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#173B67] mt-1 tracking-tight">
            Find Local Service Professionals
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 max-w-2xl">
            Compare licensed technicians, evaluate upfront diagnostic inspection fees, and book with escrow milestone protection.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-3xl border border-[#E4E7EC] shadow-2xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Left Controls: Filter Button on the side left + Search Input */}
          <div className="flex items-center gap-2 sm:gap-2.5 w-full md:max-w-xl">
            {/* Side-Left Filter Button */}
            <Button
              variant={activeFiltersCount > 0 ? 'secondary' : 'outline'}
              size="md"
              onClick={() => setMobileFilterOpen(true)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              className="rounded-2xl px-3 sm:px-3.5 py-2.5 text-xs sm:text-sm font-bold shrink-0 flex items-center gap-1.5 sm:gap-2 border-[#D0D5DD] hover:border-[#173B67] transition-all min-h-[42px]"
            >
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#173B67] text-white font-black text-[10px] flex items-center justify-center -mr-0.5">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => handleFilterChange({ query: e.target.value })}
                placeholder="Search service, issue, or trade (e.g. leaky sink)..."
                className="w-full pl-9 sm:pl-10 pr-8 py-2.5 bg-[#F7F8FA] text-xs sm:text-sm rounded-xl border border-[#E4E7EC] focus:outline-none focus:ring-2 focus:ring-[#173B67] text-[#263445] transition-all min-h-[42px]"
              />
              {filters.query && (
                <button
                  type="button"
                  onClick={() => handleFilterChange({ query: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#667085] hover:text-[#263445] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Optional Location Input in Header Bar */}
            <div className="relative hidden sm:block w-44">
              <MapPin className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange({ location: e.target.value })}
                placeholder="ZIP (e.g. 94107)"
                className="w-full pl-8 pr-7 py-2.5 bg-[#F7F8FA] text-xs rounded-xl border border-[#E4E7EC] focus:outline-none focus:ring-2 focus:ring-[#173B67] text-[#263445] transition-all min-h-[42px]"
              />
              {filters.location && (
                <button
                  type="button"
                  onClick={() => handleFilterChange({ location: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#667085] hover:text-[#263445] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Controls: Compare Button, Desktop Sidebar Toggle & Sort */}
          <div className="flex items-center gap-2 sm:gap-3 justify-between md:justify-end shrink-0 flex-wrap sm:flex-nowrap">
            {/* Quick Compare Trigger in Toolbar */}
            {comparisonIds.length > 0 && (
              <button
                type="button"
                onClick={() => setComparisonModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0F9D91] hover:bg-[#0D877D] px-3 py-2 rounded-xl transition-all shadow-xs shrink-0 active:scale-95 min-h-[38px]"
                title="View side-by-side comparison"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare ({comparisonIds.length})</span>
              </button>
            )}

            {/* Desktop Quick Toggle for Left Sidebar */}
            <button
              type="button"
              onClick={() => setShowDesktopSidebar(!showDesktopSidebar)}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-[#173B67] bg-[#EBF1F8] hover:bg-[#D9E6F5] px-3 py-2 rounded-xl border border-[#173B67]/15 transition-colors min-h-[38px]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F9D91]" />
              <span>{showDesktopSidebar ? 'Hide Left Sidebar' : 'Show Left Sidebar'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto md:ml-0">
              <span className="text-xs text-[#667085] whitespace-nowrap hidden sm:inline font-semibold">
                Sort:
              </span>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange({
                      sortBy: e.target.value as FilterState['sortBy'],
                    })
                  }
                  className="bg-[#F7F8FA] border border-[#E4E7EC] text-xs font-bold text-[#173B67] rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 pr-7 sm:pr-8 focus:outline-none focus:ring-2 focus:ring-[#173B67] cursor-pointer min-h-[38px]"
                >
                  <option value="recommended">Recommended (Top Ranked)</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-[#667085] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Auto-Detection Banner if query was resolved */}
        {diagnostics.detectedCategory.categorySlug && filters.category === 'all' && (
          <div className="mb-4 p-3 px-4 rounded-2xl bg-[#E6F7F5] border border-[#0F9D91]/30 flex items-center justify-between text-xs text-[#173B67]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0F9D91] shrink-0" />
              <span>
                Search mapped to trade:{' '}
                <strong className="text-[#0F9D91] font-bold">
                  {diagnostics.detectedCategory.categoryName}
                </strong>
                {diagnostics.searchedZip ? ` (filtering actual dispatch coverage for ZIP ${diagnostics.searchedZip})` : ''}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleFilterChange({ category: diagnostics.detectedCategory.categorySlug! })}
              className="text-[#0F9D91] font-bold hover:underline shrink-0 ml-2"
            >
              Lock Category Filter
            </button>
          </div>
        )}

        {/* Active Filter Chips Row */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-[#667085] font-semibold">Active Filters:</span>

            {filters.query && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4E7EC] text-[#263445]">
                <span>Query: &ldquo;{filters.query}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ query: '' })}
                  className="text-[#667085] hover:text-[#263445]"
                  aria-label="Remove query filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF1F8] text-[#173B67] font-bold border border-[#173B67]/20">
                <MapPin className="w-3 h-3 text-[#0F9D91]" />
                <span>Coverage: {filters.location}</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ location: '' })}
                  className="text-[#173B67] hover:text-black"
                  aria-label="Remove location filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF1F8] text-[#173B67] font-bold border border-[#173B67]/20">
                <span>{selectedCategoryName || filters.category}</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ category: 'all' })}
                  className="text-[#173B67] hover:text-black"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.verifiedOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF1F8] text-[#173B67] font-bold border border-[#173B67]/20">
                <span>Verified License Only</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ verifiedOnly: false })}
                  className="text-[#173B67] hover:text-black"
                  aria-label="Remove verified filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.minRating && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4E7EC] text-[#263445]">
                <span>Rating: {filters.minRating}+ Stars</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ minRating: null })}
                  className="text-[#667085] hover:text-[#263445]"
                  aria-label="Remove rating filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.availableToday && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#15803D] border border-emerald-200 font-bold">
                <span>Available Today</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ availableToday: false })}
                  className="text-[#15803D] hover:text-black"
                  aria-label="Remove available today filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.priceTier !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4E7EC] text-[#263445]">
                <span>Price: {filters.priceTier}</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ priceTier: 'all' })}
                  className="text-[#667085] hover:text-[#263445]"
                  aria-label="Remove price filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#0F9D91] hover:text-[#0B7F75] font-bold underline text-xs ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main 2-Column Content Layout */}
        <div className={`grid grid-cols-1 ${showDesktopSidebar ? 'lg:grid-cols-12 gap-8' : 'gap-6'} items-start`}>
          {/* Desktop Left Sidebar (w-72 / 3 cols) */}
          {showDesktopSidebar && (
            <div className="hidden lg:block lg:col-span-3 sticky top-24">
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          )}

          {/* Right Results Grid */}
          <div className={`${showDesktopSidebar ? 'lg:col-span-9' : 'lg:col-span-12'} flex flex-col gap-6`}>
            {/* Results count strip */}
            <div className="flex items-center justify-between text-xs text-[#667085]">
              <p>
                Showing <strong className="text-[#173B67]">{filteredPros.length}</strong>{' '}
                {filteredPros.length === 1 ? 'verified professional' : 'verified professionals'}
              </p>
              <span className="text-[11px] text-[#667085]">
                Standard Diagnostic Vetting Active
              </span>
            </div>

            {/* Results or Empty State */}
            {filteredPros.length > 0 ? (
              <ProfessionalGrid
                professionals={filteredPros}
                columns={showDesktopSidebar ? '3' : '4'}
              />
            ) : (
              <EmptyState
                query={filters.query}
                title={
                  diagnostics.emptyReason === 'unsupported_service'
                    ? "Service Not Supported Yet"
                    : diagnostics.emptyReason === 'invalid_zip'
                    ? "Invalid Postal Code"
                    : diagnostics.emptyReason === 'no_pros_in_zip'
                    ? "No Service Coverage in this ZIP Code"
                    : "No professionals found matching your search"
                }
                description={diagnostics.emptyMessage}
                onReset={handleResetFilters}
                actionText="Reset All Directory Filters"
              />
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Filter Drawer */}
      <FilterDrawerMobile
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        resultsCount={filteredPros.length}
      />

      {/* Floating Comparison Bar */}
      <ComparisonFloatingBar
        onOpenModal={() => setComparisonModalOpen(true)}
      />

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        professionals={comparedPros}
        onSelectForBooking={(pro) => {
          setComparisonModalOpen(false);
          setBookingDialogPro(pro);
        }}
      />

      {/* Direct Booking Flow from Modal */}
      {bookingDialogPro && (
        <BookingFlowDialog
          isOpen={Boolean(bookingDialogPro)}
          onClose={() => setBookingDialogPro(null)}
          professional={bookingDialogPro}
        />
      )}
    </div>
  );
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[#667085]">Loading directory...</div>}>
      <ProfessionalsDirectoryContent />
    </Suspense>
  );
}
