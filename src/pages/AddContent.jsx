import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { FaUsers, FaBuilding } from "react-icons/fa";
import { createNews } from "../services/newsService";
import { createFaq } from "../services/faqsService";
import { createDocument } from "../services/documentsService";
import { createPolicy } from "../services/policiesService";
import { createCirculus } from "../services/circulusService";
import {
  createWellnessVideo,
  uploadWellnessVideoFile,
} from "../services/wellnessService";
import { authFetch, parseJsonResponse } from "../services/apiClient";
import RichTextEditor from "../components/RichTextEditor";
import NewsManager from "../components/admin/NewsManager";
import WellnessManager from "../components/admin/WellnessManager";
import "../styles/addContent.css";

/* =========================================================
   PAGE OPTIONS

   Employee/user/department records moved to the Admin Center
   (/#/admin) once that became a real, database-backed module -
   keeping separate non-functional stubs for them here would just
   be a second, broken way to do the same thing.
========================================= */

const PAGE_OPTIONS = [
  {
    id: "news",
    name: "News & Circulars",
    description:
      "Publish official news, circulars, gazettes and newsletters.",
    type: "markdown",
  },
  {
    id: "faq",
    name: "FAQ",
    description: "Create frequently asked questions and answers.",
    type: "faq",
  },
  {
    id: "knowledge",
    name: "Knowledge Centre",
    description: "Add documents, guides and knowledge resources.",
    type: "markdown-pdf",
  },
  {
    id: "policies",
    name: "Policies",
    description: "Add and publish official departmental policy documents.",
    type: "pdf",
  },
  {
    id: "wellness",
    name: "Wellness",
    description: "Add wellness videos and helpful resources.",
    type: "video",
  },
  {
    id: "calendar",
    name: "Calendar Event",
    description: "Create calendar events for staff.",
    type: "calendar",
  },
];

/* =========================================================
   FAQ CATEGORIES
========================================================= */

const DEFAULT_CATEGORIES = [
  "General & Mandate",
  "Youth & Internship Programs",
  "Tourism & Tour Guide Registration",
  "Business Support & Procurement",
  "Consumer Rights",
];

/* =========================================================
   COMPONENT
========================================================= */

export default function AddContent() {
  /* =========================================================
     PAGE
  ========================================================= */

  const [selectedPage, setSelectedPage] = useState("news");

  /* =========================================================
     GENERAL CONTENT
  ========================================================= */

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("Published");

  const [content, setContent] = useState("");

  /* =========================================================
     PDF
  ========================================================= */

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  /* =========================================================
     VIDEO
  ========================================================= */

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);

  /* =========================================================
     FAQ
  ========================================================= */

  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  /* =========================================================
     CALENDAR
  ========================================================= */

  const [calendarStartTime, setCalendarStartTime] = useState("");
  const [calendarEndTime, setCalendarEndTime] = useState("");
  const [calendarCategory, setCalendarCategory] = useState("Meeting");
  const [calendarQuarter, setCalendarQuarter] = useState("Q1");

  /* =========================================================
     UI
  ========================================================= */

  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* =========================================================
     SELECTED PAGE
  ========================================================= */

  const selectedPageData = useMemo(() => {
    return (
      PAGE_OPTIONS.find((page) => page.id === selectedPage) ||
      PAGE_OPTIONS[0]
    );
  }, [selectedPage]);

  const hasUnsavedInput = () =>
    Boolean(
      title.trim() ||
        description.trim() ||
        content.trim() ||
        faqQuestion.trim() ||
        faqAnswer.trim() ||
        pdfFile ||
        videoFile ||
        videoUrl.trim()
    );

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setAuthor("");
    setPublishedDate("");
    setImageUrl("");
    setIsFeatured(false);
    setStatus("Published");

    setContent("");

    setPdfFile(null);
    setPdfUrl("");

    setVideoFile(null);
    setVideoPreviewUrl("");
    setVideoUrl("");
    setUploadProgress(null);

    setFaqQuestion("");
    setFaqAnswer("");

    /* Calendar */
    setCalendarStartTime("");
    setCalendarEndTime("");
    setCalendarCategory("Meeting");
    setCalendarQuarter("Q1");

    setShowPreview(false);

    setShowCategoryInput(false);
    setNewCategory("");

    setMessage("");
    setMessageType("");
  };

  /* =========================================================
     PAGE CHANGE
  ========================================================= */

  const handlePageChange = (pageId) => {
    if (pageId === selectedPage) return;

    if (
      hasUnsavedInput() &&
      !window.confirm(
        "You have unsaved changes on this form. Switch content type and discard them?"
      )
    ) {
      return;
    }

    setSelectedPage(pageId);
    resetForm();
  };

  /* =========================================================
     PDF UPLOAD
  ========================================================= */

  const handlePdfChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("Please select a PDF file.");
      setMessageType("error");
      return;
    }

    setPdfFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPdfUrl(objectUrl);

    setMessage("");
    setMessageType("");
  };

  /* =========================================================
     VIDEO UPLOAD
  ========================================================= */

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setMessage("Please select a valid video file.");
      setMessageType("error");
      return;
    }

    setVideoFile(file);
    setVideoUrl("");

    // This blob: URL is ONLY for an in-form preview in this browser tab -
    // it is never sent to the backend or saved to the database. The real,
    // permanent URL comes from uploadWellnessVideoFile() at publish time.
    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);

    setMessage("");
    setMessageType("");
  };

  /* =========================================================
     ADD FAQ CATEGORY
  ========================================================= */

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();

    if (!trimmedCategory) {
      setMessage("Please enter a category name.");
      setMessageType("error");
      return;
    }

    if (
      categories.some(
        (existingCategory) =>
          existingCategory.toLowerCase() ===
          trimmedCategory.toLowerCase()
      )
    ) {
      setMessage("This category already exists.");
      setMessageType("error");
      return;
    }

    setCategories([...categories, trimmedCategory]);
    setCategory(trimmedCategory);

    setNewCategory("");
    setShowCategoryInput(false);

    setMessage("");
    setMessageType("");
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    /* Policies */
    if (selectedPage === "policies") {
      if (!title.trim()) {
        setMessage("Please enter the policy title.");
        setMessageType("error");
        return false;
      }

      if (!pdfFile && !pdfUrl) {
        setMessage("Please upload a PDF file.");
        setMessageType("error");
        return false;
      }
    }

    /* Knowledge Centre */
    if (selectedPage === "knowledge") {
      if (!title.trim()) {
        setMessage("Please enter a title.");
        setMessageType("error");
        return false;
      }

      if (!content.trim()) {
        setMessage("Please enter some content.");
        setMessageType("error");
        return false;
      }

      if (!pdfFile && !pdfUrl) {
        setMessage("Please upload a PDF file.");
        setMessageType("error");
        return false;
      }
    }

    /* News */
    if (selectedPage === "news") {
      if (!title.trim()) {
        setMessage("Please enter a title.");
        setMessageType("error");
        return false;
      }

      if (!content.trim()) {
        setMessage("Please enter some content.");
        setMessageType("error");
        return false;
      }

      if (!category.trim()) {
        setMessage("Please select a news category.");
        setMessageType("error");
        return false;
      }
    }

    /* FAQ */
    if (selectedPage === "faq") {
      if (!faqQuestion.trim()) {
        setMessage("Please enter the FAQ question.");
        setMessageType("error");
        return false;
      }

      if (!faqAnswer.trim()) {
        setMessage("Please enter the FAQ answer.");
        setMessageType("error");
        return false;
      }

      if (!category.trim()) {
        setMessage("Please select an FAQ category.");
        setMessageType("error");
        return false;
      }
    }

    /* Wellness */
    if (selectedPage === "wellness") {
      if (!title.trim()) {
        setMessage("Please enter the wellness video title.");
        setMessageType("error");
        return false;
      }

      if (!videoFile && !videoUrl.trim()) {
        setMessage("Please upload a video or provide a video URL.");
        setMessageType("error");
        return false;
      }
    }

    /* Calendar */
    if (selectedPage === "calendar") {
      if (!title.trim()) {
        setMessage("Please enter the event title.");
        setMessageType("error");
        return false;
      }

      if (!publishedDate) {
        setMessage("Please select the event date.");
        setMessageType("error");
        return false;
      }

      if (!calendarStartTime) {
        setMessage("Please select the start time.");
        setMessageType("error");
        return false;
      }

      if (!calendarEndTime) {
        setMessage("Please select the end time.");
        setMessageType("error");
        return false;
      }

      if (calendarEndTime <= calendarStartTime) {
        setMessage("End time must be after start time.");
        setMessageType("error");
        return false;
      }

      if (!calendarCategory) {
        setMessage("Please select an event category.");
        setMessageType("error");
        return false;
      }
    }

    return true;
  };

  /* =========================================================
     PREVIEW
  ========================================================= */

  const handlePreview = () => {
    if (!validateForm()) {
      return;
    }

    setShowPreview(true);
  };

  /* =========================================================
     PREVIEW CONTENT
  ========================================================= */

  const renderPreviewContent = () => {
    /* Calendar */
    if (selectedPageData.type === "calendar") {
      return (
        <div className="preview-calendar">
          <h2>{title}</h2>

          {description && (
            <p>
              <strong>Description:</strong> {description}
            </p>
          )}

          <p>
            <strong>Date:</strong> {publishedDate}
          </p>

          <p>
            <strong>Start Time:</strong> {calendarStartTime}
          </p>

          <p>
            <strong>End Time:</strong> {calendarEndTime}
          </p>

          <p>
            <strong>Category:</strong> {calendarCategory}
          </p>

          <p>
            <strong>Quarter:</strong> {calendarQuarter}
          </p>
        </div>
      );
    }

    if (selectedPageData.type === "video") {
      const previewSrc = videoPreviewUrl || videoUrl;

      return (
        <div className="preview-media">
          {previewSrc ? (
            <video
              src={previewSrc}
              controls
              className="preview-video"
            />
          ) : (
            <div className="media-placeholder">
              <span>▶</span>
              <p>No video selected yet.</p>
            </div>
          )}
        </div>
      );
    }

    if (
      selectedPageData.type === "pdf" ||
      selectedPageData.type === "markdown-pdf"
    ) {
      return (
        <div className="preview-document">
          {content && (
            <div className="preview-markdown">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}

          {pdfUrl && (
            <div className="preview-pdf">
              <iframe
                src={pdfUrl}
                title={title || "PDF Preview"}
                width="100%"
                height="500"
              />
            </div>
          )}
        </div>
      );
    }

    if (selectedPageData.type === "faq") {
      return (
        <div className="preview-faq">
          <h2>{faqQuestion}</h2>

          <p>
            <strong>Category:</strong> {category}
          </p>

          <div className="preview-answer">
            <ReactMarkdown>{faqAnswer}</ReactMarkdown>
          </div>
        </div>
      );
    }

    return (
      <div className="preview-markdown">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  };

  /* =========================================================
     PUBLISH
  ========================================================= */

  const handlePublish = async () => {
    if (!validateForm()) {
      return;
    }

    setIsPublishing(true);
    setMessage("");
    setMessageType("");

    try {
      /* NEWS & CIRCULARS -> PostgreSQL table shape: news or circulus */
      if (selectedPage === "news") {
        const selectedCategory = (category || "").trim().toLowerCase();

        if (selectedCategory === "circulars") {
          await createCirculus({
            title: title.trim(),
            description: description.trim() || "",
            category: "Circulars",
            author: author.trim() || "",
            publication_date: publishedDate || null,
            file_url: pdfUrl || imageUrl.trim() || "",
            status: "published",
          });

          setMessage("Circular published successfully.");
        } else {
          await createNews({
            title: title.trim(),
            excerpt: description.trim() || null,
            content_markdown: content,
            category: category.trim(),
            author: author.trim() || null,
            publication_date: publishedDate || null,
            image_url: imageUrl.trim() || null,
            is_featured: isFeatured,
            status,
          });

          setMessage(
            status === "Draft"
              ? "News article saved as a draft."
              : "News article published successfully."
          );
        }
      } else if (selectedPage === "faq") {
        await createFaq({
          question: faqQuestion.trim(),
          answer: faqAnswer,
          category: category.trim() || "General",
          keyword: "",
          status: "published",
        });

        setMessage("FAQ published successfully.");
      } else if (selectedPage === "policies") {
        await createPolicy({
          title: title.trim(),
          policy_number: `POL-${Date.now()}`,
          description: description.trim() || "",
          category: category.trim() || "Policy",
          author: author.trim() || "",
          publication_date: publishedDate || null,
          review_date: publishedDate || null,
          status: "published",
          file_url: pdfUrl || "",
        });

        setMessage("Policy published successfully.");
      } else if (selectedPage === "knowledge") {
        await createDocument({
          title: title.trim(),
          description: description.trim() || "",
          category: category.trim() || "Knowledge Centre",
          keywords: [],
          knowledge_owner: author.trim() || "DEDaT",
          publication_date: publishedDate || null,
          review_date: publishedDate || null,
          version_number: "1.0",
          status: "published",
          file_url: pdfUrl || "",
        });

        setMessage("Knowledge document published successfully.");
      } else if (selectedPage === "wellness") {
        let finalVideoUrl = videoUrl.trim();

        if (videoFile) {
          setUploadProgress(0);
          const uploadResult = await uploadWellnessVideoFile(
            videoFile,
            setUploadProgress
          );
          finalVideoUrl = uploadResult.url;
          setUploadProgress(null);
        }

        await createWellnessVideo({
          title: title.trim(),
          description: description.trim() || "",
          category: category || "Mental Health",
          duration: "",
          thumbnail: imageUrl.trim() || "",
          video_url: finalVideoUrl,
          featured: isFeatured,
          status,
        });

        setMessage("Wellness video published successfully.");
      } else if (selectedPage === "calendar") {
        const startTime = `${publishedDate} ${calendarStartTime}:00`;
        const endTime = `${publishedDate} ${calendarEndTime}:00`;

        const response = await authFetch("/calendar-events", {
          method: "POST",
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || "",
            start_time: startTime,
            end_time: endTime,
            category: calendarCategory,
            quarter: calendarQuarter,
          }),
        });

        await parseJsonResponse(response, "Failed to create calendar event.");

        setMessage("Calendar event created successfully.");
      }

      setMessageType("success");
      setShowPreview(false);

      setTimeout(() => {
        resetForm();
      }, 1200);
    } catch (error) {
      console.error(`Failed to publish ${selectedPage}:`, error);

      setMessage(error?.message || "Failed to publish the content.");
      setMessageType("error");
    } finally {
      setIsPublishing(false);
    }
  };

  /* =========================================================
     CONTENT DETAILS
  ========================================================= */

  const renderContentDetails = () => {
    /* FAQ has its own dedicated editor below */
    if (selectedPage === "faq") {
      return null;
    }

    /* POLICIES */
    if (selectedPage === "policies") {
      return (
        <>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="policy-title">Policy Title *</label>

              <input
                id="policy-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Supply Chain Management Policy"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="policy-date">Published Date</label>

              <input
                id="policy-date"
                type="date"
                value={publishedDate}
                onChange={(event) => setPublishedDate(event.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="policy-description">Description</label>

            <textarea
              id="policy-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this policy about, in a sentence or two?"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="policy-pdf">Policy Document (PDF) *</label>

            <div className="upload-area">
              <input
                id="policy-pdf"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfChange}
              />

              {pdfFile && (
                <div className="file-status">
                  <strong>{pdfFile.name}</strong>
                  <span>Ready to publish</span>
                </div>
              )}
            </div>
            <p className="field-hint">PDF files only.</p>
          </div>
        </>
      );
    }

    /* WELLNESS */
    if (selectedPage === "wellness") {
      return (
        <>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="wellness-title">Video Title *</label>

              <input
                id="wellness-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. 5-Minute Desk Stretches"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="wellness-date">Published Date</label>

              <input
                id="wellness-date"
                type="date"
                value={publishedDate}
                onChange={(event) => setPublishedDate(event.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="wellness-category">Category</label>

              <select
                id="wellness-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">Select category</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Productivity">Productivity</option>
                <option value="Physical Care">Physical Care</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="wellness-video-url">Video Link</label>

              <input
                id="wellness-video-url"
                type="url"
                value={videoFile ? "" : videoUrl}
                onChange={(event) => {
                  setVideoUrl(event.target.value);
                  setVideoFile(null);
                }}
                placeholder="Paste a video link (optional if uploading a file)"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="wellness-description">Description</label>

            <textarea
              id="wellness-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A short, friendly summary of what this video covers"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="wellness-video-file">
              Or Upload a Video File
            </label>

            <div className="upload-area">
              <input
                id="wellness-video-file"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
              />

              {videoFile && (
                <div className="file-status">
                  <strong>{videoFile.name}</strong>
                  <span>Ready to publish</span>
                </div>
              )}
            </div>
            <p className="field-hint">
              Up to 200MB. Uploaded files are stored and served directly by
              the intranet - once published, the video plays for everyone.
            </p>

            {uploadProgress !== null && (
              <div className="upload-progress">
                <div
                  className="upload-progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                />
                <span>{uploadProgress}% uploaded</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="wellness-status">Visibility</label>

            <select
              id="wellness-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="Published">Published - visible to all staff</option>
              <option value="Draft">Draft - only visible to Admins</option>
            </select>
          </div>
        </>
      );
    }

    /* CALENDAR EVENT */
    if (selectedPage === "calendar") {
      return (
        <>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event-title">Event Title *</label>

              <input
                id="event-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Quarterly Planning Meeting"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-date">Date *</label>

              <input
                id="event-date"
                type="date"
                value={publishedDate}
                onChange={(event) => setPublishedDate(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event-start">Start Time *</label>

              <input
                id="event-start"
                type="time"
                value={calendarStartTime}
                onChange={(event) => setCalendarStartTime(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-end">End Time *</label>

              <input
                id="event-end"
                type="time"
                value={calendarEndTime}
                onChange={(event) => setCalendarEndTime(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event-category">Event Category *</label>

              <select
                id="event-category"
                value={calendarCategory}
                onChange={(event) => setCalendarCategory(event.target.value)}
              >
                <option value="Meeting">Meeting</option>
                <option value="Training">Training</option>
                <option value="Leave">Leave</option>
                <option value="Deadline">Deadline</option>
                <option value="Boardroom">Boardroom</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="event-quarter">Quarter</label>

              <select
                id="event-quarter"
                value={calendarQuarter}
                onChange={(event) => setCalendarQuarter(event.target.value)}
              >
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="event-description">Description</label>

            <textarea
              id="event-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add any details staff should know before attending"
              rows="4"
            />
          </div>
        </>
      );
    }

    /* NEWS & CIRCULARS */
    if (selectedPage === "news") {
      return (
        <>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="news-title">Title *</label>

              <input
                id="news-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Department Launches New Tourism Initiative"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="news-date">Published Date</label>

              <input
                id="news-date"
                type="date"
                value={publishedDate}
                onChange={(event) => setPublishedDate(event.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="news-category">Category *</label>

              <select
                id="news-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="News">News</option>
                <option value="Announcement">Announcement</option>
                <option value="Department Update">Department Update</option>
                <option value="Newsletter">Newsletter</option>
                <option value="Circulars">Circulars</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="news-author">Author</label>

              <input
                id="news-author"
                type="text"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="Who is this from?"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="news-excerpt">Short Summary</label>

            <textarea
              id="news-excerpt"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A one or two sentence summary shown in the news list"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="news-image">Image Link</label>

            <input
              id="news-image"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Optional - paste a link to a banner image"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) => setIsFeatured(event.target.checked)}
              />
              <span>Feature this on the News & Circulars page</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="news-status">Visibility</label>

            <select
              id="news-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="Published">Published - visible to all staff</option>
              <option value="Draft">Draft - only visible to Admins</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="news-content">Full Story *</label>

            <RichTextEditor
              id="news-content"
              label="Full story content"
              value={content}
              onChange={setContent}
              placeholder="Write the full story here..."
              required
            />
          </div>
        </>
      );
    }

    /* KNOWLEDGE CENTRE (markdown-pdf) */
    if (selectedPageData.type === "markdown-pdf") {
      return (
        <>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="kc-title">Title *</label>

              <input
                id="kc-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Procurement Guidelines 2026"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="kc-date">Published Date</label>

              <input
                id="kc-date"
                type="date"
                value={publishedDate}
                onChange={(event) => setPublishedDate(event.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="kc-description">Description</label>

            <textarea
              id="kc-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A short description of this resource"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="kc-content">Overview *</label>

            <RichTextEditor
              id="kc-content"
              label="Resource overview"
              value={content}
              onChange={setContent}
              placeholder="Summarize what's in this document..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="kc-pdf">Attach PDF *</label>

            <div className="upload-area">
              <input
                id="kc-pdf"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfChange}
              />

              {pdfFile && (
                <div className="file-status">
                  <strong>{pdfFile.name}</strong>
                  <span>Ready to publish</span>
                </div>
              )}
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  /* =========================================================
     FAQ EDITOR
  ========================================================= */

  const renderFaqEditor = () => {
    if (selectedPage !== "faq") {
      return null;
    }

    return (
      <div className="content-section">
        <div className="form-group">
          <label htmlFor="faq-question">Question *</label>

          <input
            id="faq-question"
            type="text"
            value={faqQuestion}
            onChange={(event) => setFaqQuestion(event.target.value)}
            placeholder="e.g. How do I apply for an internship?"
            required
          />
        </div>

        <div className="category-row">
          <div className="form-group">
            <label htmlFor="faq-category">Category *</label>

            <select
              id="faq-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
            >
              <option value="">Select category</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="new-category-button"
            onClick={() => setShowCategoryInput(!showCategoryInput)}
          >
            + New Category
          </button>
        </div>

        {showCategoryInput && (
          <div className="new-category-box">
            <input
              type="text"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              placeholder="Enter new category"
              aria-label="New FAQ category name"
            />

            <button type="button" onClick={handleAddCategory}>
              Add Category
            </button>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="faq-answer">Answer *</label>

          <RichTextEditor
            id="faq-answer"
            label="FAQ answer"
            value={faqAnswer}
            onChange={setFaqAnswer}
            placeholder="Write a clear, friendly answer..."
            required
          />
        </div>
      </div>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="add-content-page">
      {/* HEADER */}

      <div className="content-card">
        <div className="content-section">
          <h1>Add Content</h1>

          <p>
            Publish news, FAQs, knowledge resources, policies, wellness
            content and calendar events across the DEDaT Intranet.
          </p>
        </div>
      </div>

      {/* QUICK LINKS TO OTHER ADMIN MODULES */}

      <div className="content-card admin-quicklinks">
        <span>Managing people or departments?</span>
        <Link to="/admin/employees" className="admin-quicklink">
          <FaUsers /> Employees & Staff Directory
        </Link>
        <Link to="/admin/departments" className="admin-quicklink">
          <FaBuilding /> Departments & Programmes
        </Link>
      </div>

      {/* PAGE SELECTOR */}

      <div className="content-layout">
        <div className="page-selector">
          {PAGE_OPTIONS.map((page) => (
            <button
              key={page.id}
              type="button"
              className={`page-option ${
                selectedPage === page.id ? "active" : ""
              }`}
              onClick={() => handlePageChange(page.id)}
              aria-pressed={selectedPage === page.id}
            >
              <strong>{page.name}</strong>

              <span>{page.description}</span>
            </button>
          ))}
        </div>

        {/* EDITOR */}

        <div className="content-editor-area">
          <div className="content-card">
            <div className="content-section">
              <h2>{selectedPageData.name}</h2>

              <p>{selectedPageData.description}</p>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handlePreview();
              }}
            >
              {renderContentDetails()}

              {renderFaqEditor()}

              {/* ACTION BAR */}

              <div className="action-bar">
                <button
                  type="button"
                  className="preview-button"
                  onClick={handlePreview}
                  disabled={isPublishing}
                >
                  Preview
                </button>

                <button
                  type="button"
                  className="publish-button"
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? "Publishing..." : "Publish"}
                </button>
              </div>
            </form>

            {/* MESSAGE */}

            {message && (
              <div
                className={`message ${messageType}`}
                role={messageType === "error" ? "alert" : "status"}
              >
                {message}
              </div>
            )}
          </div>

          {selectedPage === "news" && <NewsManager />}
          {selectedPage === "wellness" && <WellnessManager />}
        </div>
      </div>

      {/* PREVIEW MODAL */}

      {showPreview && (
        <div
          className="modal-overlay"
          onClick={() => setShowPreview(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setShowPreview(false);
          }}
        >
          <div
            className="preview-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="content-section">
              <h2 id="preview-modal-title">Preview</h2>

              {selectedPage !== "faq" && title && <h1>{title}</h1>}

              {description && <p>{description}</p>}

              {selectedPage === "news" && (
                <div className="news-preview-meta">
                  {category && (
                    <span>
                      <strong>Category:</strong> {category}
                    </span>
                  )}

                  {author && (
                    <span>
                      <strong>Author:</strong> {author}
                    </span>
                  )}

                  {publishedDate && (
                    <span>
                      <strong>Date:</strong> {publishedDate}
                    </span>
                  )}
                </div>
              )}

              {renderPreviewContent()}
            </div>

            <div className="action-bar">
              <button
                type="button"
                className="preview-button"
                onClick={() => setShowPreview(false)}
              >
                Back
              </button>

              <button
                type="button"
                className="publish-button"
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
