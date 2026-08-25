import React from "react";
import {
  FaEye,
  FaRocket,
  FaHeart,
  FaUserShield,
  FaBalanceScale,
  FaUsers,
  FaBriefcase,
  FaStore,
  FaMapMarkedAlt,
  FaCoins,
  FaEnvelope,
  FaPhone,
  FaArrowRight,
  FaFilePdf,
  FaChartLine,
  FaDownload,
  FaExternalLinkAlt,
} from "react-icons/fa";

import "../styles/about.css";

const values = [
  {
    icon: <FaHeart />,
    title: "Batho Pele",
    text: "Putting people first in everything we do, ensuring accessibility and high-quality service for all citizens.",
  },
  {
    icon: <FaUserShield />,
    title: "Integrity",
    text: "Maintaining the highest ethical standards and honesty in our operations and decision-making processes.",
  },
  {
    icon: <FaBalanceScale />,
    title: "Accountability",
    text: "Taking full responsibility for our actions and the outcomes of our strategic initiatives and programs.",
  },
  {
    icon: <FaEye />,
    title: "Transparency",
    text: "Ensuring openness in all departmental activities, making information accessible to stakeholders and the public.",
  },
];

const goals = [
  {
    icon: <FaBriefcase />,
    title: "Job Creation",
    text: "Facilitating sustainable employment opportunities through sectoral intervention and large-scale projects.",
    link: "View Roadmap",
  },
  {
    icon: <FaStore />,
    title: "SMME Support",
    text: "Empowering small and medium enterprises with tools, funding access, and mentorship for long-term growth.",
    link: "Support Hub",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Tourism Promotion",
    text: "Positioning the Northern Cape as a premier global travel destination through strategic marketing and events.",
    link: "Marketing Toolkit",
  },
  {
    icon: <FaCoins />,
    title: "Trade & Investment",
    text: "Attracting foreign direct investment and expanding export opportunities for local provincial industries.",
    link: "Investor Portal",
  },
];

const executives = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCoZGc-umvsIYHbfvAaFT1oXe-inSdprn4r7EOIcFnwbVDKeEuI4DtbW1woegbBh-cxyf3RUpi25Z_nSzQsPlMRUSd13lLdwAw3tHQRhinReHlbUainfyuvrjQnSgYmD91cktwoWA-8KPTw0Xfv6z6R7w2zB3cJkZwYOvZeSq8IX_M-DEunzocmcR17H1R1Ao1eAzTNF9w4VWPyKZhfHqNd_FoCUS3uKcIUDv0M0irFqETr3Iv_2jWS89aAInRgHUuQdEtqQdaTDkw",
    role: "MEC",
    name: "Hon. Nomsa Maseko",
    position: "Member of the Executive Council",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9fSG1jT3SDeABbFX3Ui4bq0O2lZ00OAMoOvfmNZCBAg4HukrpVI-TQ4u3wifmDGzmaeRVq0mVC6IPj8-WclC_248CHfPKNrUWBXLlv0nber8Qv_G0cygb04SupwpXduYFU14wNFeox9EI-eFhmLmE-wkBwOySB5CYh8xfAhrzIDNFp-pn-I5noz2rLp1Ycp0vw46YQK4tsk511TBElB4z5TLfUc334OwM82jmEYat1-JHz1VTOfny6Had2o8h2m0Ge9Jn5kh-tbI",
    role: "HOD",
    name: "Mr. Sipho Dlamini",
    position: "Head of Department",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCv7BV6dn7T7GAsePpgTsEbLfeOWzvwgipZNjMtVt6yGVuyxNRyPgKARB1uFprOluZb0pkoKEJmPQMjIPm_bap1L5GqPEYVVuMZEUDzns603gMlPQsCf1AGXffzc8Xi1VQ4GoE3-KIe4EiLnQjIzSHXeTaovml683rbiO7mqLj9fHQoDgUueJo7mASs68NpWEJlxh0O4Rr94JcY-XCWHS5lA58CgUh49zsp93TdL9KR0pO9J4PZPrN_wwgC-CN5XJd5hMpfiVkTCKE",
    role: "CFO",
    name: "Ms. Sarah Jacobs",
    position: "Chief Financial Officer",
  },
];

const programmes = [
  {
    number: "PROGRAMME 1",
    title: "Administration",
    items: [
      "Financial Management",
      "Corporate Services",
      "Strategy & Planning",
    ],
  },
  {
    number: "PROGRAMME 2",
    title: "Economic Dev.",
    items: [
      "Business Regulation",
      "Trade & Investment",
      "SMME Support",
    ],
  },
  {
    number: "PROGRAMME 3",
    title: "Tourism",
    items: [
      "Tourism Planning",
      "Tourism Marketing",
      "Research & Statistics",
    ],
  },
];

const milestones = [
  {
    year: "1994",
    title: "Department Establishment",
    text: "Formation of the provincial economic portfolio following South Africa's transition to democracy, focusing on reconstruction and development.",
  },
  {
    year: "2010",
    title: "Tourism Master Plan Launch",
    text: "A comprehensive 20-year strategy initiated to capitalize on the Northern Cape’s unique natural assets and heritage sites.",
  },
  {
    year: "2018",
    title: "Special Economic Zone Activation",
    text: "Launch of the Upington Industrial Park and Special Economic Zone, attracting over R2bn in initial investment pledges.",
  },
  {
    year: "2024",
    title: "New Growth Strategy",
    text: "Adoption of the 2024-2030 Integrated Economic Growth Strategy with a primary focus on green energy and digital transformation.",
  },
];

const reports = [
  {
    icon: <FaFilePdf />,
    title: "Annual Report 2023/24",
    text: "Financial audited statements and performance metrics for the last fiscal year.",
  },
  {
    icon: <FaChartLine />,
    title: "APP 2024/25",
    text: "Annual Performance Plan detailing departmental targets and service delivery goals.",
  },
  {
    icon: <FaChartLine />,
    title: "Strategic Plan 2020-25",
    text: "Long-term vision and framework for socio-economic transformation in the province.",
  },
];

function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <img
          className="about-hero-image"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyTfTlwJ_IZIWcUO_K9u-e_SUgRTuJ9X9sysVli3W1gd_AZDMIsqd3-UzgMFRzWtsXRQ7Z27ASJrnzVegJMp5ty1VO4MAAAvIGR3jP6eTCgksNCqQo4yXfdSOako_kDxbm8it8eVTspHWHJCXsFiKZtSUEiUb5Dn-nba7E5O2ji8k54UUxrG86tzb-C4cnoyvfnbXcesGVqt57pF0tCbAcNs_oZNcofwN0v0Rh6nCj5x0FIjUGthN4KBDq480W4qHN3Ma3Fw34OQg"
          alt="Northern Cape landscape"
        />

        <div className="about-hero-overlay" />

        <div className="about-container about-hero-content">
          <span className="about-badge">
            Government of the Northern Cape
          </span>

          <h1>About NCDEDAT</h1>

          <p className="about-hero-description">
            Driving Economic Growth and Sustainable Tourism in the Northern
            Cape.
          </p>

          <div className="vision-mission">
            <div className="vision-mission-card">
              <div className="vision-mission-heading">
                <FaEye />
                <h3>Vision</h3>
              </div>

              <p>
                A prosperous province with sustainable economic growth and
                tourism.
              </p>
            </div>

            <div className="vision-mission-card">
              <div className="vision-mission-heading">
                <FaRocket />
                <h3>Mission</h3>
              </div>

              <p>
                To create an enabling environment for economic growth and
                tourism development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-section values-section">
        <div className="about-container">
          <div className="section-heading">
            <div>
              <h2>Values &amp; Culture</h2>
              <p>
                The core principles that guide our service delivery and
                departmental integrity.
              </p>
            </div>

            <span className="section-divider" />
          </div>

          <div className="values-list">
            {values.map((value) => (
              <div className="value-card" key={value.title}>
                <div className="value-icon">{value.icon}</div>
                <h4>{value.title}</h4>
                <p>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Goals */}
      <section className="strategic-section">
        <div className="about-container">
          <div className="center-heading">
            <h2>Strategic Goals</h2>
            <p>
              Our roadmap for transforming the Northern Cape into a leading
              economic and tourism hub in Southern Africa.
            </p>
          </div>

          <div className="goals-list">
            {goals.map((goal) => (
              <div className="goal-card" key={goal.title}>
                <div className="goal-icon">{goal.icon}</div>

                <h3>{goal.title}</h3>

                <p>{goal.text}</p>

                <button type="button" className="goal-link">
                  {goal.link}
                  <FaArrowRight />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Management */}
      <section className="about-section executive-section">
        <div className="about-container">
          <h2 className="section-title-center">Executive Management</h2>

          <div className="executive-list">
            {executives.map((person) => (
              <div className="executive-card" key={person.role}>
                <div className="executive-image-wrapper">
                  <img src={person.image} alt={person.name} />

                  <span className="executive-role">{person.role}</span>
                </div>

                <div className="executive-info">
                  <h3>{person.name}</h3>
                  <p>{person.position}</p>

                  <div className="executive-actions">
                    <button type="button" className="primary-button">
                      <FaEnvelope />
                      Email
                    </button>

                    <button type="button" className="outline-button">
                      <FaPhone />
                      Phone
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organisational Structure */}
      <section className="organisation-section">
        <div className="about-container">
          <div className="center-heading organisation-heading">
            <h2>Organisational Structure</h2>
            <p>
              Hierarchical overview of departmental programmes and reporting
              lines.
            </p>
          </div>

          <div className="organisation-tree">
            <div className="hod-box">Head of Department (HOD)</div>

            <div className="tree-line" />

            <div className="programme-list">
              {programmes.map((programme) => (
                <div className="programme-wrapper" key={programme.number}>
                  <div className="programme-line" />

                  <div className="programme-card">
                    <span>{programme.number}</span>
                    <h3>{programme.title}</h3>

                    <ul>
                      {programme.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="about-section timeline-section">
        <div className="timeline-container">
          <h2 className="section-title-center">Departmental Milestones</h2>

          <div className="timeline">
            {milestones.map((milestone) => (
              <div className="timeline-item" key={milestone.year}>
                <span className="timeline-dot" />

                <span className="timeline-year">{milestone.year}</span>

                <h3>{milestone.title}</h3>

                <p>{milestone.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Reports */}
      <section className="reports-section">
        <div className="about-container">
          <div className="reports-heading">
            <h2>Governance &amp; Reports</h2>

            <button type="button" className="archive-button">
              View Archive
              <FaExternalLinkAlt />
            </button>
          </div>

          <div className="reports-list">
            {reports.map((report) => (
              <div className="report-card" key={report.title}>
                <div className="report-icon">{report.icon}</div>

                <div>
                  <h3>{report.title}</h3>
                  <p>{report.text}</p>

                  <button type="button" className="download-button">
                    <FaDownload />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;