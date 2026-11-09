import { useEffect, useState } from "react";
import { FaUserPlus, FaUserCheck, FaUserSlash } from "react-icons/fa";
import {
  getManagedUsers,
  updateUserRole,
  updateUserStatus,
  inviteUser,
} from "../../services/adminService";
import { getCurrentUser } from "../../services/authService";
import AdminModal from "../../components/admin/AdminModal";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Employee");
  const [inviteError, setInviteError] = useState("");

  const [confirmTarget, setConfirmTarget] = useState(null);

  const currentUser = getCurrentUser();

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getManagedUsers();
      setUsers(data);
    } catch (err) {
      setToast({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleRoleChange(user, newRole) {
    try {
      await updateUserRole(user.id, newRole);
      setToast({ type: "success", text: `Role updated to ${newRole}.` });
      loadUsers();
    } catch (err) {
      setToast({ type: "error", text: err.message });
    }
  }

  async function handleStatusToggle(user) {
    try {
      await updateUserStatus(user.id, !user.is_active);
      setToast({
        type: "success",
        text: user.is_active ? "Account deactivated." : "Account activated.",
      });
      setConfirmTarget(null);
      loadUsers();
    } catch (err) {
      setToast({ type: "error", text: err.message });
      setConfirmTarget(null);
    }
  }

  async function handleInvite(e) {
    e.preventDefault();
    setInviteError("");

    if (!inviteEmail.trim()) {
      setInviteError("Email is required.");
      return;
    }

    try {
      const result = await inviteUser({ email: inviteEmail.trim(), role: inviteRole });
      setToast({ type: "success", text: result.message });
      setInviteOpen(false);
      setInviteEmail("");
      setInviteRole("Employee");
      loadUsers();
    } catch (err) {
      setInviteError(err.message);
    }
  }

  const filteredUsers = users.filter((user) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      `${user.first_name} ${user.surname}`.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="admin-panel">
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>{toast.text}</div>
      )}

      <div className="admin-toolbar">
        <div className="admin-search-filters">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => setInviteOpen(true)}
        >
          <FaUserPlus /> Invite User
        </button>
      </div>

      {loading ? (
        <>
          <div className="admin-skeleton-row" />
          <div className="admin-skeleton-row" />
        </>
      ) : filteredUsers.length === 0 ? (
        <div className="admin-empty-state">No user accounts found.</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isSelf = String(user.id) === String(currentUser?.id);

                return (
                  <tr key={user.id}>
                    <td>
                      {user.first_name} {user.surname}
                      {isSelf && (
                        <span style={{ color: "var(--text-muted)", fontSize: "var(--font-xs)" }}>
                          {" "}(you)
                        </span>
                      )}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        disabled={isSelf}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        className={`admin-pill ${
                          user.role === "Admin" ? "admin-pill-admin" : "admin-pill-employee"
                        }`}
                        style={{ border: "none", fontWeight: 600 }}
                      >
                        <option value="Employee">Employee</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span
                        className={`admin-pill ${
                          user.is_active ? "admin-pill-active" : "admin-pill-inactive"
                        }`}
                      >
                        {user.is_active ? "Active" : "Deactivated"}
                      </span>
                      {user.must_reset_password && (
                        <div style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
                          Pending password setup
                        </div>
                      )}
                    </td>
                    <td>
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleString()
                        : "Never"}
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        {confirmTarget === user.id ? (
                          <>
                            <button
                              type="button"
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => handleStatusToggle(user)}
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn-outline admin-btn-sm"
                              onClick={() => setConfirmTarget(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="admin-btn admin-btn-outline admin-btn-sm"
                            disabled={isSelf}
                            onClick={() => setConfirmTarget(user.id)}
                          >
                            {user.is_active ? (
                              <>
                                <FaUserSlash /> Deactivate
                              </>
                            ) : (
                              <>
                                <FaUserCheck /> Activate
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {inviteOpen && (
        <AdminModal
          titleId="invite-modal-title"
          title="Invite User"
          onClose={() => setInviteOpen(false)}
        >
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-sm)" }}>
              The employee must already exist in the employee directory. They'll
              receive an email with a link to set their own password - no password
              is created or shared by an administrator.
            </p>

            <form onSubmit={handleInvite}>
              <div className="admin-form-group">
                <label htmlFor="invite-email">Employee Email *</label>
                <input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@ncdedat.gov.za"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="invite-role">Role</label>
                <select
                  id="invite-role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {inviteError && (
                <div className="admin-toast admin-toast-error" role="alert">{inviteError}</div>
              )}

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-outline"
                  onClick={() => setInviteOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Send Invite
                </button>
              </div>
            </form>
        </AdminModal>
      )}
    </div>
  );
}

export default AdminUsers;
