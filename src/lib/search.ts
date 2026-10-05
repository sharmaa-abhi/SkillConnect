import { ProfessionalProfile } from '@/types/professional';
import { FilterState } from '@/types';

export function filterAndSortProfessionals(
  pros: ProfessionalProfile[],
  filters: FilterState
): ProfessionalProfile[] {
  let results = [...pros];

  // 1. Text Search (Matches name, tradeTitle, category, skills, service areas, zipCodes)
  if (filters.query && filters.query.trim().length > 0) {
    const q = filters.query.toLowerCase().trim();
    results = results.filter((pro) => {
      const matchName = pro.name.toLowerCase().includes(q);
      const matchTrade = pro.tradeTitle.toLowerCase().includes(q);
      const matchCategory = pro.categoryName.toLowerCase().includes(q) || pro.categorySlug.toLowerCase().includes(q);
      const matchSkills = pro.skills.some((skill) => skill.toLowerCase().includes(q));
      const matchAreas = pro.serviceAreas.some((area) => area.toLowerCase().includes(q));
      const matchZips = pro.zipCodes.some((zip) => zip.includes(q));
      const matchBio = pro.bio.toLowerCase().includes(q);

      return matchName || matchTrade || matchCategory || matchSkills || matchAreas || matchZips || matchBio;
    });
  }

  // 2. Category Filter
  if (filters.category && filters.category !== 'all') {
    results = results.filter((pro) => pro.categorySlug === filters.category);
  }

  // 3. Minimum Rating Filter
  if (filters.minRating !== null && filters.minRating > 0) {
    results = results.filter((pro) => pro.rating >= filters.minRating!);
  }

  // 4. Available Today
  if (filters.availableToday) {
    results = results.filter((pro) => pro.availableToday);
  }

  // 5. Price Tier Filter ($: <60, $$: 60-90, $$$: 90+)
  if (filters.priceTier && filters.priceTier !== 'all') {
    results = results.filter((pro) => pro.priceTier === filters.priceTier);
  }

  // 6. Sorting
  switch (filters.sortBy) {
    case 'rating':
      results.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'price-asc':
      results.sort((a, b) => a.hourlyRate - b.hourlyRate || a.diagnosticFee - b.diagnosticFee);
      break;
    case 'recommended':
    default:
      // Weighted score: (rating / 5 * 60) + (Math.min(reviewCount, 200) / 200 * 40)
      results.sort((a, b) => {
        const scoreA = (a.rating / 5) * 60 + (Math.min(a.reviewCount, 200) / 200) * 40;
        const scoreB = (b.rating / 5) * 60 + (Math.min(b.reviewCount, 200) / 200) * 40;
        return scoreB - scoreA;
      });
      break;
  }

  return results;
}
