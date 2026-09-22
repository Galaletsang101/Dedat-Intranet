import React, { useEffect, useMemo, useState } from "react";
import "../styles/policies.css";



/*
|--------------------------------------------------------------------------
| PROGRAMMES
|--------------------------------------------------------------------------
*/

const programmes = [
  "All",
  "General",
];

/*
|--------------------------------------------------------------------------
| DOCUMENT TYPES
|--------------------------------------------------------------------------
*/

const documentTypes = [
  "All",
  "Policy",
  "Act / Legislation",
  "Strategy",
  "Framework",
  "Guideline",
  "Directive",
  "Plan",
  "Procedure",
  "Template",
  "Form",
  "Report",
];


/*
|--------------------------------------------------------------------------
| SUB-PROGRAMMES
|--------------------------------------------------------------------------
*/

const subProgrammes = {
  Administration: [
    "Strategic Management",
    "Monitoring & Evaluation",
    "Risk Management",
    "Governance",
    "Financial Management",
    "Economic Cluster Secretariat & IGR",
  ],

  "Corporate Services": [
    "Human Resource Administration",
    "Organisational Development & Legal Services",
    "Employee Performance Management and Development System",
    "Employee Health and Wellness",
    "Labour Relations",
  ],

  "Integrated Economic Development Services": [
    "Regional and Local Economic Development",
    "Economic Empowerment, Preferential Procurement & BBBEE",
  ],

  "Trade and Sector Development": [
    "Sector Development",
    "Trade and Investment Promotion",
  ],

  "Consumer Protection and Business Regulation": [
    "Consumer Protection",
    "Northern Cape Consumer Court",
    "Business Regulation",
  ],

  "Economic Planning": [
    "Economic Research and Policy Development",
    "Knowledge Economy Support",
  ],

  Tourism: [
    "Tourism Development",
    "Tourism Growth",
  ],
};


/*
|--------------------------------------------------------------------------
| POLICIES COMPONENT
|--------------------------------------------------------------------------
*/

function Policies() {

  const [docs, setDocs] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  loadPolicies();
}, []);

const loadPolicies = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/policies");

    if (!response.ok) {
      throw new Error("Failed to fetch policies");
    }

    const data = await response.json();

    const formattedPolicies = data.map((policy) => ({
      id: policy.id,
      title: policy.title,
      programme: policy.category || "General",
      subProgramme: policy.author || "Department",
      type: "Policy",
      version: policy.version_number || "N/A",
      date: policy.publication_date
        ? new Date(policy.publication_date).toLocaleDateString("en-ZA", {
            month: "short",
            year: "numeric",
          })
        : "N/A",
      status: policy.status || "Unknown",
      description: policy.description || "",
      keywords: `${policy.title} ${policy.policy_number || ""} ${
        policy.category || ""
      } ${policy.author || ""}`,
      size: "",
      path: policy.file_url,
    }));

    setDocs(formattedPolicies);
  } catch (error) {
    console.error("Error loading policies:", error);
    setError("Unable to load policies.");
  } finally {
    setLoading(false);
  }
};

  const [programmeFilter, setProgrammeFilter] =
    useState("All");

  const [subProgrammeFilter, setSubProgrammeFilter] =
    useState("All");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const [currentPage, setCurrentPage] =
    useState(1);

  const documentsPerPage = 10;


  /*
  |--------------------------------------------------------------------------
  | AVAILABLE SUB-PROGRAMMES
  |--------------------------------------------------------------------------
  */

  const availableSubProgrammes = useMemo(() => {

    if (programmeFilter === "All") {
      return [];
    }

    return subProgrammes[programmeFilter] || [];

  }, [programmeFilter]);


  /*
  |--------------------------------------------------------------------------
  | FILTER DOCUMENTS
  |--------------------------------------------------------------------------
  */

  const filteredDocs = useMemo(() => {

    const query =
      searchTerm.trim().toLowerCase();

    return docs.filter((document) => {

      const matchesProgramme =
        programmeFilter === "All" ||
        document.programme === programmeFilter;


      const matchesSubProgramme =
        subProgrammeFilter === "All" ||
        document.subProgramme === subProgrammeFilter;


      const matchesType =
        typeFilter === "All" ||
        document.type === typeFilter;


      const searchableText = `
        ${document.title}
        ${document.programme}
        ${document.subProgramme}
        ${document.type}
        ${document.description}
        ${document.keywords}
      `.toLowerCase();


      const matchesSearch =
        query.length === 0 ||
        searchableText.includes(query);


      return (
        matchesProgramme &&
        matchesSubProgramme &&
        matchesType &&
        matchesSearch
      );

    });

  }, [
    programmeFilter,
    subProgrammeFilter,
    typeFilter,
    searchTerm,
  ]);


  /*
  |--------------------------------------------------------------------------
  | PAGINATION CALCULATIONS
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.ceil(
    filteredDocs.length / documentsPerPage
  );


  const startIndex =
    (currentPage - 1) *
    documentsPerPage;


  const endIndex =
    startIndex + documentsPerPage;


  const currentDocuments =
    filteredDocs.slice(
      startIndex,
      endIndex
    );


  /*
  |--------------------------------------------------------------------------
  | PROGRAMME FILTER CHANGE
  |--------------------------------------------------------------------------
  */

  function handleProgrammeChange(event) {

    const selectedProgramme =
      event.target.value;

    setProgrammeFilter(
      selectedProgramme
    );

    setSubProgrammeFilter("All");

    setCurrentPage(1);
  }


  /*
  |--------------------------------------------------------------------------
  | SEARCH CHANGE
  |--------------------------------------------------------------------------
  */

  function handleSearchChange(event) {

    setSearchTerm(
      event.target.value
    );

    setCurrentPage(1);
  }


  /*
  |--------------------------------------------------------------------------
  | DOCUMENT TYPE CHANGE
  |--------------------------------------------------------------------------
  */

  function handleTypeChange(event) {

    setTypeFilter(
      event.target.value
    );

    setCurrentPage(1);
  }


  /*
  |--------------------------------------------------------------------------
  | SUB-PROGRAMME CHANGE
  |--------------------------------------------------------------------------
  */

  function handleSubProgrammeChange(event) {

    setSubProgrammeFilter(
      event.target.value
    );

    setCurrentPage(1);
  }


  /*
  |--------------------------------------------------------------------------
  | VIEW PDF
  |--------------------------------------------------------------------------
  */

  function handleView(path) {

    window.open(
      path,
      "_blank"
    );

  }


  /*
  |--------------------------------------------------------------------------
  | DOWNLOAD PDF
  |--------------------------------------------------------------------------
  */

  function handleDownload(
    path,
    title
  ) {

    const link =
      document.createElement("a");

    link.href = path;

    link.download =
      `${title}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

  }


  /*
  |--------------------------------------------------------------------------
  | CLEAR FILTERS
  |--------------------------------------------------------------------------
  */

  function clearFilters() {

    setProgrammeFilter("All");

    setSubProgrammeFilter("All");

    setTypeFilter("All");

    setSearchTerm("");

    setCurrentPage(1);

  }


  /*
  |--------------------------------------------------------------------------
  | PAGE CHANGE
  |--------------------------------------------------------------------------
  */

  function goToPage(page) {

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <div className="policies-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="list-header">

        <div>
  <h3
    style={{
      color: "var(--primary, #d85f06)",
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "0.5rem",
    }}
  >
    Department Policies
  </h3>

  <p
    style={{
      color: "#5c5b5b",
      fontSize: "1rem",
      lineHeight: "1.6",
      margin: 0,
    }}
  >
    Access departmental policies, legislation, strategies, guidelines,
    procedures, templates and reports.
  </p>
</div>

        <span className="muted">

          {filteredDocs.length}{" "}

          {filteredDocs.length === 1
            ? "Document"
            : "Documents"}

        </span>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="policies-search">

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search documents, policies, legislation, keywords..."
          aria-label="Search documents"
        />

      </div>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="policies-filter-section">


        {/* PROGRAMME */}

        <div className="filter-group">

          <label htmlFor="programme">
            Programme
          </label>

          <select
            id="programme"
            value={programmeFilter}
            onChange={handleProgrammeChange}
          >

            {programmes.map(
              (programme) => (

                <option
                  key={programme}
                  value={programme}
                >
                  {programme}
                </option>

              )
            )}

          </select>

        </div>


        {/* SUB-PROGRAMME */}

        <div className="filter-group">

          <label htmlFor="subProgramme">
            Sub-programme / Unit
          </label>

          <select
            id="subProgramme"
            value={subProgrammeFilter}
            onChange={handleSubProgrammeChange}
            disabled={
              programmeFilter === "All"
            }
          >

            <option value="All">
              All
            </option>

            {availableSubProgrammes.map(
              (subProgramme) => (

                <option
                  key={subProgramme}
                  value={subProgramme}
                >
                  {subProgramme}
                </option>

              )
            )}

          </select>

        </div>


        {/* DOCUMENT TYPE */}

        <div className="filter-group">

          <label htmlFor="documentType">
            Document Type
          </label>

          <select
            id="documentType"
            value={typeFilter}
            onChange={handleTypeChange}
          >

            {documentTypes.map(
              (type) => (

                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>

              )
            )}

          </select>

        </div>


        {/* CLEAR FILTERS */}

        <button
          className="clear-filters"
          onClick={clearFilters}
        >
          Clear Filters
        </button>

      </div>


      {/* =====================================================
          RESULTS COUNT
      ===================================================== */}

      <div className="policies-results-header">

        <span>

          Showing{" "}

          <strong>
            {filteredDocs.length === 0
              ? 0
              : startIndex + 1}
          </strong>

          {" - "}

          <strong>
            {Math.min(
              endIndex,
              filteredDocs.length
            )}
          </strong>

          {" of "}

          <strong>
            {filteredDocs.length}
          </strong>

          {" "}

          {filteredDocs.length === 1
            ? "document"
            : "documents"}

        </span>

      </div>


      {/* =====================================================
          DOCUMENT LIST
      ===================================================== */}

      <div className="policies-list">
        {loading && (
  <div className="empty-state">
    <h3>Loading policies...</h3>
  </div>
)}

{error && !loading && (
  <div className="empty-state">
    <h3>{error}</h3>
  </div>
)}


        {!loading && !error && currentDocuments.length === 0 ? (
          /* EMPTY STATE */

          <div className="empty-state">

            <div className="empty-icon">
              PDF
            </div>

            <h3>
              No documents found
            </h3>

            <p>
              No policies or documents match your
              current search and filters.
            </p>

            <button
              className="clear-empty-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>

        ) : (

          /* DOCUMENT CARDS */

          currentDocuments.map(
            (document) => (

              <div
                key={document.id}
                className="doc-card"
              >


                {/* PDF ICON */}

                <div className="doc-left">

                  <div className="doc-icon">
                    PDF
                  </div>

                </div>


                {/* DOCUMENT INFORMATION */}

                <div className="doc-body">

                  <div className="doc-title">
                    {document.title}
                  </div>


                  <div className="doc-unit">

                    {document.programme}

                    <span className="separator">
                      →
                    </span>

                    {document.subProgramme}

                  </div>


                  <div className="doc-meta">

                    <span className="document-type">
                      {document.type}
                    </span>

                    <span>
                      Version {document.version}
                    </span>

                    <span>
                      Updated {document.date}
                    </span>

                    <span>
                      {document.size}
                    </span>

                  </div>


                  <div className="doc-summary">
                    {document.description}
                  </div>


                  <div className="doc-status">

                    <span className="status-dot"></span>

                    {document.status}

                  </div>

                </div>


                {/* ACTION BUTTONS */}

                <div className="doc-actions">

                  <button
                    className="view"
                    onClick={() =>
                      handleView(
                        document.path
                      )
                    }
                  >
                    View
                  </button>


                  <button
                    className="download"
                    onClick={() =>
                      handleDownload(
                        document.path,
                        document.title
                      )
                    }
                  >
                    Download
                  </button>

                </div>

              </div>

            )
          )

        )}

      </div>


      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {totalPages > 1 && (

        <div className="policies-pagination">


          {/* PREVIOUS */}

          <button
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() =>
              goToPage(
                currentPage - 1
              )
            }
          >
            Previous
          </button>


          {/* PAGE NUMBERS */}

          <div className="pagination-numbers">

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map(
              (page) => (

                <button
                  key={page}
                  className={`pagination-number ${
                    currentPage === page
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    goToPage(page)
                  }
                >
                  {page}
                </button>

              )
            )}

          </div>


          {/* NEXT */}

          <button
            className="pagination-button"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              goToPage(
                currentPage + 1
              )
            }
          >
            Next
          </button>


        </div>

      )}

    </div>

  );

}


export default Policies;