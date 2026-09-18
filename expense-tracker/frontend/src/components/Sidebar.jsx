import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "ti-layout-grid", end: true },
  { to: "/transactions", label: "Transactions", icon: "ti-list-details" },
  { to: "/budgets", label: "Budgets", icon: "ti-target-arrow" },
  { to: "/reports", label: "Reports", icon: "ti-chart-donut" },
  { to: "/profile", label: "Profile", icon: "ti-user-circle" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark" aria-label="Rupee logo">
          ₹
        </div>
        <div className="sidebar-brand-name">Ledger</div>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            <i className={`ti ${link.icon}`} aria-hidden="true" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-tip">
          <i className="ti ti-bulb" aria-hidden="true" />
          <span>Log expenses same-day for the most accurate reports.</span>
        </div>
      </div>
    </aside>
  );
}
