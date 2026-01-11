import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, RolePermissions } from '@/types';
import { validateMockCredentials } from '@/data/users';
import { getPermissions } from '@/utils/permissions';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  permissions: RolePermissions | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = validateMockCredentials(email, password);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('auth_user', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
  }, []);

  const permissions = user ? getPermissions(user.role) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        permissions,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
