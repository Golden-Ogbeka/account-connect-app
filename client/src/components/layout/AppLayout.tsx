import { useApolloClient, useQuery } from '@apollo/client/react';
import clsx from 'clsx';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { PROFILE_QUERY } from '../../graphql/operations';
import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../types';

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard', description: 'Account & balance' },
  { to: '/transactions', label: 'Transactions', description: 'Activity & reversals' },
  { to: '/people', label: 'People', description: 'Discover & follow' },
  { to: '/following', label: 'Following', description: 'Your connections' },
] as const;

export const AppLayout = () => {
  const { logout, isAuthenticated } = useAuth();
  const client = useApolloClient();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data, loading } = useQuery<{ profile: User }>(PROFILE_QUERY, { skip: !isAuthenticated });

  const onLogout = async () => {
    await client.clearStore();
    logout();
  };

  const displayName = data?.profile?.name ?? 'Account';
  const currentSection =
    navigationItems.find((item) => location.pathname.startsWith(item.to))?.label ?? 'Workspace';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_26%),linear-gradient(180deg,#f7fafc_0%,#eef4f7_100%)]">
      <div className="mx-auto flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="hidden w-full max-w-[300px] shrink-0 border-r border-white/60 bg-slate-950 text-slate-100 shadow-[28px_0_80px_-48px_rgba(15,23,42,0.9)] lg:flex lg:flex-col sticky top-0 h-screen">
          <div className="border-b border-white/10 px-8 pb-8 pt-10">
            <Link to="/dashboard" className="inline-flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
                AccountConnect
              </span>
              <span className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
                Control center
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">
              A calmer workspace for managing your account, transactions, and connections.
            </p>
          </div>

          <nav className="flex-1 px-5 py-6" aria-label="Primary">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'group flex rounded-[22px] border px-5 py-4 transition',
                      isActive
                        ? 'border-cyan-300/20 bg-white/10 shadow-[0_20px_40px_-28px_rgba(34,211,238,0.65)]'
                        : 'border-transparent bg-transparent hover:border-white/10 hover:bg-white/5',
                    )
                  }
                >
                  {({ isActive }) => (
                    <div>
                      <div className={clsx('text-sm font-semibold tracking-[-0.02em]', isActive ? 'text-white' : 'text-slate-100')}>
                        {item.label}
                      </div>
                      <div className={clsx('mt-1 text-sm leading-5', isActive ? 'text-cyan-100/85' : 'text-slate-400')}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="border-t border-white/10 px-8 py-6">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Signed in as</div>
              <div className="mt-3 text-base font-semibold text-white">{loading ? 'Loading…' : displayName}</div>
              {data?.profile?.email ? (
                <div className="mt-1 break-words text-sm text-slate-400">{data.profile.email}</div>
              ) : null}
              <button
                type="button"
                onClick={() => void onLogout()}
                className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/70 bg-white/78 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10 lg:py-5">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 lg:hidden">
                  AccountConnect
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen((o) => !o)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] transition hover:bg-slate-50 lg:hidden"
                    aria-expanded={mobileNavOpen}
                    aria-label="Toggle navigation"
                  >
                    <span className="text-lg leading-none">{mobileNavOpen ? '×' : '☰'}</span>
                  </button>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold tracking-[-0.04em] text-slate-950 sm:text-2xl">{currentSection}</div>
                    <div className="truncate text-sm text-slate-500">{loading ? 'Loading account…' : displayName}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-semibold text-slate-900">{loading ? '…' : displayName}</div>
                  {data?.profile?.email ? <div className="text-xs text-slate-500">{data.profile.email}</div> : null}
                </div>
                <button
                  type="button"
                  onClick={() => void onLogout()}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] transition hover:bg-slate-50"
                >
                  Sign out
                </button>
              </div>
            </div>

            {/* Mobile nav dropdown */}
            <div
              className={clsx(
                'overflow-hidden border-t border-slate-200 bg-white/96 px-4 transition-[max-height,opacity] duration-200 lg:hidden',
                mobileNavOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0',
              )}
            >
              <nav className="space-y-2" aria-label="Mobile primary">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileNavOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'block rounded-[20px] border px-4 py-3 transition',
                        isActive
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-800',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="text-sm font-semibold">{item.label}</div>
                        <div className={clsx('mt-1 text-sm', isActive ? 'text-slate-300' : 'text-slate-500')}>
                          {item.description}
                        </div>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
