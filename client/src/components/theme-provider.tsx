import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => undefined,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
}: ThemeProviderProps) {
  const readStored = (): Theme => {
    if (typeof window === "undefined") return defaultTheme;
    const raw = localStorage.getItem(storageKey);
    if (raw === "dark" || raw === "light" || raw === "system") return raw;
    return defaultTheme;
  };

  const [theme, setTheme] = useState<Theme>(readStored);

  // robust apply function
  const applyThemeToRoot = (t: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (t === "system") {
      const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(sys);
      console.debug("[Theme] applied system ->", sys);
      return;
    }
    root.classList.add(t);
    console.debug("[Theme] applied ->", t);
  };

  useEffect(() => {
    // apply at mount and when theme changes
    applyThemeToRoot(theme);

    // keep storage in sync
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      console.warn("[Theme] localStorage write failed", e);
    }

    // listen for system changes if theme === system
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (theme === "system") {
        applyThemeToRoot("system");
      }
    };
    // support both addEventListener & addListener for older env
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [theme, storageKey]);

  // exposed setter that updates state + storage (already done in effect but keep setter safe)
  const setThemeAndStore = (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (e) {}
  };

  const value: ThemeProviderState = { theme, setTheme: setThemeAndStore };

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
