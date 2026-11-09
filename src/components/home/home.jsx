// src/pages/Homepage.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from "react-dom";
import {
  Container, Row, Col, Nav, Navbar, Carousel, Button,
  Badge, Modal
} from 'react-bootstrap';
import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaHome,
  FaTh,
  FaHeadset,
  FaDoorOpen,
  FaSearchPlus,
  FaEnvelope,
  FaFileAlt,
  FaCalendarAlt,
  FaPaperPlane,
  FaShieldAlt,
  FaNewspaper,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaArrowRight,
  FaTimes,
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa';

import '../../styles/homepage.css';
import '../../styles/updatesModal.css';

// ============================================================
// SERVICES
// ============================================================

import { getNews } from "../../services/newsService";
import { getCirculus } from "../../services/circulusService";
import { getCalendarEvents } from "../../services/calendarService";
import { getDocuments } from "../../services/documentsService";
import { getSiteContent } from "../../services/siteContentService";

// ============================================================
// MAIN COMPONENT
// ============================================================

const Homepage = () => {

  const [emergencyVisible, setEmergencyVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [showUpdates, setShowUpdates] = useState(() => {
    const seenUpdates = localStorage.getItem("dedat_updates_seen");

    return !seenUpdates;
  });

  // ============================================================
  // DATABASE CONTENT
  // ============================================================

  const [homepageNews, setHomepageNews] = useState([]);
  const [homepageCirculars, setHomepageCirculars] = useState([]);
  const [homepageCarousel, setHomepageCarousel] = useState([]);
  const [homepageEvents, setHomepageEvents] = useState([]);
  const [homepageDocuments, setHomepageDocuments] = useState([]);
  const [homeContent, setHomeContent] = useState(null);
  const [homeLoading, setHomeLoading] = useState(true);

  // ============================================================
  // LOAD NEWS AND CIRCULUS FROM POSTGRESQL
  // ============================================================

  useEffect(() => {
    const loadHomepageContent = async () => {
      try {
        // ------------------------------------------------------
        // LOAD NEWS
        // ------------------------------------------------------

        const newsData = await getNews();

        if (Array.isArray(newsData) && newsData.length > 0) {

          // Sort newest first
          const sortedNews = [...newsData].sort((a, b) => {
            const dateA = new Date(
              a.created_date || a.publication_date || 0
            );

            const dateB = new Date(
              b.created_date || b.publication_date || 0
            );

            return dateB - dateA;
          });

          // ----------------------------------------------------
          // DEPARTMENTAL NEWS
          // ----------------------------------------------------

          setHomepageNews(
            sortedNews.slice(0, 4).map((item) => ({
              id: item.id,
              title: item.title,
              excerpt:
                item.excerpt ||
                item.summary ||
                "",
              category: item.category || "News",
              image: item.image_url || ""
            }))
          );

          // ----------------------------------------------------
          // HERO NEWS
          // ----------------------------------------------------

          // First look for a featured article
          const featuredNews = sortedNews.find(
            (item) =>
              item.is_featured === true ||
              item.is_featured === "true"
          );

          // If there is no featured article, use newest news
          const heroNews = featuredNews || sortedNews[0];

          if (heroNews) {
            setHomepageCarousel([
              {
                id: heroNews.id,
                title: heroNews.title,
                excerpt:
                  heroNews.excerpt ||
                  heroNews.summary ||
                  "",
                category: heroNews.category || "News",
                image: heroNews.image_url || "",
                time: heroNews.publication_date
                  ? `Published ${formatDate(heroNews.publication_date)}`
                  : "Latest News"
              }
            ]);
          }
        }

      } catch (error) {
        console.error(
          "Failed to load homepage news:",
          error
        );
      }

      try {
        // ------------------------------------------------------
        // LOAD CIRCULUS
        // ------------------------------------------------------

        const circulusData = await getCirculus();

        if (
          Array.isArray(circulusData) &&
          circulusData.length > 0
        ) {

          const sortedCirculus = [...circulusData].sort(
            (a, b) => {
              const dateA = new Date(
                a.created_date ||
                a.created_at ||
                a.publication_date ||
                0
              );

              const dateB = new Date(
                b.created_date ||
                b.created_at ||
                b.publication_date ||
                0
              );

              return dateB - dateA;
            }
          );

          setHomepageCirculars(
            sortedCirculus.slice(0, 4).map((item) => ({
              id: item.id,
              title: item.title,
              classification:
                item.classification ||
                getClassificationFromCategory(item.category),
              time: getPostedTime(
                item.created_date ||
                item.created_at ||
                item.publication_date
              )
            }))
          );
        }

      } catch (error) {
        console.error(
          "Failed to load homepage circulus:",
          error
        );
      }

      try {
        const events = await getCalendarEvents();
        setHomepageEvents(events.slice(0, 4).map((event) => {
          const start = new Date(event.start_time);
          const end = event.end_time ? new Date(event.end_time) : null;
          return {
            id: event.id,
            title: event.title,
            date: start.toLocaleDateString("en-ZA", { day: "2-digit" }),
            month: start.toLocaleDateString("en-ZA", { month: "short" }).toUpperCase(),
            time: `${start.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}${end ? ` - ${end.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}` : ""}`,
            expiry: event.category || "",
          };
        }));
      } catch (error) {
        console.error("Failed to load homepage calendar events:", error);
      }

      try {
        const documents = await getDocuments();
        setHomepageDocuments(documents.slice(0, 4).map((document) => ({
          id: document.id,
          title: document.title,
          expiry: document.review_date
            ? `Review date: ${formatDate(document.review_date)}`
            : "",
          urgency: "warning",
        })));
      } catch (error) {
        console.error("Failed to load homepage documents:", error);
      }
      try {
        const page = await getSiteContent("home");
        setHomeContent(page);
        const announcements = page?.content?.announcements || [];
        if (announcements.length) {
          setHomepageNews((current) => [
            ...announcements.map((item, index) => ({
              id: `announcement-${index}`,
              title: item.title,
              excerpt: item.description || item.markdown || "",
              category: "Announcement",
              image: "",
            })),
            ...current,
          ]);
        }
      } catch (error) {
        console.error("Failed to load homepage section content:", error);
      }
      setHomeLoading(false);
    };

    loadHomepageContent();
  }, []);

  const latestUpdates = [
    ...homepageNews.map((item) => ({
      id: `news-${item.id}`,
      icon: FaNewspaper,
      title: item.title,
      description: item.excerpt,
      type: item.category,
    })),
    ...homepageEvents.map((item) => ({
      id: `event-${item.id}`,
      icon: FaCalendarAlt,
      title: item.title,
      description: `${item.date} ${item.month} · ${item.time}`,
      type: "Calendar",
    })),
    ...homepageCirculars.map((item) => ({
      id: `circular-${item.id}`,
      icon: FaFileAlt,
      title: item.title,
      description: item.time,
      type: "Circular",
    })),
  ].slice(0, 4);
  const pageContent = homeContent?.content || {};

  // ============================================================
  // QUICK ACCESS ITEMS
  // ============================================================

  const quickAccessItems = pageContent.quick_access || [];
  const quickAccessIcons = {
    support: <FaHeadset />,
    boardroom: <FaDoorOpen />,
    employee: <FaSearchPlus />,
    email: <FaEnvelope />,
    document: <FaFileAlt />,
    calendar: <FaCalendarAlt />,
    submission: <FaPaperPlane />,
    security: <FaShieldAlt />,
  };

  // ============================================================
  // CLASSIFICATION BADGE
  // ============================================================

  const getClassificationBadge = (type) => {
    const classes = {
      'U': 'secondary',
      'I': 'primary',
      'C': 'warning',
      'S': 'danger',
      'TS': 'dark'
    };

    return classes[type] || 'secondary';
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="homepage">

      {/* Emergency Notices Bar */}

      {/*
      {emergencyVisible && (
        <div className="emergency-banner">
          <div className="d-flex align-items-center gap-2">
            <FaExclamationTriangle className="text-white" />
            <span>
              URGENT: Scheduled system maintenance for SAES eFiling this Friday from 18:00 PM.
            </span>
          </div>

          <button
            className="close-btn"
            onClick={() => setEmergencyVisible(false)}
          >
            <FaTimes />
          </button>
        </div>
      )}
      */}

      <Container fluid className="px-4 py-4">

        <Modal
          show={showUpdates}
          onHide={() => setShowUpdates(false)}
          centered
          backdropClassName="updates-backdrop"
          backdrop="static"
          keyboard={false}
          dialogClassName="updates-modal"
        >

          <Modal.Header closeButton>
            <Modal.Title>
              What's New on DeDAaT Intranet
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <p>
              Here are the latest updates available on the website:
            </p>

            {latestUpdates.map((update) => {

              const Icon = update.icon;

              return (
                <div
                  key={update.id}
                  className="update-card"
                >

                  <div className="update-icon">
                    <Icon />
                  </div>

                  <div className="update-content">

                    <h6>
                      {update.title}
                    </h6>

                    <div className="update-type">
                      {update.type}
                    </div>

                    <div className="update-description">
                      {update.description}
                    </div>

                  </div>

                </div>
              );

            })}

          </Modal.Body>

          <Modal.Footer>

            <Button
              className="updates-btn"
              onClick={() => {
                localStorage.setItem(
                  "dedat_updates_seen",
                  "true"
                );

                setShowUpdates(false);
              }}
            >
              Continue to Intranet
            </Button>

          </Modal.Footer>

        </Modal>

        <div className="homepage-container">

          {/* =====================================================
              HERO CAROUSEL
          ====================================================== */}

          <Carousel
            className="hero-carousel mb-4"
            activeIndex={currentSlide}
            onSelect={(index) => setCurrentSlide(index)}
            indicators={true}
            controls={true}
            interval={5000}
          >

            {homepageCarousel.length ? homepageCarousel.map((item) => (

              <Carousel.Item key={item.id}>

                {item.image && <img src={item.image} alt={item.title} />}

                <Carousel.Caption className="text-md-left">

                  <Badge className="badge-featured mb-2">
                    {item.category}
                  </Badge>

                  <h2>
                    {item.title}
                  </h2>

                  <p>
                    {item.excerpt}
                  </p>

                  <div className="d-flex align-items-center gap-3">

                    <Button className="btn-read">
                      Read Full Article
                      <FaArrowRight className="ms-2" />
                    </Button>

                    <span className="text-white-50">
                      {item.time}
                    </span>

                  </div>

                </Carousel.Caption>

              </Carousel.Item>

            )) : (
              <Carousel.Item>
                <div className="hero-carousel-empty">
                  <h2>{homeLoading ? "Loading latest news..." : "No news has been published yet."}</h2>
                </div>
              </Carousel.Item>
            )}

          </Carousel>

          <Row className="g-4">

            {/* =================================================
                LEFT COLUMN
            ================================================== */}

            <Col lg={8}>

              {/* =================================================
                  QUICK ACCESS PORTAL
              ================================================== */}

              <section className="mb-4">

                <h4 className="section-title mb-3">
                  <FaTh className="section-icon" />
                  Quick Access Portal
                </h4>

                <Row className="g-3">

                  {quickAccessItems.map((item, index) => (

                    <Col
                      xs={6}
                      sm={4}
                      md={3}
                      key={index}
                    >

                      <div className="quick-access-card">

                        <div className="icon-wrapper">
                          {quickAccessIcons[item.icon] || <FaFileAlt />}
                        </div>

                        <span className="card-label">
                          {item.label}
                        </span>

                      </div>

                    </Col>

                  ))}
                  {!quickAccessItems.length && <p>No quick-access links have been published.</p>}

                </Row>

              </section>

              {/* =================================================
                  LATEST DEPARTMENTAL NEWS
              ================================================== */}

              <section className="mb-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <h4 className="section-title">

                    <FaNewspaper className="section-icon" />

                    Latest Departmental News

                  </h4>

                  <Button
                    variant="link"
                    className="text-decoration-none section-action"
                  >
                    Explore Archive
                    <FaArrowRight className="ms-1" />
                  </Button>

                </div>

                <Row className="g-4">

                  {homepageNews.length ? homepageNews.map((item) => (

                    <Col
                      md={6}
                      key={item.id}
                    >

                      <div className="news-card">

                        {item.image && <img src={item.image} alt={item.title} />}

                        <div className="news-body">

                          <div className="news-category">
                            {item.category}
                          </div>

                          <h5 className="news-title">
                            {item.title}
                          </h5>

                          <p className="news-excerpt">
                            {item.excerpt}
                          </p>

                          <a
                            href="#"
                            className="news-read-link"
                          >
                            Read Article
                            <FaArrowRight
                              className="ms-1"
                              style={{
                                fontSize: '0.65rem'
                              }}
                            />
                          </a>

                        </div>

                      </div>

                    </Col>

                  )) : <p>{homeLoading ? "Loading news..." : "No news articles are available."}</p>}

                  {(pageContent.announcements || []).map((item, index) => (
                    <Col md={6} key={`announcement-${index}`}>
                      <div className="news-card">
                        <div className="news-body">
                          <div className="news-category">Announcement</div>
                          <h5 className="news-title">{item.title}</h5>
                          <p className="news-excerpt">{item.description || item.markdown || ""}</p>
                        </div>
                      </div>
                    </Col>
                  ))}

                </Row>

              </section>

              {/* =================================================
                  DEPARTMENTAL CALENDAR
              ================================================== */}

              <section>

                <div className="calendar-widget">

                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="section-title">
                      Departmental Calendar
                    </h5>

                    <div className="d-flex align-items-center gap-2">

                      <Button
                        variant="link"
                        className="p-0 text-secondary"
                      >
                        <FaChevronLeft />
                      </Button>

                      <span className="calendar-month">
                        {new Date().toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}
                      </span>

                      <Button
                        variant="link"
                        className="p-0 text-secondary"
                      >
                        <FaChevronRight />
                      </Button>

                    </div>

                  </div>

                  <Row className="g-3">

                    {homepageEvents.length ? homepageEvents.map((event) => (

                      <Col
                        md={6}
                        key={event.id}
                      >

                        <div className="event-item">

                          <div className="event-date">

                            <div className="month">
                              {event.month}
                            </div>

                            <div className="day">
                              {event.date}
                            </div>

                          </div>

                          <div>

                            <div className="event-title">
                              {event.title}
                            </div>

                            <div className="event-time">
                              {event.time}
                            </div>

                            <div
                              className="event-expiry"
                            >

                              <FaClock style={{ fontSize: '0.6rem' }} />
                              {event.expiry}

                            </div>

                          </div>

                        </div>

                      </Col>

                    )) : <p>{homeLoading ? "Loading events..." : "No upcoming events are available."}</p>}

                  </Row>

                </div>

              </section>

            </Col>

            {/* =================================================
                RIGHT COLUMN
            ================================================== */}

            <Col lg={4}>

              {/* =================================================
                  MEC VISION WIDGET
              ================================================== */}

              <div className="mec-widget mb-4">

                <div
                  className="position-relative"
                  style={{
                    height: '100px',
                    overflow: 'hidden'
                  }}
                >

                  {pageContent.vision_image && <img src={pageContent.vision_image} alt={pageContent.vision_title || "Department vision"} className="mec-image" />}

                  <div
                    className="position-absolute bottom-0 start-0 p-3 w-100"
                  >

                    <Badge className="mec-badge">
                      {pageContent.vision_label || "Our Vision"}
                    </Badge>

                    <h6 className="text-white mt-1">
                      {pageContent.vision_title || "Vision"}
                    </h6>

                  </div>

                </div>

                <div className="mec-body d-flex align-items-center gap-3">

                  {pageContent.mec_image && <img src={pageContent.mec_image} alt={pageContent.mec_name || "Department representative"} className="expert-avatar" />}

                  <div className="flex-grow-1">

                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}
                    >
                      {pageContent.mec_name || "Department message"}
                    </div>

                    <div className="mec-quote">
                      {pageContent.mec_message || ""}
                    </div>

                  </div>

                  <FaArrowRight
                    style={{
                      opacity: 0.5,
                      cursor: 'pointer'
                    }}
                  />

                </div>

              </div>

              {/* =================================================
                  EXPIRING DOCUMENTS
              ================================================== */}

              <section className="mb-4">

                <h5
                  className="d-flex align-items-center gap-2 mb-3"
                  style={{
                    color: '#5c5b5b'
                  }}
                >

                  <FaExclamationTriangle
                    style={{
                      color: '#dc3545'
                    }}
                  />

                  Expiring Documents

                </h5>

                <div className="bg-white p-3 rounded-3 border">

                  {homepageDocuments.length ? homepageDocuments.map((doc) => (

                    <div
                      key={doc.id}
                      className={`expiring-doc-item ${doc.urgency}`}
                    >

                      <div className='expired-docs-card'>

                        <div className="doc-title">
                          {doc.title}
                        </div>

                        <div className="doc-expiry">
                          {doc.expiry}
                        </div>

                        <button className="doc-btn mt-1">
                          Review Now
                        </button>

                      </div>

                    </div>

                  )) : <p>{homeLoading ? "Loading documents..." : "No documents are available for review."}</p>}

                </div>

              </section>

              {/* =================================================
                  CIRCULUS
              ================================================== */}

              <section className="mb-4">

                <div className="bg-white p-3 rounded-3 border">

                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5
                      style={{
                        color: '#5c5b5b',
                        fontWeight: 600
                      }}
                    >
                      Circulus
                    </h5>

                    <FaClock
                      style={{
                        color: '#6c757d'
                      }}
                    />

                  </div>

                  {homepageCirculars.length ? homepageCirculars.map((circular) => (

                    <div
                      key={circular.id}
                      className="circular-item"
                    >

                      <div className="d-flex justify-content-between align-items-start">

                        <div>

                          <Badge
                            bg={getClassificationBadge(
                              circular.classification
                            )}
                            className="me-2"
                          >
                            {circular.classification}
                          </Badge>

                        </div>

                      </div>

                      <div className="circular-title">
                        {circular.title}
                      </div>

                      <div className="circular-date">
                        {circular.time}
                      </div>

                    </div>

                  )) : <p>{homeLoading ? "Loading circulars..." : "No circulars are available."}</p>}

                  <Button
                    variant="link"
                    className="w-100 mt-2 text-decoration-none section-action"
                  >
                    View All
                  </Button>

                </div>

              </section>

              {/* =================================================
                  EXPERT SPOTLIGHT
              ================================================== */}

              <section>

                <div className="expert-spotlight">

                  <div className="spotlight-bg"></div>

                  <div className="d-flex align-items-center gap-3 mb-3">

                    {pageContent.expert_image && <img src={pageContent.expert_image} alt={pageContent.expert_name || "Staff expert"} className="expert-avatar" />}

                    <div>

                      <div className="expert-name">
                        {pageContent.expert_name || "Staff expert"}
                      </div>

                      <div className="expert-title">
                        {pageContent.expert_title || ""}
                      </div>

                    </div>

                  </div>

                  {pageContent.expert_email && <a className="btn-contact" href={`mailto:${pageContent.expert_email}`}>

                    <FaStar className="me-2" />

                    Contact Expert

                  </a>}

                </div>

              </section>

            </Col>

          </Row>

        </div>

      </Container>

    </div>
  );
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function getPostedTime(dateValue) {
  if (!dateValue) {
    return "Recently posted";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Recently posted";
  }

  return `Posted ${formatDate(dateValue)}`;
}

function getClassificationFromCategory(category) {
  if (!category) {
    return "U";
  }

  const value = String(category).trim().toLowerCase();

  if (value.includes("confidential")) {
    return "C";
  }

  if (value.includes("internal")) {
    return "I";
  }

  if (value.includes("secret")) {
    return "S";
  }

  return "U";
}

export default Homepage;