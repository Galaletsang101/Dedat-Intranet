import React, { useState } from 'react';
import '../styles/about.css';

const About = () => {
  // State for popup modals
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showStrategicGoal, setShowStrategicGoal] = useState(null);

  // Executive contact data
  const executiveContacts = {
    mec: {
      name: 'Hon. Nomsa Maseko',
      title: 'Member of the Executive Council',
      email: 'nomsa.maseko@ncdedat.gov.za',
      phone: '+27 (0)53 123 4567',
      office: 'MEC Office, Kimberley'
    },
    hod: {
      name: 'Mr. Sipho Dlamini',
      title: 'Head of Department',
      email: 'sipho.dlamini@ncdedat.gov.za',
      phone: '+27 (0)53 123 4568',
      office: 'HOD Office, Kimberley'
    },
    cfo: {
      name: 'Ms. Sarah Jacobs',
      title: 'Chief Financial Officer',
      email: 'sarah.jacobs@ncdedat.gov.za',
      phone: '+27 (0)53 123 4569',
      office: 'Finance Department, Kimberley'
    }
  };

  // Strategic Goals data
  const strategicGoalsData = {
    'job-creation': {
      title: 'Job Creation',
      description: 'Facilitating sustainable employment opportunities through sectoral intervention and large-scale projects.',
      initiatives: [
        'Youth Employment Programme',
        'Skills Development Training',
        'Sectoral Growth Partnerships',
        'Infrastructure Development Projects'
      ],
      progress: '65%',
      status: 'On Track'
    },
    'smme-support': {
      title: 'SMME Support',
      description: 'Empowering small and medium enterprises with tools, funding access, and mentorship for long-term growth.',
      initiatives: [
        'Business Incubation Program',
        'Access to Funding',
        'Mentorship & Coaching',
        'Market Access Support'
      ],
      progress: '72%',
      status: 'On Track'
    },
    'tourism-promotion': {
      title: 'Tourism Promotion',
      description: 'Positioning the Northern Cape as a premier global travel destination through strategic marketing and events.',
      initiatives: [
        'International Marketing Campaigns',
        'Event Sponsorships',
        'Tourism Infrastructure Development',
        'Heritage Tourism Promotion'
      ],
      progress: '58%',
      status: 'In Progress'
    },
    'trade-investment': {
      title: 'Trade & Investment',
      description: 'Attracting foreign direct investment and expanding export opportunities for local provincial industries.',
      initiatives: [
        'Investment Roadshows',
        'Export Development Program',
        'Trade Missions',
        'Investment Incentives'
      ],
      progress: '45%',
      status: 'In Progress'
    }
  };

  // Archive data
  const archiveData = [
    {
      id: 1,
      title: 'Annual Report 2022/23',
      date: 'June 2023',
      type: 'PDF',
      size: '2.4 MB',
      category: 'Annual Reports'
    },
    {
      id: 2,
      title: 'Strategic Plan 2015-2020',
      date: 'March 2015',
      type: 'PDF',
      size: '1.8 MB',
      category: 'Strategic Plans'
    },
    {
      id: 3,
      title: 'Annual Report 2021/22',
      date: 'June 2022',
      type: 'PDF',
      size: '2.1 MB',
      category: 'Annual Reports'
    },
    {
      id: 4,
      title: 'APP 2023/24',
      date: 'March 2023',
      type: 'PDF',
      size: '1.5 MB',
      category: 'Performance Plans'
    },
    {
      id: 5,
      title: 'Economic Development Strategy',
      date: 'January 2020',
      type: 'PDF',
      size: '3.2 MB',
      category: 'Strategies'
    },
    {
      id: 6,
      title: 'Tourism Master Plan 2020-25',
      date: 'August 2020',
      type: 'PDF',
      size: '4.1 MB',
      category: 'Tourism'
    }
  ];

  // Handle View Archive click
  const handleViewArchive = () => {
    setShowArchive(true);
  };

  // Close Archive
  const closeArchive = () => {
    setShowArchive(false);
  };

  // Handle Download PDF with actual file download
  const handleDownloadPDF = (reportName) => {
    const content = `
      ${reportName}
      Northern Cape Department of Economic Development and Tourism
     
      This is a sample PDF document for demonstration purposes.
     
      Document: ${reportName}
      Date: ${new Date().toLocaleDateString()}
     
      In production, this would be a real PDF file downloaded from your server.
     
      For actual implementation, replace this with:
      - API call to fetch the PDF
      - Or direct link to the PDF file in your public folder
    `;

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Handle Strategic Goal click
  const handleStrategicGoalClick = (goalKey) => {
    setShowStrategicGoal(goalKey);
  };

  // Close Strategic Goal
  const closeStrategicGoal = () => {
    setShowStrategicGoal(null);
  };

  // Handle Executive contact click
  const handleExecutiveClick = (executiveKey) => {
    setSelectedExecutive(executiveContacts[executiveKey]);
    setShowPopup(true);
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedExecutive(null);
  };

  // Handle Email click in popup
  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  // Handle Phone click in popup
  const handlePhoneClick = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="about-page">
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-overlay">
            <img
              className="hero-image"
              alt="Northern Cape landscape"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyTfTlwJ_IZIWcUO_K9u-e_SUgRTuJ9X9sysVli3W1gd_AZDMIsqd3-UzgMFRzWtsXRQ7Z27ASJrnzVegJMp5ty1VO4MAAAvIGR3jP6eTCgksNCqQo4yXfdSOako_kDxbm8it8eVTspHWHJCXsFiKZtSUEiUb5Dn-nba7E5O2ji8k54UUxrG86tzb-C4cnoyvfnbXcesGVqt57pF0tCbAcNs_oZNcofwN0v0Rh6nCj5x0FIjUGthN4KBDq480W4qHN3Ma3Fw34OQg"
            />
            <div className="hero-gradient"></div>
          </div>

          <div className="hero-content">
            <span className="hero-badge">Government of the Northern Cape</span>
            <h1 className="hero-title">About DEDaT</h1>
            <p className="hero-subtitle">
              Driving Economic Growth and Sustainable Tourism in the Northern Cape.
            </p>

            <div className="hero-grid">
              <div className="hero-card">
                <div className="hero-card-icon">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
                <h3 className="hero-card-title">Vision</h3>
                <p className="hero-card-text">
                  A prosperous province with sustainable economic growth and tourism.
                </p>
              </div>

              <div className="hero-card">
                <div className="hero-card-icon">
                  <span className="material-symbols-outlined">rocket_launch</span>
                </div>
                <h3 className="hero-card-title">Mission</h3>
                <p className="hero-card-text">
                  To create an enabling environment for economic growth and tourism development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values & Culture Section */}
        <section className="values-section">
          <div className="values-header">
            <div>
              <h2 className="section-title">Values &amp; Culture</h2>
              <p className="section-subtitle">
                The core principles that guide our service delivery and departmental integrity.
              </p>
            </div>
            <div className="values-divider"></div>
          </div>

          <div className="values-grid">
            <div className="value-card hover-shadow transition">
              <div className="value-icon-wrapper bg-secondary-light">
                <span className="material-symbols-outlined value-icon">favorite</span>
              </div>
              <h4 className="value-title">Batho Pele</h4>
              <p className="value-text">
                Putting people first in everything we do, ensuring accessibility and high-quality service for all citizens.
              </p>
            </div>

            <div className="value-card hover-shadow transition">
              <div className="value-icon-wrapper bg-tertiary-light">
                <span className="material-symbols-outlined value-icon">verified_user</span>
              </div>
              <h4 className="value-title">Integrity</h4>
              <p className="value-text">
                Maintaining the highest ethical standards and honesty in our operations and decision-making processes.
              </p>
            </div>

            <div className="value-card hover-shadow transition">
              <div className="value-icon-wrapper bg-primary-light">
                <span className="material-symbols-outlined value-icon">balance</span>
              </div>
              <h4 className="value-title">Accountability</h4>
              <p className="value-text">
                Taking full responsibility for our actions and the outcomes of our strategic initiatives and programs.
              </p>
            </div>

            <div className="value-card hover-shadow transition">
              <div className="value-icon-wrapper bg-error-light">
                <span className="material-symbols-outlined value-icon">visibility</span>
              </div>
              <h4 className="value-title">Transparency</h4>
              <p className="value-text">
                Ensuring openness in all departmental activities, making information accessible to stakeholders and the public.
              </p>
            </div>
          </div>
        </section>

        {/* Strategic Goals Section */}
        <section className="strategic-section">
          <div className="strategic-container">
            <div className="strategic-header">
              <h2 className="section-title">Strategic Goals</h2>
              <p className="section-subtitle">
                Our roadmap for transforming the Northern Cape into a leading economic and tourism hub in Southern Africa.
              </p>
            </div>

            <div className="strategic-grid">
              <div
                className="strategic-card hover-shadow transition"
                onClick={() => handleStrategicGoalClick('job-creation')}
              >
                <div className="card-bg-primary"></div>
                <span className="material-symbols-outlined strategic-icon">work_outline</span>
                <h3 className="strategic-card-title">Job Creation</h3>
                <p className="strategic-card-text">
                  Facilitating sustainable employment opportunities through sectoral intervention and large-scale projects.
                </p>
                <div className="strategic-link">
                  View Roadmap <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>

              <div
                className="strategic-card hover-shadow transition"
                onClick={() => handleStrategicGoalClick('smme-support')}
              >
                <div className="card-bg-secondary"></div>
                <span className="material-symbols-outlined strategic-icon">storefront</span>
                <h3 className="strategic-card-title">SMME Support</h3>
                <p className="strategic-card-text">
                  Empowering small and medium enterprises with tools, funding access, and mentorship for long-term growth.
                </p>
                <div className="strategic-link">
                  Support Hub <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>

              <div
                className="strategic-card hover-shadow transition"
                onClick={() => handleStrategicGoalClick('tourism-promotion')}
              >
                <div className="card-bg-tertiary"></div>
                <span className="material-symbols-outlined strategic-icon">map</span>
                <h3 className="strategic-card-title">Tourism Promotion</h3>
                <p className="strategic-card-text">
                  Positioning the Northern Cape as a premier global travel destination through strategic marketing and events.
                </p>
                <div className="strategic-link">
                  Marketing Toolkit <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>

              <div
                className="strategic-card hover-shadow transition"
                onClick={() => handleStrategicGoalClick('trade-investment')}
              >
                <div className="card-bg-error"></div>
                <span className="material-symbols-outlined strategic-icon">currency_exchange</span>
                <h3 className="strategic-card-title">Trade &amp; Investment</h3>
                <p className="strategic-card-text">
                  Attracting foreign direct investment and expanding export opportunities for local provincial industries.
                </p>
                <div className="strategic-link">
                  Investor Portal <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Executive Management Section */}
        <section className="executive-section">
          <h2 className="section-title text-center">Executive Management</h2>

          <div className="executive-grid">
            {/* MEC */}
            <div className="executive-card hover-shadow transition">
              <div className="executive-image-wrapper">
                <img
                  className="executive-image"
                  alt="MEC portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoZGc-umvsIYHbfvAaFT1oXe-inSdprn4r7EOIcFnwbVDKeEuI4DtbW1woegbBh-cxyf3RUpi25Z_nSzQsPlMRUSd13lLdwAw3tHQRhinReHlbUainfyuvrjQnSgYmD91cktwoWA-8KPTw0Xfv6z6R7w2zB3cJkZwYOvZeSq8IX_M-DEunzocmcR17H1R1Ao1eAzTNF9w4VWPyKZhfHqNd_FoCUS3uKcIUDv0M0irFqETr3Iv_2jWS89aAInRgHUuQdEtqQdaTDkw"
                />
                <div className="executive-badge bg-primary">
                  <span>MEC</span>
                </div>
              </div>

              <div className="executive-info">
                <h3 className="executive-name">Hon. Nomsa Maseko</h3>
                <p className="executive-role">Member of the Executive Council</p>

                <div className="executive-actions">
                  <button
                    className="executive-btn-primary transition"
                    onClick={() => handleExecutiveClick('mec')}
                  >
                    <span className="material-symbols-outlined">mail</span> Contact
                  </button>

                  <button
                    className="executive-btn-secondary transition"
                    onClick={() => handleExecutiveClick('mec')}
                  >
                    <span className="material-symbols-outlined">call</span> Info
                  </button>
                </div>
              </div>
            </div>

            {/* HOD */}
            <div className="executive-card hover-shadow transition">
              <div className="executive-image-wrapper">
                <img
                  className="executive-image"
                  alt="HOD portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9fSG1jT3SDeABbFX3Ui4bq0O2lZ00OAMoOvfmNZCBAg4HukrpVI-TQ4u3wifmDGzmaeRVq0mVC6IPj8-WclC_248CHfPKNrUWBXLlv0nber8Qv_G0cygb04SupwpXduYFU14wNFeox9EI-eFhmLmE-wkBwOySB5CYh8xfAhrzIDNFp-pn-I5noz2rLp1Ycp0vw46YQK4tsk511TBElB4z5TLfUc334OwM82jmEYat1-JHz1VTOfny6Had2o8h2m0Ge9Jn5kh-tbI"
                />
                <div className="executive-badge bg-secondary">
                  <span>HOD</span>
                </div>
              </div>

              <div className="executive-info">
                <h3 className="executive-name">Mr. Sipho Dlamini</h3>
                <p className="executive-role">Head of Department</p>

                <div className="executive-actions">
                  <button
                    className="executive-btn-primary transition"
                    onClick={() => handleExecutiveClick('hod')}
                  >
                    <span className="material-symbols-outlined">mail</span> Contact
                  </button>

                  <button
                    className="executive-btn-secondary transition"
                    onClick={() => handleExecutiveClick('hod')}
                  >
                    <span className="material-symbols-outlined">call</span> Info
                  </button>
                </div>
              </div>
            </div>

            {/* CFO */}
            <div className="executive-card hover-shadow transition">
              <div className="executive-image-wrapper">
                <img
                  className="executive-image"
                  alt="CFO portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv7BV6dn7T7GAsePpgTsEbLfeOWzvwgipZNjMtVt6yGVuyxNRyPgKARB1uFprOluZb0pkoKEJmPQMjIPm_bap1L5GqPEYVVuMZEUDzns603gMlPQsCf1AGXffzc8Xi1VQ4GoE3-KIe4EiLnQjIzSHXeTaovml683rbiO7mqLj9fHQoDgUueJo7mASs68NpWEJlxh0O4Rr94JcY-XCWHS5lA58CgUh49zsp93TdL9KR0pO9J4PZPrN_wwgC-CN5XJd5hMpfiVkTCKE"
                />
                <div className="executive-badge bg-tertiary">
                  <span>CFO</span>
                </div>
              </div>

              <div className="executive-info">
                <h3 className="executive-name">Ms. Sarah Jacobs</h3>
                <p className="executive-role">Chief Financial Officer</p>

                <div className="executive-actions">
                  <button
                    className="executive-btn-primary transition"
                    onClick={() => handleExecutiveClick('cfo')}
                  >
                    <span className="material-symbols-outlined">mail</span> Contact
                  </button>

                  <button
                    className="executive-btn-secondary transition"
                    onClick={() => handleExecutiveClick('cfo')}
                  >
                    <span className="material-symbols-outlined">call</span> Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Organisational Structure */}
        <section className="org-section">
          <div className="org-container">
            <div className="org-header">
              <h2 className="section-title text-on-primary">Organisational Structure</h2>
              <p className="section-subtitle text-on-primary-container">
                Hierarchical overview of departmental programmes and reporting lines.
              </p>
            </div>

            <div className="org-tree">
              <div className="org-root">Head of Department (HOD)</div>
              <div className="org-vertical-line"></div>

              <div className="org-branches-wrapper">
                <div className="org-horizontal-line"></div>

                <div className="org-branches">
                  <div className="org-branch">
                    <div className="org-branch-connector"></div>
                    <div className="org-node">
                      <h4 className="org-node-label">PROGRAMME 1</h4>
                      <p className="org-node-title">Administration</p>
                      <ul className="org-node-list">
                        <li>Financial Management</li>
                        <li>Corporate Services</li>
                        <li>Strategy &amp; Planning</li>
                      </ul>
                    </div>
                  </div>

                  <div className="org-branch">
                    <div className="org-branch-connector"></div>
                    <div className="org-node">
                      <h4 className="org-node-label">PROGRAMME 2</h4>
                      <p className="org-node-title">Economic Dev.</p>
                      <ul className="org-node-list">
                        <li>Business Regulation</li>
                        <li>Trade &amp; Investment</li>
                        <li>SMME Support</li>
                      </ul>
                    </div>
                  </div>

                  <div className="org-branch">
                    <div className="org-branch-connector"></div>
                    <div className="org-node">
                      <h4 className="org-node-label">PROGRAMME 3</h4>
                      <p className="org-node-title">Tourism</p>
                      <ul className="org-node-list">
                        <li>Tourism Planning</li>
                        <li>Tourism Marketing</li>
                        <li>Research &amp; Statistics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Department Timeline */}
        <section className="timeline-section">
          <h2 className="section-title text-center">Departmental Milestones</h2>

          <div className="timeline-container">
            <div className="timeline-item">
              <div className="timeline-dot bg-primary"></div>
              <span className="timeline-year">1994</span>
              <h4 className="timeline-title">Department Establishment</h4>
              <p className="timeline-text">
                Formation of the provincial economic portfolio following South Africa's transition to democracy, focusing on reconstruction and development.
              </p>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot bg-secondary"></div>
              <span className="timeline-year">2010</span>
              <h4 className="timeline-title">Tourism Master Plan Launch</h4>
              <p className="timeline-text">
                A comprehensive 20-year strategy initiated to capitalize on the Northern Cape's unique natural assets and heritage sites.
              </p>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot bg-tertiary"></div>
              <span className="timeline-year">2018</span>
              <h4 className="timeline-title">Special Economic Zone Activation</h4>
              <p className="timeline-text">
                Launch of the Upington Industrial Park and Special Economic Zone, attracting over R2bn in initial investment pledges.
              </p>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot bg-primary"></div>
              <span className="timeline-year">2024</span>
              <h4 className="timeline-title">New Growth Strategy</h4>
              <p className="timeline-text">
                Adoption of the 2024-2030 Integrated Economic Growth Strategy with a primary focus on green energy and digital transformation.
              </p>
            </div>
          </div>
        </section>

        {/* Governance & Reports Section */}
        <section className="governance-section">
          <div className="governance-container">
            <div className="governance-header">
              <h2 className="section-title">Governance &amp; Reports</h2>

              <button
                className="governance-btn transition"
                onClick={handleViewArchive}
              >
                View Archive <span className="material-symbols-outlined">open_in_new</span>
              </button>
            </div>

            <div className="governance-grid">
              <div className="governance-card hover-shadow transition">
                <div className="governance-icon-wrapper bg-error-light">
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>

                <div className="governance-card-content">
                  <h4 className="governance-card-title">Annual Report 2023/24</h4>
                  <p className="governance-card-text">
                    Financial audited statements and performance metrics for the last fiscal year.
                  </p>

                  <button
                    className="governance-download"
                    onClick={() => handleDownloadPDF('Annual_Report_2023-24')}
                  >
                    <span className="material-symbols-outlined">download</span> Download PDF
                  </button>
                </div>
              </div>

              <div className="governance-card hover-shadow transition">
                <div className="governance-icon-wrapper bg-primary-light">
                  <span className="material-symbols-outlined">analytics</span>
                </div>

                <div className="governance-card-content">
                  <h4 className="governance-card-title">APP 2024/25</h4>
                  <p className="governance-card-text">
                    Annual Performance Plan detailing departmental targets and service delivery goals.
                  </p>

                  <button
                    className="governance-download"
                    onClick={() => handleDownloadPDF('APP_2024-25')}
                  >
                    <span className="material-symbols-outlined">download</span> Download PDF
                  </button>
                </div>
              </div>

              <div className="governance-card hover-shadow transition">
                <div className="governance-icon-wrapper bg-tertiary-light">
                  <span className="material-symbols-outlined">strategy</span>
                </div>

                <div className="governance-card-content">
                  <h4 className="governance-card-title">Strategic Plan 2020-25</h4>
                  <p className="governance-card-text">
                    Long-term vision and framework for socio-economic transformation in the province.
                  </p>

                  <button
                    className="governance-download"
                    onClick={() => handleDownloadPDF('Strategic_Plan_2020-25')}
                  >
                    <span className="material-symbols-outlined">download</span> Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Executive Contact Popup Modal */}
      {showPopup && selectedExecutive && (
        <div className="popup-overlay" onClick={closePopup}>
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="popup-close" onClick={closePopup}>
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="popup-header">
              <h2 className="popup-title">{selectedExecutive.name}</h2>
              <p className="popup-role">{selectedExecutive.title}</p>
            </div>

            <div className="popup-divider"></div>

            <div className="popup-body">
              <div className="popup-contact-item">
                <span className="material-symbols-outlined popup-contact-icon">
                  email
                </span>

                <div>
                  <label className="popup-contact-label">Email</label>
                  <p
                    className="popup-contact-value clickable"
                    onClick={() => handleEmailClick(selectedExecutive.email)}
                  >
                    {selectedExecutive.email}
                  </p>
                </div>
              </div>

              <div className="popup-contact-item">
                <span className="material-symbols-outlined popup-contact-icon">
                  phone
                </span>

                <div>
                  <label className="popup-contact-label">Phone</label>
                  <p
                    className="popup-contact-value clickable"
                    onClick={() => handlePhoneClick(selectedExecutive.phone)}
                  >
                    {selectedExecutive.phone}
                  </p>
                </div>
              </div>

              <div className="popup-contact-item">
                <span className="material-symbols-outlined popup-contact-icon">
                  location_on
                </span>

                <div>
                  <label className="popup-contact-label">Office</label>
                  <p className="popup-contact-value">
                    {selectedExecutive.office}
                  </p>
                </div>
              </div>
            </div>

            <div className="popup-actions">
              <button
                className="popup-action-btn primary"
                onClick={() => handleEmailClick(selectedExecutive.email)}
              >
                <span className="material-symbols-outlined">email</span>
                Send Email
              </button>

              <button
                className="popup-action-btn secondary"
                onClick={() => handlePhoneClick(selectedExecutive.phone)}
              >
                <span className="material-symbols-outlined">call</span>
                Call Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchive && (
        <div className="popup-overlay" onClick={closeArchive}>
          <div
            className="popup-content archive-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="popup-close" onClick={closeArchive}>
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="popup-header">
              <h2 className="popup-title">Document Archive</h2>
              <p className="popup-role">
                Browse all governance and departmental documents
              </p>
            </div>

            <div className="popup-divider"></div>

            <div className="archive-search">
              <span className="material-symbols-outlined archive-search-icon">
                search
              </span>

              <input
                type="text"
                className="archive-search-input"
                placeholder="Search documents..."
              />
            </div>

            <div className="archive-filters">
              <button className="archive-filter active">All</button>
              <button className="archive-filter">Annual Reports</button>
              <button className="archive-filter">Strategic Plans</button>
              <button className="archive-filter">Performance Plans</button>
              <button className="archive-filter">Tourism</button>
            </div>

            <div className="archive-list">
              {archiveData.map((doc) => (
                <div key={doc.id} className="archive-item">
                  <div className="archive-item-icon">
                    <span className="material-symbols-outlined">
                      description
                    </span>
                  </div>

                  <div className="archive-item-info">
                    <h4 className="archive-item-title">{doc.title}</h4>

                    <div className="archive-item-meta">
                      <span className="archive-item-date">{doc.date}</span>
                      <span className="archive-item-type">{doc.type}</span>
                      <span className="archive-item-size">{doc.size}</span>
                      <span className="archive-item-category">
                        {doc.category}
                      </span>
                    </div>
                  </div>

                  <button
                    className="archive-item-download"
                    onClick={() => handleDownloadPDF(doc.title)}
                  >
                    <span className="material-symbols-outlined">
                      download
                    </span>
                  </button>
                </div>
              ))}
            </div>

            <div className="archive-footer">
              <span>Showing {archiveData.length} documents</span>
            </div>
          </div>
        </div>
      )}

      {/* Strategic Goal Detail Modal */}
      {showStrategicGoal && strategicGoalsData[showStrategicGoal] && (
        <div className="popup-overlay" onClick={closeStrategicGoal}>
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="popup-close"
              onClick={closeStrategicGoal}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="popup-header">
              <h2 className="popup-title">
                {strategicGoalsData[showStrategicGoal].title}
              </h2>

              <div className="strategic-goal-status">
                <span
                  className={`status-badge ${
                    strategicGoalsData[showStrategicGoal].status === 'On Track'
                      ? 'status-on-track'
                      : 'status-in-progress'
                  }`}
                >
                  {strategicGoalsData[showStrategicGoal].status}
                </span>

                <span className="progress-badge">
                  Progress: {strategicGoalsData[showStrategicGoal].progress}
                </span>
              </div>
            </div>

            <div className="popup-divider"></div>

            <div className="popup-body">
              <div className="strategic-goal-description">
                <p>
                  {strategicGoalsData[showStrategicGoal].description}
                </p>
              </div>

              <div className="strategic-goal-initiatives">
                <h4 className="initiatives-title">Key Initiatives</h4>

                <ul className="initiatives-list">
                  {strategicGoalsData[showStrategicGoal].initiatives.map(
                    (initiative, index) => (
                      <li key={index} className="initiative-item">
                        <span className="initiative-check">✓</span>
                        {initiative}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className="popup-actions">
              <button
                className="popup-action-btn primary"
                onClick={() =>
                  handleDownloadPDF(
                    strategicGoalsData[showStrategicGoal].title
                  )
                }
              >
                <span className="material-symbols-outlined">
                  download
                </span>
                Download Roadmap
              </button>

              <button
                className="popup-action-btn secondary"
                onClick={closeStrategicGoal}
              >
                <span className="material-symbols-outlined">close</span>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
