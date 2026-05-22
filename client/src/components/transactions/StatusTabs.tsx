import clsx from 'clsx';
import type { TransactionStatus } from '../../types';

export type StatusFilter = 'all' | TransactionStatus;

const tabs: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'posted', label: 'Posted' },
  { id: 'reversed', label: 'Reversed' },
];

export const StatusTabs = ({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (next: StatusFilter) => void;
}) => (
  <div
    className="inline-flex flex-wrap gap-1 rounded-[20px] border border-slate-200 bg-slate-50 p-1"
    role="tablist"
    aria-label="Filter by status"
  >
    {tabs.map((t) => {
      const selected = value === t.id;
      return (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={selected}
          className={clsx(
            'rounded-2xl px-4 py-2 text-sm font-semibold tracking-[-0.02em] transition',
            selected
              ? 'bg-slate-950 text-white shadow-[0_12px_24px_-18px_rgba(15,23,42,0.9)]'
              : 'text-slate-600 hover:bg-white hover:text-slate-900',
          )}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      );
    })}
  </div>
);
