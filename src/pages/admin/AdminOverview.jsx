import { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserShield,
  FaBuilding,
  FaUserClock,
} from "react-icons/fa";
import { getAdminStats } from "../../services/adminService";

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const data = await getAdminStats();
        if (isMounted) setStats(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="admin-skeleton-row" />
        <div className="admin-skeleton-row" />
        <div className="admin-skeleton-row" />
      </div>
    );
  }

  if (error) {
    return <div className="admin-toast admin-toast-error">{error}</div>;
  }

  return (
    <>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="stat-value">{stats.employees.active}</span>
          <span className="stat-label">
            <FaUsers /> Active Employees
          </span>
          <span className="stat-sub">{stats.employees.total} total on record</span>
        </div>

        <div className="admin-stat-card">
          <span className="stat-value">{stats.users.active}</span>
          <span className="stat-label">
            <FaUserShield /> Active Accounts
          </span>
          <span className="stat-sub">{stats.users.admins} Admin account(s)</span>
        </div>

        <div className="admin-stat-card">
          <span className="stat-value">{stats.departments.active}</span>
          <span className="stat-label">
            <FaBuilding /> Departments
          </span>
          <span className="stat-sub">{stats.departments.total} on record</span>
        </div>

        <div className="admin-stat-card">
          <span className="stat-value">{stats.pendingRegistrations}</span>
          <span className="stat-label">
            <FaUserClock /> Pending Registrations
          </span>
          <span className="stat-sub">Employees without an account yet</span>
        </div>
      </div>

      <div className="admin-panel-grid">
        <div className="admin-panel">
          <h2>Department Breakdown</h2>

          {stats.departments.breakdown.length === 0 ? (
            <p className="admin-empty-state">No departments yet.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Employees</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.departments.breakdown.map((dept) => (
                    <tr key={dept.name}>
                      <td>{dept.name}</td>
                      <td>{dept.employee_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-panel">
          <h2>Recent News</h2>

          {stats.recentNews.length === 0 ? (
            <p className="admin-empty-state">No news published yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {stats.recentNews.map((item) => (
                <li
                  key={item.id}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-light)",
                  }}
                >
                  <strong>{item.title}</strong>
                  <div style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
                    {item.category} ·{" "}
                    {new Date(item.created_date).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminOverview;
