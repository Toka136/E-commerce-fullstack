"use client";

import { createContext, useContext } from "react";

type AuthContextType = {
  isGuest: boolean;
  user: any | null;
};

const AuthContext = createContext<AuthContextType>({
  isGuest: true,
  user: null,
});

export function AuthProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any | null;
}) {
  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest: !user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);