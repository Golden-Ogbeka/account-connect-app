import { formatAmount, formatShortDate } from '../../lib/format';
import type { Transaction } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

export const TransactionTable = ({
  rows,
  onRequestReverse,
}: {
  rows: Transaction[];
  onRequestReverse: (tx: Transaction) => void;
}) => (
  <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/94 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur">
    {/* Mobile cards */}
    <div className="border-b border-slate-200/80 px-5 py-4 sm:hidden">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Transactions</div>
    </div>
    <div className="divide-y divide-slate-100 sm:hidden">
      {rows.map((tx) => (
        <article key={tx.id} className="space-y-4 px-5 py-5" aria-label={`Transaction ${tx.merchant}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="text-base font-semibold tracking-[-0.02em] text-slate-950">{tx.merchant}</div>
              <div className="text-sm text-slate-500">{formatShortDate(tx.date)}</div>
            </div>
            <div className="text-right">
              <div className="text-base font-semibold tracking-[-0.03em] text-slate-950">{formatAmount(tx.amount)}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StatusBadge status={tx.status} />
            {tx.status === 'posted' ? (
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-24px_rgba(15,23,42,0.7)] transition hover:bg-slate-800"
                onClick={() => onRequestReverse(tx)}
              >
                Reverse
              </button>
            ) : (
              <span className="text-sm text-slate-400">No action</span>
            )}
          </div>
        </article>
      ))}
    </div>

    {/* Desktop table */}
    <div className="hidden overflow-x-auto sm:block">
      <table className="min-w-[760px] w-full border-collapse text-left text-sm" role="table" aria-label="Transactions">
        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <tr className="text-xs uppercase tracking-[0.18em] text-slate-500">
            <th scope="col" className="px-6 py-4 font-semibold">Date</th>
            <th scope="col" className="px-6 py-4 font-semibold">Merchant</th>
            <th scope="col" className="px-6 py-4 font-semibold">Amount</th>
            <th scope="col" className="px-6 py-4 font-semibold">Status</th>
            <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((tx) => (
            <tr key={tx.id} className="transition-colors hover:bg-slate-50/85">
              <td className="whitespace-nowrap px-6 py-4 text-slate-600">{formatShortDate(tx.date)}</td>
              <td className="px-6 py-4">
                <div className="font-semibold tracking-[-0.02em] text-slate-950">{tx.merchant}</div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-base font-semibold tracking-[-0.02em] text-slate-950 tabular-nums">
                {formatAmount(tx.amount)}
              </td>
              <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
              <td className="px-6 py-4 text-right">
                {tx.status === 'posted' ? (
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-900 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] transition hover:bg-slate-50"
                    onClick={() => onRequestReverse(tx)}
                  >
                    Reverse
                  </button>
                ) : (
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
