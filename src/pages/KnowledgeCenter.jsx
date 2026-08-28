import React, { useState } from "react";
import "../styles/KnowledgeCenter.css";

import {
  FaFileAlt,
  FaChartBar,
  FaLightbulb,
  FaSearch,
  FaUpload,
  FaDownload,
} from "react-icons/fa";

/* =========================================================
   KNOWLEDGE CENTER DOCUMENT REPOSITORY
========================================================= */

const initialDocuments = [
  /* =========================================================
     POLICIES
  ========================================================= */

  {
    name: "Risk Management Policy",
    category: "POLICY",
    programme: "Administration",
    subProgramme: "Risk Management",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Risk Management Strategy",
    category: "STRATEGY",
    programme: "Administration",
    subProgramme: "Risk Management",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Provincial EPMDS Policy",
    category: "POLICY",
    programme: "Corporate Services",
    subProgramme:
      "Employee Performance Management & Development System",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Recruitment and Selection Policy",
    category: "POLICY",
    programme: "Corporate Services",
    subProgramme: "Human Resource Administration",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Employee Health and Wellness Policies",
    category: "HR",
    programme: "Corporate Services",
    subProgramme: "Employee Health & Wellness",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Code of Conduct for the Public Service",
    category: "HR",
    programme: "Corporate Services",
    subProgramme: "Labour Relations",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Fraud Prevention and Ethics Management Strategy",
    category: "GOVERNANCE",
    programme: "Corporate Services",
    subProgramme: "Labour Relations",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Whistle-blowing Policy",
    category: "POLICY",
    programme: "Corporate Services",
    subProgramme: "Labour Relations",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Cost Containment Guidelines / Instruction",
    category: "GUIDELINE",
    programme: "Administration",
    subProgramme: "Financial Management",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "SCM prescripts",
    category: "SCM",
    programme: "Administration",
    subProgramme: "Financial Management",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Northern Cape Consumer Protection Act",
    category: "CONSUMER",
    programme: "Consumer Protection & Business Regulation",
    subProgramme: "Consumer Protection",
    version: "N/A",
    date: "N/A",
  },

  /* =========================================================
     STRATEGIC MANAGEMENT
  ========================================================= */

  {
    name: "Annual Performance Plan (APP)",
    category: "PLAN",
    programme: "Administration",
    subProgramme:
      "Strategic Management / Strategic Planning",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Quarterly Performance Reports",
    category: "REPORT",
    programme: "Administration",
    subProgramme:
      "Strategic Management / Strategic Planning",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Annual Report",
    category: "REPORT",
    programme: "Administration",
    subProgramme:
      "Strategic Management / Strategic Planning",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Departmental Outlook Indicators Template",
    category: "TEMPLATE",
    programme: "Administration",
    subProgramme:
      "Strategic Management / Strategic Planning",
    version: "N/A",
    date: "N/A",
  },

  /* =========================================================
     GOVERNANCE
  ========================================================= */

  {
    name: "Public Entity Governance / Compliance Documents",
    category: "GOVERNANCE",
    programme: "Administration",
    subProgramme: "Governance",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Entity Annual Reports",
    category: "REPORT",
    programme: "Administration",
    subProgramme: "Governance",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Entity Annual Performance Plans",
    category: "PLAN",
    programme: "Administration",
    subProgramme: "Governance",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Transfer Payment Documentation",
    category: "GOVERNANCE",
    programme: "Administration",
    subProgramme: "Governance",
    version: "N/A",
    date: "N/A",
  },

  /* =========================================================
     BBBEE
  ========================================================= */

  {
    name: "BBBEE Act Compliance Guidance",
    category: "BBBEE",
    programme: "Integrated Economic Development Services",
    subProgramme:
      "Economic Empowerment, Preferential Procurement & BBBEE",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "BBBEE-related Guidance Materials",
    category: "BBBEE",
    programme: "Integrated Economic Development Services",
    subProgramme:
      "Economic Empowerment, Preferential Procurement & BBBEE",
    version: "N/A",
    date: "N/A",
  },

  /* =========================================================
     CONSUMER PROTECTION
  ========================================================= */

  {
    name: "Complaint Lodging Form",
    category: "FORM",
    programme: "Consumer Protection & Business Regulation",
    subProgramme: "Consumer Protection",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Compliance Notice Templates",
    category: "TEMPLATE",
    programme: "Consumer Protection & Business Regulation",
    subProgramme: "Consumer Protection",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Consumer Education Material",
    category: "CONSUMER",
    programme: "Consumer Protection & Business Regulation",
    subProgramme: "Consumer Protection",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Consumer Court Referral Form",
    category: "FORM",
    programme: "Consumer Protection & Business Regulation",
    subProgramme: "Northern Cape Consumer Court",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Consumer Court Adjudication Process Guide",
    category: "GUIDELINE",
    programme: "Consumer Protection & Business Regulation",
    subProgramme: "Northern Cape Consumer Court",
    version: "N/A",
    date: "N/A",
  },

  /* =========================================================
     TOURISM
  ========================================================= */

  {
    name: "Tourism Enterprise Support Programme Guidelines",
    category: "TOURISM",
    programme: "Tourism",
    subProgramme: "Tourism Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Grant Transfer Agreement",
    category: "TOURISM",
    programme: "Tourism",
    subProgramme: "Tourism Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Grant Compliance Reporting Template",
    category: "TEMPLATE",
    programme: "Tourism",
    subProgramme: "Tourism Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Tourist Route Maps",
    category: "TOURISM",
    programme: "Tourism",
    subProgramme: "Tourism Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Walking Trail Guides",
    category: "TOURISM",
    programme: "Tourism",
    subProgramme: "Tourism Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Township Tourism Strategy",
    category: "STRATEGY",
    programme: "Tourism",
    subProgramme: "Tourism Growth",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Tourism Investment Opportunities Booklet",
    category: "TOURISM",
    programme: "Tourism",
    subProgramme: "Tourism Growth",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Tour Operator Workshop Materials",
    category: "TOURISM",
    programme: "Tourism",
    subProgramme: "Tourism Growth",
    version: "N/A",
    date: "N/A",
  },

  /* =========================================================
     ECONOMIC PLANNING / EPRD
  ========================================================= */

  {
    name: "Economic Intelligence Reports",
    category: "EPRD",
    programme: "Economic Planning",
    subProgramme:
      "Economic Research & Policy Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Economic Overview Reports",
    category: "REPORT",
    programme: "Economic Planning",
    subProgramme:
      "Economic Research & Policy Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Northern Cape Reconstruction and Recovery Plan",
    category: "PLAN",
    programme: "Economic Planning",
    subProgramme:
      "Economic Research & Policy Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Agriculture and Agro-processing Masterplan",
    category: "STRATEGY",
    programme: "Economic Planning",
    subProgramme:
      "Economic Research & Policy Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Oceans Economy Strategy",
    category: "STRATEGY",
    programme: "Economic Planning",
    subProgramme:
      "Economic Research & Policy Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Economic Research",
    category: "RESEARCH",
    programme: "Economic Planning",
    subProgramme:
      "Economic Research & Policy Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Economic Policy Documents",
    category: "RESEARCH",
    programme: "Economic Planning",
    subProgramme:
      "Economic Research & Policy Development",
    version: "N/A",
    date: "N/A",
  },

  /* =========================================================
     SECTOR DEVELOPMENT
  ========================================================= */

  {
    name: "MME Industrial Cluster Masterplan",
    category: "STRATEGY",
    programme: "Trade & Sector Development",
    subProgramme: "Sector Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Northern Cape Manufacturing Strategy",
    category: "STRATEGY",
    programme: "Trade & Sector Development",
    subProgramme: "Sector Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Mining Sector Research",
    category: "RESEARCH",
    programme: "Trade & Sector Development",
    subProgramme: "Sector Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Social Labour Plan Analysis",
    category: "RESEARCH",
    programme: "Trade & Sector Development",
    subProgramme: "Sector Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Export / Trade Research",
    category: "RESEARCH",
    programme: "Trade & Sector Development",
    subProgramme: "Sector Development",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "GI Registration Information",
    category: "GUIDELINE",
    programme: "Trade & Sector Development",
    subProgramme: "Sector Development",
    version: "N/A",
    date: "N/A",
  },

  /* =========================================================
     TRADE & INVESTMENT
  ========================================================= */

  {
    name: "NC Business Publication",
    category: "TRADE",
    programme: "Trade & Sector Development",
    subProgramme: "Trade & Investment Promotion",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Trade Invest Africa Newsletter",
    category: "TRADE",
    programme: "Trade & Sector Development",
    subProgramme: "Trade & Investment Promotion",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Africa Decisions Magazine Features",
    category: "TRADE",
    programme: "Trade & Sector Development",
    subProgramme: "Trade & Investment Promotion",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Investment Opportunity Materials",
    category: "TRADE",
    programme: "Trade & Sector Development",
    subProgramme: "Trade & Investment Promotion",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Catalytic Project Information",
    category: "TRADE",
    programme: "Trade & Sector Development",
    subProgramme: "Trade & Investment Promotion",
    version: "N/A",
    date: "N/A",
  },

  /* =========================================================
     RALED
  ========================================================= */

  {
    name: "LED Strategies",
    category: "STRATEGY",
    programme: "Integrated Economic Development Services",
    subProgramme: "RaLED",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Business Plans",
    category: "PLAN",
    programme: "Integrated Economic Development Services",
    subProgramme: "RaLED",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Project Proposals",
    category: "RESEARCH",
    programme: "Integrated Economic Development Services",
    subProgramme: "RaLED",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "EPWP Project Reports",
    category: "REPORT",
    programme: "Integrated Economic Development Services",
    subProgramme: "RaLED",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Municipal LED Information",
    category: "RESEARCH",
    programme: "Integrated Economic Development Services",
    subProgramme: "RaLED",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Section 47 Analysis",
    category: "RESEARCH",
    programme: "Integrated Economic Development Services",
    subProgramme: "RaLED",
    version: "N/A",
    date: "N/A",
  },

  /* =========================================================
     KNOWLEDGE ECONOMY SUPPORT
  ========================================================= */

  {
    name: "Planning Forum Stakeholder Database",
    category: "ICT",
    programme: "Economic Planning",
    subProgramme: "Knowledge Economy Support",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Tourist Incident Report e-form",
    category: "FORM",
    programme: "Economic Planning",
    subProgramme: "Knowledge Economy Support",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Illegal Tourist Guiding Report e-form",
    category: "FORM",
    programme: "Economic Planning",
    subProgramme: "Knowledge Economy Support",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Visitor Tracking System Documentation",
    category: "ICT",
    programme: "Economic Planning",
    subProgramme: "Knowledge Economy Support",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "SA Connect Documentation",
    category: "ICT",
    programme: "Economic Planning",
    subProgramme: "Knowledge Economy Support",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Digital Literacy Resources",
    category: "ICT",
    programme: "Economic Planning",
    subProgramme: "Knowledge Economy Support",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "ICT Entrepreneurship Resources",
    category: "ICT",
    programme: "Economic Planning",
    subProgramme: "Knowledge Economy Support",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Northern Cape Innovation Forum Information",
    category: "ICT",
    programme: "Economic Planning",
    subProgramme: "Knowledge Economy Support",
    version: "N/A",
    date: "N/A",
  },

  /* =========================================================
     REPORTS
  ========================================================= */

  {
    name:
      "Economic Recovery and Growth Intervention Monitoring Reports",
    category: "M&E",
    programme: "Administration",
    subProgramme: "Monitoring & Evaluation",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Tourism-supported Establishment Reports",
    category: "M&E",
    programme: "Administration",
    subProgramme: "Monitoring & Evaluation",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Co-operative Support Reports",
    category: "REPORT",
    programme: "Administration",
    subProgramme: "Monitoring & Evaluation",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "SMME Economic Recovery Evaluation Reports",
    category: "M&E",
    programme: "Administration",
    subProgramme: "Monitoring & Evaluation",
    version: "N/A",
    date: "N/A",
  },

  {
    name: "Tourism SMME Support Evaluation Reports",
    category: "M&E",
    programme: "Administration",
    subProgramme: "Monitoring & Evaluation",
    version: "N/A",
    date: "N/A",
  },
];

/* =========================================================
   KNOWLEDGE CENTER
========================================================= */

const KnowledgeCenter = () => {
  const [documents, setDocuments] = useState(initialDocuments);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("ALL");

  const [showUpload, setShowUpload] = useState(false);

  const [showSupport, setShowSupport] = useState(false);

  /* =========================================================
     PAGINATION
     
     5 DOCUMENTS PER PAGE
     
     PAGE 1 = DOCUMENTS 1 - 5
     PAGE 2 = DOCUMENTS 6 - 10
     PAGE 3 = DOCUMENTS 11 - 15
     etc.
  ========================================================= */

  const documentsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(1);

  /* =========================================================
     SEARCH AND CATEGORY FILTER
  ========================================================= */

  const filteredDocuments = documents.filter((doc) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      doc.name.toLowerCase().includes(searchText) ||
      doc.programme.toLowerCase().includes(searchText) ||
      doc.subProgramme.toLowerCase().includes(searchText) ||
      doc.category.toLowerCase().includes(searchText) ||
      (doc.subject &&
        doc.subject.toLowerCase().includes(searchText));

    const matchesCategory =
      category === "ALL" || doc.category === category;

    return matchesSearch && matchesCategory;
  });

  /* =========================================================
     RESET TO PAGE 1 WHEN SEARCH OR CATEGORY CHANGES
  ========================================================= */

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  /* =========================================================
     PAGINATION CALCULATIONS
  ========================================================= */

  const totalPages = Math.ceil(
    filteredDocuments.length / documentsPerPage
  );

  const startIndex =
    (currentPage - 1) * documentsPerPage;

  const endIndex =
    startIndex + documentsPerPage;

  const visibleDocuments =
    filteredDocuments.slice(startIndex, endIndex);

  /* =========================================================
     UPLOAD RESOURCE
  ========================================================= */

  const uploadResource = () => {
    alert(
      "The upload function is ready to be connected to Firebase Storage. Actual departmental documents must be supplied by the responsible programme."
    );

    setShowUpload(false);
  };

  /* =========================================================
     KNOWLEDGE STATS
  ========================================================= */

  const totalAssets = documents.length;

  const categories = new Set(
    documents.map((doc) => doc.category)
  ).size;

  const repositoryEntries = documents.length;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="knowledgecenter-app-container">

      {/* =====================================================
          HEADER
      ===================================================== */}

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
            <FaUpload />
            Upload Resource
          </button>

        </div>

      </header>


      {/* =====================================================
          PRIMARY KNOWLEDGE AREAS
      ===================================================== */}

      <section className="knowledgecenter-primary-grid">

        <Card
          icon={<FaFileAlt />}
          title="Policies Repository"
          text="Departmental mandates and regulatory frameworks."
          color="navy"
        />

        <Card
          icon={<FaChartBar />}
          title="Reports Library"
          text="Annual reviews and economic studies."
          color="green"
        />

        <Card
          icon={<FaLightbulb />}
          title="Research & Insights"
          text="Academic partnerships and analysis."
          color="orange"
        />

      </section>


      {/* =====================================================
          MAIN DOCUMENT REPOSITORY
      ===================================================== */}

      <section className="knowledgecenter-main-grid">

        <div className="knowledgecenter-table-section">

          <h2>
            Recent Documents
          </h2>

          <p>
            Search the central departmental document repository
            by document name, programme, sub-programme,
            category or subject.
          </p>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="knowledgecenter-search">

            <FaSearch />

            <input
              placeholder="Search documents, programmes or topics..."
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

              <option value="POLICY">
                POLICY
              </option>

              <option value="REPORT">
                REPORT
              </option>

              <option value="SOP">
                SOP
              </option>

              <option value="HR">
                HR
              </option>

              <option value="FINANCE">
                FINANCE
              </option>

              <option value="ICT">
                ICT
              </option>

              <option value="GOVERNANCE">
                GOVERNANCE
              </option>

              <option value="STRATEGY">
                STRATEGY
              </option>

              <option value="PLAN">
                PLAN
              </option>

              <option value="FORM">
                FORM
              </option>

              <option value="TEMPLATE">
                TEMPLATE
              </option>

              <option value="GUIDELINE">
                GUIDELINE
              </option>

              <option value="RESEARCH">
                RESEARCH
              </option>

              <option value="TOURISM">
                TOURISM
              </option>

              <option value="CONSUMER">
                CONSUMER
              </option>

              <option value="BBBEE">
                BBBEE
              </option>

              <option value="SCM">
                SCM
              </option>

              <option value="M&E">
                M&E
              </option>

              <option value="EPRD">
                EPRD
              </option>

              <option value="TRADE">
                TRADE
              </option>

            </select>

          </div>


          {/* =================================================
              DOCUMENT TABLE
          ================================================= */}

          <div className="knowledgecenter-table-wrapper">

            <table className="knowledgecenter-table">

              <colgroup>
                <col className="knowledgecenter-column-name" />
                <col className="knowledgecenter-column-category" />
                <col className="knowledgecenter-column-programme" />
                <col className="knowledgecenter-column-version" />
                <col className="knowledgecenter-column-date" />
                <col className="knowledgecenter-column-action" />
              </colgroup>

              <thead>

                <tr>

                  <th>
                    Name
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Programme
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

                {visibleDocuments.length > 0 ? (

                  visibleDocuments.map((doc, index) => (

                    <tr
                      key={`${doc.name}-${index}`}
                    >

                      <td className="knowledgecenter-document-name">

                        <div className="knowledgecenter-document-name-content">
                          <FaFileAlt />

                          <span>
                            {doc.name}
                          </span>
                        </div>

                      </td>


                      <td>

                        <span className="knowledgecenter-badge">

                          {doc.category}

                        </span>

                      </td>


                      <td>

                        {doc.programme}

                      </td>


                      <td>

                        {doc.version}

                      </td>


                      <td>

                        {doc.date}

                      </td>


                      <td>

                        <button
                          className="download-btn"
                          onClick={() =>
                            alert(
                              `The actual file for "${doc.name}" has not yet been supplied by the responsible programme.`
                            )
                          }
                        >

                          <FaDownload />

                          Download

                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="knowledgecenter-no-results"
                    >

                      No documents found.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* =================================================
              PAGINATION
              
              SEPARATE PREVIOUS AND NEXT BUTTONS
              
              PAGE 1 = 1 - 5
              PAGE 2 = 6 - 10
              PAGE 3 = 11 - 15
          ================================================= */}

          {filteredDocuments.length > documentsPerPage && (

            <div className="knowledgecenter-pagination">

              {/* PREVIOUS */}

              <button
                className="knowledgecenter-pagination-btn"
                onClick={() =>
                  setCurrentPage(
                    (page) => Math.max(1, page - 1)
                  )
                }
                disabled={currentPage === 1}
              >

                Previous

              </button>


              {/* PAGE NUMBER */}

              <button
                className="knowledgecenter-pagination-btn active"
                disabled
              >

                {currentPage}

              </button>


              {/* NEXT */}

              <button
                className="knowledgecenter-pagination-btn"
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        totalPages,
                        page + 1
                      )
                  )
                }
                disabled={
                  currentPage === totalPages
                }
              >

                Next

              </button>

            </div>

          )}

        </div>


        {/* ===================================================
            RIGHT COLUMN
        =================================================== */}

        <aside className="knowledgecenter-right-column">


          {/* =================================================
              KNOWLEDGE STATS
          ================================================= */}

          <div className="knowledgecenter-stats-card">

            <h3>
              Knowledge Stats
            </h3>


            <div className="knowledgecenter-stats">

              <div>

                <strong>
                  {totalAssets}
                </strong>

                <p>
                  Total Assets
                </p>

              </div>


              <div>

                <strong>
                  {repositoryEntries}
                </strong>

                <p>
                  Repository Entries
                </p>

              </div>


              <div>

                <strong>
                  {categories}
                </strong>

                <p>
                  Categories
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              SUPPORT
          ================================================= */}

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
              onClick={() => setShowSupport(true)}
            >

              Open Support Ticket

            </button>

          </div>


        </aside>

      </section>


      {/* =====================================================
          UPLOAD MODAL
      ===================================================== */}

      {showUpload && (

        <div className="knowledgecenter-modal">

          <div className="knowledgecenter-modal-box">

            <h2>
              Upload Resource
            </h2>


            <p>
              The final upload function must be connected to
              the actual document storage system.
            </p>


            <label>
              File
            </label>

            <input
              type="file"
            />


            <label>
              Document Name
            </label>

            <input
              type="text"
              placeholder="Enter document name"
            />


            <label>
              Programme
            </label>

            <input
              type="text"
              placeholder="Enter programme"
            />


            <label>
              Sub-programme
            </label>

            <input
              type="text"
              placeholder="Enter sub-programme"
            />


            <label>
              Category
            </label>

            <select>

              <option>
                POLICY
              </option>

              <option>
                REPORT
              </option>

              <option>
                STRATEGY
              </option>

              <option>
                PLAN
              </option>

              <option>
                FORM
              </option>

              <option>
                TEMPLATE
              </option>

              <option>
                GUIDELINE
              </option>

              <option>
                RESEARCH
              </option>

              <option>
                TOURISM
              </option>

              <option>
                CONSUMER
              </option>

              <option>
                BBBEE
              </option>

              <option>
                SCM
              </option>

              <option>
                M&E
              </option>

              <option>
                EPRD
              </option>

              <option>
                TRADE
              </option>

            </select>


            <label>
              Version
            </label>

            <input
              type="text"
              placeholder="Enter version"
            />


            <label>
              Description
            </label>

            <textarea
              placeholder="Enter document description"
            />


            <label>
              Content Owner / Maintainer
            </label>

            <input
              type="text"
              placeholder="Enter content owner"
            />


            <div className="knowledgecenter-modal-actions">

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

        </div>

      )}


      {/* =====================================================
          SUPPORT MODAL
      ===================================================== */}

      {showSupport && (

        <div className="modal">

          <div className="modal-box">

            <h2>
              Support Ticket
            </h2>


            <p>
              The Knowledge Management team can assist with:
            </p>


            <ul>

              <li>
                Finding documents
              </li>

              <li>
                Document access
              </li>

              <li>
                Uploading documents
              </li>

              <li>
                Repository issues
              </li>

              <li>
                Incorrect document information
              </li>

              <li>
                Missing documents
              </li>

              <li>
                Version updates
              </li>

            </ul>


            <textarea
              placeholder="Describe your issue..."
            />


            <p>

              <strong>
                Support contact details:
              </strong>{" "}

              To Be Confirmed.

            </p>


            <button
              onClick={() => {

                alert(
                  "Support ticket submitted successfully!"
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


/* =========================================================
   PRIMARY KNOWLEDGE CARD
========================================================= */

function Card({
  icon,
  title,
  text,
  color,
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


      <a
        href="#recent-documents"
        onClick={(e) => {

          e.preventDefault();

          document
            .querySelector(
              ".knowledgecenter-table-section"
            )
            ?.scrollIntoView({
              behavior: "smooth",
            });

        }}
      >

        View Documents →

      </a>

    </div>

  );
}


export default KnowledgeCenter;