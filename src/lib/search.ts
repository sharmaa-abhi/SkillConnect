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

  // 6. Verified Only Filter
  if (filters.verifiedOnly) {
    results = results.filter((pro) => pro.verifiedPro);
  }

  // 7. Sorting
  switch (filters.sortBy) {
    case 'rating':
      results.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'price-asc':
      results.sort((a, b) => a.hourlyRate - b.hourlyRate || a.diagnosticFee - b.diagnosticFee);
      break;
    case 'recommended':
    default:
      // Weighted score: (rating / 5 * 50) + (Math.min(reviewCount, 200) / 200 * 30) + (verifiedPro ? 20 : 0)
      results.sort((a, b) => {
        const scoreA =
          (a.rating / 5) * 50 +
          (Math.min(a.reviewCount, 200) / 200) * 30 +
          (a.verifiedPro ? 20 : 0);
        const scoreB =
          (b.rating / 5) * 50 +
          (Math.min(b.reviewCount, 200) / 200) * 30 +
          (b.verifiedPro ? 20 : 0);
        return scoreB - scoreA;
      });
      break;
  }

  return results;
}

export interface MatchScoreResult {
  professional: ProfessionalProfile;
  totalScore: number; // 0 - 100
  factors: {
    skillMatch: number; // 0-30
    locationMatch: number; // 0-25
    availabilityMatch: number; // 0-20
    verificationScore: number; // 0-15
    reviewAuthority: number; // 0-10
  };
  explanation: string[];
}

export function calculateDeterministicProMatch(
  pro: ProfessionalProfile,
  criteria: {
    categorySlug?: string;
    keywords?: string[];
    postalCode?: string;
    urgentToday?: boolean;
    maxHourlyRate?: number;
  }
): MatchScoreResult {
  const factors = {
    skillMatch: 0,
    locationMatch: 0,
    availabilityMatch: 0,
    verificationScore: 0,
    reviewAuthority: 0,
  };
  const explanation: string[] = [];

  // 1. Skill & Category Relevance (30 max)
  let skillPoints = 0;
  if (criteria.categorySlug && pro.categorySlug === criteria.categorySlug) {
    skillPoints += 15;
    explanation.push(`Exact trade match in ${pro.categoryName}`);
  }
  if (criteria.keywords && criteria.keywords.length > 0) {
    const matchedSkills = pro.skills.filter((s) =>
      criteria.keywords!.some((kw) => s.toLowerCase().includes(kw.toLowerCase()))
    );
    if (matchedSkills.length > 0) {
      skillPoints += Math.min(15, matchedSkills.length * 6);
      explanation.push(`Direct skill match: ${matchedSkills.slice(0, 2).join(', ')}`);
    }
  }
  factors.skillMatch = Math.min(30, skillPoints);

  // 2. Service Area & Postal Code (25 max)
  if (criteria.postalCode && criteria.postalCode.trim()) {
    const zip = criteria.postalCode.trim();
    if (pro.zipCodes.includes(zip)) {
      factors.locationMatch = 25;
      explanation.push(`Direct dispatch coverage in ZIP ${zip}`);
    } else {
      factors.locationMatch = 15;
      explanation.push('Service area includes broader metropolitan region');
    }
  } else {
    factors.locationMatch = 20;
    explanation.push('Metropolitan district coverage');
  }

  // 3. Availability (20 max)
  if (criteria.urgentToday) {
    if (pro.availableToday) {
      factors.availabilityMatch = 20;
      explanation.push('Available for same-day dispatch today');
    } else {
      factors.availabilityMatch = 5;
      explanation.push('Next dispatch open tomorrow');
    }
  } else {
    factors.availabilityMatch = pro.availableToday ? 20 : 15;
    explanation.push('Regular weekly schedule open');
  }

  // 4. Verification & Licensing (15 max)
  if (pro.verifiedPro && pro.insuranceStatus === 'Verified Active') {
    factors.verificationScore = 15;
    explanation.push('Verified state license & $2M active liability insurance');
  } else if (pro.verifiedPro) {
    factors.verificationScore = 10;
    explanation.push('Identity and license verified');
  } else {
    factors.verificationScore = 5;
  }

  // 5. Review Authority (10 max)
  const ratingWeight = (pro.rating / 5) * 6;
  const countWeight = Math.min(4, (pro.reviewCount / 100) * 4);
  factors.reviewAuthority = Math.round((ratingWeight + countWeight) * 10) / 10;
  if (pro.rating >= 4.9) {
    explanation.push(`Exceptional ${pro.rating}★ customer track record (${pro.reviewCount} reviews)`);
  }

  const totalScore = Math.min(
    100,
    Math.round(
      factors.skillMatch +
        factors.locationMatch +
        factors.availabilityMatch +
        factors.verificationScore +
        factors.reviewAuthority
    )
  );

  return {
    professional: pro,
    totalScore,
    factors,
    explanation,
  };
}
