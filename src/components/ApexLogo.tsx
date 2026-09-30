import React from 'react';

interface ApexLogoProps {
  className?: string;
  showText?: boolean;
}

export const ApexLogo: React.FC<ApexLogoProps> = ({ className = 'h-9', showText = true }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Vector Emblem inspired by Apex Webworks */}
      <svg
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full aspect-[5/4] shrink-0 drop-shadow-sm"
        aria-label="Apex Webworks Logo"
      >
        <defs>
          <linearGradient id="silverApexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="blueApexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0B2A4A" />
          </linearGradient>
          <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0B2A4A" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Silver 'A' Chevron Frame */}
        <path
          d="M38 10L14 62H26L38 34L50 62H62L38 10Z"
          fill="url(#silverApexGrad)"
          stroke="#334155"
          strokeWidth="0.8"
        />

        {/* Inner Code Bracket </> in crossbar of A */}
        <text
          x="38"
          y="56"
          textAnchor="middle"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
          fill="#0B2A4A"
          letterSpacing="-0.5"
        >
          &lt;/&gt;
        </text>

        {/* Interlocking Modern Blue 'W' */}
        <path
          d="M48 38L57 62L66 38L75 62L85 38H94L80 72H71L62 48L53 72H44L35 48H44L48 38Z"
          fill="url(#blueApexGrad)"
          stroke="#0B2A4A"
          strokeWidth="0.8"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-base sm:text-lg font-extrabold tracking-wider text-[#0B2A4A] uppercase">
            Apex <span className="text-[#0B2A4A]/80 font-bold">Webworks</span>
          </span>
          <span className="text-[10px] tracking-widest text-[#0B2A4A]/60 font-semibold uppercase mt-0.5">
            Spidey Connect
          </span>
        </div>
      )}
    </div>
  );
};
