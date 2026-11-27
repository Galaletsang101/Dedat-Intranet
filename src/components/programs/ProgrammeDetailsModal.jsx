import { useEffect, useRef, useState } from "react";
import {
  getSubProgrammes,
  createSubProgramme,
  updateSubProgramme,
  deactivateSubProgramme,
} from "../../services/subProgrammesService";
import "../../styles/programDetailsModal.css";

const EMPTY_FORM = { name: "", description: "" };

/*
 * Single overlay / single dialog element, no matter how deep the user has
 * drilled in - `view` is a small state machine ('programme' |
 * 'subprogramme' | 'add-sub' | 'edit-sub') that swaps the panel's content
 * in place. This is what keeps programme -> sub-programme drill-down (and
 * the Admin-only add/edit forms) from ever stacking a second overlay on
 * top of this one.
 */
function ProgrammeDetailsModal({ department, isAdmin, onClose }) {
  const [subProgrammes, setSubProgrammes] = useState(null); // null = loading
  const [error, setError] = useState("");
  const [view, setView] = useState("programme");
  const [activeSubProgramme, setActiveSubProgramme] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [confirmDeactivateId, setConfirmDeactivateId] = useState(null);

  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;
    setSubProgrammes(null);
    setError("");

    getSubProgrammes(department.id)
      .then((data) => {
        if (isMounted) setSubProgrammes(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load sub-programmes.");
      });

    return () => {
      isMounted = false;
    };
  }, [department.id]);

  const visibleSubProgrammes = (subProgrammes || []).filter(
    (sub) => isAdmin || sub.status !== "Inactive"
  );

  function openAddForm() {
    setForm(EMPTY_FORM);
    setFormError("");
    setView("add-sub");
  }

  function openEditForm(sub) {
    setForm({ name: sub.name, description: sub.description || "" });
    setFormError("");
    setActiveSubProgramme(sub);
    setView("edit-sub");
  }

  function openDetails(sub) {
    setActiveSubProgramme(sub);
    setConfirmDeactivateId(null);
    setView("subprogramme");
  }

  function backToList() {
    setConfirmDeactivateId(null);
    setView("programme");
  }

  async function handleCreateSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setFormError("Sub-programme name is required.");
      return;
    }

    try {
      const created = await createSubProgramme(department.id, {
        name: form.name.trim(),
        description: form.description,
      });

      setSubProgrammes((prev) => [...(prev || []), created]);
      setView("programme");
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleEditSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setFormError("Sub-programme name is required.");
      return;
    }

    try {
      const updated = await updateSubProgramme(activeSubProgramme.id, {
        name: form.name.trim(),
        description: form.description,
        status: activeSubProgramme.status,
      });

      setSubProgrammes((prev) =>
        (prev || []).map((sub) => (sub.id === updated.id ? updated : sub))
      );
      setActiveSubProgramme(updated);
      setView("subprogramme");
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDeactivate(id) {
    try {
      await deactivateSubProgramme(id);

      setSubProgrammes((prev) =>
        (prev || []).map((sub) =>
          sub.id === id ? { ...sub, status: "Inactive" } : sub
        )
      );
      setActiveSubProgramme((prev) =>
        prev && prev.id === id ? { ...prev, status: "Inactive" } : prev
      );
      setConfirmDeactivateId(null);
    } catch {
      setConfirmDeactivateId(null);
    }
  }

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div
        className="pm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="programme-modal-heading"
        ref={dialogRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="pm-close-x"
          aria-label="Close"
          onClick={onClose}
        >
          &times;
        </button>

        {view === "programme" && (
          <>
            <h2 id="programme-modal-heading">{department.name}</h2>

            <span
              className={`pm-pill ${
                department.status === "Active" ? "pm-pill-active" : "pm-pill-inactive"
              }`}
            >
              {department.status}
            </span>

            <p className="pm-description">
              {department.description ||
                "No description has been added for this programme yet."}
            </p>

            <div className="pm-meta-row">
              <div className="pm-meta-item">
                <strong>{department.employee_count}</strong> Employees
              </div>
              <div className="pm-meta-item">
                <strong>{department.sub_programme_count}</strong> Sub-Programmes
              </div>
            </div>

            <div className="pm-section-header">
              <h3>Sub-Programmes</h3>

              {isAdmin && visibleSubProgrammes.length > 0 && (
                <button
                  type="button"
                  className="pm-btn pm-btn-outline pm-btn-sm"
                  onClick={openAddForm}
                >
                  + Add Sub-Programme
                </button>
              )}
            </div>

            {subProgrammes === null && !error && (
              <p className="pm-loading">Loading sub-programmes…</p>
            )}

            {error && (
              <p className="pm-error" role="alert">
                {error}
              </p>
            )}

            {subProgrammes !== null && !error && visibleSubProgrammes.length === 0 && (
              <div className="pm-empty-state">
                <p>No sub-programmes have been added for this programme yet.</p>

                {isAdmin && (
                  <button
                    type="button"
                    className="pm-btn pm-btn-primary"
                    onClick={openAddForm}
                  >
                    + Add Sub-Programme
                  </button>
                )}
              </div>
            )}

            {subProgrammes !== null && !error && visibleSubProgrammes.length > 0 && (
              <ul className="pm-sub-list">
                {visibleSubProgrammes.map((sub) => (
                  <li className="pm-sub-card" key={sub.id}>
                    <div className="pm-sub-card-header">
                      <strong>{sub.name}</strong>

                      {isAdmin && (
                        <span
                          className={`pm-pill pm-pill-sm ${
                            sub.status === "Active" ? "pm-pill-active" : "pm-pill-inactive"
                          }`}
                        >
                          {sub.status}
                        </span>
                      )}
                    </div>

                    <p className="pm-sub-card-description">
                      {sub.description || "No description added."}
                    </p>

                    <button
                      type="button"
                      className="pm-btn pm-btn-outline pm-btn-sm"
                      onClick={() => openDetails(sub)}
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {view === "subprogramme" && activeSubProgramme && (
          <>
            <button type="button" className="pm-back-btn" onClick={backToList}>
              ← Back to {department.name}
            </button>

            <h2 id="programme-modal-heading">{activeSubProgramme.name}</h2>

            <span
              className={`pm-pill ${
                activeSubProgramme.status === "Active"
                  ? "pm-pill-active"
                  : "pm-pill-inactive"
              }`}
            >
              {activeSubProgramme.status}
            </span>

            <p className="subprog-parent">Part of: {department.name}</p>

            <p className="pm-description">
              {activeSubProgramme.description ||
                "No description has been added for this sub-programme yet."}
            </p>

            {isAdmin && (
              <div className="pm-modal-actions">
                <button
                  type="button"
                  className="pm-btn pm-btn-outline"
                  onClick={() => openEditForm(activeSubProgramme)}
                >
                  Edit
                </button>

                {confirmDeactivateId === activeSubProgramme.id ? (
                  <>
                    <span>Deactivate this sub-programme?</span>

                    <button
                      type="button"
                      className="pm-btn pm-btn-danger"
                      onClick={() => handleDeactivate(activeSubProgramme.id)}
                    >
                      Yes, Deactivate
                    </button>

                    <button
                      type="button"
                      className="pm-btn pm-btn-outline"
                      onClick={() => setConfirmDeactivateId(null)}
                    >
                      No
                    </button>
                  </>
                ) : (
                  activeSubProgramme.status === "Active" && (
                    <button
                      type="button"
                      className="pm-btn pm-btn-danger"
                      onClick={() => setConfirmDeactivateId(activeSubProgramme.id)}
                    >
                      Deactivate
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}

        {(view === "add-sub" || view === "edit-sub") && (
          <form onSubmit={view === "add-sub" ? handleCreateSubmit : handleEditSubmit}>
            <h2 id="programme-modal-heading">
              {view === "add-sub" ? "Add Sub-Programme" : "Edit Sub-Programme"}
            </h2>

            <div className="pm-form-group">
              <label htmlFor="sub-programme-name">Name *</label>
              <input
                id="sub-programme-name"
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </div>

            <div className="pm-form-group">
              <label htmlFor="sub-programme-description">Description</label>
              <textarea
                id="sub-programme-description"
                rows="3"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />
            </div>

            {formError && (
              <p className="pm-error" role="alert">
                {formError}
              </p>
            )}

            <div className="pm-modal-actions">
              <button
                type="button"
                className="pm-btn pm-btn-outline"
                onClick={() =>
                  setView(view === "add-sub" ? "programme" : "subprogramme")
                }
              >
                Cancel
              </button>

              <button type="submit" className="pm-btn pm-btn-primary">
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProgrammeDetailsModal;
