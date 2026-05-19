import PropTypes from "prop-types";
import { createContext, useState, useEffect, useCallback } from "react";
import { authAPI, tokenStorage } from "../services/api.js";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const response = await authAPI.getMe();
    const serverUser = response.data?.user ?? response.data?.data?.user;
    if (!serverUser) {
      throw new Error("Unable to load authenticated user");
    }
    persistUser(serverUser);
    return serverUser;
  }, [persistUser]);

  const clearSession = useCallback(() => {
    tokenStorage.clearTokens();
    persistUser(null);
  }, [persistUser]);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          persistUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        await fetchCurrentUser();
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [clearSession, fetchCurrentUser, persistUser]);

  const login = useCallback(
    async (email, password) => {
      const response = await authAPI.login({ email, password });
      const payload = response.data ?? {};
      const accessToken = payload.accessToken ?? payload.data?.accessToken;
      const refreshToken = payload.refreshToken ?? payload.data?.refreshToken;
      const nextUser = payload.user ?? payload.data?.user;

      if (!accessToken || !refreshToken || !nextUser) {
        throw new Error(payload.message || "Login failed");
      }

      tokenStorage.setTokens({ accessToken, refreshToken });
      persistUser(nextUser);
      return payload;
    },
    [persistUser]
  );

  const register = useCallback(
    async (payloadOrName, emailArg, passwordArg, phoneArg) => {
      const registerPayload =
        typeof payloadOrName === "object"
          ? payloadOrName
          : {
              name: payloadOrName,
              email: emailArg,
              password: passwordArg,
              phone: phoneArg,
            };

      const response = await authAPI.register(registerPayload);
      const data = response.data ?? {};
      const accessToken = data.accessToken ?? data.data?.accessToken;
      const refreshToken = data.refreshToken ?? data.data?.refreshToken;
      const nextUser = data.user ?? data.data?.user;

      if (!accessToken || !refreshToken || !nextUser) {
        throw new Error(data.message || "Registration failed");
      }

      tokenStorage.setTokens({ accessToken, refreshToken });
      persistUser(nextUser);
      return data;
    },
    [persistUser]
  );

  const refreshAuth = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      clearSession();
      return null;
    }

    setIsRefreshing(true);
    try {
      const response = await authAPI.refreshToken(refreshToken);
      const payload = response.data ?? {};
      const accessToken = payload.accessToken ?? payload.data?.accessToken;
      const nextRefreshToken = payload.refreshToken ?? payload.data?.refreshToken;

      if (!accessToken) {
        throw new Error("Refresh token expired");
      }

      tokenStorage.setTokens({
        accessToken,
        refreshToken: nextRefreshToken || refreshToken,
      });

      return fetchCurrentUser();
    } catch (error) {
      clearSession();
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [clearSession, fetchCurrentUser]);

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      await authAPI.logout(refreshToken);
    } catch {
      // Ignore API errors; clear client state anyway.
    }

    clearSession();
  }, [clearSession]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const value = {
    user,
    setUser,
    login,
    register,
    refreshAuth,
    logout,
    clearSession,
    isAuthenticated,
    isAdmin,
    loading,
    isRefreshing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
