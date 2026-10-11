'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowUpDown, X, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { FilterState } from '@/types';
import { serviceCategories } from '@/data/services';
import { filterAndSortProfessionals } from '@/lib/search';
import { useProfessionalsList } from '@/lib/demo-storage';
import { ProfessionalGrid } from '@/components/professionals/professional-grid';
import { FilterSidebar } from '@/components/professionals/filter-sidebar';
import { FilterDrawerMobile } from '@/components/professionals/filter-drawer-mobile';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

function ProfessionalsDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const allPros = useProfessionalsList();

  const [localFilters, setLocalFilters] = useState<Partial<FilterState>>({});

  // Computed filter state merging URL searchParams with local overrides
  const filters: FilterState = useMemo(() => {
    const urlQuery = searchParams.get('query') || searchParams.get('location') || '';
    const urlCategory = searchParams.get('category') || 'all';

    return {
      query: localFilters.query !== undefined ? localFilters.query : urlQuery,
      category: localFilters.category !== undefined ? localFilters.category : urlCategory,
      minRating: localFilters.minRating !== undefined ? localFilters.minRating : null,
      availableToday: localFilters.availableToday !== undefined ? localFilters.availableToday : false,
      priceTier: localFilters.priceTier !== undefined ? localFilters.priceTier : 'all',
      verifiedOnly: localFilters.verifiedOnly !== undefined ? localFilters.verifiedOnly : false,
      sortBy: localFilters.sortBy !== undefined ? localFilters.sortBy : 'recommended',
    };
  }, [searchParams, localFilters]);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Handle filter changes
  const handleFilterChange = (updated: Partial<FilterState>) => {
    setLocalFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setLocalFilters({
      query: '',
      category: 'all',
      minRating: null,
      availableToday: false,
      priceTier: 'all',
      verifiedOnly: false,
      sortBy: 'recommended',
    });
    router.replace('/professionals');
  };

  // Filter & sort
  const filteredPros = useMemo(() => {
    return filterAndSortProfessionals(allPros, filters);
  }, [allPros, filters]);

  // Active filters count
  const activeFiltersCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0) +
    (filters.availableToday ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.priceTier !== 'all' ? 1 : 0) +
    (filters.query ? 1 : 0);

  const selectedCategoryName =
    filters.category !== 'all'
      ? serviceCategories.find((c) => c.slug === filters.category)?.name
      : null;

  return (
    <div className="py-8 sm:py-12 bg-[#F7F8FA]">
      <Container>
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
        <div className="bg-white p-4 rounded-3xl border border-[#E4E7EC] shadow-2xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => handleFilterChange({ query: e.target.value })}
              placeholder="Search by name, skill, neighborhood (e.g. 94107, Mission)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F8FA] text-xs sm:text-sm rounded-xl border border-[#E4E7EC] focus:outline-none focus:ring-2 focus:ring-[#173B67] text-[#263445] transition-all"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => handleFilterChange({ query: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#667085] hover:text-[#263445]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort & Mobile Filter Trigger */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFilterOpen(true)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              className="lg:hidden text-xs relative"
            >
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#173B67] text-white font-bold text-[10px] flex items-center justify-center -mr-1">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#667085] whitespace-nowrap hidden sm:inline font-semibold">
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange({
                      sortBy: e.target.value as FilterState['sortBy'],
                    })
                  }
                  className="bg-[#F7F8FA] border border-[#E4E7EC] text-xs font-bold text-[#173B67] rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#173B67] cursor-pointer"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar (w-72 / 3 cols) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-28">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Results Grid (9 cols) */}
          <div className="lg:col-span-9 flex flex-col gap-6">
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
              <ProfessionalGrid professionals={filteredPros} columns="3" />
            ) : (
              <EmptyState
                query={filters.query}
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
    </div>
  );
}

export default function ProfessionalsDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-[#667085]">
          Loading directory...
        </div>
      }
    >
      <ProfessionalsDirectoryContent />
    </Suspense>
  );
}
