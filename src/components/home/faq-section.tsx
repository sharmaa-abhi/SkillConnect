'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/layout/container';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is a Diagnostic Inspection Fee?',
      answer:
        'A diagnostic fee covers the technician’s time, travel, and specialized equipment to accurately diagnose the root cause of your issue on-site. If you authorize the technician to complete the repair, 100% of this fee is credited directly toward your final labor total.',
    },
    {
      question: 'How does the Escrow Payment Protection work?',
      answer:
        'When you book, funds for the diagnostic fee are securely pre-authorized in escrow. The money is never released to the technician until the inspection or repair is completed and you sign off in the app, or after 48 hours with no reported disputes.',
    },
    {
      question: 'How do you verify contractor licenses and insurance?',
      answer:
        'Every professional undergoes a 4-tier verification protocol: state license number verification against municipal licensing boards, active commercial liability insurance validation ($2M minimum), government photo ID biometric matching, and background screening.',
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer:
        'Yes. Cancellations made more than 2 hours before the scheduled arrival window are completely free with zero penalties and immediate release of your pre-authorized escrow hold. Cancellations under 2 hours may incur a small dispatch compensation fee.',
    },
    {
      question: 'How does the AI Cost Estimator work?',
      answer:
        'Our AI Cost Estimator analyzes your problem description against historical municipal repair benchmarks to generate an indicative price range with itemized labor hours and required parts, helping you understand fair market rates before booking.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E4E7EC]">
      <Container size="narrow" className="max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D91]">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#173B67] mt-1 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#667085] mt-2">
            Everything you need to know about our local marketplace standards.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-[#E4E7EC] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-[#F7F8FA] transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-[#263445]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#667085] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#173B67]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-[#667085] bg-white leading-relaxed border-t border-[#E4E7EC]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
