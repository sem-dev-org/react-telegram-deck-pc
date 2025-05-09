import React, { createContext, useContext, useEffect, useState } from 'react';
import { verifyTelegramUser } from '../api/auth';
import { IUser, IUserStatus } from '../types/auth';
import { isTMA } from '@telegram-apps/sdk-react';
import FailedToLoadPage from '@/pages/informationPage/failedToLoadPage';
import { signIn, signOut, signStatus, signUser } from '@/cookies/sign';

interface AuthContextType {
  user: IUser | null;
  status: IUserStatus | null;
  // token: string;
  isLoading: boolean;
  error: Error | null;
  authenticated: boolean;
  updateUser: (obj: IUser) => void;
  updateStatus: (obj: IUserStatus) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [status, setStatus] = useState<IUserStatus | null>(null);
  // const [token, setToken] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function verifyUser() {
      try {
        setIsLoading(true);
        const response = await verifyTelegramUser();

        if (response.code === 0) {
          setUser(response.user);
          setStatus(response.status);
          // setToken(response.data.token);

          // 保存认证信息到 localStorage
          const obj = {
            user: response.user,
            status: response.status,
            username: response.data.username,
            token: response.data.token,
          };
          signIn(obj);
        } else {
          signOut();
          throw new Error(response.msg);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to verify user'));
      } finally {
        setIsLoading(false);
        setAuthenticated(true);
      }
    }

    async function checkAuth() {
      if (await isTMA()) {
        verifyUser();
      }
    }

    checkAuth();
  }, []);

  const updateUser = async (obj: IUser) => {
    setUser(obj);
    signUser(obj);
  };

  const updateStatus = async (obj: IUserStatus) => {
    setStatus(obj);
    signStatus(obj);
  };

  return (
    <AuthContext.Provider value={{ user, status, isLoading, error, updateUser, updateStatus, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return (<FailedToLoadPage />) as unknown as AuthContextType;
  }
  return context;
}
