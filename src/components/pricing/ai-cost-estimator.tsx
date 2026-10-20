'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { generateCostEstimate } from '@/lib/ai-estimator';
import { AIEstimateResult } from '@/types';
import { serviceCategories } from '@/data/services';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { useProfessionalsList } from '@/lib/demo-storage';
import { BookingFlowDialog } from '@/components/booking/booking-flow-dialog';
import { ProfessionalProfile } from '@/types/professional';
import { PrototypeDisclaimer } from '@/components/ui/prototype-disclaimer';
import { MarketPriceIntelligence } from '@/components/pricing/market-price-intelligence';

interface AICostEstimatorProps {
  initialCategory?: string;
  initialZipCode?: string;
  onEstimateGenerated?: (res: AIEstimateResult) => void;
  className?: string;
}

const samplePrompts = [
  { label: 'Water Heater Leaking', text: 'Water heater is leaking pooling water on floor, 8 years old, pilot light is still on' },
  { label: 'Breaker Tripping', text: 'Kitchen circuit breaker keeps tripping when microwave runs with refrigerator compressor' },
  { label: 'Backed-up Sink', text: 'Double kitchen sink draining very slowly with gurgling sounds, chemical drain cleaner did not help' },
  { label: 'EV Charger Installation', text: 'Need NEMA 14-50 240V outlet installed in garage for Level 2 EV charging, main panel is 200 amp' },
  { label: 'Babysitter (Test Guard)', text: 'I need a babysitter for Friday evening from 6pm to 10pm' },
];

export function AICostEstimator({
  initialCategory,
  initialZipCode = '94107',
  onEstimateGenerated,
  className = '',
}: AICostEstimatorProps) {
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState(initialCategory || '');
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [urgency, setUrgency] = useState<'flexible' | 'same_day'>('flexible');
  const [hasParts, setHasParts] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [estimateResult, setEstimateResult] = useState<AIEstimateResult | null>(null);

  // Selected pro for direct booking from estimate
  const [bookingPro, setBookingPro] = useState<ProfessionalProfile | null>(null);
  const allPros = useProfessionalsList();

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!description.trim() || description.trim().length < 8) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const result = generateCostEstimate({
        problemDescription: description,
        categorySlug: categorySlug || undefined,
        urgency,
        hasReplacementPart: hasParts,
      });
      setEstimateResult(result);
      setIsAnalyzing(false);
      if (onEstimateGenerated) onEstimateGenerated(result);
    }, 500);
  };

  const matchedPros = estimateResult && estimateResult.recommendedProIds
    ? allPros.filter((p) => estimateResult.recommendedProIds?.includes(p.id))
    : [];

  return (
    <div
      className={`rounded-3xl bg-white border border-[#E4E7EC] p-6 sm:p-8 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E7EC]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F7F5] text-[#0F9D91] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[#173B67]">
                AI Cost & Scope Estimator
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF1F8] text-[#173B67] uppercase tracking-wider">
                Transparent Benchmark
              </span>
            </div>
            <p className="text-xs text-[#667085] mt-0.5">
              Describe your issue to calculate realistic labor ranges, required diagnostic credits, and itemized assumptions.
            </p>
          </div>
        </div>

        <PrototypeDisclaimer variant="inline" />
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="mt-6 flex flex-col gap-4">
        <div>
          <label
            htmlFor="estimator-description"
            className="block text-xs font-bold text-[#263445] uppercase tracking-wider mb-2"
          >
            What is the issue or project scope? <span className="text-[#B42318]">*</span>
          </label>
          <textarea
            id="estimator-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Garbage disposal hums loudly but blades don't turn; or leaky sink under master bathroom vanity..."
            className="w-full p-3.5 text-sm rounded-xl border border-[#D0D5DD] bg-[#F7F8FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67] transition-all placeholder:text-[#667085]/60"
          />

          {/* Quick-Prompt Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[11px] text-[#667085] font-medium mr-1">Examples:</span>
            {samplePrompts.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setDescription(p.text);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F7F8FA] hover:bg-[#EBF1F8] text-[#173B67] border border-[#E4E7EC] transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Options Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-1">
              Trade Category
            </label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full text-xs font-medium p-2.5 rounded-xl border border-[#E4E7EC] bg-[#F7F8FA] text-[#263445] focus:outline-none focus:ring-2 focus:ring-[#173B67]"
            >
              <option value="">Auto-Detect from Description</option>
              {serviceCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-1">
              Dispatch Window
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as 'flexible' | 'same_day')}
              className="w-full text-xs font-medium p-2.5 rounded-xl border border-[#E4E7EC] bg-[#F7F8FA] text-[#263445] focus:outline-none focus:ring-2 focus:ring-[#173B67]"
            >
              <option value="flexible">Flexible / Next Scheduled Slot</option>
              <option value="same_day">Urgent Same-Day Dispatch</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-1">
              ZIP Code (Market Area)
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="e.g. 94107"
              maxLength={5}
              className="w-full text-xs font-medium p-2.5 rounded-xl border border-[#E4E7EC] bg-[#F7F8FA] text-[#263445] focus:outline-none focus:ring-2 focus:ring-[#173B67]"
            />
          </div>

          <div className="flex items-center pt-5 sm:pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#263445]">
              <input
                type="checkbox"
                checked={hasParts}
                onChange={(e) => setHasParts(e.target.checked)}
                className="rounded text-[#0F9D91] focus:ring-[#0F9D91] border-[#D0D5DD]"
              />
              <span className="font-medium">I have parts/fixtures already</span>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isAnalyzing}
          disabled={!description.trim() || description.trim().length < 8}
          leftIcon={<Calculator className="w-4 h-4" />}
          className="mt-2 justify-center font-bold"
        >
          {isAnalyzing ? 'Analyzing Scope & Labor Rates...' : 'Calculate Cost Estimate'}
        </Button>
      </form>

      {/* ESTIMATE RESULTS DISPLAY */}
      {estimateResult && (
        <div className="mt-8 pt-6 border-t border-[#E4E7EC] flex flex-col gap-6 animate-fadeIn">
          {/* CASE 1: UNSUPPORTED SERVICE (e.g. Babysitter) */}
          {estimateResult.status === 'unsupported' && (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#B54708]" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#B54708]">
                    We can&apos;t estimate this service yet.
                  </h4>
                  <p className="text-xs sm:text-sm text-[#7A271A] mt-1 leading-relaxed">
                    SkillConnect currently provides benchmark estimates and vetted professionals exclusively for licensed home trades (Plumbing, Electrical, HVAC, Carpentry, Deep Cleaning, Painting, Appliance Repair).
                  </p>
                  {estimateResult.categoryName && (
                    <p className="text-xs text-[#B54708] font-bold mt-2">
                      Detected domain: {estimateResult.categoryName} (Not in active trade network)
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/60 mt-1">
                <span className="text-xs font-semibold text-[#7A271A]">Supported trades:</span>
                {serviceCategories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => {
                      setCategorySlug(c.slug);
                      setDescription(`Need assistance with ${c.name.toLowerCase()} installation and diagnostic`);
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-[#173B67] hover:bg-[#EBF1F8] font-medium transition-colors"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CASE 2: AMBIGUOUS SERVICE */}
          {estimateResult.status === 'ambiguous' && (
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#173B67] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-[#173B67]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#173B67]">
                    Please clarify your service category
                  </h4>
                  <p className="text-xs sm:text-sm text-[#344054] mt-1 leading-relaxed">
                    {estimateResult.statusMessage || 'Your request contains keywords that could apply to multiple trades. Please select a specific category above to generate an accurate estimate.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CASE 3: INVALID INPUT */}
          {estimateResult.status === 'invalid_input' && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-[#B42318]">
              {estimateResult.statusMessage || 'Please provide at least 8 characters describing your issue.'}
            </div>
          )}

          {/* CASE 4: SUCCESS ESTIMATE */}
          {estimateResult.status === 'success' && (
            <>
              {/* Top Estimate Banner */}
              <div className="p-5 rounded-2xl bg-[#E6F7F5] border border-[#0F9D91]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0F9D91] uppercase tracking-wider">
                      Estimated Range: {estimateResult.categoryName}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-[#173B67] border border-[#0F9D91]/20">
                      {estimateResult.complexity} Complexity
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#173B67]">
                      {formatCurrency(estimateResult.totalEstimateMin ?? 0)} –{' '}
                      {formatCurrency(estimateResult.totalEstimateMax ?? 0)}
                    </span>
                    <span className="text-xs text-[#667085] font-medium">total estimated range</span>
                  </div>
                </div>

                <div className="text-xs text-[#263445] sm:text-right bg-white/70 p-3 rounded-xl border border-[#0F9D91]/20">
                  <span className="block font-bold text-[#15803D] flex items-center sm:justify-end gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>100% Diagnostic Credit</span>
                  </span>
                  <span className="text-[11px] text-[#667085]">
                    {formatCurrency(estimateResult.diagnosticFeeCredit ?? 65)} inspection credited to repair labor
                  </span>
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="rounded-xl border border-[#E4E7EC] overflow-hidden text-xs sm:text-sm">
                <div className="bg-[#F7F8FA] px-4 py-2.5 font-bold text-[#173B67] border-b border-[#E4E7EC] uppercase tracking-wider text-[11px]">
                  Itemized Cost Breakdown
                </div>
                <div className="divide-y divide-[#E4E7EC] p-4 flex flex-col gap-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 text-[#263445]">
                    <div className="flex-1">
                      <span className="font-semibold text-xs sm:text-sm">Diagnostic Evaluation Inspection</span>
                      <p className="text-[11px] sm:text-xs text-[#667085]">
                        On-site physical testing & written scope. Fully credited if repair authorized.
                      </p>
                    </div>
                    <span className="font-bold text-[#173B67] text-sm shrink-0">
                      {formatCurrency(estimateResult.diagnosticFeeCredit ?? 65)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 text-[#263445] pt-2">
                    <div className="flex-1">
                      <span className="font-semibold text-xs sm:text-sm">
                        Estimated Skilled Labor ({estimateResult.estimatedHoursMin} – {estimateResult.estimatedHoursMax} hrs)
                      </span>
                      <p className="text-[11px] sm:text-xs text-[#667085]">
                        Standard hourly rate benchmark (~$85/hr for certified specialists)
                      </p>
                    </div>
                    <span className="font-bold text-[#263445] text-sm shrink-0">
                      {formatCurrency(estimateResult.laborEstimateMin ?? 0)} – {formatCurrency(estimateResult.laborEstimateMax ?? 0)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 text-[#263445] pt-2">
                    <div className="flex-1">
                      <span className="font-semibold text-xs sm:text-sm">Parts & Required Consumables</span>
                      <p className="text-[11px] sm:text-xs text-[#667085]">
                        {hasParts
                          ? 'Customer supplies primary parts; consumables allowance only'
                          : 'OEM or commercial-grade replacement components & fittings'}
                      </p>
                    </div>
                    <span className="font-bold text-[#263445] text-sm shrink-0">
                      {formatCurrency(estimateResult.partsEstimateMin ?? 0)} – {formatCurrency(estimateResult.partsEstimateMax ?? 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assumptions & Code Compliance */}
              {estimateResult.assumptions && estimateResult.assumptions.length > 0 && (
                <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC] text-xs">
                  <span className="font-bold text-[#173B67] uppercase tracking-wider text-[11px] block mb-2">
                    Scope Assumptions
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-[#667085]">
                    {estimateResult.assumptions.map((assump, idx) => (
                      <li key={idx}>{assump}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* LIVE LOCAL PRICE INTELLIGENCE (TINYFISH FREE SEARCH & FETCH) */}
              <MarketPriceIntelligence
                problemDescription={description}
                categorySlug={estimateResult.categorySlug}
                categoryName={estimateResult.categoryName}
                skillConnectEstimateMin={estimateResult.totalEstimateMin}
                skillConnectEstimateMax={estimateResult.totalEstimateMax}
                initialZipCode={zipCode || '94107'}
              />

              {/* Recommended Pros */}
              {matchedPros.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-[#173B67] mb-3">
                    Top Verified Specialists for this {estimateResult.categoryName} Scope
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {matchedPros.map((pro) => (
                      <div
                        key={pro.id}
                        className="p-3.5 rounded-2xl border border-[#E4E7EC] hover:border-[#173B67] transition-all bg-white flex flex-col justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={pro.avatarUrl}
                            alt={pro.name}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-[#263445] truncate">{pro.name}</h5>
                            <span className="text-[11px] text-[#0F9D91] font-semibold block truncate">
                              ${pro.diagnosticFee} diagnostic
                            </span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setBookingPro(pro)}
                          className="w-full text-xs font-bold justify-center"
                        >
                          Book with Credited Fee
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Booking Flow Dialog triggered directly from estimate */}
      {bookingPro && (
        <BookingFlowDialog
          isOpen={Boolean(bookingPro)}
          onClose={() => setBookingPro(null)}
          professional={bookingPro}
          initialScopeDescription={description}
        />
      )}
    </div>
  );
}
