import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { ToastProvider } from '@/context/toast-context';

export const metadata: Metadata = {
  title: 'SkillConnect — Connecting People with Trusted Local Service Professionals',
  description:
    'Find trusted help. Book confidently. Connect with verified plumbers, electricians, carpenters, painters, and appliance technicians with transparent diagnostic pricing.',
  keywords: [
    'local services',
    'plumber',
    'electrician',
    'carpenter',
    'technician',
    'home repair',
    'verified contractors',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#f8f8f4] text-[#172522]">
        <ToastProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ToastProvider>
      </body>
    </html>
  );
}
