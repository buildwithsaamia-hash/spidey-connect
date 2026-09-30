import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Search,
  RefreshCw,
  LogOut,
  Calendar,
  Mail,
  Lock,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { RegisteredUser } from '../types';
import { fetchRegisteredUsers } from '../lib/supabase';

const CLIENT_ADMIN_EMAIL = 'web.studio.by.ahmed@gmail.com';
const CLIENT_ADMIN_PASSWORD = 'Apex@2026';

interface AdminPortalProps {
  isAdminAuthenticated: boolean;
  onAdminLogin: (email: string, password: string) => boolean;
  onAdminLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isAdminAuthenticated,
  onAdminLogin,
  onAdminLogout,
  onNavigateHome,
}) => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard state
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageSource, setStorageSource] = useState<'supabase' | 'local_storage'>('local_storage');

  // Load data function with useCallback to prevent infinite re-renders
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetchRegisteredUsers();
      setUsers(res.users || []);
      setStorageSource(res.source);
      if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch registered users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Safe useEffect triggered strictly when authentication state is true
  useEffect(() => {
    if (isAdminAuthenticated) {
      loadUsers();
    }
  }, [isAdminAuthenticated, loadUsers]);

  // Requirement 3 & 4: Hardcoded local credential check, no supabase.auth
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const emailTrimmed = adminEmail.trim().toLowerCase();
    const passTrimmed = adminPassword.trim();

    if (!emailTrimmed || !passTrimmed) {
      setLoginError('Please enter both admin email and password.');
      return;
    }

    if (
      emailTrimmed === CLIENT_ADMIN_EMAIL.toLowerCase() &&
      passTrimmed === CLIENT_ADMIN_PASSWORD
    ) {
      const valid = onAdminLogin(emailTrimmed, passTrimmed);
      if (!valid) {
        setLoginError('Access denied: Invalid administrator credentials.');
      }
    } else {
      setLoginError('Access denied: Invalid administrator credentials.');
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // ==========================================
  // 1. GATEKEEPER VIEW: Administrator Authentication
  // ==========================================
  if (!isAdminAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#0B2A4A] text-white mx-auto flex items-center justify-center mb-4 shadow-sm">
            <ShieldAlert className="w-7 h-7 text-[#E30613]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2A4A] tracking-tight">
            Admin Portal Sign In
          </h1>
          <p className="mt-2 text-xs text-[#0B2A4A]/70 max-w-xs mx-auto leading-relaxed">
            Restricted access. Please sign in with verified administrator credentials.
          </p>
        </div>

        <div className="bg-white border border-[#0B2A4A]/10 rounded-2xl shadow-[0_12px_40px_rgba(11,42,74,0.06)] p-6 sm:p-8">
          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#E30613]/5 border border-[#E30613]/20 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#E30613] shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-[#E30613]">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold uppercase tracking-wider text-[#0B2A4A] mb-2"
              >
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B2A4A]/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => {
                    setAdminEmail(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="admin@apexwebworks.com"
                  className="w-full pl-10 pr-4 py-3 bg-white text-[#0B2A4A] text-sm rounded-xl border border-[#0B2A4A]/15 focus:border-[#0B2A4A] focus:ring-2 focus:ring-[#0B2A4A]/10 focus:outline-none transition-all placeholder:text-[#0B2A4A]/30"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold uppercase tracking-wider text-[#0B2A4A] mb-2"
              >
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B2A4A]/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white text-[#0B2A4A] text-sm rounded-xl border border-[#0B2A4A]/15 focus:border-[#0B2A4A] focus:ring-2 focus:ring-[#0B2A4A]/10 focus:outline-none transition-all placeholder:text-[#0B2A4A]/30"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#0B2A4A] hover:bg-[#071b30] active:scale-[0.99] transition-all cursor-pointer shadow-sm"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#0B2A4A]/10 text-center">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs font-semibold text-[#0B2A4A]/60 hover:text-[#E30613] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Sign Up</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. AUTHENTICATED ADMIN PORTAL DASHBOARD
  // ==========================================
  return (
    <div className="w-full max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Banner & Control Zone */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#0B2A4A]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#E30613] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#E30613]" />
            <span>Authenticated Administrator Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2A4A] tracking-tight">
            User Registration Database
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#0B2A4A]/70">
            Real-time audit log of registered accounts across Spidey Connect.
          </p>
        </div>

        {/* Action Controls: Refresh and Logout Only */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadUsers}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border border-[#0B2A4A]/15 text-[#0B2A4A] hover:bg-[#0B2A4A]/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#E30613]' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={onAdminLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#0B2A4A]/5 text-[#0B2A4A] hover:bg-[#E30613] hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Database Error Banner if any */}
      {errorMessage && (
        <div className="mt-6 p-4 rounded-xl bg-[#E30613]/5 border border-[#E30613]/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#E30613] shrink-0 mt-0.5" />
          <div className="text-xs text-[#0B2A4A] leading-relaxed">
            <span className="font-bold text-[#E30613] block mb-1">Database Notice:</span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Primary Statistic Card: TOTAL USERS */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="sm:col-span-2 bg-white rounded-2xl border border-[#0B2A4A]/10 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B2A4A]/60">
                Total Registered Users
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#0B2A4A]/5 flex items-center justify-center text-[#0B2A4A]">
                <Users className="w-4 h-4 text-[#0B2A4A]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black text-[#0B2A4A] font-mono-tabular">
                {users.length}
              </span>
              <span className="text-xs text-[#0B2A4A]/60 font-medium">
                Verified records in database
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#0B2A4A]/5 flex items-center justify-between text-xs text-[#0B2A4A]/60">
            <span>Database status</span>
            <span className="font-semibold text-[#0B2A4A]">
              {storageSource === 'supabase' ? 'Supabase Cloud DB' : 'Encrypted Storage'}
            </span>
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="bg-white rounded-2xl border border-[#0B2A4A]/10 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B2A4A]/60">
              Registration Portal
            </span>
            <p className="mt-2 text-xs text-[#0B2A4A]/70 leading-relaxed">
              Open the user side to test new account registrations in real time.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateHome}
            className="mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#E30613] hover:bg-[#c40510] active:scale-[0.98] transition-all text-center cursor-pointer shadow-sm"
          >
            Open Sign Up Page
          </button>
        </div>
      </div>

      {/* Registration Table Container */}
      <div className="mt-8 bg-white rounded-2xl border border-[#0B2A4A]/10 shadow-[0_8px_30px_rgba(11,42,74,0.04)] overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-[#0B2A4A]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0B2A4A]/40">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email..."
              className="w-full pl-9 pr-4 py-2 bg-white text-xs text-[#0B2A4A] rounded-lg border border-[#0B2A4A]/15 focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
            />
          </div>

          <div className="text-xs text-[#0B2A4A]/60 font-medium">
            Showing <span className="font-bold text-[#0B2A4A]">{filteredUsers.length}</span> of{' '}
            <span className="font-bold text-[#0B2A4A]">{users.length}</span> users
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#0B2A4A]/20 border-t-[#E30613] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-semibold text-[#0B2A4A]">Querying user database...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          /* EMPTY STATE */
          <div className="p-12 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-xl bg-[#0B2A4A]/5 mx-auto flex items-center justify-center text-[#0B2A4A]/40 mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#0B2A4A]">No Registered Users Found</h3>
            <p className="mt-1 text-xs text-[#0B2A4A]/60">
              {searchQuery
                ? `No user found matching "${searchQuery}".`
                : 'No accounts have been registered yet.'}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="mt-4 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#E30613] hover:bg-[#c40510] transition-colors cursor-pointer"
              >
                Register First User
              </button>
            )}
          </div>
        ) : (
          /* RESPONSIVE TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B2A4A]/5 border-b border-[#0B2A4A]/10 text-[#0B2A4A] font-bold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 px-6">
                    User Email Address
                  </th>
                  <th scope="col" className="py-3.5 px-6">
                    Signup Date &amp; Time
                  </th>
                  <th scope="col" className="py-3.5 px-6 text-right">
                    Account Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B2A4A]/5">
                {filteredUsers.map((u, idx) => {
                  const dateObj = new Date(u.created_at);
                  const formattedDate = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Recent';
                  const formattedTime = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '';

                  return (
                    <tr
                      key={u.id || idx}
                      className="hover:bg-[#0B2A4A]/[0.02] transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-[#0B2A4A]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#0B2A4A]/30" />
                          <span className="text-sm font-medium">{u.email}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-[#0B2A4A]/75 font-mono-tabular">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#0B2A4A]/40" />
                          <span>{formattedDate}</span>
                          {formattedTime && (
                            <span className="text-[#0B2A4A]/40">· {formattedTime}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right font-medium">
                        <span className="text-[#0B2A4A] font-semibold">Active Member</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
