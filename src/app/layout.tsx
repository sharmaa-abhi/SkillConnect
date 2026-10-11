import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { ToastProvider } from '@/context/toast-context';
import { AuthProvider } from '@/context/auth-context';
import { DemoExperienceWidget } from '@/components/demo/demo-experience-widget';

export const metadata: Metadata = {
  title: 'SkillConnect — Trusted Local Service Professionals',
  description:
    'Find trusted help. Book confidently. Connect with verified plumbers, electricians, carpenters, painters, and appliance technicians with transparent upfront diagnostic pricing and escrow protection.',
  keywords: [
    'local services marketplace',
    'licensed plumbers',
    'certified electricians',
    'local trade contractors',
    'home repair',
    'transparent diagnostic fee',
    'escrow protection',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#F7F8FA] text-[#263445]">
        <AuthProvider>
          <ToastProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <DemoExperienceWidget />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
