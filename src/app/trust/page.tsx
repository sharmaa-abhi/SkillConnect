'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Scale,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  FileCheck2,
  BadgeCheck,
  ChevronDown,
  Wrench,
  UserCheck,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';

interface ComparisonRow {
  aspect: string;
  traditional: string;
  skillConnect: string;
  benefit: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    aspect: 'Contractor Verification',
    traditional: 'Unverified classifieds, random flyers, or unvetted lead-gen aggregators with zero license checks.',
    skillConnect: 'Mandatory 4-tier verification: Active State Board trade license, $1M+ liability insurance, and biometric identity.',
    benefit: 'Only legally authorized, insured specialists touch your home.',
  },
  {
    aspect: 'Pricing Transparency',
    traditional: '"Free estimate" bait-and-switch followed by inflated surprise invoices after work begins.',
    skillConnect: 'Upfront diagnostic fee starting benchmark, 100% credited toward accepted repair labor.',
    benefit: 'No pricing surprises; clear scope itemization before any work starts.',
  },
  {
    aspect: 'Payment Safety',
    traditional: 'Large upfront cash, check, or Venmo deposits with zero recourse if contractor disappears.',
    skillConnect: 'Bank-grade escrow milestone hold. Funds stay locked and are never released without your sign-off.',
    benefit: 'You maintain 100% leverage until the job is inspected and completed.',
  },
  {
    aspect: 'Workmanship Protection',
    traditional: '"Cash-only warranties" where the contractor blocks your number when problems arise.',
    skillConnect: '$2,500 SkillConnect Craftsmanship Guarantee with photographic dispute mediation desk.',
    benefit: 'Platform-backed legal mediation and code compliance coverage.',
  },
  {
    aspect: 'Customer Reviews',
    traditional: 'Fabricated 5-star reviews written by bots, friends, or purchased review packages.',
    skillConnect: '100% verified booking reviews. Only homeowners who completed and paid through the platform can review.',
    benefit: 'Authentic feedback from real local homeowners in your neighborhood.',
  },
];

interface WorkflowStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  guaranteeNote: string;
  icon: React.ElementType;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: '01',
    title: 'Find & Verify Credentials',
    subtitle: 'Transparent discovery with zero gatekeeping',
    description:
      'Search local specialists filtered by state license status, verified customer ratings, upfront hourly rates, and same-day availability. Every profile displays active license numbers and verified badges.',
    guaranteeNote: 'Every listed professional is pre-vetted against state registry boards.',
    icon: UserCheck,
  },
  {
    number: '02',
    title: 'Standard Diagnostic Inspection',
    subtitle: 'Expert on-site troubleshooting with zero obligation',
    description:
      'Book a confirmed arrival slot. The specialist performs an in-depth diagnosis of your repair. When you authorize the proposed scope, 100% of the diagnostic inspection fee is deducted directly from your final labor bill.',
    guaranteeNote: 'Diagnostic fee is credited directly toward your authorized repair.',
    icon: Scale,
  },
  {
    number: '03',
    title: 'Escrow Milestone Pre-Authorization',
    subtitle: 'Your money stays protected until work is inspected',
    description:
      'When you agree to the repair estimate, funds are pre-authorized in a secure platform escrow hold. The technician does NOT receive payment upfront, eliminating deposit forfeiture risks.',
    guaranteeNote: 'Zero funds released until you personally sign off on the job.',
    icon: Lock,
  },
  {
    number: '04',
    title: 'Satisfactory Sign-Off & Release',
    subtitle: 'You inspect the work before releasing funds',
    description:
      'Once the technician finishes the repair and walks you through the completed service, you confirm satisfactory completion with one click. Only then are escrow funds disbursed to the professional.',
    guaranteeNote: 'Protected by our 72-hour dispute window and $2,500 Workmanship Guarantee.',
    icon: Award,
  },
];

interface SimulationScenario {
  trade: string;
  jobName: string;
  diagnosticFee: number;
  estimatedLaborParts: number;
  inspectionChecklist: string[];
}

const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    trade: 'Plumbing',
    jobName: 'Water Heater Pressure Valve Replacement',
    diagnosticFee: 65,
    estimatedLaborParts: 280,
    inspectionChecklist: [
      'Pressure relief valve tested and drain pipe secured',
      'No active water or gas line leaks observed',
      'Hot water temperature verified at fixtures',
      'Work site cleared of old parts and debris',
    ],
  },
  {
    trade: 'Electrical',
    jobName: 'Circuit Breaker Tripping & Subpanel Diagnostic',
    diagnosticFee: 85,
    estimatedLaborParts: 340,
    inspectionChecklist: [
      'Multi-meter load test completed and balanced',
      'GFCI & AFCI breaker trip test confirmed',
      'Panel label documentation updated',
      'Code-compliant grounding inspection validated',
    ],
  },
  {
    trade: 'Carpentry',
    jobName: 'Interior Door Alignment & Subframe Repair',
    diagnosticFee: 55,
    estimatedLaborParts: 220,
    inspectionChecklist: [
      'Door swings cleanly without dragging on carpet',
      'Deadbolt and latch align smoothly without sticking',
      'Screws countersunk and trim flush with jamb',
      'Clean dust extraction and work zone cleanup',
    ],
  },
  {
    trade: 'HVAC',
    jobName: 'Heat Pump Capacitor & Blower Fan Servicing',
    diagnosticFee: 79,
    estimatedLaborParts: 310,
    inspectionChecklist: [
      'Capacitor microfarad rating within factory specs',
      'Thermostat responsive in both heat and cool modes',
      'Air filter replaced or cleaned',
      'Condensate drain line flushed and clean',
    ],
  },
];

const FAQS = [
  {
    question: 'How does SkillConnect verify that contractors are genuinely licensed?',
    answer:
      'Unlike uncurated directories, every professional on SkillConnect undergoes automated and manual verification against state licensing boards (such as the California Contractors State License Board - CSLB). We verify active license status, classification codes, active worker compensation records, and verify commercial general liability insurance ($1,000,000 minimum). Profiles with revoked, suspended, or expired credentials are automatically delisted.',
  },
  {
    question: 'How exactly does the Diagnostic Fee Credit work?',
    answer:
      'When you book an initial inspection, the professional charges a standardized diagnostic fee (e.g. $75) to travel, troubleshoot, and evaluate your repair. If you accept their written repair quote, that entire $75 fee is credited directly toward your total labor and parts bill. If the total repair is $300, you only pay an additional $225. You are never double-charged for diagnosis.',
  },
  {
    question: 'What is Escrow Milestone Protection, and when is my card charged?',
    answer:
      'When you accept a quote, SkillConnect places an authorization hold in secure escrow through our banking partner. The contractor does NOT receive this money while working. Only after you physically inspect the completed work and press "Approve & Sign Off" in your customer dashboard are the funds disbursed to the professional. If work is incomplete, your money remains protected.',
  },
  {
    question: 'What happens if a professional does not show up or does a poor job?',
    answer:
      'If a specialist cancels or fails to arrive within the agreed arrival window, your pre-authorization is instantly released with zero cancellation fee. If a completed job fails local building code or shows defective craftsmanship, our dedicated dispute mediation team reviews photographic evidence within our 72-hour protection window, covered up to $2,500 by the SkillConnect Workmanship Guarantee.',
  },
  {
    question: 'Can a contractor increase the price midway through the repair?',
    answer:
      'Never without your explicit digital consent. Any unforeseen repairs discovered during work require an official Change Order estimate submitted through the SkillConnect portal. The professional cannot proceed with additional work or charge extra without your recorded digital approval.',
  },
  {
    question: 'Are the customer ratings and reviews genuine?',
    answer:
      'Yes, 100%. On SkillConnect, it is technically impossible to leave a review without completing a verified booking and transaction through our platform. We do not permit anonymous reviews, competitor smears, or paid marketing reviews. Every review is tied to a real completed work order and real homeowner.',
  },
];

export default function TrustAndSafetyPage() {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scenario = SIMULATION_SCENARIOS[activeScenarioIndex];
  const finalAdditionalPayment = scenario.estimatedLaborParts - scenario.diagnosticFee;

  return (
    <div className="flex flex-col bg-[#F7F8FA]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-[#EBF1F8] via-[#F7F8FA] to-[#F7F8FA] border-b border-[#E4E7EC] overflow-hidden">
        <Container>
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#0F9D91]/30 shadow-xs mb-6">
              <ShieldCheck className="w-4 h-4 text-[#0F9D91]" />
              <span className="text-xs font-bold text-[#173B67] uppercase tracking-wider">
                Built For 100% Homeowner Trust & Safety
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173B67] tracking-tight leading-[1.15]">
              How SkillConnect Protects You &amp; Your Home
            </h1>

            <p className="text-sm sm:text-base text-[#667085] mt-4 leading-relaxed max-w-2xl">
              Hiring home service contractors shouldn&apos;t feel like a gamble. We eliminated unverified contractors,
              surprise invoices, and disappearing deposits with multi-tier verification, transparent diagnostic credits,
              and bank-grade escrow protection.
            </p>

            {/* Quick CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link href="/professionals">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="rounded-full font-bold shadow-md"
                >
                  Browse Verified Professionals
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Sparkles className="w-4 h-4 text-[#0F9D91]" />}
                  className="rounded-full font-bold bg-white"
                >
                  Explore Benchmark Pricing
                </Button>
              </Link>
            </div>

            {/* Trust Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-12 sm:mt-16 pt-8 border-t border-[#E4E7EC]">
              <div className="bg-white p-4 rounded-2xl border border-[#E4E7EC] shadow-2xs text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#173B67] block">100%</span>
                <span className="text-xs font-semibold text-[#667085] mt-1 block">Active State Licenses</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E4E7EC] shadow-2xs text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#0F9D91] block">100%</span>
                <span className="text-xs font-semibold text-[#667085] mt-1 block">Diagnostic Fee Credited</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E4E7EC] shadow-2xs text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#173B67] block">$2,500</span>
                <span className="text-xs font-semibold text-[#667085] mt-1 block">Workmanship Guarantee</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E4E7EC] shadow-2xs text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#0F9D91] block">$0</span>
                <span className="text-xs font-semibold text-[#667085] mt-1 block">Released Without Sign-off</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Side-by-Side Comparison: Traditional vs SkillConnect */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E4E7EC]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
              The Marketplace Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#173B67] mt-1 tracking-tight">
              Why Traditional Contractor Hiring Fails — And How We Fixed It
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-2">
              Compare standard contractor platforms against SkillConnect&apos;s verified trust infrastructure.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#E4E7EC] shadow-xs bg-white">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-[#E4E7EC] bg-[#F7F8FA]">
                  <th className="py-4 px-6 text-xs font-bold text-[#173B67] uppercase tracking-wider w-1/4">
                    Hiring Safeguard
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#B42318] uppercase tracking-wider w-1/3">
                    Traditional Unregulated Platforms
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#0F9D91] uppercase tracking-wider w-5/12 bg-[#E6F7F5]/50">
                    SkillConnect Verified Platform
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC] text-xs sm:text-sm">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6 font-bold text-[#173B67] align-top">
                      {row.aspect}
                      <span className="block text-[11px] font-normal text-[#667085] mt-1">
                        {row.benefit}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-[#667085] align-top">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-[#B42318] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{row.traditional}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-[#263445] font-medium align-top bg-[#E6F7F5]/20">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0F9D91] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{row.skillConnect}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Step-by-Step Interactive Workflow */}
      <section className="py-16 sm:py-20 bg-[#F7F8FA] border-b border-[#E4E7EC]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
              Full Transparency Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#173B67] mt-1 tracking-tight">
              Protected Every Step Of The Way
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-2">
              From the moment you discover a professional to final inspection, here is how SkillConnect shields you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-[#E4E7EC] shadow-2xs hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Top Row: Number and Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-[#EBF1F8] text-[#173B67]">
                        Step {step.number}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-[#E6F7F5] text-[#0F9D91] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#173B67] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#0F9D91] mb-3">
                      {step.subtitle}
                    </p>
                    <p className="text-xs text-[#667085] leading-relaxed mb-4">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E4E7EC] flex items-center gap-1.5 text-[11px] font-semibold text-[#173B67]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9D91] shrink-0" />
                    <span>{step.guaranteeNote}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Interactive Protection Simulator */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E4E7EC]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
              Live Protection Simulator
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#173B67] mt-1 tracking-tight">
              Experience How Escrow &amp; Diagnostic Credits Work
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-2">
              Select any trade repair below to see an interactive simulation of payment locking, fee credit, and inspection release.
            </p>
          </div>

          {/* Trade Select Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {SIMULATION_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.trade}
                type="button"
                onClick={() => setActiveScenarioIndex(idx)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeScenarioIndex === idx
                    ? 'bg-[#173B67] text-white shadow-sm scale-105'
                    : 'bg-[#F7F8FA] text-[#667085] hover:bg-[#EBF1F8] hover:text-[#173B67] border border-[#E4E7EC]'
                }`}
              >
                {sc.trade}: {sc.jobName.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Interactive Calculator Card */}
          <div className="max-w-4xl mx-auto bg-[#F7F8FA] rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Cost Math */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[#0F9D91]" />
                  <h3 className="font-bold text-lg text-[#173B67]">
                    {scenario.jobName}
                  </h3>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#E4E7EC] flex flex-col gap-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs sm:text-sm pb-2 border-b border-[#E4E7EC]">
                    <span className="text-[#667085]">Standard Diagnostic Inspection Fee</span>
                    <strong className="text-[#173B67]">{formatCurrency(scenario.diagnosticFee)}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm pb-2 border-b border-[#E4E7EC]">
                    <span className="text-[#667085]">Authorized Repair Labor &amp; Materials</span>
                    <strong className="text-[#173B67]">{formatCurrency(scenario.estimatedLaborParts)}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-[#0F9D91] font-bold pb-2 border-b border-[#E4E7EC]">
                    <span>Diagnostic Fee Credit Applied (100%)</span>
                    <span>-{formatCurrency(scenario.diagnosticFee)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xs font-bold text-[#173B67] block">Remaining Escrow Pre-Authorization</span>
                      <span className="text-[11px] text-[#667085]">Locked safely until you sign off</span>
                    </div>
                    <span className="text-xl font-black text-[#173B67]">
                      {formatCurrency(finalAdditionalPayment)}
                    </span>
                  </div>
                </div>

                {/* Escrow Guarantee Pill */}
                <div className="p-3.5 rounded-2xl bg-[#E6F7F5] border border-[#0F9D91]/30 flex items-start gap-3 text-xs text-[#0F9D91]">
                  <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Zero Upfront Contractor Payout:</strong> The {formatCurrency(finalAdditionalPayment)} remains locked in escrow. The specialist only receives payment when you mark the inspection as complete.
                  </p>
                </div>
              </div>

              {/* Right Column: Homeowner Inspection Checklist */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-[#E4E7EC] shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-[#173B67]">
                    Homeowner Release Inspection Checklist
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#15803D] border border-emerald-200">
                    Required for Payout
                  </span>
                </div>

                <p className="text-xs text-[#667085] mb-4">
                  Before funds leave escrow, you verify each milestone in person with the technician:
                </p>

                <ul className="flex flex-col gap-2.5">
                  {scenario.inspectionChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#263445] bg-[#F7F8FA] p-2.5 rounded-xl border border-[#E4E7EC]/60">
                      <CheckCircle2 className="w-4 h-4 text-[#0F9D91] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Unsatisfied? Open a dispute within 72 hours for mediation before payment release.</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4-Tier Verification Protocol */}
      <section className="py-16 sm:py-20 bg-[#F7F8FA] border-b border-[#E4E7EC]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
              Strict Verification Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#173B67] mt-1 tracking-tight">
              The SkillConnect 4-Tier Vetting Protocol
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-2">
              Only approximately 28% of contractor applicants meet our strict multi-tier vetting requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E4E7EC] shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF1F8] text-[#173B67] flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6 text-[#0F9D91]" />
              </div>
              <h3 className="font-bold text-base text-[#173B67] mb-1">1. State Trade License</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Direct API integration with State Licensing Boards (e.g. CSLB) verifying current active status, trade specialty classifications, and disciplinary standing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E4E7EC] shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF1F8] text-[#173B67] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-[#0F9D91]" />
              </div>
              <h3 className="font-bold text-base text-[#173B67] mb-1">2. $1M+ Liability Insurance</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Mandatory active Commercial General Liability insurance certificates verified with issuing policy underwriters before public listing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E4E7EC] shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF1F8] text-[#173B67] flex items-center justify-center mb-4">
                <BadgeCheck className="w-6 h-6 text-[#0F9D91]" />
              </div>
              <h3 className="font-bold text-base text-[#173B67] mb-1">3. Biometric &amp; ID Check</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Government-issued photo identification verified against facial biometrics to eliminate contractor identity substitution and subleasing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E4E7EC] shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF1F8] text-[#173B67] flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-[#0F9D91]" />
              </div>
              <h3 className="font-bold text-base text-[#173B67] mb-1">4. Workmanship Guarantee</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Every booking is backed by the $2,500 SkillConnect Craftsmanship Protection Fund and platform dispute resolution board.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust & Safety FAQ Accordion */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E4E7EC]">
        <Container size="narrow" className="max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#173B67] mt-1 tracking-tight">
              Frequently Asked Trust &amp; Safety Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-2">
              Everything you need to know about our warranties, escrow releases, and verification.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E4E7EC] overflow-hidden bg-[#F7F8FA] transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-[#173B67] flex items-center justify-between gap-4 hover:bg-[#EBF1F8]/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#667085] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#0F9D91]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-[#667085] leading-relaxed border-t border-[#E4E7EC]/40 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 sm:py-20 bg-[#173B67] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#0F9D91] flex items-center justify-center text-white mb-6 shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Experience Worry-Free Home Repairs Today
            </h2>

            <p className="text-xs sm:text-sm text-white/80 mt-3 max-w-xl leading-relaxed">
              Find verified trade professionals with active state licenses, upfront diagnostic pricing,
              and complete escrow milestone safety.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/professionals">
                <Button
                  variant="secondary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="rounded-full font-bold shadow-md"
                >
                  Find Verified Professionals
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full font-bold text-white border-white/20 hover:bg-white/10"
                >
                  Browse Service Categories
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
