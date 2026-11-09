import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  getAdminWellnessVideos,
  updateWellnessVideo,
  deleteWellnessVideo,
  uploadWellnessVideoFile,
} from "../../services/wellnessService";
import { formatDate } from "../../utils/dateUtils";
import AdminModal from "./AdminModal";
import "../../styles/admin.css";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "Mental Health",
  duration: "",
  thumbnail: "",
  video_url: "",
  featured: false,
  status: "Published",
};

/*
 * Lists every wellness video (including Drafts) so an Admin can edit,
 * publish/unpublish, replace the video source, or delete content they
 * already created.
 */
function WellnessManager() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [replaceFile, setReplaceFile] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  async function loadVideos() {
    setLoading(true);
    try {
      const data = await getAdminWellnessVideos();
      setVideos(data);
    } catch (err) {
      setToast({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVideos();
  }, []);

  function openEdit(video) {
    setEditingId(video.id);
    setReplaceFile(null);
    setForm({
      title: video.title || "",
      description: video.description || "",
      category: video.category || "Mental Health",
      duration: video.duration || "",
      thumbnail: video.thumbnail || "",
      video_url: video.video_url || "",
      featured: Boolean(video.featured),
      status: video.status || "Published",
    });
    setFormError("");
  }

  async function handleSave(event) {
    event.preventDefault();
    setFormError("");

    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }

    let finalVideoUrl = form.video_url.trim();

    if (replaceFile) {
      if (!replaceFile.type.startsWith("video/")) {
        setFormError("Please select a valid video file.");
        return;
      }
    }

    if (!finalVideoUrl && !replaceFile) {
      setFormError("A video URL or uploaded video file is required.");
      return;
    }

    setSaving(true);
    try {
      if (replaceFile) {
        setUploadProgress(0);
        const result = await uploadWellnessVideoFile(replaceFile, setUploadProgress);
        finalVideoUrl = result.url;
        setUploadProgress(null);
      }

      await updateWellnessVideo(editingId, { ...form, video_url: finalVideoUrl });
      setToast({ type: "success", text: "Wellness video updated successfully." });
      setEditingId(null);
      loadVideos();
    } catch (err) {
      setFormError(err.message);
      setUploadProgress(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(video) {
    try {
      await updateWellnessVideo(video.id, {
        ...video,
        status: video.status === "Published" ? "Draft" : "Published",
      });
      setToast({
        type: "success",
        text: video.status === "Published" ? "Video unpublished." : "Video published.",
      });
      loadVideos();
    } catch (err) {
      setToast({ type: "error", text: err.message });
    }
  }

  async function handleDelete(id) {
    try {
      await deleteWellnessVideo(id);
      setToast({ type: "success", text: "Video deleted." });
      setConfirmDeleteId(null);
      loadVideos();
    } catch (err) {
      setToast({ type: "error", text: err.message });
      setConfirmDeleteId(null);
    }
  }

  return (
    <div className="admin-panel" style={{ marginTop: "20px" }}>
      <h2>Manage Existing Videos</h2>

      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>{toast.text}</div>
      )}

      {loading ? (
        <div className="admin-skeleton-row" />
      ) : videos.length === 0 ? (
        <p className="admin-empty-state">No videos yet - publish your first one above.</p>
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
              {videos.map((video) => (
                <tr key={video.id}>
                  <td>{video.title}</td>
                  <td>{video.category}</td>
                  <td>{formatDate(video.created_date)}</td>
                  <td>
                    <span
                      className={`admin-pill ${
                        video.status === "Published"
                          ? "admin-pill-active"
                          : "admin-pill-inactive"
                      }`}
                    >
                      {video.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        onClick={() => openEdit(video)}
                      >
                        <FaEdit /> Edit
                      </button>

                      <button
                        type="button"
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        onClick={() => handleTogglePublish(video)}
                      >
                        {video.status === "Published" ? (
                          <>
                            <FaEyeSlash /> Unpublish
                          </>
                        ) : (
                          <>
                            <FaEye /> Publish
                          </>
                        )}
                      </button>

                      {confirmDeleteId === video.id ? (
                        <>
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => handleDelete(video.id)}
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
                          onClick={() => setConfirmDeleteId(video.id)}
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
          titleId="edit-wellness-title"
          title="Edit Wellness Video"
          onClose={() => setEditingId(null)}
        >
          <form onSubmit={handleSave}>
            <div className="admin-form-group">
              <label htmlFor="edit-wellness-title-input">Title *</label>
              <input
                id="edit-wellness-title-input"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="edit-wellness-category">Category</label>
                <select
                  id="edit-wellness-category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="Mental Health">Mental Health</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Physical Care">Physical Care</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="edit-wellness-duration">Duration</label>
                <input
                  id="edit-wellness-duration"
                  type="text"
                  placeholder="e.g. 12 min"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="edit-wellness-description">Description</label>
              <textarea
                id="edit-wellness-description"
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="edit-wellness-thumbnail">Thumbnail Image Link</label>
              <input
                id="edit-wellness-thumbnail"
                type="url"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="edit-wellness-video-url">Video Link (YouTube, Vimeo, or direct URL)</label>
              <input
                id="edit-wellness-video-url"
                type="url"
                value={form.video_url}
                onChange={(e) => {
                  setForm({ ...form, video_url: e.target.value });
                  setReplaceFile(null);
                }}
                placeholder="Leave as-is to keep the current video"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="edit-wellness-replace-file">Or Replace With an Uploaded File</label>
              <div className="upload-area">
                <input
                  id="edit-wellness-replace-file"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setReplaceFile(e.target.files?.[0] || null)}
                />
                {replaceFile && (
                  <div className="file-status">
                    <strong>{replaceFile.name}</strong>
                    <span>Will replace the current video on save</span>
                  </div>
                )}
              </div>
              {uploadProgress !== null && (
                <div className="upload-progress">
                  <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
                  <span>{uploadProgress}% uploaded</span>
                </div>
              )}
            </div>

            <div className="admin-checkbox-row">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              <label>Featured ("NEW" badge)</label>
            </div>

            <div className="admin-form-group">
              <label htmlFor="edit-wellness-status">Visibility</label>
              <select
                id="edit-wellness-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Published">Published - visible to all staff</option>
                <option value="Draft">Draft - only visible to Admins</option>
              </select>
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

export default WellnessManager;
