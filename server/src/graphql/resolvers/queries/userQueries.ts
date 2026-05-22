import { getAllUsersService, getUserByIdService } from '../../../services';
import { isFollowingService } from '../../../services/connectionService';
import { GraphQLContext } from '../../../types';
import { requireAuth } from '../../auth';

export const userQueries = {
  profile: (_: unknown, __: unknown, context: GraphQLContext) => {
    return requireAuth(context);
  },
  users: async (_: unknown, __: unknown, context: GraphQLContext) => {
    const user = requireAuth(context);
    const users = await getAllUsersService(user.id);
    return Promise.all(
      users.map(async (u) => ({
        ...u,
        isFollowing: await isFollowingService(user.id, u.id),
      })),
    );
  },
  user: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
    const currentUser = requireAuth(context);
    const user = await getUserByIdService(id);
    const { password: _p, ...userSafe } = user;
    return {
      ...userSafe,
      isFollowing: await isFollowingService(currentUser.id, id),
    };
  },
};
