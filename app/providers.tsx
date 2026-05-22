/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyTheme(nextTheme: Theme) {
  document.documentElement.classList.toggle("light", nextTheme === "light");
  document.documentElement.style.colorScheme = nextTheme;
}

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0d6bde",
      light: "#0f89ff",
      dark: "#0a5cb8",
    },
    secondary: {
      main: "#059669",
      light: "#10b981",
      dark: "#047857",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
    divider: "#e2e8f0",
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "32px",
      fontWeight: 950,
    },
    h2: {
      fontSize: "24px",
      fontWeight: 900,
    },
    h3: {
      fontSize: "20px",
      fontWeight: 800,
    },
    body1: {
      fontSize: "16px",
      fontWeight: 500,
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          borderRadius: "12px",
        },
        contained: {
          boxShadow: "0 4px 12px rgba(13, 107, 222, 0.3)",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(13, 107, 222, 0.4)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: "13px",
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#0d6bde",
    },
    secondary: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#cbd5e1",
    },
    divider: "#334155",
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "32px",
      fontWeight: 950,
    },
    h2: {
      fontSize: "24px",
      fontWeight: 900,
    },
    h3: {
      fontSize: "20px",
      fontWeight: 800,
    },
    body1: {
      fontSize: "16px",
      fontWeight: 500,
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          borderRadius: "12px",
        },
        contained: {
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: "13px",
        },
      },
    },
  },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    const initialTheme: Theme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme: Theme = prev === "dark" ? "light" : "dark";

      localStorage.setItem("theme", nextTheme);
      applyTheme(nextTheme);

      return nextTheme;
    });
  };

  const muiTheme = useMemo(
    () => (theme === "dark" ? darkTheme : lightTheme),
    [theme]
  );

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}