import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { registerNewUser, signInUser } from '../lib/supabase';
import { RegisteredUser } from '../types';

interface SignupFormProps {
  onSuccess: (user: RegisteredUser) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation & Error states
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (newMode: 'signup' | 'signin') => {
    setMode(newMode);
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email format (e.g., name@domain.com).';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (mode === 'signup') {
      if (!confirmPassword) {
        errs.confirmPassword = 'Please confirm your password.';
      } else if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      if (mode === 'signup') {
        const result = await registerNewUser(email, password);
        if (result.success && result.user) {
          onSuccess(result.user);
        } else {
          setErrors({
            general: result.error || 'Registration failed. Please check your credentials.',
          });
        }
      } else {
        const result = await signInUser(email, password);
        if (result.success && result.user) {
          onSuccess(result.user);
        } else {
          setErrors({
            general: result.error || 'Failed to sign in. Please verify your credentials.',
          });
        }
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-8 sm:py-16 px-4 sm:px-6">
      {/* Top Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2A4A] tracking-tight">
          {mode === 'signup' ? 'Create Account' : 'Sign In'}
        </h1>
        <p className="mt-2.5 text-sm text-[#0B2A4A]/70 max-w-xs mx-auto leading-relaxed">
          {mode === 'signup'
            ? 'Sign up to connect with Spidey Connect by Apex Webworks.'
            : 'Sign in to access your Spidey Connect account.'}
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-[#0B2A4A]/10 rounded-2xl shadow-[0_12px_40px_rgba(11,42,74,0.06)] p-6 sm:p-8">
        {/* Error Banner */}
        {errors.general && (
          <div className="mb-6 p-4 rounded-xl bg-[#E30613]/5 border border-[#E30613]/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#E30613] shrink-0 mt-0.5" />
            <div className="text-xs font-semibold text-[#E30613] leading-relaxed">
              {errors.general}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="auth-email"
              className="block text-xs font-bold uppercase tracking-wider text-[#0B2A4A] mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B2A4A]/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-3 bg-white text-[#0B2A4A] text-sm rounded-xl border transition-all placeholder:text-[#0B2A4A]/30 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-[#E30613] focus:ring-[#E30613]/20'
                    : 'border-[#0B2A4A]/15 focus:border-[#0B2A4A] focus:ring-[#0B2A4A]/10'
                }`}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-[#E30613] font-medium flex items-center gap-1">
                <span>·</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="auth-password"
              className="block text-xs font-bold uppercase tracking-wider text-[#0B2A4A] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B2A4A]/40">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="Minimum 6 characters"
                className={`w-full pl-10 pr-11 py-3 bg-white text-[#0B2A4A] text-sm rounded-xl border transition-all placeholder:text-[#0B2A4A]/30 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-[#E30613] focus:ring-[#E30613]/20'
                    : 'border-[#0B2A4A]/15 focus:border-[#0B2A4A] focus:ring-[#0B2A4A]/10'
                }`}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#0B2A4A]/40 hover:text-[#0B2A4A] focus:outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-[#E30613] font-medium flex items-center gap-1">
                <span>·</span> {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field (Sign Up only) */}
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="auth-confirmPassword"
                className="block text-xs font-bold uppercase tracking-wider text-[#0B2A4A] mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B2A4A]/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="auth-confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="Confirm password"
                  className={`w-full pl-10 pr-11 py-3 bg-white text-[#0B2A4A] text-sm rounded-xl border transition-all placeholder:text-[#0B2A4A]/30 focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-[#E30613] focus:ring-[#E30613]/20'
                      : 'border-[#0B2A4A]/15 focus:border-[#0B2A4A] focus:ring-[#0B2A4A]/10'
                  }`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#0B2A4A]/40 hover:text-[#0B2A4A] focus:outline-none cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-[#E30613] font-medium flex items-center gap-1">
                  <span>·</span> {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Red Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#E30613] hover:bg-[#c40510] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#E30613]/20 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(227,6,19,0.25)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
              </div>
            ) : (
              <>
                <span>{mode === 'signup' ? 'Sign Up' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Small Helper Text below the red button */}
        <div className="mt-4 text-center">
          {mode === 'signup' ? (
            <p className="text-xs text-[#0B2A4A]/70">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="font-bold text-[#E30613] hover:underline cursor-pointer ml-0.5"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-xs text-[#0B2A4A]/70">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="font-bold text-[#E30613] hover:underline cursor-pointer ml-0.5"
              >
                Sign up
              </button>
            </p>
          )}
        </div>

        {/* Secure registration text at bottom */}
        <div className="mt-6 pt-5 border-t border-[#0B2A4A]/10 flex items-center justify-center gap-1.5 text-xs text-[#0B2A4A]/50">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0B2A4A]" />
          <span>Secure registration with Supabase database</span>
        </div>
      </div>
    </div>
  );
};
