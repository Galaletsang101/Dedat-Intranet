import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { getAdminNews, updateNews, deleteNews } from "../../services/newsService";
import { formatDate } from "../../utils/dateUtils";
import RichTextEditor from "../RichTextEditor";
import AdminModal from "./AdminModal";
import "../../styles/admin.css";

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content_markdown: "",
  category: "News",
  author: "",
  publication_date: "",
  image_url: "",
  is_featured: false,
  status: "Published",
};

/*
 * Lists every news article (including Drafts, which the public listing
 * never returns) so an Admin can edit, publish/unpublish, or delete
 * content they already created - the Add Content form above only
 * handles creating new articles.
 */
function NewsManager() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  async function loadArticles() {
    setLoading(true);
    try {
      const data = await getAdminNews();
      setArticles(data);
    } catch (err) {
      setToast({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  function openEdit(article) {
    setEditingId(article.id);
    setForm({
      title: article.title || "",
      excerpt: article.excerpt || "",
      content_markdown: article.content_markdown || "",
      category: article.category || "News",
      author: article.author || "",
      publication_date: article.publication_date
        ? String(article.publication_date).slice(0, 10)
        : "",
      image_url: article.image_url || "",
      is_featured: Boolean(article.is_featured),
      status: article.status || "Published",
    });
    setFormError("");
  }

  async function handleSave(event) {
    event.preventDefault();
    setFormError("");

    if (!form.title.trim() || !form.content_markdown.trim()) {
      setFormError("Title and full story content are required.");
      return;
    }

    setSaving(true);
    try {
      await updateNews(editingId, form);
      setToast({ type: "success", text: "Article updated successfully." });
      setEditingId(null);
      loadArticles();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(article) {
    try {
      await updateNews(article.id, {
        ...article,
        status: article.status === "Published" ? "Draft" : "Published",
      });
      setToast({
        type: "success",
        text:
          article.status === "Published"
            ? "Article unpublished."
            : "Article published.",
      });
      loadArticles();
    } catch (err) {
      setToast({ type: "error", text: err.message });
    }
  }

  async function handleDelete(id) {
    try {
      await deleteNews(id);
      setToast({ type: "success", text: "Article deleted." });
      setConfirmDeleteId(null);
      loadArticles();
    } catch (err) {
      setToast({ type: "error", text: err.message });
      setConfirmDeleteId(null);
    }
  }

  return (
    <div className="admin-panel" style={{ marginTop: "20px" }}>
      <h2>Manage Existing Articles</h2>

      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>{toast.text}</div>
      )}

      {loading ? (
        <div className="admin-skeleton-row" />
      ) : articles.length === 0 ? (
        <p className="admin-empty-state">No articles yet - publish your first one above.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.category}</td>
                  <td>{formatDate(article.publication_date || article.created_date)}</td>
                  <td>
                    <span
                      className={`admin-pill ${
                        article.status === "Published"
                          ? "admin-pill-active"
                          : "admin-pill-inactive"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        onClick={() => openEdit(article)}
                      >
                        <FaEdit /> Edit
                      </button>

                      <button
                        type="button"
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        onClick={() => handleTogglePublish(article)}
                      >
                        {article.status === "Published" ? (
                          <>
                            <FaEyeSlash /> Unpublish
                          </>
                        ) : (
                          <>
                            <FaEye /> Publish
                          </>
                        )}
                      </button>

                      {confirmDeleteId === article.id ? (
                        <>
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => handleDelete(article.id)}
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-outline admin-btn-sm"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="admin-btn admin-btn-outline admin-btn-sm"
                          onClick={() => setConfirmDeleteId(article.id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId && (
        <AdminModal
          titleId="edit-news-title"
          title="Edit Article"
          onClose={() => setEditingId(null)}
        >
          <form onSubmit={handleSave}>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="edit-news-title-input">Title *</label>
                <input
                  id="edit-news-title-input"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="edit-news-date">Published Date</label>
                <input
                  id="edit-news-date"
                  type="date"
                  value={form.publication_date}
                  onChange={(e) => setForm({ ...form, publication_date: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="edit-news-category">Category</label>
                <select
                  id="edit-news-category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="News">News</option>
                  <option value="Announcement">Announcement</option>
                  <option value="Department Update">Department Update</option>
                  <option value="Newsletter">Newsletter</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="edit-news-author">Author</label>
                <input
                  id="edit-news-author"
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="edit-news-excerpt">Short Summary</label>
              <textarea
                id="edit-news-excerpt"
                rows="2"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="edit-news-image">Image Link</label>
              <input
                id="edit-news-image"
                type="url"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              />
            </div>

            <div className="admin-checkbox-row">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              <label>Featured</label>
            </div>

            <div className="admin-form-group">
              <label htmlFor="edit-news-status">Visibility</label>
              <select
                id="edit-news-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Published">Published - visible to all staff</option>
                <option value="Draft">Draft - only visible to Admins</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="edit-news-content">Full Story *</label>
              <RichTextEditor
                id="edit-news-content"
                label="Full story content"
                value={form.content_markdown}
                onChange={(value) => setForm({ ...form, content_markdown: value })}
                placeholder="Write the full story here..."
                required
              />
            </div>

            {formError && (
              <div className="admin-toast admin-toast-error" role="alert">{formError}</div>
            )}

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-btn admin-btn-outline"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}

export default NewsManager;
