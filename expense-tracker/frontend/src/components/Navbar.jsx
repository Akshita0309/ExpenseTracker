import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("ledger-theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("ledger-theme", theme);
  }, [theme]);

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <header className="navbar">
      <div className="navbar-search">
        <i className="ti ti-search" aria-hidden="true" />
        <input type="text" placeholder="Search transactions, categories..." />
      </div>
      <div className="navbar-actions">
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <i
            className={`ti ${theme === "dark" ? "ti-sun" : "ti-moon"}`}
            aria-hidden="true"
          />
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
        <button
          className={`icon-btn icon-only notification-btn ${theme === "dark" ? "dark" : "light"}`}
          title="Notifications"
        >
          <i className="ti ti-bell" aria-hidden="true" />
        </button>
        <div className="navbar-divider" />
        <div className="navbar-user">
          <div className="avatar">{initials}</div>
          <span>{user?.name}</span>
        </div>
        <button className="icon-btn" onClick={handleLogout}>
          <i className="ti ti-logout-2" aria-hidden="true" />
          Log out
        </button>
      </div>
    </header>
  );
}
