'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { User, Briefcase, Wrench, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { TextField } from '@/components/forms/text-field';
import { SelectField } from '@/components/forms/select-field';
import { Button } from '@/components/ui/button';
import { serviceCategories } from '@/data/services';
import { useToast } from '@/context/toast-context';
import { useAuth } from '@/context/auth-context';

function RegisterFormContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'worker' ? 'worker' : 'customer';

  const { showToast } = useToast();
  const { login, updateProfile } = useAuth();
  const [role, setRole] = useState<'customer' | 'worker'>(initialRole);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(serviceCategories[0].slug);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Please enter your full name.';
    }
    if (!email || !email.includes('@')) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (role === 'worker' && (!phone || phone.length < 7)) {
      newErrors.phone = 'Please provide a valid contact telephone number.';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      login(email, role);
      updateProfile({ name: name.trim(), phone: phone.trim() || undefined });

      setPassword('');
      setConfirmPassword('');

      showToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome to SkillConnect, ${name}! Your profile is ready.`,
      });
    }, 600);
  };

  return (
    <div className="py-12 sm:py-20 bg-[#F8FAFC]">
      <Container size="narrow">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-md">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0B0F0E] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Wrench className="w-6 h-6 text-[#16A34A]" />
            </div>
            <h1 className="text-2xl font-black text-[#111827]">
              Join SkillConnect
            </h1>
            <p className="text-xs text-[#4B5563] mt-1">
              Select your role to get started with verified local services
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-[#111827] mb-2">
                Registration Complete
              </h2>
              <p className="text-xs text-[#4B5563] mb-6 leading-relaxed">
                Your profile has been created and you are signed in. Explore your personalized dashboard to manage appointments or service dispatch.
              </p>
              <div className="flex flex-col gap-3">
                <Link href={role === 'worker' ? '/worker/dashboard' : '/customer/dashboard'}>
                  <Button variant="primary" size="lg" className="w-full justify-center">
                    Enter {role === 'worker' ? 'Pro Worker Portal' : 'Customer Dashboard'}
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="md" className="w-full justify-center">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Role Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] mb-6">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    role === 'customer'
                      ? 'bg-white text-[#111827] shadow-xs'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>I Need Services</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('worker')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    role === 'worker'
                      ? 'bg-[#0B0F0E] text-white shadow-xs'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>I Am a Professional</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <TextField
                  id="reg-name"
                  label="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'worker' ? 'e.g. Elena Rodriguez' : 'e.g. Sarah Jenkins'}
                  error={errors.name}
                />

                <TextField
                  id="reg-email"
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  error={errors.email}
                />

                {role === 'worker' && (
                  <>
                    <SelectField
                      id="reg-category"
                      label="Primary Trade Category"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      options={serviceCategories.map((c) => ({
                        value: c.slug,
                        label: c.name,
                      }))}
                    />

                    <TextField
                      id="reg-phone"
                      label="Phone Number"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. (555) 234-5678"
                      error={errors.phone}
                    />
                  </>
                )}

                <TextField
                  id="reg-password"
                  label="Password"
                  isPassword
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  error={errors.password}
                />

                <TextField
                  id="reg-confirm-password"
                  label="Confirm Password"
                  isPassword
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  error={errors.confirmPassword}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full justify-center mt-3 font-bold"
                >
                  Create {role === 'worker' ? 'Professional' : 'Customer'} Account
                </Button>
              </form>

              {/* Sign In Link & Demo Prompt */}
              <div className="mt-6 text-center text-xs text-[#4B5563] space-y-3">
                <div>
                  Already have an account?{' '}
                  <Link href="/login" className="font-bold text-[#2563EB] hover:underline">
                    Sign in
                  </Link>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-[#111827] flex items-center justify-between text-left">
                  <div>
                    <span className="font-bold block">Evaluating the platform?</span>
                    <span className="text-[11px] text-[#4B5563]">Skip signup and use pre-configured demo personas.</span>
                  </div>
                  <Link
                    href="/login"
                    className="px-2.5 py-1.5 rounded-lg bg-[#0B0F0E] text-white font-bold text-[11px] hover:bg-[#1f2937] whitespace-nowrap"
                  >
                    Demo Logins →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-[#667085]">
          Loading registration...
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
