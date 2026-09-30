import React from 'react';
import { SpiderManImageFrame } from './SpiderManImageFrame';
import { RegisteredUser } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  user: RegisteredUser | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ user }) => {
  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  return (
    <section className="relative w-full bg-white overflow-hidden py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Heading and Connection Details */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0B2A4A]/5 border border-[#0B2A4A]/10 text-xs font-bold text-[#0B2A4A] mb-6">
              <CheckCircle2 className="w-4 h-4 text-[#E30613]" />
              <span>Registration Successful</span>
            </div>

            {/* MANDATORY EXACT HEADING: "Thanks for Connecting" */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B2A4A] tracking-tight leading-[1.1]">
              Thanks for Connecting
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg text-[#0B2A4A]/75 max-w-xl leading-relaxed">
              Your account has been registered and verified in the database. Welcome to Spidey Connect by Apex Webworks.
            </p>

            {/* User Confirmation Card */}
            <div className="mt-8 w-full max-w-lg p-5 rounded-2xl bg-white border border-[#0B2A4A]/10 shadow-[0_4px_24px_rgba(11,42,74,0.04)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#0B2A4A]/50 font-semibold block uppercase tracking-wider">
                    Registered Email
                  </span>
                  <span className="text-[#0B2A4A] font-bold text-sm truncate block mt-1">
                    {user?.email || 'Account Registered'}
                  </span>
                </div>
                <div>
                  <span className="text-[#0B2A4A]/50 font-semibold block uppercase tracking-wider">
                    Signup Date
                  </span>
                  <span className="text-[#0B2A4A] font-semibold text-sm block mt-1 font-mono-tabular">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Desktop) / Below (Mobile): 3:4 Spider-Man Image */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <SpiderManImageFrame />
          </div>
        </div>
      </div>
    </section>
  );
};
