import React, { useState } from "react";
import "../styles/knowledgecenter.css";

import {
  FaFileAlt,
  FaChartBar,
  FaLightbulb,
  FaSearch,
  FaUpload,
  FaDownload,
} from "react-icons/fa";

const initialDocuments = [
  {
    name: "NC_Economic_Strategy_2024.pdf",
    category: "POLICY",
    status: "Approved",
    version: "v2.1",
    date: "2h ago",
  },
  {
    name: "Tourism_Quarterly_Q3.docx",
    category: "REPORT",
    status: "Under Review",
    version: "v1.4",
    date: "5h ago",
  },
  {
    name: "Export_Permit_Guidelines_SOP.pdf",
    category: "SOP",
    status: "Active",
    version: "v3.0",
    date: "Yesterday",
  },
  {
    name: "HR_Employee_Leave_Policy.pdf",
    category: "HR",
    status: "Approved",
    version: "v1.2",
    date: "Today",
  },
  
 
  {
    name: "Finance_Compliance_Framework.pdf",
    category: "FINANCE",
    status: "Approved",
    version: "v3.1",
    date: "Yesterday",
  },
  {
    name: "ICT_Cyber_Security_Policy.pdf",
    category: "ICT",
    status: "Active",
    version: "v1.5",
    date: "2 days ago",
  },
  
  {
    name: "Governance_Risk_Framework.pdf",
    category: "GOVERNANCE",
    status: "Approved",
    version: "v2.3",
    date: "1 week ago",
  },
  
];

const KnowledgeCenter = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [showUpload, setShowUpload] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const filteredDocuments = documents.filter((doc) => {
    return (
      doc.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "ALL" || doc.category === category)
    );
  });

  const uploadResource = () => {
    const newDoc = {
      name: "New_Department_File.pdf",
      category: "GOVERNANCE",
      status: "Pending",
      version: "v1.0",
      date: "Just now",
    };

    setDocuments([newDoc, ...documents]);
    setShowUpload(false);
  };

  return (
    <div className="knowledgecenter-app-container">
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

      <section className="knowledgecenter-main-grid">
        <div className="knowledgecenter-table-section">
          <h2>Recent Documents</h2>

          <div className="knowledgecenter-search">
            <FaSearch />

            <input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="POLICY">POLICY</option>
              <option value="REPORT">REPORT</option>
              <option value="SOP">SOP</option>
              <option value="HR">HR</option>
              <option value="FINANCE">FINANCE</option>
              <option value="ICT">ICT</option>
          
              <option value="GOVERNANCE">GOVERNANCE</option>
              
            </select>
          </div>

          <table className="knowledgecenter-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Version</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.name}>
                  <td className="knowledgecenter-document-name">
                    <FaFileAlt /> {doc.name}
                  </td>

                  <td>
                    <span className="knowledgecenter-badge">
                      {doc.category}
                    </span>
                  </td>

                  <td>
                    <span className="knowledgecenter-status">
                      ● {doc.status}
                    </span>
                  </td>

                  <td>{doc.version}</td>

                  <td>{doc.date}</td>

                  <td>
                    <button
                      className="download-btn"
                      onClick={() =>
                        alert(`Downloading ${doc.name}`)
                      }
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
                <aside className="knowledgecenter-right-column">

          <div className="knowledgecenter-stats-card">

            <h3>Knowledge Stats</h3>

            <div className="knowledgecenter-stats">

              <div>
                <strong>{documents.length}</strong>
                <p>Total Assets</p>
              </div>

              <div>
                <strong>+42</strong>
                <p>New This Month</p>
              </div>

              <div>
                <strong>10</strong>
                <p>Categories</p>
              </div>

            </div>

          </div>




          <div className="knowledgecenter-support-card">

            <h3>Need KM Support?</h3>

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




      {showUpload && (

      <div className="knowledgecenter-modal">
    <div className="knowledgecenter-modal-box">

            <h2>Upload Resource</h2>

            <input type="file" />

            <button onClick={uploadResource}>
              Upload
            </button>

            <button
              onClick={() => setShowUpload(false)}
            >
              Cancel
            </button>

          </div>

        </div>

      )}




      {showSupport && (

        <div className="modal">

          <div className="modal-box">

            <h2>Support Ticket</h2>

            <textarea
              placeholder="Describe your issue..."
            />

            <button
              onClick={() => {
                alert("Ticket submitted successfully!");
                setShowSupport(false);
              }}
            >
              Submit
            </button>

            <button
              onClick={() => setShowSupport(false)}
            >
              Cancel
            </button>

          </div>

        </div>

      )}
          </div>
  );
};

function Card({ icon, title, text, color }) {
  return (
    <div className="knowledgecenter-card">
      <div
        className={`knowledgecenter-card-icon knowledgecenter-${color}`}
      >
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <a href="#">
        View Documents →
      </a>
    </div>
  );
}

export default KnowledgeCenter;

