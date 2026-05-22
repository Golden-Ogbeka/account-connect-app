import { useMutation, useQuery } from '@apollo/client/react';
import { toast } from 'sonner';
import { FOLLOW_USER_MUTATION, UNFOLLOW_USER_MUTATION, USERS_QUERY } from '../graphql/operations';
import type { User } from '../types';

export const PeoplePage = () => {
  const { data, loading } = useQuery<{ users: User[] }>(USERS_QUERY);
  const [followUser] = useMutation(FOLLOW_USER_MUTATION, { refetchQueries: [{ query: USERS_QUERY }] });
  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, { refetchQueries: [{ query: USERS_QUERY }] });

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

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">People</h1>
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {(data?.users ?? []).map((user) => (
          <div key={user.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={() => handleToggle(user)}
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                user.isFollowing
                  ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {user.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
