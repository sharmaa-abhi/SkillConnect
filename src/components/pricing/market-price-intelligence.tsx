'use client';

import React, { useState } from 'react';
import {
  Globe,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  Clock,
  MapPin,
  CheckCircle2,
  Info,
  Building,
} from 'lucide-react';
import {
  PriceIntelligenceResult,
  PriceIntelligenceStatus,
  MarketReferenceSource,
} from '@/types/price-intelligence';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';

interface MarketPriceIntelligenceProps {
  problemDescription: string;
  categorySlug?: string;
  categoryName?: string;
  skillConnectEstimateMin?: number;
  skillConnectEstimateMax?: number;
  initialZipCode?: string;
  className?: string;
}

export function MarketPriceIntelligence({
  problemDescription,
  categorySlug,
  categoryName,
  skillConnectEstimateMin,
  skillConnectEstimateMax,
  initialZipCode = '94107',
  className = '',
}: MarketPriceIntelligenceProps) {
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [status, setStatus] = useState<PriceIntelligenceStatus>('idle');
  const [data, setData] = useState<PriceIntelligenceResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');

  const handleFetchIntelligence = async () => {
    if (!problemDescription || problemDescription.trim().length < 5) return;

    setStatus('loading');
    setErrorMessage(null);
    setLoadingStep('Sanitizing query & scrubbing customer PII...');

    try {
      const stepTimer1 = setTimeout(() => {
        setLoadingStep('Querying TinyFish Free Search API...');
      }, 350);

      const stepTimer2 = setTimeout(() => {
        setLoadingStep('Fetching credible price guides & extracting local evidence...');
      }, 750);

      const res = await fetch('/api/price-intelligence/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemDescription,
          categorySlug,
          zipCode: zipCode.trim() || '94107',
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        if (res.status === 402) {
          setStatus('quota_exhausted');
          setErrorMessage(
            errorJson.error ||
              'TinyFish Free Tier monthly quota has been reached. SkillConnect original cost estimates and booking remain 100% active.'
          );
          return;
        }

        if (res.status === 429) {
          setStatus('rate_limited');
          setErrorMessage('Search rate limit reached. Please wait a moment before trying again.');
          return;
        }

        setStatus('unavailable');
        setErrorMessage(errorJson.error || 'Live price research is temporarily unavailable.');
        return;
      }

      const json: PriceIntelligenceResult = await res.json();
      setData(json);
      setStatus(json.status);
    } catch {
      setStatus('unavailable');
      setErrorMessage(
        'Unable to connect to live price intelligence provider. SkillConnect verified estimates remain 100% functional.'
      );
    }
  };

  return (
    <div
      className={`rounded-2xl border border-[#E4E7EC] bg-white overflow-hidden transition-all shadow-2xs ${className}`}
    >
      {/* Header bar */}
      <div className="bg-gradient-to-r from-[#173B67] to-[#1E4D85] text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-[#0F9D91]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-white">
                Live Local Price Intelligence
              </h4>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#0F9D91]/20 text-[#2FEAD7] border border-[#0F9D91]/30 uppercase tracking-wider">
                TinyFish Free Tier
              </span>
            </div>
            <p className="text-xs text-blue-100/80 mt-0.5">
              Compare SkillConnect platform pricing against public market references in your ZIP code.
            </p>
          </div>
        </div>

        {/* Action Button & ZIP input in idle/retry states */}
        {status === 'idle' && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-white/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="ZIP Code"
                maxLength={5}
                className="w-24 pl-7 pr-2 py-1.5 text-xs rounded-lg bg-white/15 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleFetchIntelligence}
              className="text-xs font-bold text-[#173B67] bg-white hover:bg-white/90"
            >
              Compare Market Rates
            </Button>
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-6">
        {/* State: IDLE */}
        {status === 'idle' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC]">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-[#0F9D91] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#173B67] block">
                  Verify market rates with independent public guides
                </span>
                <p className="text-xs text-[#667085] mt-0.5">
                  Click &ldquo;Compare Market Rates&rdquo; to query live public price guides (Bob Vila, This Old House, Angi, etc.) for {categoryName || 'this service'} in ZIP {zipCode || '94107'}.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleFetchIntelligence}
              className="shrink-0 text-xs font-bold"
            >
              Compare with Public References
            </Button>
          </div>
        )}

        {/* State: LOADING */}
        {status === 'loading' && (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-4">
            <div className="relative w-12 h-12">
              <div className="w-12 h-12 rounded-full border-2 border-[#E4E7EC] border-t-[#0F9D91] animate-spin" />
              <Globe className="w-5 h-5 text-[#173B67] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#173B67]">Researching Local Public Market Rates...</p>
              <p className="text-xs text-[#667085] mt-1 animate-pulse">{loadingStep}</p>
            </div>
            <div className="text-[11px] text-[#667085] bg-[#F7F8FA] px-3 py-1.5 rounded-full border border-[#E4E7EC]">
              🔒 Security: Zero customer PII transmitted. Generic trade terms and approximate ZIP only.
            </div>
          </div>
        )}

        {/* State: UNAVAILABLE or QUOTA EXHAUSTED */}
        {(status === 'unavailable' || status === 'quota_exhausted' || status === 'rate_limited' || status === 'error') && (
          <div className="p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#B54708] shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="text-sm font-bold text-[#B54708]">
                  {status === 'quota_exhausted'
                    ? 'TinyFish Free Tier Quota Reached'
                    : status === 'rate_limited'
                    ? 'Search Rate Limit Temporarily Exceeded'
                    : 'Live Public Intelligence Unavailable'}
                </h5>
                <p className="text-xs text-[#7A271A] mt-1 leading-relaxed">
                  {errorMessage ||
                    'Unable to retrieve external market references at this time. SkillConnect certified estimates and technician booking remain 100% operational.'}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleFetchIntelligence}
                    leftIcon={<RotateCw className="w-3.5 h-3.5" />}
                    className="text-xs font-semibold"
                  >
                    Retry Query
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State: SUCCESS / NO_EVIDENCE / WEAK / CONTRADICTORY */}
        {data && status !== 'loading' && status !== 'idle' && status !== 'unavailable' && status !== 'quota_exhausted' && (
          <div className="flex flex-col gap-5">
            {/* COMPARISON CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SkillConnect Benchmark */}
              <div className="p-4 rounded-xl border border-[#16A34A]/30 bg-[#F0FDF4] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-[#16A34A] uppercase tracking-wider">
                      SkillConnect Guaranteed Estimate
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16A34A] text-white">
                      Verified
                    </span>
                  </div>
                  <div className="text-2xl font-black text-[#0B0F0E] mt-1">
                    {formatCurrency(skillConnectEstimateMin ?? 158)} –{' '}
                    {formatCurrency(skillConnectEstimateMax ?? 375)}
                  </div>
                  <ul className="text-xs text-[#4B5563] mt-2.5 space-y-1">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      <span>100% Diagnostic fee credited directly toward labor</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      <span>Verified, licensed &amp; insured local specialists</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      <span>Escrow milestone hold with customer sign-off</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Public Market References */}
              <div className="p-4 rounded-xl border border-[#D0D5DD] bg-[#F7F8FA] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                      External Public Market References
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4E7EC] text-[#344054]">
                      Public Guides
                    </span>
                  </div>

                  <div className="text-2xl font-black text-[#263445] mt-1">
                    {data.evidence.marketLow && data.evidence.marketHigh ? (
                      <>
                        {formatCurrency(data.evidence.marketLow)} –{' '}
                        {formatCurrency(data.evidence.marketHigh)}
                      </>
                    ) : (
                      <span className="text-base font-bold text-[#667085]">
                        Insufficient public range data
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                    {data.evidence.assessmentMessage}
                  </p>
                </div>

                <div className="pt-2 text-[11px] text-[#667085] flex items-center justify-between border-t border-[#E4E7EC] mt-3">
                  <span>Locality: ZIP {data.zipCode}</span>
                  {data.isCached && (
                    <span className="flex items-center gap-1 text-[#0F9D91]">
                      <Clock className="w-3 h-3" /> Cached (24h)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CONTRADICTORY OR WEAK WARNING BANNER */}
            {data.evidence.status === 'contradictory' && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-[#7A271A] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#B54708] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#B54708] block mb-0.5">
                    Contradictory / High-Variance Public Data:
                  </span>
                  Third-party guides report prices ranging widely ({formatCurrency(data.evidence.marketLow ?? 0)} to {formatCurrency(data.evidence.marketHigh ?? 0)}). This reflects differences between minor spot fixes and whole-system replacements. We recommend relying on an on-site diagnostic inspection.
                </div>
              </div>
            )}

            {data.evidence.status === 'weak' && data.sources.length === 1 && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#173B67] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#173B67] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Single Public Source:</span>
                  Only one public reference document was validated. We display this for transparency without claiming consensus.
                </div>
              </div>
            )}

            {/* SOURCES LIST */}
            {data.sources.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold text-[#173B67] uppercase tracking-wider">
                    Sourced Public Reference Documents ({data.sources.length})
                  </h5>
                  <span className="text-[11px] text-[#667085]">
                    Retrieved via TinyFish Free APIs
                  </span>
                </div>

                <div className="space-y-2.5">
                  {data.sources.map((src: MarketReferenceSource, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-[#E4E7EC] hover:border-[#D0D5DD] bg-white transition-all text-xs flex flex-col gap-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#173B67] hover:text-[#0F9D91] transition-colors flex items-center gap-1.5"
                        >
                          <Building className="w-3.5 h-3.5 text-[#667085] shrink-0" />
                          <span className="hover:underline">{src.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                        </a>

                        <div className="flex items-center gap-2 shrink-0">
                          {src.geographicScope === 'local' ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Local (ZIP {data.zipCode})
                            </span>
                          ) : src.geographicScope === 'state' ? (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              Regional / CA
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                              National Benchmark
                            </span>
                          )}

                          {src.datePublished && (
                            <span className="text-[10px] text-[#667085]">
                              {src.datePublished}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-[#F0F2F5] text-[11px] text-[#667085]">
                        <div>
                          <span className="font-semibold text-[#344054]">Pricing basis: </span>
                          <span>{src.pricingBasis || 'Standard residential repair'}</span>
                        </div>
                        {src.priceRange && (
                          <div className="font-bold text-[#173B67] sm:text-right shrink-0">
                            Reported range: {formatCurrency(src.priceRange.min)} –{' '}
                            {formatCurrency(src.priceRange.max)}
                          </div>
                        )}
                      </div>

                      {src.sampleQuote && (
                        <p className="text-[11px] text-[#475467] bg-[#F7F8FA] p-2 rounded-lg italic border-l-2 border-[#0F9D91]">
                          &ldquo;{src.sampleQuote}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MANDATORY DISCLAIMERS & PRIVACY NOTICES */}
            <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC] text-[11px] text-[#667085] space-y-1.5">
              <div className="flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#173B67] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-[#344054]">Market Reference Disclaimer: </strong>
                  {data.disclaimer}
                </p>
              </div>
              <div className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F9D91] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-[#344054]">Privacy Guarantee: </strong>
                  Zero customer PII (name, address, payment details) is ever sent to external APIs. Only generic problem keywords and ZIP code are used for research.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
