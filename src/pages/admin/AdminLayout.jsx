import { NavLink, Outlet } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import "../../styles/admin.css";

const TABS = [
  { label: "Overview", path: "/admin" },
  { label: "Employees", path: "/admin/employees" },
  { label: "Users & Roles", path: "/admin/users" },
  { label: "Departments", path: "/admin/departments" },
  { label: "Content", path: "/add-content" },
];

function AdminLayout() {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Center</h1>
          <p>Manage employees, user accounts, roles and departments.</p>
        </div>

        <span className="admin-badge">
          <FaShieldAlt /> Admin access
        </span>
      </div>

      <nav className="admin-tabs">
        {TABS.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === "/admin"}
            className={({ isActive }) =>
              `admin-tab${isActive ? " active" : ""}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}

export default AdminLayout;
