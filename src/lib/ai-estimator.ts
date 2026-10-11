import { AIEstimateResult } from '@/types';
import { serviceCategories } from '@/data/services';
import { professionals } from '@/data/professionals';
import { calculateDeterministicProMatch } from '@/lib/search';

export interface EstimateInput {
  categorySlug?: string;
  problemDescription: string;
  propertyType?: 'house' | 'apartment' | 'commercial';
  urgency?: 'same_day' | 'next_day' | 'flexible';
  hasReplacementPart?: boolean;
}

export function generateCostEstimate(input: EstimateInput): AIEstimateResult {
  const text = (input.problemDescription || '').toLowerCase();
  
  // 1. Detect Category if not explicitly provided
  let detectedCategory = serviceCategories.find((c) => c.slug === input.categorySlug);
  if (!detectedCategory) {
    if (text.includes('plumb') || text.includes('pipe') || text.includes('leak') || text.includes('drain') || text.includes('sink') || text.includes('toilet') || text.includes('faucet') || text.includes('water heater')) {
      detectedCategory = serviceCategories.find((c) => c.slug === 'plumbing');
    } else if (text.includes('electr') || text.includes('breaker') || text.includes('outlet') || text.includes('wire') || text.includes('panel') || text.includes('light') || text.includes('switch')) {
      detectedCategory = serviceCategories.find((c) => c.slug === 'electrical');
    } else if (text.includes('hvac') || text.includes('air cond') || text.includes('ac ') || text.includes('heater') || text.includes('furnace') || text.includes('thermostat')) {
      detectedCategory = serviceCategories.find((c) => c.slug === 'hvac');
    } else if (text.includes('appliance') || text.includes('washer') || text.includes('dryer') || text.includes('fridge') || text.includes('refrigerator') || text.includes('dishwasher') || text.includes('oven')) {
      detectedCategory = serviceCategories.find((c) => c.slug === 'appliance-repair');
    } else if (text.includes('carpenter') || text.includes('wood') || text.includes('door') || text.includes('cabinet') || text.includes('deck') || text.includes('trim')) {
      detectedCategory = serviceCategories.find((c) => c.slug === 'carpentry');
    } else if (text.includes('clean') || text.includes('deep clean') || text.includes('carpet')) {
      detectedCategory = serviceCategories.find((c) => c.slug === 'cleaning');
    } else {
      detectedCategory = serviceCategories.find((c) => c.slug === 'handyman') || serviceCategories[0];
    }
  }

  // Base parameters from detected category
  const baseDiagnosticCredit = detectedCategory?.startingPrice || 75;
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
  if (text.includes('emergency') || text.includes('flood') || text.includes('burst') || text.includes('spark') || text.includes('smoke')) {
    complexity = 'High';
    estimatedHoursMin = 2.5;
    estimatedHoursMax = 5.0;
    partsMin = 80;
    partsMax = 280;
    assumptions.push('Emergency stabilization requires immediate on-site diagnostic isolation.');
  } else if (text.includes('minor') || text.includes('simple') || text.includes('fixture') || text.includes('clog') || text.includes('replace outlet')) {
    complexity = 'Low';
    estimatedHoursMin = 1.0;
    estimatedHoursMax = 2.0;
    partsMin = 20;
    partsMax = 60;
    assumptions.push('Existing structural framing or piping in good serviceable condition.');
  } else if (text.includes('replace panel') || text.includes('repipe') || text.includes('tankless') || text.includes('new install')) {
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

  const laborMin = Math.round(estimatedHoursMin * avgHourlyLabor);
  const laborMax = Math.round(estimatedHoursMax * avgHourlyLabor);
  const totalMin = Math.max(baseDiagnosticCredit, laborMin + partsMin);
  const totalMax = laborMax + partsMax;

  // Find top matching pros
  const keywords = text.split(/\s+/).filter((w) => w.length > 3);
  const ranked = professionals
    .map((pro) =>
      calculateDeterministicProMatch(pro, {
        categorySlug: detectedCategory?.slug,
        keywords,
        urgentToday: input.urgency === 'same_day',
      })
    )
    .sort((a, b) => b.totalScore - a.totalScore);

  const recommendedProIds = ranked.slice(0, 3).map((r) => r.professional.id);

  return {
    categorySlug: detectedCategory?.slug || 'plumbing',
    categoryName: detectedCategory?.name || 'Plumbing',
    problemSummary:
      input.problemDescription.length > 70
        ? `${input.problemDescription.slice(0, 67)}...`
        : input.problemDescription,
    complexity,
    estimatedHoursMin,
    estimatedHoursMax,
    diagnosticFeeCredit: baseDiagnosticCredit,
    partsEstimateMin: partsMin,
    partsEstimateMax: partsMax,
    laborEstimateMin: laborMin,
    laborEstimateMax: laborMax,
    totalEstimateMin: totalMin,
    totalEstimateMax: totalMax,
    assumptions,
    recommendedTasks: detectedCategory?.popularTasks.slice(0, 3) || [],
    recommendedProIds,
  };
}
