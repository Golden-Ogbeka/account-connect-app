import { getFollowingService, isFollowingService } from '../../../services';
import { GraphQLContext } from '../../../types';
import { requireAuth } from '../../auth';

export const connectionQueries = {
  following: async (_: unknown, __: unknown, context: GraphQLContext) => {
    const user = requireAuth(context);
    const following = await getFollowingService(user.id);
    return Promise.all(
      following.map(async (u) => ({
        ...u,
        isFollowing: await isFollowingService(user.id, u.id),
      })),
    );
  },
};
