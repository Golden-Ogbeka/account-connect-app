import type { TransactionStatus } from '../../types';

const STATUS_STYLES: Record<TransactionStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  posted: 'bg-green-100 text-green-800',
  reversed: 'bg-red-100 text-red-800',
};

export const StatusBadge = ({ status }: { status: TransactionStatus }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status]}`}>
    {status}
  </span>
);
