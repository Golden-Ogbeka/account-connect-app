import { useId, useState, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';

export const CreateTransactionModal = ({
  open,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (input: { merchant: string; amountKobo: number; idempotencyKey: string }) => void;
}) => {
  const merchantId = useId();
  const amountId = useId();
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');

  const handleClose = () => {
    setMerchant('');
    setAmount('');
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const m = merchant.trim();
    const n = Number(amount);
    if (!m || !n) return;
    onSubmit({ merchant: m, amountKobo: Math.round(n * 100), idempotencyKey: crypto.randomUUID() });
  };

  const canSubmit = Boolean(merchant.trim()) && Number(amount) > 0 && !loading;

  return (
    <Modal
      open={open}
      title="New transaction"
      description="Amount is entered in naira and converted to kobo. A unique idempotency key is generated per submission."
      onClose={handleClose}
      footer={
        <>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-tx-form"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            disabled={!canSubmit}
          >
            {loading ? 'Creating…' : 'Create transaction'}
          </button>
        </>
      }
    >
      <form id="create-tx-form" className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor={merchantId} className="block text-xs font-medium text-slate-600">Merchant</label>
          <input
            id={merchantId}
            type="text"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="e.g. Shoprite"
            required
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
          />
        </div>
        <div>
          <label htmlFor={amountId} className="block text-xs font-medium text-slate-600">Amount (₦)</label>
          <input
            id={amountId}
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000"
            required
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
          />
        </div>
      </form>
    </Modal>
  );
};
