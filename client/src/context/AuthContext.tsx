import { useMutation } from '@apollo/client/react';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { getToken, removeToken, setToken } from '../auth/storage';
import { LOGIN_MUTATION } from '../graphql/operations';
import type { AuthPayload, User } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginMutation] = useMutation<{ login: AuthPayload }>(LOGIN_MUTATION);

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({ variables: { email, password } });
    if (!data) throw new Error('Login failed');
    setToken(data.login.token);
    setUser(data.login.user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user || !!getToken() }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
