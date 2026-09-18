import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("ledger-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    document.body.setAttribute("data-theme", theme);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ExpenseProvider>
          <AppRoutes />
        </ExpenseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
