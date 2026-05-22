import clsx from 'clsx';
import type { TransactionStatus } from '../../types';

const styles: Record<TransactionStatus, string> = {
  posted: 'bg-emerald-50 text-emerald-800 ring-emerald-600/10',
  pending: 'bg-amber-50 text-amber-900 ring-amber-600/10',
  reversed: 'bg-rose-50 text-rose-800 ring-rose-600/10',
};

const labels: Record<TransactionStatus, string> = {
  posted: 'Posted',
  pending: 'Pending',
  reversed: 'Reversed',
};

export const StatusBadge = ({ status }: { status: TransactionStatus }) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ring-1 ring-inset',
      styles[status],
    )}
  >
    {labels[status]}
  </span>
);
