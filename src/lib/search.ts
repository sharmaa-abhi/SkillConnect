import { ProfessionalProfile } from '@/types/professional';
import { FilterState } from '@/types';
import { serviceCategories } from '@/data/services';

/**
 * Normalizes user search input by trimming whitespace, lowercasing,
 * and stripping extraneous punctuation while preserving alpha-numerics and spaces.
 */
export function normalizeSearchTerm(input?: string | null): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, ' ') // replace punctuation with space
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim();
}

/**
 * Validates a US 5-digit ZIP code format.
 */
export function isValidZipCode(zip: string): boolean {
  return /^\d{5}$/.test(zip.trim());
}

/**
 * Validates a ZIP code string and provides detailed validation feedback.
 */
export function validateZipCode(zip: string): { isValid: boolean; error?: string } {
  const trimmed = zip.trim();
  if (!trimmed) return { isValid: true };
  if (!/^\d+$/.test(trimmed)) return { isValid: false, error: 'ZIP code must contain digits only.' };
  if (!/^\d{5}$/.test(trimmed)) return { isValid: false, error: 'ZIP code must be exactly 5 digits.' };
  return { isValid: true };
}

/**
 * Extracts a 5-digit ZIP code if present in the text.
 */
export function extractZipCode(text: string): string | null {
  const match = text.match(/\b\d{5}\b/);
  return match ? match[0] : null;
}

export interface CategoryDetectionResult {
  categorySlug: string | null;
  categoryName: string | null;
  isUnsupported: boolean;
  unsupportedServiceName?: string;
  isAmbiguous: boolean;
  confidence: 'high' | 'medium' | 'none';
  keywordsMatched: string[];
}

/**
 * Known unsupported services map to prevent incorrect fallbacks (e.g. babysitter -> Plumbing).
 */
const UNSUPPORTED_SERVICE_SYNONYMS: Record<string, string[]> = {
  'Childcare & Babysitting': [
    'babysitter',
    'babysitting',
    'nanny',
    'childcare',
    'child care',
    'daycare',
    'au pair',
    'infant care',
    'toddler care',
  ],
  'Pet Care & Grooming': [
    'dog walking',
    'dog walker',
    'pet sitting',
    'pet grooming',
    'cat sitting',
    'vet',
    'veterinary',
  ],
  'Legal & Financial Consulting': [
    'lawyer',
    'attorney',
    'tax prep',
    'accountant',
    'cpa',
    'legal advice',
  ],
  'Automotive Repair': [
    'car repair',
    'mechanic',
    'oil change',
    'tire replacement',
    'brake pads',
    'auto body',
  ],
};

/**
 * Comprehensive synonym and multiword phrase dictionary for supported categories.
 */
const CATEGORY_SYNONYMS: Record<string, { name: string; phrases: string[] }> = {
  plumbing: {
    name: 'Plumbing',
    phrases: [
      'plumb',
      'plumber',
      'plumbing',
      'leaky sink',
      'sink leak',
      'leaking sink',
      'leak',
      'leaks',
      'leaking',
      'pipe',
      'pipes',
      'burst pipe',
      'pipe burst',
      'copper pipe',
      'pex',
      'drain',
      'drains',
      'blocked drain',
      'clogged drain',
      'slow drain',
      'drain clearing',
      'clog',
      'clogged',
      'clogged toilet',
      'toilet',
      'running toilet',
      'toilet overflow',
      'faucet',
      'dripping faucet',
      'water heater',
      'tankless',
      'water leak',
      'sewer',
      'sewer line',
      'backflow',
      'p-trap',
      'garbage disposal',
      'shower leak',
      'bathtub drain',
      'hydro jetting',
      'repiping',
      'shut off valve',
    ],
  },
  electrical: {
    name: 'Electrical Work',
    phrases: [
      'electric',
      'electrical',
      'electrician',
      'circuit breaker problem',
      'breaker problem',
      'tripped breaker',
      'breaker',
      'circuit breaker',
      'tripping breaker',
      'breaker panel',
      'panel upgrade',
      'fuse',
      'outlet',
      'wall outlet',
      'sparking outlet',
      'sparking',
      'wire',
      'wiring',
      'short circuit',
      'light',
      'lighting',
      'recessed lights',
      'ceiling fan',
      'ev charger',
      'level 2 charger',
      'switch',
      'light switch',
      'dimmer',
      'ground fault',
      'gfci',
      'generator',
      'smart switch',
      'power outage',
    ],
  },
  hvac: {
    name: 'HVAC & Climate Control',
    phrases: [
      'hvac',
      'hvac repair',
      'ac not cooling',
      'not cooling',
      'cooling problem',
      'ac blowing warm',
      'central air',
      'cooling',
      'ac',
      'air cond',
      'air conditioner',
      'air conditioning',
      'air conditioning not cooling',
      'ac repair',
      'ac unit',
      'ac tune up',
      'heat pump',
      'furnace',
      'heater',
      'heating',
      'thermostat',
      'nest thermostat',
      'duct',
      'air ducts',
      'ventilation',
      'climate control',
      'freon',
      'refrigerant',
      'compressor',
      'blower',
    ],
  },
  'appliance-repair': {
    name: 'Appliance Repair',
    phrases: [
      'appliance',
      'appliances',
      'appliance repair',
      'appliance fix',
      'refrigerator',
      'fridge',
      'freezer',
      'washer',
      'washing machine',
      'dryer',
      'clothes dryer',
      'dishwasher',
      'oven',
      'stove',
      'range',
      'cooktop',
      'ice maker',
      'microwave',
    ],
  },
  carpentry: {
    name: 'Carpentry & Framing',
    phrases: [
      'carpenter',
      'carpentry',
      'woodwork',
      'wood',
      'cabinet',
      'cabinets',
      'cabinetry',
      'door',
      'door hanging',
      'door sticking',
      'deck',
      'deck repair',
      'framing',
      'trim',
      'baseboard',
      'molding',
      'shelving',
      'built in',
      'handrail',
      'stairs',
    ],
  },
  cleaning: {
    name: 'Deep & Move-In Cleaning',
    phrases: [
      'clean',
      'cleaning',
      'deep clean',
      'move in clean',
      'move out clean',
      'post renovation clean',
      'carpet cleaning',
      'sanitization',
      'window detailing',
      'maid',
      'housekeeping',
      'scrub',
    ],
  },
  painting: {
    name: 'Painting & Finishing',
    phrases: [
      'paint',
      'painter',
      'painting',
      'interior paint',
      'exterior paint',
      'accent wall',
      'cabinet spray',
      'cabinet painting',
      'drywall',
      'drywall patch',
      'drywall repair',
      'sheetrock',
      'wallpaper',
      'primer',
    ],
  },
};

/**
 * Detects the service category with synonym mapping and explicit unsupported checks.
 * NEVER defaults to Plumbing or an arbitrary category if unknown.
 */
export function detectServiceCategory(rawInput: string): CategoryDetectionResult {
  const normalized = normalizeSearchTerm(rawInput);
  if (!normalized) {
    return {
      categorySlug: null,
      categoryName: null,
      isUnsupported: false,
      isAmbiguous: false,
      confidence: 'none',
      keywordsMatched: [],
    };
  }

  // 1. Check if the query matches an explicitly unsupported domain (e.g. babysitter, pet care)
  for (const [unsupportedName, synonyms] of Object.entries(UNSUPPORTED_SERVICE_SYNONYMS)) {
    for (const syn of synonyms) {
      if (normalized.includes(syn)) {
        return {
          categorySlug: null,
          categoryName: null,
          isUnsupported: true,
          unsupportedServiceName: unsupportedName,
          isAmbiguous: false,
          confidence: 'high',
          keywordsMatched: [syn],
        };
      }
    }
  }

  // 2. Exact slug or category name check against active catalog
  for (const cat of serviceCategories) {
    if (
      normalized === cat.slug ||
      normalized === normalizeSearchTerm(cat.name)
    ) {
      return {
        categorySlug: cat.slug,
        categoryName: cat.name,
        isUnsupported: false,
        isAmbiguous: false,
        confidence: 'high',
        keywordsMatched: [cat.slug],
      };
    }
  }

  // 3. Synonym and phrase dictionary matching
  const categoryScores: Record<string, { count: number; matched: string[] }> = {};

  for (const [slug, meta] of Object.entries(CATEGORY_SYNONYMS)) {
    for (const phrase of meta.phrases) {
      // Regex word boundary or substring match for multiword phrases
      const isMultiword = phrase.includes(' ');
      const matched = isMultiword
        ? normalized.includes(phrase)
        : new RegExp(`\\b${phrase}\\b`, 'i').test(normalized) || normalized.includes(phrase);

      if (matched) {
        if (!categoryScores[slug]) {
          categoryScores[slug] = { count: 0, matched: [] };
        }
        categoryScores[slug].count += isMultiword ? 3 : 1;
        categoryScores[slug].matched.push(phrase);
      }
    }
  }

  const entries = Object.entries(categoryScores).sort((a, b) => b[1].count - a[1].count);

  if (entries.length === 0) {
    return {
      categorySlug: null,
      categoryName: null,
      isUnsupported: false,
      isAmbiguous: false,
      confidence: 'none',
      keywordsMatched: [],
    };
  }

  // Check if top 2 categories have identical high scores (ambiguous request)
  if (entries.length > 1 && entries[0][1].count === entries[1][1].count && entries[0][1].count > 0) {
    return {
      categorySlug: entries[0][0],
      categoryName: CATEGORY_SYNONYMS[entries[0][0]]?.name || entries[0][0],
      isUnsupported: false,
      isAmbiguous: true,
      confidence: 'medium',
      keywordsMatched: [...entries[0][1].matched, ...entries[1][1].matched],
    };
  }

  const topSlug = entries[0][0];
  const topMeta = CATEGORY_SYNONYMS[topSlug];

  return {
    categorySlug: topSlug,
    categoryName: topMeta?.name || topSlug,
    isUnsupported: false,
    isAmbiguous: false,
    confidence: entries[0][1].count >= 2 ? 'high' : 'medium',
    keywordsMatched: entries[0][1].matched,
  };
}

export interface SearchDiagnostics {
  normalizedQuery: string;
  detectedCategory: CategoryDetectionResult;
  searchedLocation: string | null;
  searchedZip: string | null;
  isInvalidZip: boolean;
  hasLocationFilter: boolean;
  totalBeforeLocationFilter: number;
  totalResults: number;
  emptyReason?:
    | 'unsupported_service'
    | 'unknown_service'
    | 'no_pros_in_zip'
    | 'no_pros_matching_filters'
    | 'invalid_zip';
  emptyMessage?: string;
}

export interface SmartSearchResult {
  results: ProfessionalProfile[];
  diagnostics: SearchDiagnostics;
}

/**
 * Smart professional discovery with synonym mapping, genuine ZIP coverage validation,
 * and diagnostic explanation for helpful empty states.
 */
export function performSmartProSearch(
  pros: ProfessionalProfile[],
  filters: FilterState
): SmartSearchResult {
  const normalizedRaw = normalizeSearchTerm(filters.query);

  // Separate location input or extracted ZIP from query
  let searchedLocation = filters.location ? normalizeSearchTerm(filters.location) : '';
  let searchedZip = extractZipCode(filters.location || '');

  // If query contains a 5-digit ZIP and location is not set, extract it
  let cleanedQueryText = normalizedRaw;
  const embeddedZip = extractZipCode(normalizedRaw);
  if (embeddedZip) {
    searchedZip = embeddedZip;
    searchedLocation = embeddedZip;
    cleanedQueryText = normalizedRaw.replace(embeddedZip, '').trim();
  }

  const isInvalidZip = Boolean(
    filters.location &&
      filters.location.trim().length > 0 &&
      /^\d+$/.test(filters.location.trim()) &&
      !isValidZipCode(filters.location.trim())
  );

  const detectedCategory = detectServiceCategory(cleanedQueryText);

  // If the query is an unsupported service (e.g. babysitter)
  if (detectedCategory.isUnsupported) {
    return {
      results: [],
      diagnostics: {
        normalizedQuery: cleanedQueryText,
        detectedCategory,
        searchedLocation: searchedLocation || null,
        searchedZip,
        isInvalidZip,
        hasLocationFilter: Boolean(searchedLocation),
        totalBeforeLocationFilter: 0,
        totalResults: 0,
        emptyReason: 'unsupported_service',
        emptyMessage: `We don't offer ${detectedCategory.unsupportedServiceName || 'this service'} yet. SkillConnect specializes exclusively in licensed home trades (Plumbing, Electrical, HVAC, Carpentry, Cleaning, Painting, Appliance Repair).`,
      },
    };
  }

  // If invalid ZIP format was provided
  if (isInvalidZip) {
    return {
      results: [],
      diagnostics: {
        normalizedQuery: cleanedQueryText,
        detectedCategory,
        searchedLocation: searchedLocation || null,
        searchedZip: null,
        isInvalidZip: true,
        hasLocationFilter: true,
        totalBeforeLocationFilter: 0,
        totalResults: 0,
        emptyReason: 'invalid_zip',
        emptyMessage: `"${filters.location}" is not a valid 5-digit US ZIP code. Please enter a valid 5-digit code (e.g., 94107).`,
      },
    };
  }

  let candidates = Array.isArray(pros) ? [...pros] : [];

  // 1. Text & Category relevance filtering
  if (cleanedQueryText.length > 0) {
    if (detectedCategory.categorySlug) {
      // Filter by detected category and also match pros directly
      candidates = candidates.filter((pro) => {
        const matchesCategory = pro.categorySlug === detectedCategory.categorySlug;
        const matchesTextDirectly =
          pro.name.toLowerCase().includes(cleanedQueryText) ||
          pro.tradeTitle.toLowerCase().includes(cleanedQueryText) ||
          pro.skills.some((s) => s.toLowerCase().includes(cleanedQueryText)) ||
          pro.bio.toLowerCase().includes(cleanedQueryText);

        return matchesCategory || matchesTextDirectly;
      });
    } else {
      // Freeform text search matching name, trade, category, skills, bio
      candidates = candidates.filter((pro) => {
        const q = cleanedQueryText;
        return (
          pro.name.toLowerCase().includes(q) ||
          pro.tradeTitle.toLowerCase().includes(q) ||
          pro.categoryName.toLowerCase().includes(q) ||
          pro.categorySlug.toLowerCase().includes(q) ||
          pro.skills.some((s) => s.toLowerCase().includes(q)) ||
          pro.bio.toLowerCase().includes(q)
        );
      });
    }
  }

  // 2. Explicit Category dropdown filter override
  if (filters.category && filters.category !== 'all') {
    candidates = candidates.filter((pro) => pro.categorySlug === filters.category);
  }

  // 3. Minimum Rating Filter
  if (filters.minRating !== null && filters.minRating > 0) {
    candidates = candidates.filter((pro) => pro.rating >= filters.minRating!);
  }

  // 4. Available Today
  if (filters.availableToday) {
    candidates = candidates.filter((pro) => pro.availableToday);
  }

  // 5. Price Tier Filter
  if (filters.priceTier && filters.priceTier !== 'all') {
    candidates = candidates.filter((pro) => pro.priceTier === filters.priceTier);
  }

  // 6. Verified Only
  if (filters.verifiedOnly) {
    candidates = candidates.filter((pro) => pro.verifiedPro);
  }

  const totalBeforeLocation = candidates.length;

  // 7. Strict Location and ZIP coverage validation
  if (searchedZip) {
    candidates = candidates.filter((pro) => pro.zipCodes.includes(searchedZip!));
  } else if (searchedLocation) {
    candidates = candidates.filter((pro) =>
      pro.serviceAreas.some((area) =>
        area.toLowerCase().includes(searchedLocation) || searchedLocation.includes(area.toLowerCase())
      ) ||
      pro.zipCodes.some((zip) => zip.includes(searchedLocation))
    );
  }

  // 8. Sorting
  switch (filters.sortBy) {
    case 'rating':
      candidates.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'price-asc':
      candidates.sort((a, b) => a.hourlyRate - b.hourlyRate || a.diagnosticFee - b.diagnosticFee);
      break;
    case 'recommended':
    default:
      candidates.sort((a, b) => {
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

  // Determine diagnostics empty message if no candidates found
  let emptyReason: SearchDiagnostics['emptyReason'];
  let emptyMessage: string | undefined;

  if (candidates.length === 0) {
    if (searchedZip && totalBeforeLocation > 0) {
      emptyReason = 'no_pros_in_zip';
      emptyMessage = `We found ${totalBeforeLocation} verified specialists, but none currently provide service coverage in ZIP ${searchedZip}. Try clearing the ZIP filter to view specialists in the greater metropolitan area.`;
    } else if (cleanedQueryText.length > 0 && !detectedCategory.categorySlug) {
      emptyReason = 'unknown_service';
      emptyMessage = `We couldn't identify a matching service category for "${cleanedQueryText}". Try searching for plumbing, electrical, HVAC, carpentry, cleaning, painting, or appliance repair.`;
    } else {
      emptyReason = 'no_pros_matching_filters';
      emptyMessage = `No verified professionals matched your current filter selection. Try resetting filters or adjusting search criteria.`;
    }
  }

  return {
    results: candidates,
    diagnostics: {
      normalizedQuery: cleanedQueryText,
      detectedCategory,
      searchedLocation: searchedLocation || null,
      searchedZip,
      isInvalidZip,
      hasLocationFilter: Boolean(searchedLocation || searchedZip),
      totalBeforeLocationFilter: totalBeforeLocation,
      totalResults: candidates.length,
      emptyReason,
      emptyMessage,
    },
  };
}

/**
 * Backward-compatible helper that delegates to `performSmartProSearch`.
 */
export function filterAndSortProfessionals(
  pros: ProfessionalProfile[],
  filters: FilterState
): ProfessionalProfile[] {
  return performSmartProSearch(pros, filters).results;
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
