import { createContext, ReactNode, useContext, useState } from "react";
import { UserData } from "../src/assets/types";
import { getUserData } from "../src/assets/helpers";

/* ------------------ 🧾 Types ------------------ */

interface UserContextType {
  user: UserData | null;
  setUser: (data: UserData | null) => void;
  logout: () => void;
}

/* ------------------ ⚙️ Context ------------------ */

const UserContext = createContext<UserContextType | undefined>(undefined);

/* ------------------ 🧠 Provider ------------------ */

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<UserData | null>(() => getUserData());

  const setUser = (data: UserData | null) => {
    setUserState(data);
    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

/* ------------------ 🪄 Hook ------------------ */

export const useUser = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};
