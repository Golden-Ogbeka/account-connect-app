import { useAppDispatch, useAppSelector } from './useAppStore';
import { loginSuccess, logoutSuccess } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
    login: (token: string, user: { id: string; name: string; email: string }) =>
      dispatch(loginSuccess({ token, user })),
    logout: () => dispatch(logoutSuccess()),
  };
};
