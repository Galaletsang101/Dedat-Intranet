import React, { useEffect, useMemo, useState } from "react";
import { getDocuments } from "../services/documentsService";
import "../styles/knowledgecenter.css";

import {
  FaFileAlt,
  FaChartBar,
  FaLightbulb,
  FaSearch,
  FaUpload,
  FaDownload,
} from "react-icons/fa";

const KnowledgeCenter = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [documents, setDocuments] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("ALL");

  const [showUpload, setShowUpload] = useState(false);

  const [showSupport, setShowSupport] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================================
  // LOAD DOCUMENTS FROM POSTGRESQL
  // =========================================================

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        setError("");

        const rows = await getDocuments();

        if (!Array.isArray(rows)) {
          setDocuments([]);
          return;
        }

        const mapped = rows.map((doc) => ({
          id: doc.id,

          name:
            doc.title ||
            "Untitled Document",

          description:
            doc.description ||
            "",

          category:
            (
              doc.category ||
              "DOCUMENT"
            ).toUpperCase(),

          status:
            (
              doc.status ||
              "PUBLISHED"
            ).toUpperCase(),

          version:
            doc.version_number ||
            "v1.0",

          date:
            doc.publication_date ||
            doc.created_at ||
            "Today",

          file_url:
            doc.file_url ||
            "",

          knowledge_owner:
            doc.knowledge_owner ||
            "",

          publication_date:
            doc.publication_date ||
            null,

          review_date:
            doc.review_date ||
            null,
        }));

        setDocuments(mapped);

      } catch (error) {
        console.error(
          "Failed to load documents:",
          error
        );

        setError(
          error?.message ||
          "Failed to load documents."
        );

        setDocuments([]);

      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);


  // =========================================================
  // CATEGORY LIST
  // =========================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        documents
          .map((doc) => doc.category)
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.sort();
  }, [documents]);


  // =========================================================
  // FILTER DOCUMENTS
  // =========================================================

  const filteredDocuments = useMemo(() => {
    const searchTerm =
      search.trim().toLowerCase();

    return documents.filter((doc) => {
      const matchesSearch =
        !searchTerm ||
        doc.name
          .toLowerCase()
          .includes(searchTerm) ||
        doc.description
          .toLowerCase()
          .includes(searchTerm) ||
        doc.category
          .toLowerCase()
          .includes(searchTerm);

      const matchesCategory =
        category === "ALL" ||
        doc.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    documents,
    search,
    category,
  ]);


  // =========================================================
  // DOWNLOAD DOCUMENT
  // =========================================================

  const downloadDocument = (doc) => {
    if (!doc.file_url) {
      alert(
        `No downloadable file is available for ${doc.name}.`
      );

      return;
    }

    window.open(
      doc.file_url,
      "_blank",
      "noopener,noreferrer"
    );
  };


  // =========================================================
  // UPLOAD RESOURCE
  // =========================================================
  //
  // The actual document creation happens through:
  //
  // Add Content
  //      ↓
  // createDocument()
  //      ↓
  // Express API
  //      ↓
  // PostgreSQL
  //
  // This button currently just closes the old mock upload
  // modal so we don't create fake documents in React state.
  //
  // =========================================================

  const uploadResource = () => {
    setShowUpload(false);

    alert(
      "Please use the Add Content page to publish a Knowledge Centre resource."
    );
  };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Today";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString(
      "en-ZA",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="knowledgecenter-app-container">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="knowledgecenter-main-header">

        <div>

          <h1 className="knowledgecenter-header-title">
            Institutional Repository
          </h1>

          <p className="knowledgecenter-header-subtitle">
            Access NCDEDAT's centralized collective intelligence.
          </p>

        </div>


        <div className="knowledgecenter-header-actions">

          <button
            className="knowledgecenter-btn-primary"
            onClick={() => setShowUpload(true)}
          >
            <FaUpload /> Upload Resource
          </button>

        </div>

      </header>


      {/* =====================================================
          PRIMARY CATEGORY CARDS
      ====================================================== */}

      <section className="knowledgecenter-primary-grid">

        <Card
          icon={<FaFileAlt />}
          title="Policies Repository"
          text="Departmental mandates and regulatory frameworks."
          color="navy"
          onClick={() => setCategory("POLICY")}
        />


        <Card
          icon={<FaChartBar />}
          title="Reports Library"
          text="Annual reviews and economic studies."
          color="green"
          onClick={() => setCategory("REPORT")}
        />


        <Card
          icon={<FaLightbulb />}
          title="Research & Insights"
          text="Academic partnerships and analysis."
          color="orange"
          onClick={() => setCategory("RESEARCH")}
        />

      </section>


      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <section className="knowledgecenter-main-grid">

        {/* ===================================================
            DOCUMENT TABLE
        ==================================================== */}

        <div className="knowledgecenter-table-section">

          <h2>
            Recent Documents
          </h2>


          {/* SEARCH + FILTER */}

          <div className="knowledgecenter-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />


            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="ALL">
                All Categories
              </option>

              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}

            </select>

          </div>


          {/* =================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="text-center py-5">

              <p>
                Loading documents...
              </p>

            </div>

          )}


          {/* =================================================
              ERROR
          ================================================== */}

          {!loading && error && (

            <div
              className="alert alert-danger"
              role="alert"
            >

              {error}

            </div>

          )}


          {/* =================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            filteredDocuments.length === 0 && (

              <div className="text-center py-5">

                <FaFileAlt
                  size={40}
                  style={{
                    marginBottom: "15px",
                  }}
                />

                <h5>
                  No documents found
                </h5>

                <p>
                  {documents.length === 0
                    ? "Documents published through Add Content will appear here."
                    : "Try changing your search or category filter."
                  }
                </p>

              </div>

            )}


          {/* =================================================
              DOCUMENT TABLE
          ================================================== */}

          {!loading &&
            !error &&
            filteredDocuments.length > 0 && (

              <table className="knowledgecenter-table">

                <thead>

                  <tr>

                    <th>
                      Name
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Version
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredDocuments.map(
                    (doc) => (

                      <tr
                        key={doc.id}
                      >

                        {/* NAME */}

                        <td className="knowledgecenter-document-name">

                          <FaFileAlt />

                          {" "}

                          {doc.name}

                        </td>


                        {/* CATEGORY */}

                        <td>

                          <span className="knowledgecenter-badge">

                            {doc.category}

                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span className="knowledgecenter-status">

                            ● {doc.status}

                          </span>

                        </td>


                        {/* VERSION */}

                        <td>

                          {doc.version}

                        </td>


                        {/* DATE */}

                        <td>

                          {formatDate(
                            doc.date
                          )}

                        </td>


                        {/* DOWNLOAD */}

                        <td>

                          <button
                            className="download-btn"
                            onClick={() =>
                              downloadDocument(
                                doc
                              )
                            }
                            disabled={
                              !doc.file_url
                            }
                          >

                            <FaDownload />

                            {" "}

                            Download

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

        </div>


        {/* ===================================================
            RIGHT COLUMN
        ==================================================== */}

        <aside className="knowledgecenter-right-column">


          {/* =================================================
              KNOWLEDGE STATS
          ================================================== */}

          <div className="knowledgecenter-stats-card">

            <h3>
              Knowledge Stats
            </h3>


            <div className="knowledgecenter-stats">

              <div>

                <strong>
                  {documents.length}
                </strong>

                <p>
                  Total Assets
                </p>

              </div>


              <div>

                <strong>
                  +42
                </strong>

                <p>
                  New This Month
                </p>

              </div>


              <div>

                <strong>
                  {categories.length}
                </strong>

                <p>
                  Categories
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              SUPPORT CARD
          ================================================== */}

          <div className="knowledgecenter-support-card">

            <h3>
              Need KM Support?
            </h3>

            <p>
              Contact the Information Governance and Knowledge
              Management team for assistance with repositories,
              document access and uploads.
            </p>


            <button
              className="knowledgecenter-support-btn"
              onClick={() =>
                setShowSupport(true)
              }
            >
              Open Support Ticket
            </button>

          </div>


        </aside>

      </section>


      {/* =====================================================
          UPLOAD MODAL
      ====================================================== */}

      {showUpload && (

        <div className="knowledgecenter-modal">

          <div className="knowledgecenter-modal-box">

            <h2>
              Upload Resource
            </h2>


            <p>
              Knowledge Centre resources should be
              published through the Add Content page.
            </p>


            <input
              type="file"
              accept=".pdf"
            />


            <button
              onClick={uploadResource}
            >
              Upload
            </button>


            <button
              onClick={() =>
                setShowUpload(false)
              }
            >
              Cancel
            </button>

          </div>

        </div>

      )}


      {/* =====================================================
          SUPPORT MODAL
      ====================================================== */}

      {showSupport && (

        <div className="modal">

          <div className="modal-box">

            <h2>
              Support Ticket
            </h2>


            <textarea
              placeholder="Describe your issue..."
            />


            <button
              onClick={() => {

                alert(
                  "Ticket submitted successfully!"
                );

                setShowSupport(false);

              }}
            >
              Submit
            </button>


            <button
              onClick={() =>
                setShowSupport(false)
              }
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </div>
  );
};


// =========================================================
// CATEGORY CARD COMPONENT
// =========================================================

function Card({
  icon,
  title,
  text,
  color,
  onClick,
}) {

  return (

    <div className="knowledgecenter-card">

      <div
        className={`knowledgecenter-card-icon knowledgecenter-${color}`}
      >
        {icon}
      </div>


      <h3>
        {title}
      </h3>


      <p>
        {text}
      </p>


      <button
        type="button"
        onClick={onClick}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          color: "inherit",
          cursor: "pointer",
          font: "inherit",
        }}
      >
        View Documents →
      </button>

    </div>

  );
}


export default KnowledgeCenter;