import { useMutation, useQuery } from '@apollo/client/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CreateTransactionModal } from '../components/transactions/CreateTransactionModal';
import { ReverseConfirmModal } from '../components/transactions/ReverseConfirmModal';
import { StatusTabs, type StatusFilter } from '../components/transactions/StatusTabs';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TableSkeleton } from '../components/ui/Skeleton';
import {
  ACCOUNT_QUERY,
  CREATE_TRANSACTION_MUTATION,
  REVERSE_TRANSACTION_MUTATION,
  TRANSACTIONS_QUERY,
} from '../graphql/operations';
import type { Transaction, TransactionConnection } from '../types';

export const TransactionsPage = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [reverseTarget, setReverseTarget] = useState<Transaction | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const variables = useMemo(
    () => ({ status: statusFilter === 'all' ? undefined : statusFilter, limit: 10, after: undefined as string | undefined }),
    [statusFilter],
  );

  const { data, loading, error, refetch, fetchMore } = useQuery<{ transactions: TransactionConnection }>(
    TRANSACTIONS_QUERY,
    { variables, notifyOnNetworkStatusChange: true },
  );

  const [createTx, { loading: creating }] = useMutation(CREATE_TRANSACTION_MUTATION);
  const [reverseTx, { loading: reversing }] = useMutation(REVERSE_TRANSACTION_MUTATION, {
    // Update account balance in cache after reverse without a full refetch
    refetchQueries: [{ query: ACCOUNT_QUERY }],
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const items = data?.transactions.items ?? [];
  const rows: Transaction[] = items.map((e) => e.transaction);
  const totalCount = data?.transactions.totalCount ?? 0;
  const pageInfo = data?.transactions.pageInfo;

  const handleLoadMore = () => {
    void fetchMore({
      variables: { after: pageInfo?.endCursor },
      updateQuery: (prev, { fetchMoreResult }) => ({
        transactions: {
          ...fetchMoreResult.transactions,
          items: [...prev.transactions.items, ...fetchMoreResult.transactions.items],
        },
      }),
    });
  };

  const onCreateSubmit = async (input: { merchant: string; amountKobo: number; idempotencyKey: string }) => {
    try {
      const res = await createTx({
        variables: { merchant: input.merchant, amount: input.amountKobo, idempotencyKey: input.idempotencyKey },
      });
      if (!res.data) { toast.error('Could not create transaction.'); return; }
      toast.success('Transaction created.');
      setCreateOpen(false);
      await refetch();
    } catch {
      toast.error('Could not create transaction.');
    }
  };

  const onConfirmReverse = async () => {
    if (!reverseTarget) return;
    try {
      await reverseTx({ variables: { id: reverseTarget.id } });
      toast.success('Transaction reversed.');
      setReverseTarget(null);
      await refetch();
    } catch {
      toast.error('Could not reverse transaction.');
    }
  };

  const filterLabel = statusFilter === 'all'
    ? 'All transactions'
    : `${statusFilter.charAt(0).toUpperCase()}${statusFilter.slice(1)} transactions`;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero */}
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.9fr)]">
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
          <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700">
            Transaction intelligence
          </span>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
            Clear activity oversight, built for faster decisions.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Review account activity, isolate exceptions quickly, and reverse posted charges with a calmer, more focused workflow.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/92 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total records</div>
            <div className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{loading ? '…' : totalCount}</div>
          </div>
          <div className="rounded-[28px] border border-slate-200/80 bg-white/92 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Active filter</div>
            <div className="mt-4 text-xl font-semibold tracking-[-0.04em] text-slate-950">{filterLabel}</div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">View controls</div>
            <StatusTabs value={statusFilter} onChange={(s) => setStatusFilter(s)} />
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              {loading ? 'Updating…' : `${totalCount} total`}
            </div>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="shrink-0 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              New transaction
            </button>
          </div>
        </div>
      </section>

      {/* Error */}
      {error ? (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50/90 p-6 text-sm text-rose-900 shadow-[0_18px_60px_-48px_rgba(225,29,72,0.6)]" role="alert">
          <div className="font-semibold">Something went wrong</div>
          <p className="mt-1 text-rose-800">We couldn't load transactions. Check your connection and try again.</p>
          <button
            type="button"
            className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-900 ring-1 ring-rose-200 transition hover:bg-rose-50"
            onClick={() => void refetch()}
          >
            Retry
          </button>
        </div>
      ) : null}

      {/* Skeleton */}
      {loading && !data ? <TableSkeleton /> : null}

      {/* Empty */}
      {!error && data && totalCount === 0 ? (
        <div className="rounded-[28px] border border-slate-200/80 bg-white/92 p-10 text-center shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
          <div className="text-sm font-semibold text-slate-900">
            {statusFilter === 'all' ? 'No transactions yet' : 'Nothing in this view'}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {statusFilter === 'all'
              ? 'When activity appears on your account, it will show up here.'
              : 'Try a different status filter.'}
          </p>
          {statusFilter === 'all' ? (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="mt-6 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Create transaction
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Table */}
      {!error && rows.length > 0 ? (
        <div className="space-y-6">
          <TransactionTable rows={rows} onRequestReverse={(tx) => setReverseTarget(tx)} />
          {pageInfo?.hasNextPage ? (
            <div className="flex justify-center pb-4">
              <button
                type="button"
                onClick={() => void handleLoadMore()}
                disabled={loading}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50 transition"
              >
                {loading ? 'Loading…' : 'Load more'}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <CreateTransactionModal
        open={createOpen}
        loading={creating}
        onClose={() => setCreateOpen(false)}
        onSubmit={(input) => void onCreateSubmit(input)}
      />
      <ReverseConfirmModal
        open={Boolean(reverseTarget)}
        transaction={reverseTarget}
        loading={reversing}
        onClose={() => setReverseTarget(null)}
        onConfirm={() => void onConfirmReverse()}
      />
    </div>
  );
};
