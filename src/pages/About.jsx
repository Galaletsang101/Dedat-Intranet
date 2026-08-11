import React from "react";
import "../styles/About.css";
import "../styles/about.css";

const About = () => {
  return (
    <div className="about-page">
      <section className="hero-section" id="hero">
        <img
          alt="Northern Cape Landscape"
          className="hero-bg"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1sJtxBxMkiHHIY7z5tuCof2AB4MQ5BfO-xY5HrUyI-t8xHBMSWWuBjGkcj0gJ6GUroLmhYJA4E88VSptlzTstv0YKODv7mECLbVHxrpLAmX07cs41i75liMTQeZM_jbzBx3Usg2eBrNDInXw4KqyckoYpJ_12-zpWLSSFjXP5lgMZyDpUIB4ERSmLnfFpIdSLZ5nsVq1wy60v6iyRsUjsFRQTFTGHIGhh-q-HQR5we9x1DBLBYxbmcg"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1 className="hero-title">About DEDaT</h1>
          <p className="hero-subtitle">
            Driving Economic Growth and Sustainable Tourism in the Northern
            Cape.
          </p>
          <div className="hero-grid">
            <div className="hero-card">
              <div className="hero-card-icon">...</div>

              <div className="hero-card-content">
                <h3 className="hero-card-title">Vision</h3>

                <p className="hero-card-text">
                  A prosperous province with sustainable economic growth and
                  tourism.
                </p>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-card-icon">
                  <svg
                    className="icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <div className="hero-card-content">
                <h3 className="hero-card-title">Mission</h3>
                <p className="hero-card-text">
                  To create an enabling environment for economic growth and
                  tourism development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section" id="values">
        <div className="container">
          <div className="values-header">
            <h2 className="section-title">Values and Culture</h2>
            <p className="section-subtitle">
              The core principles that guide our service delivery and
              departmental integrity
            </p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon red">
                <svg
                  className="icon-lg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <h4 className="value-title">Batho Pele</h4>
              <p className="value-text">
                Putting people first in everything we do, ensuring accessibility
                and high quality service for all citizens.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon green">
                <svg
                  className="icon-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h4 className="value-title">Integrity</h4>
              <p className="value-text">
                Maintaining the highest ethical standards and honesty in our
                operations and decision making processes.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon blue">
                <svg
                  className="icon-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h4 className="value-title">Accountability</h4>
              <p className="value-text">
                Taking full responsibility of our actions and the outcomes of
                our strategic initiatives and programs.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon orange">
                <svg
                  className="icon-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h4 className="value-title">Transparency</h4>
              <p className="value-text">
                Ensuring openness in all departmental activities, making
                information accessible to stakeholders and the public.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="goals-section" id="strategic-goals">
        <div className="container">
          <div className="goals-header">
            <h2 className="section-title">Strategic Goals</h2>
            <p className="section-subtitle">
              Our roadmap for transforming the Northern Cape into a leading
              economic and tourism hub
            </p>
          </div>
          <div className="goals-grid">
            <div className="goal-card purple">
              <div className="goal-icon">
                <svg
                  className="icon-md"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h4 className="goal-title">Job Creation</h4>
              <p className="goal-text">
                Facilitating sustainable employment opportunities through
                sectoral intervention and large-scale projects.
              </p>
            </div>
            <div className="goal-card red">
              <div className="goal-icon">
                <svg
                  className="icon-md"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h4 className="goal-title">SMME Support</h4>
              <p className="goal-text">
                Empowering small and medium enterprises with tools, funding
                access and mentorship for long-term growth.
              </p>
            </div>
            <div className="goal-card green">
              <div className="goal-icon">
                <svg
                  className="icon-md"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h4 className="goal-title">Tourism Promotion</h4>
              <p className="goal-text">
                Positioning the Northern Cape as a premier global travel
                destination through strategic marketing and events.
              </p>
            </div>
            <div className="goal-card orange">
              <div className="goal-icon">
                <svg
                  className="icon-md"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h4 className="goal-title">Trade &amp; Invest</h4>
              <p className="goal-text">
                Attracting foreign direct investment and expanding export
                opportunities for local provincial industries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="management-section" id="management">
        <div className="container">
          <div className="management-header">
            <h2 className="section-title">Executive Management</h2>
          </div>
          <div className="management-grid">
            <div className="management-card">
              <div className="management-img-wrapper">
                <img
                  alt="Hon. Nomsa Maseko"
                  className="management-img"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD73RGiqhnU62W6Phtbpl-raWfTdafdnc5WWcxfXn3sjfKp9UOOX2Z7SAcEXa7vWp8y5jcW_XKB3-GuY1gKbT4pByZjH0Tadz1umtGKFsMohdmUBDv5CjdXrozyEhqkmh97J221zWA9hz4C7x33PdLcUWCjfCq9YB3ESPux51TcadVvExM4wrUxGtfzPIi0afnrp-4mwBmA5qE87O_Pg-od-TLUSlbfQ6tSx16YpV8bOaM_Rj1Bd-HUUg"
                />
                <span className="management-badge mec">MEC</span>
              </div>
              <div className="management-info">
                <h3 className="management-name">Hon. Nomsa Maseko</h3>
                <p className="management-role">
                  Member of the Executive Council
                </p>
                <div className="management-actions">
                  <button className="btn-primary">
                    <svg
                      className="btn-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    Email
                  </button>
                  <button className="btn-secondary">
                    <svg
                      className="btn-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    Phone
                  </button>
                </div>
              </div>
            </div>

            <div className="management-card">
              <div className="management-img-wrapper">
                <img
                  alt="Mr. Sipho Dlamini"
                  className="management-img"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqB7XnvPPAmjI4QpxJ3bN8ORoo4KoXVwxe_zx9OJTkiGDX_NjNNfXarIjRYV8AW3yM2z_93gNdw-c63PLAhbhbUX780KJAx1UplEJbe2jOWiUYHdwZVxbM3zLghXPuWV6li2ct7v8CxqKtBYDdeKaB9bPclcX_mjChsKbhMUZ-gJS58B77909NSKFSZ19CJHtAyszzciXgdBEurxReVdBK4RAN-WemSNmfq00JzVwyeo6x8PGE-EumRg"
                />
                <span className="management-badge hod">HOD</span>
              </div>
              <div className="management-info">
                <h3 className="management-name">Mr. Sipho Dlamini</h3>
                <p className="management-role">Head of Department</p>
                <div className="management-actions">
                  <button className="btn-primary">
                    <svg
                      className="btn-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    Email
                  </button>
                  <button className="btn-secondary">
                    <svg
                      className="btn-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    Phone
                  </button>
                </div>
              </div>
            </div>

            <div className="management-card">
              <div className="management-img-wrapper">
                <img
                  alt="Ms. Sarah Jacobs"
                  className="management-img"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4AtKjr2vubg6Xq75ejzYpuJpL3-NDBs1mj6BMDKdkKG9L_LsoqLMj5_0uU6k1uynziymNx4OGdconpzZKKbhn1FhnKK9Df4U-vPydQcj3c5ul8CGKWxaXoOS72sJQVVQdFnHttunFtt8876gQC2yc5kus48ECQqBOvIYwX3ylecfHdJuGBPH6oaaUq24xkrDu33lfY8g-F0tZjL-zFfLnANn5-L7dUTLpInlvAeAAhUz5OUdPdeoVCQ"
                />
                <span className="management-badge cfo">CFO</span>
              </div>
              <div className="management-info">
                <h3 className="management-name">Ms. Sarah Jacobs</h3>
                <p className="management-role">Chief Financial Officer</p>
                <div className="management-actions">
                  <button className="btn-primary">
                    <svg
                      className="btn-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    Email
                  </button>
                  <button className="btn-secondary">
                    <svg
                      className="btn-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    Phone
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="org-section" id="org-structure">
        <div className="container">
          <div className="org-header">
            <h2 className="org-title">Organisational Structure</h2>
            <p className="org-subtitle">
              Hierarchical overview of departmental programmes and reporting
              lines
            </p>
          </div>
          <div className="org-chart">
            <div className="org-root">Head of Department (HOD)</div>
            <div className="org-vertical"></div>
            <div className="org-horizontal-wrapper">
              <div className="org-vertical"></div>
              <div className="org-vertical"></div>
              <div className="org-vertical"></div>
            </div>
            <div className="org-horizontal-line"></div>
            <div className="org-programs">
              <div className="org-program">
                <div className="org-program-content">
                  <span className="org-program-label">Programme 1</span>
                  <h4 className="org-program-title">Administration</h4>
                  <ul className="org-program-list">
                    <li>Financial Management</li>
                    <li>Corporate Service</li>
                    <li>Strategy &amp; Planning</li>
                  </ul>
                </div>
              </div>
              <div className="org-program">
                <div className="org-program-content">
                  <span className="org-program-label">Programme 2</span>
                  <h4 className="org-program-title">Economic Dev.</h4>
                  <ul className="org-program-list">
                    <li>Business Regulation</li>
                    <li>Trade &amp; Investment</li>
                    <li>SMME Support</li>
                  </ul>
                </div>
              </div>
              <div className="org-program">
                <div className="org-program-content">
                  <span className="org-program-label">Programme 3</span>
                  <h4 className="org-program-title">Tourism</h4>
                  <ul className="org-program-list">
                    <li>Tourism Planning</li>
                    <li>Tourism Marketing</li>
                    <li>Research &amp; Statistics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="timeline-section" id="history-timeline">
        <div className="container timeline-container">
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot navy"></div>
              <div className="timeline-content">
                <span className="timeline-year">1994</span>
                <h4 className="timeline-title">Department Establishment</h4>
                <p className="timeline-text">
                  Formation of the provincial economic portfolio following South
                  Africa's transition to democracy, focusing on reconstruction
                  and development.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot orange"></div>
              <div className="timeline-content">
                <span className="timeline-year">2010</span>
                <h4 className="timeline-title">Tourism Master Plan Launch</h4>
                <p className="timeline-text">
                  A comprehensive 20-year strategy initiated to capitalize on
                  the Northern Cape's unique natural assets and heritage sites.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot green"></div>
              <div className="timeline-content">
                <span className="timeline-year">2018</span>
                <h4 className="timeline-title">
                  Special Economic Zone Activation
                </h4>
                <p className="timeline-text">
                  Launch of the Upington Industrial Park and Special Economic
                  Zone, attracting over R2bn in initial investment pledges.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot red"></div>
              <div className="timeline-content">
                <span className="timeline-year">2024</span>
                <h4 className="timeline-title">New Growth Strategy</h4>
                <p className="timeline-text">
                  Adoption of the 2024-2030 Integrated Economic Growth Strategy
                  with a primary focus on green energy and digital
                  transformation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reports-section" id="reports">
        <div className="container">
          <div className="reports-header">
            <h2 className="section-title">Governance &amp; Reports</h2>
            <a className="reports-archive" href="#">
              View Archive{" "}
              <svg
                className="icon-sm"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </a>
          </div>
          <div className="reports-grid">
            <div className="report-card">
              <div className="report-icon red">
                <svg
                  className="icon-md"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <h4 className="report-title">Annual Report 2023/24</h4>
                <p className="report-desc">
                  Financial audited statements and performance metrics for the
                  last fiscal year.
                </p>
              </div>
              <button className="report-download">Download PDF</button>
            </div>
            <div className="report-card">
              <div className="report-icon blue">
                <svg
                  className="icon-md"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <h4 className="report-title">APP 2024/25</h4>
                <p className="report-desc">
                  Annual Performance Plan detailing departmental targets and
                  service delivery goals.
                </p>
              </div>
              <button className="report-download">Download PDF</button>
            </div>
            <div className="report-card">
              <div className="report-icon green">
                <svg
                  className="icon-md"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <h4 className="report-title">Strategic Plan 2020-25</h4>
                <p className="report-desc">
                  Long-term vision and framework for socio-economic
                  transformation in the province.
                </p>
              </div>
              <button className="report-download">Download PDF</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
