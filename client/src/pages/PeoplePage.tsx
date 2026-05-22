import { useMutation, useQuery } from '@apollo/client/react';
import { toast } from 'sonner';
import { TableSkeleton } from '../components/ui/Skeleton';
import {
  FOLLOW_USER_MUTATION,
  FOLLOWING_QUERY,
  UNFOLLOW_USER_MUTATION,
  USERS_QUERY,
} from '../graphql/operations';
import type { User } from '../types';

export const PeoplePage = () => {
  const { data, loading, error } = useQuery<{ users: User[] }>(USERS_QUERY);

  const [followUser, { loading: following }] = useMutation(FOLLOW_USER_MUTATION, {
    refetchQueries: [{ query: USERS_QUERY }, { query: FOLLOWING_QUERY }],
  });

  const [unfollowUser, { loading: unfollowing }] = useMutation(UNFOLLOW_USER_MUTATION, {
    refetchQueries: [{ query: USERS_QUERY }, { query: FOLLOWING_QUERY }],
  });

  const busy = following || unfollowing;

  const handleToggle = async (user: User) => {
    try {
      if (user.isFollowing) {
        await unfollowUser({ variables: { userId: user.id } });
        toast.success(`Unfollowed ${user.name}.`);
      } else {
        await followUser({ variables: { userId: user.id } });
        toast.success(`Following ${user.name}.`);
      }
    } catch {
      toast.error('Action failed.');
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero */}
      <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
          Connections
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
          Discover people on the platform.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Follow other users to build your network. Your following list updates instantly.
        </p>
      </section>

      {error ? (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50/90 p-6 text-sm text-rose-900" role="alert">
          <div className="font-semibold">Could not load users.</div>
        </div>
      ) : null}

      {loading ? <TableSkeleton rows={4} /> : null}

      {!loading && !error && (
        <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/94 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur">
          {(data?.users ?? []).length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">No other users found.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {(data?.users ?? []).map((user) => (
                <div key={user.id} className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700">
                      {user.name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold tracking-[-0.02em] text-slate-950">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => void handleToggle(user)}
                    disabled={busy}
                    className={
                      user.isFollowing
                        ? 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50'
                        : 'rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50'
                    }
                  >
                    {user.isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
