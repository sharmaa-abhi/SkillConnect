'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wrench, Sparkles, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { TextField } from '@/components/forms/text-field';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/toast-context';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Quick fill helper
  const handleQuickFill = (role: 'customer' | 'worker' | 'admin') => {
    if (role === 'customer') {
      setEmail('sarah.jenkins@example.com');
      setPassword('CustomerDemo2026!');
    } else if (role === 'worker') {
      setEmail('marcus.vance@example.com');
      setPassword('WorkerDemo2026!');
    } else {
      setEmail('admin@skillconnect.local');
      setPassword('AdminSecurity2026!');
    }
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const isWorker = email.includes('marcus') || email.includes('elena') || email.includes('worker');
      const isAdmin = email.includes('admin');

      const targetRole = isAdmin ? 'admin' : isWorker ? 'worker' : 'customer';
      login(email, targetRole);

      showToast({
        type: 'success',
        title: 'Sign In Successful',
        message: `Welcome back! Opening ${
          isAdmin ? 'Admin Operations Desk' : isWorker ? 'Worker Portal' : 'Customer Dashboard'
        }.`,
      });

      setPassword('');

      if (isAdmin) {
        router.push('/admin');
      } else if (isWorker) {
        router.push('/worker/dashboard');
      } else {
        router.push('/customer/dashboard');
      }
    }, 500);
  };

  return (
    <div className="py-12 sm:py-20 bg-[#F7F8FA]">
      <Container size="narrow">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4E7EC] shadow-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#173B67] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Wrench className="w-6 h-6 text-[#0F9D91]" />
            </div>
            <h1 className="text-2xl font-black text-[#173B67]">
              Sign in to SkillConnect
            </h1>
            <p className="text-xs text-[#667085] mt-1">
              Access your service appointments or professional dispatch portal
            </p>
          </div>

          {/* Quick 1-Click Demo Personas Bar */}
          <div className="mb-6 p-4 rounded-2xl bg-[#EBF1F8] border border-[#173B67]/20 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#173B67]">
                <Sparkles className="w-4 h-4 text-[#0F9D91]" />
                <span>Instant 1-Click Demo Account Sign In:</span>
              </div>
              <span className="text-[10px] text-[#667085] font-semibold">No password required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  login('sarah.jenkins@example.com', 'customer');
                  showToast({
                    type: 'success',
                    title: 'Signed in as Sarah Jenkins',
                    message: 'Customer Dashboard opened with pre-scheduled bookings & reviews.',
                  });
                  router.push('/customer/dashboard');
                }}
                className="p-2.5 rounded-xl bg-white border border-[#E4E7EC] hover:border-[#173B67] hover:shadow-xs transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#263445] group-hover:text-[#173B67]">
                    Sarah Jenkins
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-[#173B67] border border-blue-200">
                    Customer
                  </span>
                </div>
                <span className="text-[10px] text-[#667085] block mt-0.5">
                  1-Click Sign In →
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('marcus.vance@example.com', 'worker');
                  showToast({
                    type: 'success',
                    title: 'Signed in as Marcus Vance',
                    message: 'Worker Portal opened with live dispatch requests & rate manager.',
                  });
                  router.push('/worker/dashboard');
                }}
                className="p-2.5 rounded-xl bg-white border border-[#E4E7EC] hover:border-[#0F9D91] hover:shadow-xs transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#263445] group-hover:text-[#0F9D91]">
                    Marcus Vance
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-[#0F9D91] border border-emerald-200">
                    Pro Worker
                  </span>
                </div>
                <span className="text-[10px] text-[#667085] block mt-0.5">
                  1-Click Sign In →
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('admin@skillconnect.local', 'admin');
                  showToast({
                    type: 'success',
                    title: 'Signed in as Alex Rivera',
                    message: 'Admin Operations Desk opened with verification queue & disputes.',
                  });
                  router.push('/admin');
                }}
                className="p-2.5 rounded-xl bg-white border border-[#E4E7EC] hover:border-purple-400 hover:shadow-xs transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#263445] group-hover:text-purple-700">
                    Alex Rivera
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Admin
                  </span>
                </div>
                <span className="text-[10px] text-[#667085] block mt-0.5">
                  1-Click Sign In →
                </span>
              </button>
            </div>

            <div className="pt-2 border-t border-[#173B67]/10 flex items-center justify-between text-[11px] text-[#667085]">
              <span>Or fill form fields to test manual sign in:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('customer')}
                  className="font-bold text-[#173B67] hover:underline"
                >
                  Fill Customer
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleQuickFill('worker')}
                  className="font-bold text-[#0F9D91] hover:underline"
                >
                  Fill Worker
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin')}
                  className="font-bold text-purple-700 hover:underline"
                >
                  Fill Admin
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              id="login-email"
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sarah.jenkins@example.com"
              error={errors.email}
            />

            <TextField
              id="login-password"
              label="Password"
              isPassword
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              error={errors.password}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#0F9D91] focus:ring-[#0F9D91] border-[#D0D5DD]"
                />
                <span className="text-[#667085]">Remember this browser</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  showToast({
                    type: 'info',
                    title: 'One-Click Access',
                    message: 'Use the demo buttons above to sign in as Customer, Worker, or Administrator.',
                  })
                }
                className="text-[#0F9D91] hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full justify-center mt-3 font-bold"
            >
              Sign In
            </Button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 text-center text-xs text-[#667085]">
            Don’t have an account yet?{' '}
            <Link href="/register" className="font-bold text-[#0F9D91] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
