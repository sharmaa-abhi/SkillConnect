import { AIEstimateResult } from '@/types';
import { serviceCategories } from '@/data/services';
import { professionals } from '@/data/professionals';
import { calculateDeterministicProMatch, detectServiceCategory, normalizeSearchTerm } from '@/lib/search';
import { calculateFees } from '@/lib/pricing';

export interface EstimateInput {
  categorySlug?: string;
  problemDescription: string;
  propertyType?: 'house' | 'apartment' | 'commercial';
  urgency?: 'same_day' | 'next_day' | 'flexible';
  hasReplacementPart?: boolean;
}

export function generateCostEstimate(input: EstimateInput): AIEstimateResult {
  const rawText = input.problemDescription || '';
  const normalized = normalizeSearchTerm(rawText);

  // 1. Input Validation
  if (!normalized || normalized.length < 8) {
    return {
      status: 'invalid_input',
      statusMessage: 'Please provide a clear description of the issue or project scope (minimum 8 characters).',
      categorySlug: '',
      categoryName: '',
      problemSummary: rawText,
      complexity: 'Diagnostic Needed',
      estimatedHoursMin: 0,
      estimatedHoursMax: 0,
      diagnosticFeeCredit: 0,
      partsEstimateMin: 0,
      partsEstimateMax: 0,
      laborEstimateMin: 0,
      laborEstimateMax: 0,
      totalEstimateMin: 0,
      totalEstimateMax: 0,
      assumptions: [],
      recommendedTasks: [],
      recommendedProIds: [],
    };
  }

  // 2. Category Detection & Validation
  let detectedCategory = serviceCategories.find((c) => c.slug === input.categorySlug);

  if (!detectedCategory) {
    const detection = detectServiceCategory(rawText);

    // Explicitly unsupported service check (e.g. babysitter, pet grooming)
    if (detection.isUnsupported) {
      return {
        status: 'unsupported',
        statusMessage: "We can't estimate this service yet.",
        categorySlug: '',
        categoryName: detection.unsupportedServiceName || 'Unsupported Service',
        problemSummary: rawText,
        complexity: 'Diagnostic Needed',
        estimatedHoursMin: 0,
        estimatedHoursMax: 0,
        diagnosticFeeCredit: 0,
        partsEstimateMin: 0,
        partsEstimateMax: 0,
        laborEstimateMin: 0,
        laborEstimateMax: 0,
        totalEstimateMin: 0,
        totalEstimateMax: 0,
        assumptions: [
          `SkillConnect does not currently support ${detection.unsupportedServiceName || 'this service'}.`,
          'Our platform specializes strictly in licensed residential and commercial building trades.',
        ],
        recommendedTasks: [],
        recommendedProIds: [],
      };
    }

    // Ambiguous service check
    if (detection.isAmbiguous) {
      return {
        status: 'ambiguous',
        statusMessage: 'This request touches multiple trades. Please select a specific category above for an accurate estimate.',
        categorySlug: '',
        categoryName: 'Ambiguous Scope',
        problemSummary: rawText,
        complexity: 'Diagnostic Needed',
        estimatedHoursMin: 0,
        estimatedHoursMax: 0,
        diagnosticFeeCredit: 0,
        partsEstimateMin: 0,
        partsEstimateMax: 0,
        laborEstimateMin: 0,
        laborEstimateMax: 0,
        totalEstimateMin: 0,
        totalEstimateMax: 0,
        assumptions: ['Multiple trade specialties matched your description.'],
        recommendedTasks: [],
        recommendedProIds: [],
      };
    }

    // If completely unknown or cannot be identified confidently
    if (!detection.categorySlug) {
      return {
        status: 'unsupported',
        statusMessage: "We can't estimate this service yet.",
        categorySlug: '',
        categoryName: 'Unidentified Service',
        problemSummary: rawText,
        complexity: 'Diagnostic Needed',
        estimatedHoursMin: 0,
        estimatedHoursMax: 0,
        diagnosticFeeCredit: 0,
        partsEstimateMin: 0,
        partsEstimateMax: 0,
        laborEstimateMin: 0,
        laborEstimateMax: 0,
        totalEstimateMin: 0,
        totalEstimateMax: 0,
        assumptions: [
          'No verified pricing benchmark or licensed trade category matches this request.',
          'Try specifying plumbing, electrical, HVAC, carpentry, painting, cleaning, or appliance repair.',
        ],
        recommendedTasks: [],
        recommendedProIds: [],
      };
    }

    detectedCategory = serviceCategories.find((c) => c.slug === detection.categorySlug);
  }

  // Double check if valid category has pricing rules
  if (!detectedCategory) {
    return {
      status: 'unsupported',
      statusMessage: "We can't estimate this service yet.",
      categorySlug: '',
      categoryName: 'Unknown',
      problemSummary: rawText,
      complexity: 'Diagnostic Needed',
      estimatedHoursMin: 0,
      estimatedHoursMax: 0,
      diagnosticFeeCredit: 0,
      partsEstimateMin: 0,
      partsEstimateMax: 0,
      laborEstimateMin: 0,
      laborEstimateMax: 0,
      totalEstimateMin: 0,
      totalEstimateMax: 0,
      assumptions: [],
      recommendedTasks: [],
      recommendedProIds: [],
    };
  }

  // 3. Category Pricing & Complexity Rules
  const baseDiagnosticCredit = detectedCategory.startingPrice || 65;
  const avgHourlyLabor = 85;

  let complexity: AIEstimateResult['complexity'] = 'Moderate';
  let estimatedHoursMin = 1.5;
  let estimatedHoursMax = 3.0;
  let partsMin = 30;
  let partsMax = 120;
  const assumptions: string[] = [
    'Standard residential code compliance with accessible utility shut-offs.',
    'Diagnostic fee is credited 100% toward authorized repair labor on-site.',
  ];

  // Heuristic adjustments based on description signals
  const text = normalized;
  if (
    text.includes('emergency') ||
    text.includes('flood') ||
    text.includes('burst') ||
    text.includes('spark') ||
    text.includes('smoke')
  ) {
    complexity = 'High';
    estimatedHoursMin = 2.5;
    estimatedHoursMax = 5.0;
    partsMin = 80;
    partsMax = 280;
    assumptions.push('Emergency stabilization requires immediate on-site diagnostic isolation.');
  } else if (
    text.includes('minor') ||
    text.includes('simple') ||
    text.includes('fixture') ||
    text.includes('clog') ||
    text.includes('replace outlet')
  ) {
    complexity = 'Low';
    estimatedHoursMin = 1.0;
    estimatedHoursMax = 2.0;
    partsMin = 20;
    partsMax = 60;
    assumptions.push('Existing structural framing or piping in good serviceable condition.');
  } else if (
    text.includes('replace panel') ||
    text.includes('repipe') ||
    text.includes('tankless') ||
    text.includes('new install')
  ) {
    complexity = 'High';
    estimatedHoursMin = 4.0;
    estimatedHoursMax = 8.0;
    partsMin = 250;
    partsMax = 800;
    assumptions.push('Municipal permit filing may be required for whole-home panel or gas line alterations.');
  }

  if (input.hasReplacementPart) {
    partsMin = 0;
    partsMax = 35; // minor hardware consumables only
    assumptions.push('Customer has supplied compatible manufacturer replacement unit.');
  }

  // Use centralized pricing engine
  const feeCalc = calculateFees({
    diagnosticFee: baseDiagnosticCredit,
    hourlyRate: avgHourlyLabor,
    estimatedHoursMin,
    estimatedHoursMax,
    partsMin,
    partsMax,
  });

  // Find top matching pros for this supported category
  const keywords = text.split(/\s+/).filter((w) => w.length > 3);
  const ranked = professionals
    .map((pro) =>
      calculateDeterministicProMatch(pro, {
        categorySlug: detectedCategory!.slug,
        keywords,
        urgentToday: input.urgency === 'same_day',
      })
    )
    .sort((a, b) => b.totalScore - a.totalScore);

  const recommendedProIds = ranked.slice(0, 3).map((r) => r.professional.id);

  return {
    status: 'success',
    categorySlug: detectedCategory.slug,
    categoryName: detectedCategory.name,
    problemSummary:
      rawText.length > 70 ? `${rawText.slice(0, 67)}...` : rawText,
    complexity,
    estimatedHoursMin,
    estimatedHoursMax,
    diagnosticFeeCredit: feeCalc.diagnosticCredit,
    partsEstimateMin: feeCalc.partsMin,
    partsEstimateMax: feeCalc.partsMax,
    laborEstimateMin: feeCalc.laborMin,
    laborEstimateMax: feeCalc.laborMax,
    totalEstimateMin: feeCalc.totalMin,
    totalEstimateMax: feeCalc.totalMax,
    assumptions,
    recommendedTasks: detectedCategory.popularTasks.slice(0, 3),
    recommendedProIds,
  };
}
