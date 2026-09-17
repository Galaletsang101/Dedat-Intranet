import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { createNews } from "../services/newsService";
import { createFaq } from "../services/faqsService";
import { createDocument } from "../services/documentsService";
import { createPolicy } from "../services/policiesService";
import { createCirculus } from "../services/circulusService";
import "../styles/addContent.css";

/* =========================================================
   PAGE OPTIONS
========================================================= */

const PAGE_OPTIONS = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Add dashboard announcements, notices and updates.",
    type: "markdown",
  },
  {
    id: "faq",
    name: "FAQ",
    description: "Create frequently asked questions and answers.",
    type: "faq",
  },
  {
    id: "homepage",
    name: "Homepage",
    description: "Add homepage announcements and information.",
    type: "markdown",
  },
  {
    id: "knowledge",
    name: "Knowledge Centre",
    description: "Add documents, guides and knowledge resources.",
    type: "markdown-pdf",
  },
  {
    id: "news",
    name: "News & Circulars",
    description:
      "Publish official news, circulars, gazettes and newsletters.",
    type: "markdown",
  },
  {
    id: "policies",
    name: "Policies",
    description: "Add and publish official departmental policy documents.",
    type: "pdf",
  },
  {
    id: "programsUnits",
    name: "Programmes & Units",
    description:
      "Add programme, sub-programme and unit information.",
    type: "program",
  },
  {
    id: "staffDirectory",
    name: "Staff Directory",
    description:
      "Add staff members and their contact information.",
    type: "staff",
  },
  {
    id: "wellness",
    name: "Wellness",
    description: "Add wellness videos and helpful resources.",
    type: "video",
  },
];

/* =========================================================
   DEFAULT MARKDOWN
========================================================= */

const DEFAULT_MARKDOWN = `# New Content

## Introduction

Write your content here.

## Details

Add the relevant information.

- Point one
- Point two
- Point three

## Contact Information

Add contact information if required.
`;

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

  const [selectedPage, setSelectedPage] = useState("policies");
  const [activeStep, setActiveStep] = useState(1);

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

  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);

  /* =========================================================
     PDF
  ========================================================= */

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  /* =========================================================
     VIDEO
  ========================================================= */

  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  /* =========================================================
     FAQ
  ========================================================= */

  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  /* =========================================================
     PROGRAMMES & UNITS
  ========================================================= */

  const [programme, setProgramme] = useState("");
  const [unit, setUnit] = useState("");

  /* =========================================================
     STAFF DIRECTORY
  ========================================================= */

  const [staffName, setStaffName] = useState("");
  const [staffPosition, setStaffPosition] = useState("");
  const [staffProgramme, setStaffProgramme] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffTelephone, setStaffTelephone] = useState("");
  const [staffDescription, setStaffDescription] = useState("");

  /* =========================================================
     UI
  ========================================================= */

  const [showGuide, setShowGuide] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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

    setMarkdown(DEFAULT_MARKDOWN);

    setPdfFile(null);
    setPdfUrl("");

    setVideoFile(null);
    setVideoUrl("");

    setFaqQuestion("");
    setFaqAnswer("");

    setProgramme("");
    setUnit("");

    setStaffName("");
    setStaffPosition("");
    setStaffProgramme("");
    setStaffEmail("");
    setStaffTelephone("");
    setStaffDescription("");

    setActiveStep(1);

    setShowGuide(false);
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
    setSelectedPage(pageId);

    setTitle("");
    setDescription("");
    setCategory("");
    setAuthor("");
    setPublishedDate("");
    setImageUrl("");
    setIsFeatured(false);

    setMarkdown(DEFAULT_MARKDOWN);

    setPdfFile(null);
    setPdfUrl("");

    setVideoFile(null);
    setVideoUrl("");

    setFaqQuestion("");
    setFaqAnswer("");

    setProgramme("");
    setUnit("");

    setStaffName("");
    setStaffPosition("");
    setStaffProgramme("");
    setStaffEmail("");
    setStaffTelephone("");
    setStaffDescription("");

    setShowCategoryInput(false);
    setNewCategory("");

    setShowPreview(false);
    setMessage("");
    setMessageType("");

    setActiveStep(1);
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

    setActiveStep(2);
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

    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);

    setMessage("");
    setMessageType("");

    setActiveStep(2);
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
    /* Dashboard */
    if (selectedPage === "dashboard") {
      if (!title.trim()) {
        setMessage("Please enter a title.");
        setMessageType("error");
        return false;
      }

      if (!markdown.trim()) {
        setMessage("Please enter some Markdown content.");
        setMessageType("error");
        return false;
      }
    }

    /* Homepage */
    if (selectedPage === "homepage") {
      if (!title.trim()) {
        setMessage("Please enter a title.");
        setMessageType("error");
        return false;
      }

      if (!markdown.trim()) {
        setMessage("Please enter some Markdown content.");
        setMessageType("error");
        return false;
      }
    }

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

      if (!markdown.trim()) {
        setMessage("Please enter some Markdown content.");
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

      if (!markdown.trim()) {
        setMessage("Please enter some Markdown content.");
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

    /* Programmes & Units */
    if (selectedPage === "programsUnits") {
      if (!programme.trim()) {
        setMessage("Please enter the programme.");
        setMessageType("error");
        return false;
      }

      if (!unit.trim()) {
        setMessage("Please enter the unit.");
        setMessageType("error");
        return false;
      }

      if (!markdown.trim()) {
        setMessage("Please enter some Markdown content.");
        setMessageType("error");
        return false;
      }
    }

    /* Staff Directory */
    if (selectedPage === "staffDirectory") {
      if (!staffName.trim()) {
        setMessage("Please enter the staff member's name.");
        setMessageType("error");
        return false;
      }

      if (!staffPosition.trim()) {
        setMessage("Please enter the staff member's position.");
        setMessageType("error");
        return false;
      }

      if (!staffProgramme.trim()) {
        setMessage("Please enter the programme.");
        setMessageType("error");
        return false;
      }

      if (!staffEmail.trim()) {
        setMessage("Please enter the staff member's email.");
        setMessageType("error");
        return false;
      }

      if (!staffTelephone.trim()) {
        setMessage("Please enter the staff member's telephone number.");
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

    return true;
  };

  /* =========================================================
     PREVIEW
  ========================================================= */

  const handlePreview = () => {
    if (!validateForm()) {
      return;
    }

    setActiveStep(3);
    setShowPreview(true);
  };

  /* =========================================================
     PREVIEW CONTENT
  ========================================================= */

  const renderPreviewContent = () => {
    if (selectedPageData.type === "video") {
      return (
        <div className="preview-media">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              className="preview-video"
            />
          ) : (
            <div className="media-placeholder">
              <span>▶</span>
              <p>Video uploaded and ready for preview.</p>
              <small>{videoFile?.name}</small>
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
          {markdown && (
            <div className="preview-markdown">
              <ReactMarkdown>{markdown}</ReactMarkdown>
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

    if (selectedPageData.type === "program") {
      return (
        <div className="preview-program">
          <h2>{unit}</h2>

          <p>
            <strong>Programme:</strong> {programme}
          </p>

          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      );
    }

    if (selectedPageData.type === "staff") {
      return (
        <div className="preview-staff">
          <h2>{staffName}</h2>

          <p>
            <strong>Position:</strong> {staffPosition}
          </p>

          <p>
            <strong>Programme:</strong> {staffProgramme}
          </p>

          <p>
            <strong>Email:</strong> {staffEmail}
          </p>

          <p>
            <strong>Telephone:</strong> {staffTelephone}
          </p>

          {staffDescription && (
            <p>
              <strong>Description:</strong> {staffDescription}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="preview-markdown">
        <ReactMarkdown>{markdown}</ReactMarkdown>
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

    /* =======================================================
       NEWS & CIRCULARS -> PostgreSQL table shape: news or circulus
    ======================================================= */

    if (selectedPage === "news") {
      try {
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
          setMessageType("success");
          setShowPreview(false);
          setActiveStep(1);

          setTimeout(() => {
            resetForm();
          }, 1200);

          return;
        }

        await createNews({
          title: title.trim(),
          excerpt: description.trim() || null,
          content_markdown: markdown,
          category: category.trim(),
          author: author.trim() || null,
          publication_date: publishedDate || null,
          image_url: imageUrl.trim() || null,
          is_featured: isFeatured,
        });

        setMessage("News article published successfully.");
        setMessageType("success");

        setShowPreview(false);
        setActiveStep(1);

        setTimeout(() => {
          resetForm();
        }, 1200);
      } catch (error) {
        console.error("Failed to publish content:", error);

        setMessage(
          error?.message ||
            "Failed to publish the content."
        );

        setMessageType("error");
      }

      return;
    }

    /* =======================================================
       FAQ -> PostgreSQL table shape: faqs
    ======================================================= */

    if (selectedPage === "faq") {
      try {
        await createFaq({
          question: faqQuestion.trim(),
          answer: faqAnswer,
          category: category.trim() || "General",
          keywords: [],
          status: "published",
        });

        setMessage("FAQ published successfully.");
        setMessageType("success");
        setShowPreview(false);
        setActiveStep(1);

        setTimeout(() => {
          resetForm();
        }, 1200);
      } catch (error) {
        console.error("Failed to publish FAQ:", error);
        setMessage(error?.message || "Failed to publish the FAQ.");
        setMessageType("error");
      }

      return;
    }

    /* =======================================================
       POLICIES -> PostgreSQL table shape: policies
    ======================================================= */

    if (selectedPage === "policies") {
      try {
        await createPolicy({
          title: title.trim(),
          policy_number: `POL-${Date.now()}`,
          description: description.trim() || "",
          category: category.trim() || "Policy",
          author: author.trim() || "",
          publication_date: publishedDate || null,
          review_date: publishedDate || null,
          version_number: "1.0",
          status: "published",
          file_url: pdfUrl || "",
        });

        setMessage("Policy published successfully.");
        setMessageType("success");
        setShowPreview(false);
        setActiveStep(1);

        setTimeout(() => {
          resetForm();
        }, 1200);
      } catch (error) {
        console.error("Failed to publish policy:", error);
        setMessage(error?.message || "Failed to publish the policy.");
        setMessageType("error");
      }

      return;
    }

    /* =======================================================
       KNOWLEDGE CENTRE -> PostgreSQL table shape: documents
    ======================================================= */

    if (selectedPage === "knowledge") {
      try {
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
        setMessageType("success");
        setShowPreview(false);
        setActiveStep(1);

        setTimeout(() => {
          resetForm();
        }, 1200);
      } catch (error) {
        console.error("Failed to publish document:", error);
        setMessage(error?.message || "Failed to publish the document.");
        setMessageType("error");
      }

      return;
    }

    /* =======================================================
       OTHER PAGES

       These still use the temporary localStorage system
       until their backend/API integrations are completed.
    ======================================================= */

    const content = {
      id: Date.now(),

      page: selectedPage,

      pageName: selectedPageData.name,

      type: selectedPageData.type,

      title:
        selectedPage === "faq"
          ? faqQuestion
          : selectedPage === "programsUnits"
          ? unit
          : selectedPage === "staffDirectory"
          ? staffName
          : title,

      description,

      category:
        selectedPage === "faq"
          ? category
          : selectedPage === "wellness"
          ? category || "Mental Health"
          : category,

      author:
        selectedPage === "news"
          ? author
          : "",

      publishedDate,

      markdown:
        selectedPage === "dashboard" ||
        selectedPage === "homepage" ||
        selectedPage === "knowledge" ||
        selectedPage === "news" ||
        selectedPage === "programsUnits"
          ? markdown
          : "",

      faq:
        selectedPage === "faq"
          ? {
              question: faqQuestion,
              answer: faqAnswer,
              category,
            }
          : null,

      pdf:
        selectedPage === "policies" ||
        selectedPage === "knowledge"
          ? {
              name: pdfFile?.name || "",
              url: pdfUrl || "",
              type: pdfFile?.type || "application/pdf",
            }
          : null,

      video:
        selectedPage === "wellness"
          ? {
              name: videoFile?.name || "",
              url: videoUrl || "",
              type: videoFile?.type || "",
            }
          : null,

      programme:
        selectedPage === "programsUnits"
          ? {
              programme,
              unit,
            }
          : null,

      staff:
        selectedPage === "staffDirectory"
          ? {
              name: staffName,
              position: staffPosition,
              programme: staffProgramme,
              email: staffEmail,
              telephone: staffTelephone,
              description: staffDescription,
            }
          : null,

      createdAt: new Date().toISOString(),
    };

    const existingContent = JSON.parse(
      localStorage.getItem("dedatPublishedContent") || "[]"
    );

    const updatedContent = [...existingContent, content];

    localStorage.setItem(
      "dedatPublishedContent",
      JSON.stringify(updatedContent)
    );

    window.dispatchEvent(new Event("dedatContentUpdated"));

    setMessage(
      `${selectedPageData.name} content published successfully.`
    );

    setMessageType("success");

    setShowPreview(false);

    setActiveStep(1);

    setTimeout(() => {
      resetForm();
    }, 1200);
  };

  /* =========================================================
     CONTENT DETAILS
  ========================================================= */

  const renderContentDetails = () => {
    /* =======================================================
       FAQ
    ======================================================= */

    if (selectedPage === "faq") {
      return null;
    }

    /* =======================================================
       POLICIES
    ======================================================= */

    if (selectedPage === "policies") {
      return (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Policy Title *</label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter policy title"
              />
            </div>

            <div className="form-group">
              <label>Published Date</label>

              <input
                type="date"
                value={publishedDate}
                onChange={(event) =>
                  setPublishedDate(event.target.value)
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Enter a short description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Upload Policy PDF *</label>

            <div className="upload-area">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfChange}
              />

              {pdfFile && (
                <div className="file-status">
                  <strong>{pdfFile.name}</strong>
                  <span>PDF ready for publishing</span>
                </div>
              )}
            </div>
          </div>
        </>
      );
    }

    /* =======================================================
       WELLNESS
    ======================================================= */

    if (selectedPage === "wellness") {
      return (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Video Title *</label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter wellness video title"
              />
            </div>

            <div className="form-group">
              <label>Published Date</label>

              <input
                type="date"
                value={publishedDate}
                onChange={(event) =>
                  setPublishedDate(event.target.value)
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">Select category</option>

                <option value="Mental Health">
                  Mental Health
                </option>

                <option value="Productivity">
                  Productivity
                </option>

                <option value="Physical Care">
                  Physical Care
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Video URL</label>

              <input
                type="url"
                value={videoFile ? "" : videoUrl}
                onChange={(event) => {
                  setVideoUrl(event.target.value);
                  setVideoFile(null);
                }}
                placeholder="Optional video URL"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Enter a short description for the video"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Upload Wellness Video</label>

            <div className="upload-area">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
              />

              {videoFile && (
                <div className="file-status">
                  <strong>{videoFile.name}</strong>
                  <span>Video ready for publishing</span>
                </div>
              )}
            </div>
          </div>
        </>
      );
    }

    /* =======================================================
       PROGRAMMES & UNITS
    ======================================================= */

    if (selectedPage === "programsUnits") {
      return (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Programme *</label>

              <input
                type="text"
                value={programme}
                onChange={(event) =>
                  setProgramme(event.target.value)
                }
                placeholder="Enter programme"
              />
            </div>

            <div className="form-group">
              <label>Unit *</label>

              <input
                type="text"
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                placeholder="Enter unit"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Enter a short description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Markdown Content *</label>

            <textarea
              className="markdown-editor"
              value={markdown}
              onChange={(event) =>
                setMarkdown(event.target.value)
              }
              rows="16"
            />
          </div>
        </>
      );
    }

    /* =======================================================
       STAFF DIRECTORY
    ======================================================= */

    if (selectedPage === "staffDirectory") {
      return (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>

              <input
                type="text"
                value={staffName}
                onChange={(event) =>
                  setStaffName(event.target.value)
                }
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label>Position *</label>

              <input
                type="text"
                value={staffPosition}
                onChange={(event) =>
                  setStaffPosition(event.target.value)
                }
                placeholder="Enter position"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Programme *</label>

              <input
                type="text"
                value={staffProgramme}
                onChange={(event) =>
                  setStaffProgramme(event.target.value)
                }
                placeholder="Enter programme"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>

              <input
                type="email"
                value={staffEmail}
                onChange={(event) =>
                  setStaffEmail(event.target.value)
                }
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Telephone *</label>

              <input
                type="text"
                value={staffTelephone}
                onChange={(event) =>
                  setStaffTelephone(event.target.value)
                }
                placeholder="Enter telephone number"
              />
            </div>

            <div className="form-group">
              <label>Published Date</label>

              <input
                type="date"
                value={publishedDate}
                onChange={(event) =>
                  setPublishedDate(event.target.value)
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              value={staffDescription}
              onChange={(event) =>
                setStaffDescription(event.target.value)
              }
              placeholder="Enter staff description"
              rows="5"
            />
          </div>
        </>
      );
    }

    /* =======================================================
       NEWS & CIRCULARS
    ======================================================= */

    if (selectedPage === "news") {
      return (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter news title"
              />
            </div>

            <div className="form-group">
              <label>Published Date</label>

              <input
                type="date"
                value={publishedDate}
                onChange={(event) =>
                  setPublishedDate(event.target.value)
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                <option value="">Select category</option>

                <option value="News">
                  News
                </option>

                <option value="Announcement">
                  Announcement
                </option>

                <option value="Department Update">
                  Department Update
                </option>

                <option value="Newsletter">
                  Newsletter
                </option>

                {/* ADDED CIRCULARS CATEGORY */}
                <option value="Circulars">
                  Circulars
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Author</label>

              <input
                type="text"
                value={author}
                onChange={(event) =>
                  setAuthor(event.target.value)
                }
                placeholder="Enter author"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Excerpt / Summary</label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Enter a short summary"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>

            <input
              type="url"
              value={imageUrl}
              onChange={(event) =>
                setImageUrl(event.target.value)
              }
              placeholder="Optional image URL"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) =>
                  setIsFeatured(event.target.checked)
                }
              />

              <span>Featured news article</span>
            </label>
          </div>

          <div className="form-group">
            <label>Markdown Content *</label>

            <textarea
              className="markdown-editor"
              value={markdown}
              onChange={(event) =>
                setMarkdown(event.target.value)
              }
              rows="18"
            />
          </div>
        </>
      );
    }

    /* =======================================================
       MARKDOWN + PDF
    ======================================================= */

    if (selectedPageData.type === "markdown-pdf") {
      return (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="form-group">
              <label>Published Date</label>

              <input
                type="date"
                value={publishedDate}
                onChange={(event) =>
                  setPublishedDate(event.target.value)
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Enter a short description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Markdown Content *</label>

            <textarea
              className="markdown-editor"
              value={markdown}
              onChange={(event) =>
                setMarkdown(event.target.value)
              }
              rows="16"
            />
          </div>

          <div className="form-group">
            <label>Upload PDF *</label>

            <div className="upload-area">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfChange}
              />

              {pdfFile && (
                <div className="file-status">
                  <strong>{pdfFile.name}</strong>
                  <span>PDF ready for publishing</span>
                </div>
              )}
            </div>
          </div>
        </>
      );
    }

    /* =======================================================
       MARKDOWN
    ======================================================= */

    return (
      <>
        <div className="form-row">
          <div className="form-group">
            <label>Title *</label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="form-group">
            <label>Published Date</label>

            <input
              type="date"
              value={publishedDate}
              onChange={(event) =>
                setPublishedDate(event.target.value)
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Enter a short description"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Markdown Content *</label>

          <textarea
            className="markdown-editor"
            value={markdown}
            onChange={(event) =>
              setMarkdown(event.target.value)
            }
            rows="18"
          />
        </div>
      </>
    );
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
          <label>Question *</label>

          <input
            type="text"
            value={faqQuestion}
            onChange={(event) =>
              setFaqQuestion(event.target.value)
            }
            placeholder="Enter frequently asked question"
          />
        </div>

        <div className="category-row">
          <div className="form-group">
            <label>Category *</label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
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
            onClick={() =>
              setShowCategoryInput(!showCategoryInput)
            }
          >
            + New Category
          </button>
        </div>

        {showCategoryInput && (
          <div className="new-category-box">
            <input
              type="text"
              value={newCategory}
              onChange={(event) =>
                setNewCategory(event.target.value)
              }
              placeholder="Enter new category"
            />

            <button
              type="button"
              onClick={handleAddCategory}
            >
              Add Category
            </button>
          </div>
        )}

        <div className="form-group">
          <label>Answer *</label>

          <textarea
            className="answer-editor"
            value={faqAnswer}
            onChange={(event) =>
              setFaqAnswer(event.target.value)
            }
            placeholder="Write the answer using Markdown if required"
            rows="12"
          />
        </div>

        <div className="faq-tip">
          <strong>Tip:</strong> You can use Markdown formatting
          inside your answer.
        </div>
      </div>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="add-content-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="content-card">
        <div className="content-section">
          <h1>Add Content</h1>

          <p>
            Use this page to create and publish content across
            the DEDaT Intranet.
          </p>
        </div>
      </div>

      {/* =====================================================
          PAGE SELECTOR
      ===================================================== */}

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
            >
              <strong>{page.name}</strong>

              <span>{page.description}</span>
            </button>
          ))}
        </div>

        {/* ===================================================
            EDITOR
        =================================================== */}

        <div className="content-editor-area">
          <div className="content-card">
            <div className="content-section">
              <h2>{selectedPageData.name}</h2>

              <p>{selectedPageData.description}</p>
            </div>

            {renderContentDetails()}

            {renderFaqEditor()}

            {/* =================================================
                ACTION BAR
            ================================================= */}

            <div className="action-bar">
              <button
                type="button"
                className="preview-button"
                onClick={handlePreview}
              >
                Preview
              </button>

              <button
                type="button"
                className="publish-button"
                onClick={handlePublish}
              >
                Publish
              </button>
            </div>

            {/* =================================================
                MESSAGE
            ================================================= */}

            {message && (
              <div className={`message ${messageType}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          GUIDE
      ===================================================== */}

      {showGuide && (
        <div className="modal-overlay">
          <div className="preview-modal">
            <h2>Content Guide</h2>

            <p>
              Use Markdown to format your content. You can use
              headings, lists, links, bold text and other
              Markdown features.
            </p>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          PREVIEW MODAL
      ===================================================== */}

      {showPreview && (
        <div className="modal-overlay">
          <div className="preview-modal">
            <div className="content-section">
              <h2>Preview</h2>

              {selectedPage !== "faq" &&
                selectedPage !== "programsUnits" &&
                selectedPage !== "staffDirectory" &&
                title && <h1>{title}</h1>}

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
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}