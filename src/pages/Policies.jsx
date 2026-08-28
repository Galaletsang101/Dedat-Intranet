import React, { useMemo, useState } from "react";
import "../styles/policies.css";

/*
|--------------------------------------------------------------------------
| TEST DOCUMENT DATA
|--------------------------------------------------------------------------
*/

const docs = [
  {
    id: 1,
    title: "Recruitment and Selection Policy",
    programme: "Corporate Services",
    subProgramme: "Human Resource Administration",
    type: "Policy",
    version: "2026",
    date: "Aug 2026",
    status: "Approved",
    description:
      "Policy governing recruitment and selection of departmental employees.",
    keywords: "recruitment selection HR employees hiring",
    size: "2.4 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 2,
    title: "Risk Management Policy",
    programme: "Administration",
    subProgramme: "Risk Management",
    type: "Policy",
    version: "2026",
    date: "Aug 2026",
    status: "Approved",
    description:
      "Policy providing the framework for identifying, assessing and managing departmental risks.",
    keywords: "risk management ERM risk register",
    size: "1.8 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 3,
    title: "Employee Health and Wellness Policy",
    programme: "Corporate Services",
    subProgramme: "Employee Health and Wellness",
    type: "Policy",
    version: "2026",
    date: "Jul 2026",
    status: "Approved",
    description:
      "Guidance relating to employee health, wellness and workplace wellbeing.",
    keywords: "employee wellness health EHW diversity",
    size: "1.6 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 4,
    title: "Code of Conduct for the Public Service",
    programme: "Corporate Services",
    subProgramme: "Labour Relations",
    type: "Guideline",
    version: "2026",
    date: "Jul 2026",
    status: "Approved",
    description:
      "Guidelines relating to ethical conduct and responsibilities of public service employees.",
    keywords: "code conduct ethics employees public service",
    size: "1.2 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 5,
    title: "Consumer Protection Act",
    programme: "Consumer Protection and Business Regulation",
    subProgramme: "Consumer Protection",
    type: "Act / Legislation",
    version: "Current",
    date: "2026",
    status: "Approved",
    description:
      "Legislation relating to consumer protection and consumer rights.",
    keywords: "consumer protection legislation consumers complaints",
    size: "3.1 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 6,
    title: "Consumer Complaint Lodging Form",
    programme: "Consumer Protection and Business Regulation",
    subProgramme: "Consumer Protection",
    type: "Form",
    version: "2026",
    date: "Jun 2026",
    status: "Approved",
    description:
      "Official form for lodging a consumer complaint with the department.",
    keywords: "consumer complaint form complaint lodging",
    size: "650 KB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 7,
    title: "Northern Cape Manufacturing Strategy",
    programme: "Trade and Sector Development",
    subProgramme: "Sector Development",
    type: "Strategy",
    version: "2026",
    date: "Jun 2026",
    status: "Approved",
    description:
      "Strategy supporting manufacturing and industrial development in the Northern Cape.",
    keywords: "manufacturing industry sector development",
    size: "4.2 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 8,
    title: "Investment Opportunity Framework",
    programme: "Trade and Sector Development",
    subProgramme: "Trade and Investment Promotion",
    type: "Framework",
    version: "2026",
    date: "May 2026",
    status: "Approved",
    description:
      "Framework supporting trade and investment promotion opportunities in the province.",
    keywords: "investment trade business exporters opportunities",
    size: "2.7 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 9,
    title: "Local Economic Development Strategy",
    programme: "Integrated Economic Development Services",
    subProgramme: "Regional and Local Economic Development",
    type: "Strategy",
    version: "2026",
    date: "May 2026",
    status: "Approved",
    description:
      "Strategy supporting local economic development and inclusive economic participation.",
    keywords: "LED local economic development economy",
    size: "3.5 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 10,
    title: "Red Tape Reduction Guidelines",
    programme: "Integrated Economic Development Services",
    subProgramme: "Regional and Local Economic Development",
    type: "Guideline",
    version: "2026",
    date: "Apr 2026",
    status: "Approved",
    description:
      "Guidelines for identifying and reducing unnecessary regulatory barriers affecting businesses.",
    keywords: "red tape business regulation SMME",
    size: "1.4 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 11,
    title: "Economic Overview Report",
    programme: "Economic Planning",
    subProgramme: "Economic Research and Policy Development",
    type: "Report",
    version: "2026",
    date: "Apr 2026",
    status: "Approved",
    description:
      "Overview of economic conditions, trends and developments relevant to the Northern Cape.",
    keywords: "economic overview economy research report",
    size: "3.8 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 12,
    title: "Digital Infrastructure Guidelines",
    programme: "Economic Planning",
    subProgramme: "Knowledge Economy Support",
    type: "Guideline",
    version: "2026",
    date: "Mar 2026",
    status: "Approved",
    description:
      "Guidelines supporting digital infrastructure and knowledge economy initiatives.",
    keywords: "ICT digital broadband infrastructure technology",
    size: "2.1 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 13,
    title: "Tourism Enterprise Support Programme Guidelines",
    programme: "Tourism",
    subProgramme: "Tourism Development",
    type: "Guideline",
    version: "2026",
    date: "Mar 2026",
    status: "Approved",
    description:
      "Guidelines for tourism enterprises seeking departmental support.",
    keywords: "tourism enterprise support grant business",
    size: "2.9 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 14,
    title: "Tourism Safety Guidelines",
    programme: "Tourism",
    subProgramme: "Tourism Growth",
    type: "Guideline",
    version: "2026",
    date: "Feb 2026",
    status: "Approved",
    description:
      "Guidelines supporting safe and responsible tourism activities.",
    keywords: "tourism safety visitors tourists",
    size: "1.7 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },

  {
    id: 15,
    title: "Annual Performance Plan",
    programme: "Administration",
    subProgramme: "Strategic Management",
    type: "Plan",
    version: "2026/27",
    date: "Feb 2026",
    status: "Approved",
    description:
      "Annual departmental performance planning document outlining planned outputs and targets.",
    keywords:
      "APP annual performance plan strategic planning targets",
    size: "4.8 MB",
    path: "/assets/test-pdfs/Recruitment-Selection-Policy.pdf",
  },
];


/*
|--------------------------------------------------------------------------
| PROGRAMMES
|--------------------------------------------------------------------------
*/

const programmes = [
  "All",
  "Administration",
  "Corporate Services",
  "Integrated Economic Development Services",
  "Trade and Sector Development",
  "Consumer Protection and Business Regulation",
  "Economic Planning",
  "Tourism",
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


        {currentDocuments.length === 0 ? (

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