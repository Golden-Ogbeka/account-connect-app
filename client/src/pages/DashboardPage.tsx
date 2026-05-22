import { useMutation, useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '../components/ui/Modal';
import { ACCOUNT_QUERY, PROFILE_QUERY, UPDATE_ACCOUNT_MUTATION } from '../graphql/operations';
import { formatAmount } from '../lib/format';
import type { Account, User } from '../types';

export const DashboardPage = () => {
  const { data: profileData, loading: profileLoading } = useQuery<{ profile: User }>(PROFILE_QUERY);
  const { data: accountData, loading: accountLoading } = useQuery<{ account: Account }>(ACCOUNT_QUERY);
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const [updateAccount, { loading: saving }] = useMutation(UPDATE_ACCOUNT_MUTATION, {
    refetchQueries: [{ query: ACCOUNT_QUERY }],
  });

  const account = accountData?.account;
  const profile = profileData?.profile;
  const loading = profileLoading || accountLoading;

  const startEdit = () => {
    setAddress(account?.address ?? '');
    setDescription(account?.description ?? '');
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateAccount({ variables: { address, description } });
      toast.success('Account updated.');
      setEditing(false);
    } catch {
      toast.error('Failed to update account.');
    }
  };

  const initials = profile?.name
    ? profile.name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('')
    : '…';

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero */}
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.9fr)]">
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700">
              Account overview
            </span>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
                {loading ? 'Loading…' : `Welcome, ${profile?.name ?? 'Account holder'}.`}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Review your account balance, update your details, and manage your financial activity from one place.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200/80 bg-white/92 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Balance</div>
          <div className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
            {accountLoading ? '…' : formatAmount(account?.balance ?? 0)}
          </div>
          <div className="mt-2 text-sm text-slate-500">{account?.account_number ?? '—'}</div>
        </div>
      </section>

      {/* Account card */}
      {account && (
        <section className="rounded-[28px] border border-white/70 bg-white/92 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#0f172a_0%,#155e75_100%)] text-xl font-semibold text-white shadow-[0_20px_40px_-24px_rgba(8,47,73,0.8)]">
                {initials}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Account holder</div>
                <div className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-950">{account.account_name}</div>
              </div>
            </div>
            <button
              onClick={startEdit}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Edit
            </button>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Account number</dt>
              <dd className="mt-3 font-mono text-base font-medium text-slate-950">{account.account_number}</dd>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Email</dt>
              <dd className="mt-3 break-words text-base font-medium text-slate-950">{profile?.email ?? '—'}</dd>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Address</dt>
              <dd className="mt-3 text-base font-medium text-slate-950">{account.address ?? '—'}</dd>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Description</dt>
              <dd className="mt-3 text-base font-medium text-slate-950">{account.description ?? '—'}</dd>
            </div>
          </dl>
        </section>
      )}

      <Modal
        open={editing}
        title="Edit account"
        description="Update your address and description."
        onClose={() => setEditing(false)}
        footer={
          <>
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
