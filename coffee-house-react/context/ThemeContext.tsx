import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";

interface ThemeContextType {
  mode: "light" | "dark";
  updateMode: (mode: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("mode") as "light" | "dark") || "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("mode", mode);
  }, [mode]);

  const updateMode = (newMode: "light" | "dark") => setMode(newMode);

  return (
    <ThemeContext.Provider value={{ mode, updateMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
