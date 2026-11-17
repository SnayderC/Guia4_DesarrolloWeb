import { createContext, useCallback, useContext, useState } from 'react';

const AuthContext = createContext(null);
const TOKEN_KEY = 'token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  // Aviso que se muestra en el login al cerrar la sesión (manual o por token inválido/expirado)
  const [notice, setNotice] = useState(null);

  const login = useCallback((newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setNotice(null);
  }, []);

  const logout = useCallback((message = null) => {
    localStorage.removeItem(TOKEN_KEY);
    setNotice(message);
    setToken(null);
  }, []);

  return <AuthContext.Provider value={{ token, notice, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
