import React, { useState } from "react";
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
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import orgarnogram from "../../backend/database/assets/Northern_Cape_Organogram_Intranet_Updated.png";
import thamiMabijaImage from "../assets/executives/thami-mabija.jpeg";
import tebogoNgamoleImage from "../assets/executives/tebogo-ngamole.png";
import lizetteWyngaardImage from "../assets/executives/lizette-wyngaard.png";
import zahidCaderImage from "../assets/executives/zahid-cader.png";
import princeOlivierImage from "../assets/executives/prince-olivier.jpeg";
import riaanWarieImage from "../assets/executives/riaan-warie.png";
import samMabiloImage from "../assets/executives/sam-mabilo.png";
import jeanWilsonImage from "../assets/executives/jean-wilson.png";
import darrylChristiansImage from "../assets/executives/darryl-christians.png";
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
    image: null,
    initials: "ML",
    role: "MINISTRY",
    name: "Modise Letselebe",
    position: "Head of Ministry",
    phone: "073 662 7454",
    email: "diceletselebe@yahoo.com",
  },
  {
    image: null,
    initials: "KM",
    role: "MINISTRY",
    name: "Kgalalelo Matsime",
    position: "Media Liaison Officer: Ministry",
    phone: "072 516 0182",
    email: "kgalalelomatsime@gmail.com",
  },
  {
    image: thamiMabijaImage,
    initials: "TM",
    role: "HOD",
    name: "Thami Mabija",
    position: "Head of Department",
    phone: "053 839 4002",
    email: "UNgomane@ncpg.gov.za",
  },
  {
    image: tebogoNgamoleImage,
    initials: "TN",
    role: "CORPORATE SERVICES",
    name: "Tebogo Ngamole",
    position: "Chief Director: Corporate Services",
    phone: "083 631 6507",
    email: "tngamole@ncpg.gov.za",
  },
  {
    image: lizetteWyngaardImage,
    initials: "LW",
    role: "ADMINISTRATION",
    name: "Lizette Wyngaard",
    position: "Chief Director: Administration",
    phone: "053 839 4076",
    email: "mmusa@ncpg.gov.za",
  },
  {
    image: zahidCaderImage,
    initials: "ZC",
    role: "FINANCE",
    name: "Zahid Cader",
    position: "Chief Financial Officer",
    phone: "067 012 1049",
    email: "caderzah@gmail.com",
  },
  {
    image: princeOlivierImage,
    initials: "PO",
    role: "CONSUMER PROTECTION",
    name: "Adv. Prince Olivier",
    position: "Chief Director: Consumer Protection",
    phone: "082 812 5617",
    email: "POlivier@ncpg.gov.za",
  },
  {
    image: riaanWarieImage,
    initials: "RW",
    role: "TRADE & SECTOR DEVELOPMENT",
    name: "Mr. Riaan Warie",
    position: "Chief Director: Trade & Sector Development",
    phone: "053 830 4899",
    email: "rwarie@ncpg.gov.za",
  },
  {
    image: samMabiloImage,
    initials: "SM",
    role: "ECONOMIC PLANNING",
    name: "Mr. Sam Mabilo",
    position: "Chief Director: Economic Planning",
    phone: "053 830 4864",
    email: "smabilo@ncpg.gov.za",
  },
  {
    image: jeanWilsonImage,
    initials: "JW",
    role: "TOURISM",
    name: "Ms. Jean Wilson",
    position: "Chief Director: Tourism",
    phone: "053 830 4895",
    email: "jwilson@ncpg.gov.za",
  },
  {
    image: darrylChristiansImage,
    initials: "DC",
    role: "IEDS",
    name: "Mr. Darryl Christians",
    position: "Chief Director: IEDS",
    phone: "053 802 1646",
    email: "dchristians@ncpg.gov.za",
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
  const [activeExecutiveIndex, setActiveExecutiveIndex] = useState(0);

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

          <div
            className="executive-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="Executive management contacts"
          >
            <button
              type="button"
              className="executive-carousel-button executive-carousel-previous"
              aria-label="Previous executive contact"
              onClick={() =>
                setActiveExecutiveIndex((index) => Math.max(index - 1, 0))
              }
              disabled={activeExecutiveIndex === 0}
            >
              <FaChevronLeft />
            </button>

            <div className="executive-carousel-viewport">
              <div
                className="executive-carousel-track"
                style={{
                  transform: `translateX(-${activeExecutiveIndex * 100}%)`,
                }}
              >
                {executives.map((person, index) => (
                  <div
                    className="executive-carousel-slide"
                    key={person.email}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${person.name}, ${index + 1} of ${executives.length}`}
                    aria-hidden={activeExecutiveIndex !== index}
                    inert={activeExecutiveIndex !== index}
                  >
                    <article className="executive-card">
                      <div className="executive-image-wrapper">
                        {person.image ? (
                          <img src={person.image} alt={person.name} />
                        ) : (
                          <div
                            className="executive-image-placeholder"
                            role="img"
                            aria-label={`Portrait not provided for ${person.name}`}
                          >
                            {person.initials}
                          </div>
                        )}
                        <span className="executive-role">{person.role}</span>
                      </div>

                      <div className="executive-info">
                        <h3>{person.name}</h3>
                        <p>{person.position}</p>

                        <div className="executive-actions">
                          <a
                            className="primary-button"
                            href={`mailto:${person.email}`}
                          >
                            <FaEnvelope />
                            Email
                          </a>

                          <a
                            className="outline-button"
                            href={`tel:${person.phone.replace(/\s/g, "")}`}
                          >
                            <FaPhone />
                            Phone
                          </a>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="executive-carousel-button executive-carousel-next"
              aria-label="Next executive contact"
              onClick={() =>
                setActiveExecutiveIndex((index) =>
                  Math.min(index + 1, executives.length - 1)
                )
              }
              disabled={activeExecutiveIndex === executives.length - 1}
            >
              <FaChevronRight />
            </button>

            <div className="executive-carousel-footer">
              <span aria-live="polite">
                {activeExecutiveIndex + 1} / {executives.length}
              </span>
              <div
                className="executive-carousel-dots"
                role="group"
                aria-label="Choose an executive contact"
              >
                {executives.map((person, index) => (
                  <button
                    type="button"
                    key={person.email}
                    className="executive-carousel-dot"
                    aria-label={`View ${person.name}`}
                    aria-current={activeExecutiveIndex === index ? "true" : undefined}
                    onClick={() => setActiveExecutiveIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organisational Structure */}
      <section className="organisation-section">
        <div className="about-container">
          <img src={orgarnogram} alt="Organisational Structure" className="organisation-image" />
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