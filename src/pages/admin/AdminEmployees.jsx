import { useEffect, useState, useCallback } from "react";
import { FaPlus, FaEdit, FaUserSlash, FaSearch } from "react-icons/fa";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} from "../../services/employeesService";
import { getDepartments } from "../../services/departmentsService";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import AdminModal from "../../components/admin/AdminModal";

const ITEMS_PER_PAGE = 10;

const EMPTY_FORM = {
  id: "",
  first_name: "",
  surname: "",
  email: "",
  position: "",
  programme: "",
  department_id: "",
  phone: "",
  location: "",
  experience: "",
  is_mentor: false,
  skills: "",
};

function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("Active");

  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [confirmDeactivateId, setConfirmDeactivateId] = useState(null);

  const loadDepartments = useCallback(async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch {
      // Non-fatal - the employee table still works without the filter list.
    }
  }, []);

  const debouncedSearch = useDebouncedValue(search, 350);

  const loadEmployees = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const result = await getEmployees(
          {
            search: debouncedSearch,
            department: departmentFilter,
            status: statusFilter === "all" ? undefined : statusFilter,
          },
          page,
          ITEMS_PER_PAGE
        );
        setEmployees(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setToast({ type: "error", text: err.message });
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, departmentFilter, statusFilter]
  );

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  useEffect(() => {
    loadEmployees(1);
  }, [loadEmployees]);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(employee) {
    setEditingId(employee.id);
    setForm({
      id: employee.id,
      first_name: employee.first_name || "",
      surname: employee.surname || "",
      email: employee.email || "",
      position: employee.position || "",
      programme: employee.programme || "",
      department_id: employee.department_id || "",
      phone: employee.phone || "",
      location: employee.location || "",
      experience: employee.experience || "",
      is_mentor: employee.is_mentor || false,
      skills: (employee.skills || []).join(", "),
    });
    setFormError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!form.first_name.trim() || !form.surname.trim()) {
      setFormError("First name and surname are required.");
      return;
    }

    const selectedDept = departments.find(
      (d) => String(d.id) === String(form.department_id)
    );

    const payload = {
      ...form,
      programme: selectedDept ? selectedDept.name : form.programme,
      department_id: form.department_id || null,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await updateEmployee(editingId, payload);
        setToast({ type: "success", text: "Employee updated successfully." });
      } else {
        if (!form.id) {
          setFormError("Employee id is required for new records.");
          return;
        }

        await createEmployee(payload);
        setToast({ type: "success", text: "Employee created successfully." });
      }

      setModalOpen(false);
      loadEmployees(pagination.currentPage);
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDeactivate(id) {
    try {
      await deactivateEmployee(id);
      setToast({ type: "success", text: "Employee deactivated successfully." });
      setConfirmDeactivateId(null);
      loadEmployees(pagination.currentPage);
    } catch (err) {
      setToast({ type: "error", text: err.message });
      setConfirmDeactivateId(null);
    }
  }

  return (
    <div className="admin-panel">
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>{toast.text}</div>
      )}

      <div className="admin-toolbar">
        <div className="admin-search-filters">
          <input
            type="text"
            placeholder="Search name, position, skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="all">All</option>
          </select>
        </div>

        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreateModal}>
          <FaPlus /> Add Employee
        </button>
      </div>

      {loading ? (
        <>
          <div className="admin-skeleton-row" />
          <div className="admin-skeleton-row" />
          <div className="admin-skeleton-row" />
        </>
      ) : employees.length === 0 ? (
        <div className="admin-empty-state">
          <FaSearch style={{ fontSize: "1.5rem", marginBottom: 8 }} />
          <p>No employees match your filters.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    {employee.full_name}
                    {employee.is_mentor && (
                      <span className="admin-pill admin-pill-admin" style={{ marginLeft: 6 }}>
                        Mentor
                      </span>
                    )}
                  </td>
                  <td>{employee.position || "-"}</td>
                  <td>{employee.programme || "-"}</td>
                  <td>{employee.email || "-"}</td>
                  <td>
                    <span
                      className={`admin-pill ${
                        employee.status === "Inactive"
                          ? "admin-pill-inactive"
                          : "admin-pill-active"
                      }`}
                    >
                      {employee.status || "Active"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        onClick={() => openEditModal(employee)}
                      >
                        <FaEdit /> Edit
                      </button>

                      {employee.status !== "Inactive" &&
                        (confirmDeactivateId === employee.id ? (
                          <>
                            <button
                              type="button"
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => handleDeactivate(employee.id)}
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn-outline admin-btn-sm"
                              onClick={() => setConfirmDeactivateId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="admin-btn admin-btn-outline admin-btn-sm"
                            onClick={() => setConfirmDeactivateId(employee.id)}
                          >
                            <FaUserSlash /> Deactivate
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

      {pagination.totalPages > 1 && (
        <div className="admin-pagination">
          <button
            type="button"
            className="admin-btn admin-btn-outline admin-btn-sm"
            disabled={!pagination.hasPrev}
            onClick={() => loadEmployees(pagination.currentPage - 1)}
          >
            Previous
          </button>

          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            type="button"
            className="admin-btn admin-btn-outline admin-btn-sm"
            disabled={!pagination.hasNext}
            onClick={() => loadEmployees(pagination.currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {modalOpen && (
        <AdminModal
          titleId="employee-modal-title"
          title={editingId ? "Edit Employee" : "Add Employee"}
          onClose={() => setModalOpen(false)}
        >
            <form onSubmit={handleSubmit}>
              {!editingId && (
                <div className="admin-form-group">
                  <label>Employee ID *</label>
                  <input
                    type="number"
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Surname *</label>
                  <input
                    type="text"
                    value={form.surname}
                    onChange={(e) => setForm({ ...form, surname: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Department</label>
                  <select
                    value={form.department_id}
                    onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 years"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Skills (comma-separated)</label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
              </div>

              <div className="admin-checkbox-row">
                <input
                  type="checkbox"
                  checked={form.is_mentor}
                  onChange={(e) => setForm({ ...form, is_mentor: e.target.checked })}
                />
                <label>Available as a mentor</label>
              </div>

              {formError && (
                <div className="admin-toast admin-toast-error">{formError}</div>
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
                  {editingId ? "Save Changes" : "Create Employee"}
                </button>
              </div>
            </form>
        </AdminModal>
      )}
    </div>
  );
}

export default AdminEmployees;
