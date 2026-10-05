'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wrench, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { TextField } from '@/components/forms/text-field';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/toast-context';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Quick fill helper
  const handleQuickFill = (role: 'customer' | 'worker') => {
    if (role === 'customer') {
      setEmail('sarah.jenkins@example.com');
      setPassword('CustomerDemo2026!');
    } else {
      setEmail('elena.rodriguez@example.com');
      setPassword('WorkerDemo2026!');
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

    // Simulate demo sign in
    setTimeout(() => {
      setIsLoading(false);
      const isWorker = email.includes('elena') || email.includes('worker');

      showToast({
        type: 'success',
        title: 'Demo Sign In Successful',
        message: `Welcome back! Navigating to ${isWorker ? 'Worker' : 'Customer'} Dashboard.`,
      });

      // Clear password from memory
      setPassword('');

      if (isWorker) {
        router.push('/worker/dashboard');
      } else {
        router.push('/customer/dashboard');
      }
    }, 600);
  };

  return (
    <div className="py-12 sm:py-20 bg-[#f8f8f4]">
      <Container size="narrow">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e3e8e3] shadow-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#143d35] text-white flex items-center justify-center mx-auto mb-3">
              <Wrench className="w-6 h-6 text-[#e7f4ed]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#172522]">
              Sign in to SkillConnect
            </h1>
            <p className="text-xs text-[#66716d] mt-1">
              Access your local booking dashboard or manage pro jobs
            </p>
          </div>

          {/* Demo Quick-Fill Pill Bar */}
          <div className="mb-6 p-3.5 rounded-2xl bg-[#e7f4ed]/70 border border-[#237a63]/20 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#143d35]">
              <Sparkles className="w-4 h-4 text-[#237a63]" />
              <span>One-Click Demo Credentials:</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('customer')}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-white text-xs font-semibold text-[#172522] border border-[#e3e8e3] hover:border-[#237a63] transition-colors"
              >
                Fill Customer Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('worker')}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-white text-xs font-semibold text-[#172522] border border-[#e3e8e3] hover:border-[#237a63] transition-colors"
              >
                Fill Worker Demo
              </button>
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
                  className="rounded text-[#237a63] focus:ring-[#237a63] border-[#c8d3cc]"
                />
                <span className="text-[#66716d]">Remember this browser</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  showToast({
                    type: 'info',
                    title: 'Password Reset (Demo)',
                    message: 'In demonstration mode, you can sign in directly using the demo buttons.',
                  })
                }
                className="text-[#237a63] hover:underline font-medium"
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
              Sign In (Demo)
            </Button>
          </form>

          {/* Demo disclaimer */}
          <div className="mt-6 p-3 rounded-xl bg-[#f8f8f4] border border-[#e3e8e3] text-center text-[11px] text-[#66716d]">
            Prototype demonstration mode. Passwords are wiped immediately upon submission and never transmitted or stored.
          </div>

          {/* Registration Link */}
          <div className="mt-6 text-center text-xs text-[#66716d]">
            Don’t have an account yet?{' '}
            <Link href="/register" className="font-semibold text-[#237a63] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
