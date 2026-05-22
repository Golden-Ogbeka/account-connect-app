import { useMutation, useQuery } from '@apollo/client/react';
import { toast } from 'sonner';
import { FOLLOWING_QUERY, UNFOLLOW_USER_MUTATION, USERS_QUERY } from '../graphql/operations';
import type { User } from '../types';

export const FollowingPage = () => {
  const { data, loading } = useQuery<{ following: User[] }>(FOLLOWING_QUERY);
  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
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

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;

  const following = data?.following ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Following</h1>
      {following.length === 0 ? (
        <p className="text-sm text-gray-500">You're not following anyone yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {following.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => handleUnfollow(user)}
                className="text-sm font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                Unfollow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
