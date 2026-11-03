import { createContext, useContext, useState, useEffect } from 'react';
import api, { getCsrfCookie } from '../lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/user')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    await getCsrfCookie();
    const res = await api.post('/api/login', { email, password });
    setUser(res.data);
  };

  const register = async (name, email, password, password_confirmation) => {
    await getCsrfCookie();
    const res = await api.post('/api/register', { name, email, password, password_confirmation });
    setUser(res.data);
  };

  const logout = async () => {
    await api.post('/api/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);