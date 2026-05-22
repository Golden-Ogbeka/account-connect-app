import { useMutation } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LOGIN_MUTATION } from '../graphql/operations';
import { useAuth } from '../hooks/useAuth';
import type { AuthPayload } from '../types';

export const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [doLogin, { loading }] = useMutation<{ login: AuthPayload }>(LOGIN_MUTATION);

  useEffect(() => {
    if (sessionStorage.getItem('session_expired')) {
      sessionStorage.removeItem('session_expired');
      toast.error('Your session has expired. Please sign in again.');
    }
  }, []);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await doLogin({ variables: { email, password } });
      if (!res.data?.login) { toast.error('Invalid email or password.'); return; }
      login(res.data.login.token, res.data.login.user);
      toast.success('Signed in');
      navigate('/dashboard', { replace: true });
    } catch {
      toast.error('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbfc_0%,_#eef4f7_100%)]">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,480px)] lg:px-8">
        <section className="hidden lg:block">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700 backdrop-blur">
              Account Connect
            </span>
            <h1 className="text-5xl font-semibold tracking-[-0.06em] text-slate-950">
              Social banking with a calmer, focused workspace.
            </h1>
            <p className="text-base leading-7 text-slate-600">
              Sign in to manage your account, review transactions, and connect with people on the platform.
            </p>
          </div>
        </section>

        <div className="rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_32px_90px_-52px_rgba(15,23,42,0.5)] backdrop-blur sm:p-10">
          <div className="mb-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700 lg:hidden">Account Connect</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950">Sign in</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Use your account credentials to access your workspace.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => void onSubmit(e)}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] outline-none transition focus:border-cyan-700 focus:ring-4 focus:ring-cyan-100"
                placeholder="you@connect.ng"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Password</label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-900 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] outline-none transition focus:border-cyan-700 focus:ring-4 focus:ring-cyan-100"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.8)] transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
