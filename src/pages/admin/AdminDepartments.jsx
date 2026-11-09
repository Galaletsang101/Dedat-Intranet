import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaBan } from "react-icons/fa";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deactivateDepartment,
} from "../../services/departmentsService";
import AdminModal from "../../components/admin/AdminModal";

const EMPTY_FORM = { name: "", description: "" };

function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  async function loadDepartments() {
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      setToast({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(dept) {
    setEditingId(dept.id);
    setForm({ name: dept.name, description: dept.description || "" });
    setFormError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Department name is required.");
      return;
    }

    try {
      if (editingId) {
        await updateDepartment(editingId, form);
        setToast({ type: "success", text: "Department updated successfully." });
      } else {
        await createDepartment(form);
        setToast({ type: "success", text: "Department created successfully." });
      }

      setModalOpen(false);
      loadDepartments();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDeactivate(id) {
    try {
      await deactivateDepartment(id);
      setToast({ type: "success", text: "Department deactivated successfully." });
      setConfirmId(null);
      loadDepartments();
    } catch (err) {
      setToast({ type: "error", text: err.message });
      setConfirmId(null);
    }
  }

  return (
    <div className="admin-panel">
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>{toast.text}</div>
      )}

      <div className="admin-toolbar">
        <div />
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreateModal}>
          <FaPlus /> Add Department
        </button>
      </div>

      {loading ? (
        <div className="admin-skeleton-row" />
      ) : departments.length === 0 ? (
        <div className="admin-empty-state">No departments yet.</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Employees</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.name}</td>
                  <td>{dept.description || "-"}</td>
                  <td>{dept.employee_count}</td>
                  <td>
                    <span
                      className={`admin-pill ${
                        dept.status === "Active" ? "admin-pill-active" : "admin-pill-inactive"
                      }`}
                    >
                      {dept.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        onClick={() => openEditModal(dept)}
                      >
                        <FaEdit /> Edit
                      </button>

                      {dept.status === "Active" &&
                        (confirmId === dept.id ? (
                          <>
                            <button
                              type="button"
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => handleDeactivate(dept.id)}
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn-outline admin-btn-sm"
                              onClick={() => setConfirmId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="admin-btn admin-btn-outline admin-btn-sm"
                            onClick={() => setConfirmId(dept.id)}
                          >
                            <FaBan /> Deactivate
                          </button>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <AdminModal
          titleId="department-modal-title"
          title={editingId ? "Edit Department" : "Add Department"}
          onClose={() => setModalOpen(false)}
        >
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label htmlFor="department-name">Department Name *</label>
                <input
                  id="department-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="department-description">Description</label>
                <textarea
                  id="department-description"
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this department/programme do?"
                />
              </div>

              {formError && (
                <div className="admin-toast admin-toast-error" role="alert">{formError}</div>
              )}

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingId ? "Save Changes" : "Create Department"}
                </button>
              </div>
            </form>
        </AdminModal>
      )}
    </div>
  );
}

export default AdminDepartments;
