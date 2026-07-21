import React from "react";
import "../styles/knowledgeCenter.css";

import {
  FaFileAlt,
  FaChartBar,
  FaLightbulb,
  FaClipboardList,
  FaFileContract,
  FaWpforms,
} from "react-icons/fa";


const documents = [
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
];


const KnowledgeCenter = () => {
  return (
    <div className="knowledge-app-container">

      <header className="knowledge-main-header">

        <div>
          <h1 className="knowledge-header-title">
            Institutional Repository
          </h1>

          <p className="knowledge-header-subtitle">
            Access NCDEDAT&apos;s centralized collective intelligence.
            Manage economic reports, tourism insights, and departmental
            governance documentation.
          </p>
        </div>


        <div className="knowledge-header-actions">

          <button className="knowledge-btn-outline">
            My Downloads
          </button>

          <button className="knowledge-btn-primary">
            Upload Resource
          </button>

        </div>

      </header>



      <section className="knowledge-primary-grid">

        <Card
          icon={<FaFileAlt />}
          title="Policies Repository"
          text="Departmental mandates and regulatory frameworks."
          color="navy"
        />


        <Card
          icon={<FaChartBar />}
          title="Reports Library"
          text="Annual reviews, economic outlooks and tourism studies."
          color="green"
        />


        <Card
          icon={<FaLightbulb />}
          title="Research & Insights"
          text="Academic partnerships and sector analysis."
          color="salamander"
        />

      </section>



      <section className="knowledge-utility-grid">

        <Utility
          icon={<FaClipboardList />}
          title="SOPs"
          text="Standard Operating Procedures"
        />


        <Utility
          icon={<FaFileContract />}
          title="Templates"
          text="Official branding documents"
        />


        <Utility
          icon={<FaWpforms />}
          title="Forms"
          text="Department applications"
        />

      </section>



      <section className="knowledge-main-grid">


        <div className="knowledge-table-section">

          <h2>
            Recent Documents
          </h2>


          <table>

            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Version</th>
                <th>Date</th>
              </tr>
            </thead>


            <tbody>

              {documents.map((doc)=>(
                <tr key={doc.name}>

                  <td>
                    {doc.name}
                  </td>


                  <td>
                    <span className="knowledge-badge">
                      {doc.category}
                    </span>
                  </td>


                  <td>
                    <span className="knowledge-status">
                      ● {doc.status}
                    </span>
                  </td>


                  <td>
                    {doc.version}
                  </td>


                  <td>
                    {doc.date}
                  </td>

                </tr>
              ))}


            </tbody>

          </table>

        </div>



        <aside className="knowledge-right-column">


          <div className="knowledge-stats-card">

            <h3>
              Knowledge Stats
            </h3>


            <div className="knowledge-stats">

              <div>
                <strong>
                  1284
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
                  New Month
                </p>
              </div>

            </div>

          </div>



          <div className="knowledge-support-card">

            <h3>
              Need KM Support?
            </h3>

            <p>
              Contact Information Governance team.
            </p>


            <button>
              Open Support Ticket
            </button>


          </div>


        </aside>


      </section>


    </div>
  );
};




function Card({icon,title,text,color}) {

  return (

    <div className="knowledge-card">

      <div className={`knowledge-card-icon knowledge-${color}`}>
        {icon}
      </div>


      <h3>
        {title}
      </h3>


      <p>
        {text}
      </p>


      <a href="#">
        View Documents →
      </a>


    </div>

  );

}



function Utility({icon,title,text}) {

  return (

    <div className="knowledge-utility-card">

      <div className="knowledge-utility-icon">
        {icon}
      </div>


      <h4>
        {title}
      </h4>


      <p>
        {text}
      </p>


    </div>

  );

}



export default KnowledgeCenter;