import { followUserService, getUserByIdService, unfollowUserService } from '../../../services';
import { GraphQLContext } from '../../../types';
import { isFollowingService } from '../../../services/connectionService';
import { requireAuth } from '../../auth';

export const connectionMutations = {
  followUser: async (_: unknown, { userId }: { userId: string }, context: GraphQLContext) => {
    const user = requireAuth(context);
    await followUserService(user.id, userId);
    const target = await getUserByIdService(userId);
    const { password: _p, ...userSafe } = target;
    return { ...userSafe, isFollowing: true };
  },
  unfollowUser: async (_: unknown, { userId }: { userId: string }, context: GraphQLContext) => {
    const user = requireAuth(context);
    return unfollowUserService(user.id, userId);
  },
};
