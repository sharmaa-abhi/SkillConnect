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
        'When you book, funds for the diagnostic fee are securely pre-authorized with our payment partner (Stripe). The money is never released to the technician until the inspection or repair is completed and you sign off in the app, or after 48 hours with no reported disputes.',
    },
    {
      question: 'How do you verify contractor licenses and insurance?',
      answer:
        'Every professional undergoes a 4-tier verification protocol: state license number verification against municipal licensing boards, active commercial liability insurance validation, government photo ID matching, and background screening.',
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer:
        'Yes. Cancellations made more than 2 hours before the scheduled arrival window are completely free with zero penalties. Cancellations under 2 hours may incur a small cancellation fee to compensate the technician for reserved vehicle dispatch time.',
    },
    {
      question: 'Is this a real live service right now?',
      answer:
        'This website is currently operating as a Phase 1 UI/UX demonstration prototype. You can explore all pages, filter professionals, test the 4-step booking flow, and experience the customer and worker dashboards using realistic local data.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#e3e8e3]">
      <Container size="narrow" className="max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#237a63]">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172522] mt-1 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#66716d] mt-2">
            Everything you need to know about our local marketplace standards.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-[#e3e8e3] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-[#f8f8f4] transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-[#172522]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#66716d] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#237a63]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-[#66716d] bg-white leading-relaxed border-t border-[#e3e8e3]/50">
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
