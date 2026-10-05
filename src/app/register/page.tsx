'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Briefcase, Wrench, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { TextField } from '@/components/forms/text-field';
import { SelectField } from '@/components/forms/select-field';
import { Button } from '@/components/ui/button';
import { serviceCategories } from '@/data/services';
import { useToast } from '@/context/toast-context';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'worker' ? 'worker' : 'customer';

  const { showToast } = useToast();
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

    // Simulate demo registration
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // Wipe password from memory immediately
      setPassword('');
      setConfirmPassword('');

      showToast({
        type: 'success',
        title: 'Demo Account Created',
        message: `Welcome to SkillConnect, ${name}! Your demo account is ready.`,
      });
    }, 700);
  };

  return (
    <div className="py-12 sm:py-20 bg-[#f8f8f4]">
      <Container size="narrow">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e3e8e3] shadow-md">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#143d35] text-white flex items-center justify-center mx-auto mb-3">
              <Wrench className="w-6 h-6 text-[#e7f4ed]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#172522]">
              Join SkillConnect
            </h1>
            <p className="text-xs text-[#66716d] mt-1">
              Select your role to get started with verified local services
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#e7f4ed] text-[#237a63] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-[#172522] mb-2">
                Registration Complete (Demo)
              </h2>
              <p className="text-xs text-[#66716d] mb-6 leading-relaxed">
                Your demo profile has been generated. Explore your personalized dashboard to manage bookings or pro dispatch.
              </p>
              <div className="flex flex-col gap-3">
                <Link href={role === 'worker' ? '/worker/dashboard' : '/customer/dashboard'}>
                  <Button variant="primary" size="lg" className="w-full justify-center">
                    Enter {role === 'worker' ? 'Worker Dashboard' : 'Customer Dashboard'}
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
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#f8f8f4] border border-[#e3e8e3] mb-6">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    role === 'customer'
                      ? 'bg-white text-[#143d35] shadow-xs'
                      : 'text-[#66716d] hover:text-[#172522]'
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
                      ? 'bg-[#143d35] text-white shadow-xs'
                      : 'text-[#66716d] hover:text-[#172522]'
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
                  Create {role === 'worker' ? 'Professional' : 'Customer'} Account (Demo)
                </Button>
              </form>

              {/* Notice */}
              <div className="mt-6 p-3 rounded-xl bg-[#f8f8f4] border border-[#e3e8e3] text-center text-[11px] text-[#66716d]">
                Notice: SkillConnect is in prototype demonstration mode. Passwords are never stored.
              </div>

              {/* Sign In Link */}
              <div className="mt-6 text-center text-xs text-[#66716d]">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-[#237a63] hover:underline">
                  Sign in
                </Link>
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
        <div className="py-20 text-center text-sm text-[#66716d]">
          Loading registration...
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
