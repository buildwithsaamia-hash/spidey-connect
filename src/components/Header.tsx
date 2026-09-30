import React from 'react';
import { ApexLogo } from './ApexLogo';
import { ShieldCheck, LogOut } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isAdminAuthenticated: boolean;
  onAdminLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  isAdminAuthenticated,
  onAdminLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-[#0B2A4A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Apex Webworks Logo */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613] rounded-lg transition-transform duration-150 cursor-pointer"
          aria-label="Apex Webworks - Spidey Connect"
        >
          <ApexLogo className="h-10" />
        </button>

        {/* Right: Minimal Admin link (quiet, small, unobtrusive) */}
        <div className="flex items-center gap-4">
          {currentPath === '/admin' && isAdminAuthenticated ? (
            <button
              onClick={onAdminLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 text-[#0B2A4A] hover:text-[#E30613] border border-[#0B2A4A]/15 hover:border-[#E30613]/30 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('/admin')}
              className="text-xs font-medium text-[#0B2A4A]/50 hover:text-[#0B2A4A] transition-colors cursor-pointer py-1 px-2 rounded"
              title="Admin Portal"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
