import { useMutation, useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ACCOUNT_QUERY, PROFILE_QUERY, UPDATE_ACCOUNT_MUTATION } from '../graphql/operations';
import { formatAmount } from '../lib/format';
import type { Account, User } from '../types';

export const DashboardPage = () => {
  const { data: profileData } = useQuery<{ profile: User }>(PROFILE_QUERY);
  const { data: accountData, loading } = useQuery<{ account: Account }>(ACCOUNT_QUERY);
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [updateAccount, { loading: saving }] = useMutation(UPDATE_ACCOUNT_MUTATION, {
    refetchQueries: [{ query: ACCOUNT_QUERY }],
  });

  const account = accountData?.account;
  const profile = profileData?.profile;

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

  if (loading) return <p className="text-gray-500 text-sm">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile?.name ?? '…'}</h1>
        <p className="text-sm text-gray-500">{profile?.email}</p>
      </div>

      {account && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Account</h2>
            <button onClick={startEdit} className="text-sm text-indigo-600 hover:underline">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Account name</p>
              <p className="font-medium text-gray-900">{account.account_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Account number</p>
              <p className="font-medium text-gray-900">{account.account_number}</p>
            </div>
            <div>
              <p className="text-gray-500">Balance</p>
              <p className="text-2xl font-bold text-indigo-600">{formatAmount(account.balance)}</p>
            </div>
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium text-gray-900">{account.address ?? '—'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">Description</p>
              <p className="font-medium text-gray-900">{account.description ?? '—'}</p>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Edit Account</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setEditing(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
