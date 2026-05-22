import { formatAmount } from '../../lib/format';
import type { Transaction } from '../../types';
import { Modal } from '../ui/Modal';

export const ReverseConfirmModal = ({
  open,
  transaction,
  loading,
  onConfirm,
  onClose,
}: {
  open: boolean;
  transaction: Transaction | null;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) => (
  <Modal
    open={open}
    title="Reverse transaction"
    description="This will mark the transaction as reversed. This action is intended for corrections and disputes."
    onClose={onClose}
    footer={
      <>
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Reversing…' : 'Confirm reverse'}
        </button>
      </>
    }
  >
    {transaction ? (
      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium text-slate-500">Merchant</dt>
          <dd className="mt-1 text-slate-900">{transaction.merchant}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Amount</dt>
          <dd className="mt-1 tabular-nums text-slate-900">{formatAmount(transaction.amount)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium text-slate-500">Reference</dt>
          <dd className="mt-1 font-mono text-xs text-slate-700">{transaction.id}</dd>
        </div>
      </dl>
    ) : null}
  </Modal>
);
