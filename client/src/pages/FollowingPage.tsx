import { useMutation, useQuery } from '@apollo/client/react';
import { toast } from 'sonner';
import { TableSkeleton } from '../components/ui/Skeleton';
import { FOLLOWING_QUERY, UNFOLLOW_USER_MUTATION, USERS_QUERY } from '../graphql/operations';
import type { User } from '../types';

export const FollowingPage = () => {
  const { data, loading, error } = useQuery<{ following: User[] }>(FOLLOWING_QUERY);

  const [unfollowUser, { loading: unfollowing }] = useMutation(UNFOLLOW_USER_MUTATION, {
    refetchQueries: [{ query: FOLLOWING_QUERY }, { query: USERS_QUERY }],
  });

  const handleUnfollow = async (user: User) => {
    try {
      await unfollowUser({ variables: { userId: user.id } });
      toast.success(`Unfollowed ${user.name}.`);
    } catch {
      toast.error('Failed to unfollow.');
    }
  };

  const following = data?.following ?? [];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero */}
      <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
        <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Your network
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
          People you follow.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Manage your connections. Unfollow anyone at any time.
        </p>
      </section>

      {error ? (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50/90 p-6 text-sm text-rose-900" role="alert">
          <div className="font-semibold">Could not load following list.</div>
        </div>
      ) : null}

      {loading ? <TableSkeleton rows={4} /> : null}

      {!loading && !error && following.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200/80 bg-white/92 p-10 text-center shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
          <div className="text-sm font-semibold text-slate-900">Not following anyone yet</div>
          <p className="mt-2 text-sm text-slate-600">Head to the People page to discover and follow users.</p>
        </div>
      ) : null}

      {!loading && !error && following.length > 0 ? (
        <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/94 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="divide-y divide-slate-100">
            {following.map((user) => (
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
                  onClick={() => void handleUnfollow(user)}
                  disabled={unfollowing}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
