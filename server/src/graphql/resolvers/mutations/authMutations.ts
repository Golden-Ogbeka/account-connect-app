import { authenticateUserService } from '../../../services';
import { User } from '../../../types';
import { signToken } from '../../../utils/auth';

export const authMutations = {
  login: async (_: unknown, { email, password }: { email: string; password: string }) => {
    const user = await authenticateUserService(email, password);
    const token = signToken(user as User);
    const { password: _p, ...userSafe } = user;
    return { token, user: userSafe };
  },
};
