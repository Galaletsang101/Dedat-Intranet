import { useEffect, useState } from "react";
import {
  CONTENT_COLLECTIONS,
  createAdminContent,
  deleteAdminContent,
  listAdminContent,
  updateAdminContent,
} from "../services/adminContentService.js";

const emptyValues = (collection) =>
  Object.fromEntries(
    CONTENT_COLLECTIONS[collection].fields.map(([name, , type]) => [
      name,
      type === "checkbox" ? false : name === "content" ? "{}" : "",
    ])
  );

const displayValue = (value, type) => {
  if (value == null) return "";
  if (type === "checkbox") return Boolean(value);
  if (type === "json") return JSON.stringify(value, null, 2);
  if (type === "date") return String(value).slice(0, 10);
  if (type === "datetime-local") {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  }
  return String(value);
};

function AdminContentManager() {
  const [collection, setCollection] = useState("news");
  const [records, setRecords] = useState([]);
  const [values, setValues] = useState(emptyValues("news"));
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const config = CONTENT_COLLECTIONS[collection];

  const loadRecords = async () => {
    setLoading(true);
    setError("");
    try {
      setRecords(await listAdminContent(collection));
    } catch (loadError) {
      setError(loadError.message || "Unable to load content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues(emptyValues(collection));
    setEditingId(null);
    setMessage("");
    loadRecords();
  }, [collection]);

  const editRecord = (record) => {
    setEditingId(record[config.key]);
    setValues(
      Object.fromEntries(
        config.fields.map(([name, , type]) => [
          name,
          displayValue(record[name], type),
        ])
      )
    );
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setValues(emptyValues(collection));
  };

  const saveRecord = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {};
      config.fields.forEach(([name, , type]) => {
        const value = values[name];
        if (type === "json") {
          payload[name] = value.trim() ? JSON.parse(value) : {};
        } else if (type === "checkbox") {
          payload[name] = Boolean(value);
        } else if (type === "number") {
          payload[name] = value === "" ? null : Number(value);
        } else if (type === "datetime-local") {
          payload[name] = value ? new Date(value).toISOString() : null;
        } else {
          payload[name] = value === "" && type === "date" ? null : value;
        }
      });

      if (editingId === null) {
        await createAdminContent(collection, payload);
        setMessage("Content added.");
      } else {
        delete payload[config.key];
        await updateAdminContent(collection, editingId, payload);
        setMessage("Content updated.");
      }
      setEditingId(null);
      setValues(emptyValues(collection));
      await loadRecords();
    } catch (saveError) {
      setError(saveError.message || "Unable to save content.");
    } finally {
      setSaving(false);
    }
  };

  const removeRecord = async (record) => {
    const id = record[config.key];
    if (!window.confirm("Delete this content permanently?")) return;
    setError("");
    setMessage("");
    try {
      await deleteAdminContent(collection, id);
      if (String(editingId) === String(id)) cancelEdit();
      setMessage("Content deleted.");
      await loadRecords();
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete content.");
    }
  };

  const recordTitle = (record) =>
    record.title ||
    record.question ||
    [record.first_name, record.surname].filter(Boolean).join(" ") ||
    record.slug ||
    `Record ${record[config.key]}`;

  return (
    <section className="admin-content-manager">
      <div className="admin-content-heading">
        <div>
          <h2>Manage published content</h2>
          <p>Changes are saved to PostgreSQL and shown on the intranet.</p>
        </div>
        <label>
          Content type
          <select
            value={collection}
            onChange={(event) => setCollection(event.target.value)}
          >
            {Object.entries(CONTENT_COLLECTIONS).map(([key, item]) => (
              <option key={key} value={key}>{item.label}</option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="admin-content-message error" role="alert">{error}</p>}
      {message && <p className="admin-content-message success" role="status">{message}</p>}

      <form className="admin-content-form" onSubmit={saveRecord}>
        <h3>{editingId === null ? `Add ${config.label}` : `Edit ${config.label}`}</h3>
        <div className="admin-content-fields">
          {config.fields.map(([name, label, type, required]) => (
            <label key={name} className={type === "textarea" || type === "json" ? "wide" : ""}>
              {label}{required ? " *" : ""}
              {type === "textarea" || type === "json" ? (
                <textarea
                  required={required}
                  rows={type === "json" ? 7 : 3}
                  value={values[name] ?? ""}
                  disabled={editingId !== null && name === config.key}
                  onChange={(event) => setValues({ ...values, [name]: event.target.value })}
                />
              ) : type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={Boolean(values[name])}
                  onChange={(event) => setValues({ ...values, [name]: event.target.checked })}
                />
              ) : (
                <input
                  type={type}
                  required={required}
                  value={values[name] ?? ""}
                  disabled={editingId !== null && name === config.key}
                  onChange={(event) => setValues({ ...values, [name]: event.target.value })}
                />
              )}
            </label>
          ))}
        </div>
        <div className="admin-content-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId === null ? "Add content" : "Save changes"}
          </button>
          {editingId !== null && (
            <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </form>

      <div className="admin-content-records">
        <h3>{config.label}</h3>
        {loading ? (
          <p>Loading content...</p>
        ) : records.length === 0 ? (
          <p>No content found.</p>
        ) : (
          <ul>
            {records.map((record) => (
              <li key={record[config.key]}>
                <span>
                  <strong>{recordTitle(record)}</strong>
                  {record.status && <small>{record.status}</small>}
                </span>
                <span className="admin-content-row-actions">
                  <button type="button" onClick={() => editRecord(record)}>Edit</button>
                  <button type="button" className="delete" onClick={() => removeRecord(record)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default AdminContentManager;
