import { useMutation, useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { StatusBadge } from '../components/ui/StatusBadge';
import {
  CREATE_TRANSACTION_MUTATION,
  REVERSE_TRANSACTION_MUTATION,
  TRANSACTIONS_QUERY,
} from '../graphql/operations';
import { formatAmount, formatDate } from '../lib/format';
import type { Transaction, TransactionConnection, TransactionStatus } from '../types';

const LIMIT = 10;
const STATUSES: (TransactionStatus | 'all')[] = ['all', 'pending', 'posted', 'reversed'];

export const TransactionsPage = () => {
  const [activeStatus, setActiveStatus] = useState<TransactionStatus | 'all'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [confirmReverse, setConfirmReverse] = useState<Transaction | null>(null);
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');

  const variables = {
    status: activeStatus === 'all' ? undefined : activeStatus,
    limit: LIMIT,
    after: null,
  };

  const { data, loading, fetchMore } = useQuery<{ transactions: TransactionConnection }>(
    TRANSACTIONS_QUERY,
    { variables, notifyOnNetworkStatusChange: true },
  );

  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION_MUTATION, {
    refetchQueries: [{ query: TRANSACTIONS_QUERY, variables }],
  });

  const [reverseTransaction, { loading: reversing }] = useMutation(REVERSE_TRANSACTION_MUTATION, {
    refetchQueries: [{ query: TRANSACTIONS_QUERY, variables }],
  });

  const transactions = data?.transactions;
  const items = transactions?.items ?? [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTransaction({
        variables: {
          merchant,
          amount: Math.round(parseFloat(amount) * 100),
          idempotencyKey: `${Date.now()}-${merchant}`,
        },
      });
      toast.success('Transaction created.');
      setShowCreate(false);
      setMerchant('');
      setAmount('');
    } catch {
      toast.error('Failed to create transaction.');
    }
  };

  const handleReverse = async () => {
    if (!confirmReverse) return;
    try {
      await reverseTransaction({ variables: { id: confirmReverse.id } });
      toast.success('Transaction reversed.');
      setConfirmReverse(null);
    } catch {
      toast.error('Failed to reverse transaction.');
    }
  };

  const loadMore = () => {
    fetchMore({
      variables: { ...variables, after: transactions?.pageInfo.endCursor },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700"
        >
          + New
        </button>
      </div>

      <div className="flex gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              activeStatus === s
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-400'
            }`}
          >
            {s}
          </button>
        ))}
        {transactions && (
          <span className="ml-auto text-sm text-gray-400 self-center">
            {transactions.totalCount} total
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading && items.length === 0 ? (
          <p className="text-sm text-gray-500 p-6">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500 p-6">No transactions found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Date', 'Merchant', 'Amount', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(({ cursor, transaction: tx }) => (
                <tr key={cursor} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{formatDate(tx.date)}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{tx.merchant}</td>
                  <td className="px-4 py-3 text-gray-900">{formatAmount(tx.amount)}</td>
                  <td className="px-4 py-3"><StatusBadge status={tx.status} /></td>
                  <td className="px-4 py-3 text-right">
                    {tx.status === 'posted' && (
                      <button
                        onClick={() => setConfirmReverse(tx)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Reverse
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {transactions?.pageInfo.hasNextPage && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={loadMore}
              disabled={loading}
              className="text-sm text-indigo-600 hover:underline disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">New Transaction</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Merchant</label>
                <input
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Shoprite"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 5000"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowCreate(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmReverse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Reverse Transaction?</h2>
            <p className="text-sm text-gray-600">
              Reverse <strong>{confirmReverse.merchant}</strong> for{' '}
              <strong>{formatAmount(confirmReverse.amount)}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmReverse(null)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button
                onClick={handleReverse}
                disabled={reversing}
                className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {reversing ? 'Reversing…' : 'Reverse'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
