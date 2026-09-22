
// src/components/news/NewsPage.jsx

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import {
  Container,
  Row,
  Col,
  Badge,
} from "react-bootstrap";

import {
  FaSearch,
  FaNewspaper,
  FaGavel,
  FaCalendarAlt,
  FaFileAlt,
  FaDownload,
  FaEye,
  FaClock,
} from "react-icons/fa";

import "./NewsPage.css";


// ============================================================
// STATIC NEWSLETTER ARCHIVE
// ============================================================

const newsletters = [
  {
    id: 1,
    title: "January 2024",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDyMWt37Gw_Su-ShdDe9vBf7Iu31UwOYcMA8QhzTII18AWfSBtOgFe5dqERJd5NhgUhmv2d7JAmBRsA8ls_2HfPxIiEwkdds2zUGW6PBN7lEmRf6k0KOj2--r_KAxW4sagLttyU4RbOooSMPOCCRQDyVmLhhrKwwtzBnovp5RlV19ygLAGFohOXBH0gP70B5Dfjt-4igQuIb9Wt6mgpIkgACUj7JxSbFYjIWtmRZGOrKcJNtLt35duKKHckmhVkEg-_LFpNZWWwA4U",
  },
  {
    id: 2,
    title: "December 2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBD8JvKBnRRDpqrhSUhH736LfYLgWB12TyJfUBOo6gfZyd1N9PvmJ00rY8kL8EA1Qh4vcrmHmMjXjJhJVXkK654h0PbZiwrRb_JiWk3pxs5PaFmEeCVtTpbVRCtdarqHllpX5O2O4O8Si9fuOTl9vAvy2IXOx7tKZZRAP4aZLeo4RtZS3Ja8aQATouyPL9GzxalHQwPnT8Ax71uJ0e-StjyMdGcHpICYev6i52zCu21iV1zjY_EOPNWTUdGPf5LqhKLiBVWr1f0iVI",
  },
  {
    id: 3,
    title: "November 2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBK7bMcK4K_zQocMW7nf67p2GDAwZahFyMRMzhyGeUfEvCgCYDTQD1fZy5aB1fX3TF2pF_NHVxSk0VFMuAz_HSl74UctMDVTv77ZMJdOfAlAqGaUe4mgIJgRTF3lyNZR7-bBLD0iKgY_1QkrRq3On-Bajzj-Ch9EwHegWjhRwO-OOVR9oC5_vZqdyuRYdoXttoJKvEH7QTI8Y-YiuQ6xtleK-w19wHiFaL0GCAsTOlPRGtBuECjUtl5TyL_6tiX3iZWnlCmVRlP_JI",
  },
  {
    id: 4,
    title: "October 2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ0IHurd4i9gkbt4NbiV6zOoQHexhdzbkzxuE2U58ykAPzlDGMLV4WzZnzqbKMxCdAUPQ0MF9U_huzXVPHHLkMqL4rftPzXTAd11ccSz2LNnmtVSSVgo4awgduPOGliz3KwP5WSGIesHmdgEiRZEQeiQHhZlBvuKTL75fXvT30DlatBXl6n_sqFc6xCMIDiuYZ39tAIvCzCtOA3X80HeOaMKxi6YNaFS8zOIan08p7rERX2qL_5hMPq0xuI1VgA1wWe-UgSSLLKU0",
  },
];


// ============================================================
// CATEGORY FILTERS
// ============================================================

const categories = [
  "All",
  "News",
  "Circulars",
  "Events",
  "Training",
];


// ============================================================
// STATIC CIRCULARS
// ============================================================

const circulars = [
  {
    id: 1,
    title:
      "Circular 04 of 2024: Revised Travel & Subsistence Policy",
    description:
      "Effective from Feb 1st, 2024. Mandatory for all departmental travel claims.",
    date: "Jan 10, 2024",
  },
];


// ============================================================
// DATE FORMATTER
// ============================================================

const formatDate = (date) => {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


// ============================================================
// NEWS PAGE
// ============================================================

const NewsPage = () => {
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [newsItems, setNewsItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================================
  // FETCH NEWS FROM BACKEND
  // ==========================================================

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/news"
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch news: ${response.status}`
          );
        }

        const data = await response.json();

        const formattedNews = Array.isArray(data)
          ? data.map((item, index) => ({
              id: item.id,

              title: item.title || "Untitled News Article",

              excerpt:
                item.description ||
                item.excerpt ||
                "",

              content_markdown:
                item.content_markdown || "",

              category:
                item.category || "News",

              author:
                item.author || "DEDaT",

              publication_date:
                item.publication_date ||
                item.publish_date ||
                null,

              image_url:
                item.image_url || "",

              is_featured:
                item.is_featured === true ||
                (index === 0 &&
                  item.is_featured === undefined),
            }))
          : [];

        setNewsItems(formattedNews);
      } catch (err) {
        console.error(
          "Error loading news:",
          err
        );

        setError(
          "Unable to load news. Please make sure the backend server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);


  // ==========================================================
  // FILTER NEWS
  // ==========================================================

  const filteredNews =
    activeCategory === "All"
      ? newsItems
      : newsItems.filter(
          (item) =>
            item.category === activeCategory
        );


  // ==========================================================
  // FEATURED NEWS
  // ==========================================================

  const featuredNews = filteredNews.filter(
    (item) => item.is_featured
  );


  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <div className="news-page">
        <Container className="py-5">
          <p>Loading news...</p>
        </Container>
      </div>
    );
  }


  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error) {
    return (
      <div className="news-page">
        <Container className="py-5">
          <div className="text-center">
            <FaNewspaper
              size={40}
              className="mb-3"
            />

            <p>{error}</p>
          </div>
        </Container>
      </div>
    );
  }


  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <div className="news-page">

      <Container fluid className="px-4 py-4">

        <div className="news-container">

          <Row className="g-4">

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <Col lg={8}>

              {/* ==================================================
                  CATEGORY FILTERS
              ================================================== */}

              <div
                className="d-flex gap-2 mb-4 overflow-auto pb-2"
                style={{
                  flexWrap: "nowrap",
                }}
              >

                {categories.map((category) => (

                  <button
                    key={category}
                    className={`category-filter-btn ${
                      activeCategory === category
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveCategory(category)
                    }
                  >
                    {category}
                  </button>

                ))}

              </div>


              {/* ==================================================
                  FEATURED NEWS
              ================================================== */}

              {featuredNews.length > 0 && (

                <>

                  {featuredNews.map((item) => (

                    <div
                      key={item.id}
                      className="news-hero mb-4"
                    >

                      {item.image_url ? (

                        <img
                          src={item.image_url}
                          alt={item.title}
                        />

                      ) : (

                        <div className="news-hero-placeholder">

                          <FaNewspaper />

                        </div>

                      )}


                      <div className="news-hero-overlay">

                        <Badge className="badge-featured mb-2">

                          {item.category}

                        </Badge>


                        <h1>
                          {item.title}
                        </h1>


                        {item.excerpt && (

                          <p className="hero-excerpt">
                            {item.excerpt}
                          </p>

                        )}


                        <div className="d-flex align-items-center gap-3 meta-text">

                          <span>
                            <FaClock className="me-1" />

                            {item.author ||
                              "DEDaT"}
                          </span>


                          <span>•</span>


                          <span>
                            {formatDate(
                              item.publication_date
                            )}
                          </span>

                        </div>

                      </div>

                    </div>

                  ))}

                </>

              )}


              {/* ==================================================
                  NEWS ARTICLES
              ================================================== */}

              {filteredNews.length > 0 ? (

                <div className="news-list">

                  {filteredNews.map((item) => (

                    <div
                      key={item.id}
                      className="card mb-4 border-0 shadow-sm"
                    >

                      <div className="card-body">

                        <p className="text-muted small mb-1">

                          {formatDate(
                            item.publication_date
                          )}

                        </p>


                        <h5 className="card-title">

                          {item.title}

                        </h5>


                        {item.excerpt && (

                          <p className="card-excerpt">

                            {item.excerpt}

                          </p>

                        )}


                        {/* ========================================
                            MARKDOWN CONTENT
                        ======================================== */}

                        {item.content_markdown && (

                          <div className="news-markdown-preview">

                            <ReactMarkdown>

                              {item.content_markdown}

                            </ReactMarkdown>

                          </div>

                        )}


                        {/* ========================================
                            AUTHOR
                        ======================================== */}

                        <div className="d-flex justify-content-between align-items-center mt-3">

                          {item.author && (

                            <p className="small text-muted mb-0">

                              By {item.author}

                            </p>

                          )}

                          <Badge
                            bg="secondary"
                          >
                            {item.category}
                          </Badge>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="text-center py-5">

                  <FaNewspaper
                    size={40}
                    className="mb-3"
                  />

                  <h5>
                    No news available
                  </h5>

                  <p className="text-muted">

                    There are currently no news
                    articles in this category.

                  </p>

                </div>

              )}


              {/* ==================================================
                  CIRCULARS
              ================================================== */}

              <div className="bg-light p-4 rounded-3 mb-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <h5 className="d-flex align-items-center gap-2">

                    <FaGavel />

                    Official Circulars & Gazettes

                  </h5>


                  <div className="position-relative">

                    <FaSearch
                      className="position-absolute top-50 start-0 translate-middle-y ms-2 text-secondary"
                      style={{
                        fontSize: "0.75rem",
                      }}
                    />

                    <input
                      className="form-control form-control-sm ps-4"
                      placeholder="Search gazettes..."
                      style={{
                        width: "200px",
                      }}
                    />

                  </div>

                </div>


                <div className="space-y-3">

                  {circulars.map((circ) => (

                    <div
                      key={circ.id}
                      className="circular-item"
                    >

                      <div className="d-flex align-items-center gap-3">

                        <div className="d-flex align-items-center justify-content-center">

                          <FaFileAlt />

                        </div>


                        <div>

                          <h6 className="circular-title">

                            {circ.title}

                          </h6>


                          <p className="circular-meta">

                            {circ.description}

                          </p>


                          <span className="text-muted small">

                            {circ.date}

                          </span>

                        </div>

                      </div>


                      <div className="d-flex gap-2 flex-shrink-0">

                        <button className="btn btn-sm btn-outline-primary">

                          View Summary

                        </button>


                        <button className="btn btn-sm btn-primary">

                          <FaDownload className="me-1" />

                          PDF

                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              </div>


              {/* ==================================================
                  NEWSLETTER ARCHIVE
              ================================================== */}

              <div>

                <h5 className="mb-3">
                  Digital Newsletters
                </h5>


                <Row className="g-3">

                  {newsletters.map((item) => (

                    <Col
                      xs={6}
                      md={3}
                      key={item.id}
                    >

                      <div className="newsletter-item">

                        <div className="newsletter-cover">

                          <img
                            src={item.image}
                            alt={item.title}
                          />

                          <div className="hover-overlay">

                            <FaEye />

                          </div>

                        </div>


                        <p className="text-center small fw-semibold mt-2">

                          {item.title}

                        </p>

                      </div>

                    </Col>

                  ))}

                </Row>

              </div>

            </Col>


            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <Col lg={4}>

              <div className="d-flex flex-column gap-4">


                {/* ==================================================
                    EXECUTIVE CORNER
                ================================================== */}

                <div className="executive-corner">

                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIuaCHIKONYb8pily3ScVoHCWW8PIgxECayfgVWNbYhWyy2kvRSLAnv9X9QbFwtdkcajMVCKUjS68PW_nXb8RiLSatjs_vqTOuONWWtG7IZbutf29NdqQJbuw2In3s4YTLu0tUt3bIDcsO9DhnVuObxCUp98jGD6aGU4NlVlhM6lIpzN06SeO1U_osGnh2wYv7awOCPMIMCjhpLW8N5a77-lrE9tAaCXN3y7ffTf-ml_1CPlms1ZaJyiXRIoHaahoZ9nlKQVhwUsA"
                    alt="MEC"
                    className="executive-image"
                  />


                  <div className="executive-body">

                    <Badge className="mb-2">

                      MEC'S CORNER

                    </Badge>


                    <blockquote className="executive-quote">

                      "Our collective efforts in
                      digitizing the workplace are
                      a testament to our commitment
                      to efficiency and transparency
                      for the people of Northern Cape."

                    </blockquote>


                    <div className="d-flex align-items-center gap-2">

                      <span className="fw-semibold">

                        Hon. Abraham Vosloo

                      </span>

                    </div>

                  </div>

                </div>


                {/* ==================================================
                    UPCOMING EVENTS
                ================================================== */}

                <div className="sidebar-widget">

                  <h6 className="widget-title d-flex justify-content-between align-items-center">

                    Upcoming Highlights

                    <FaCalendarAlt />

                  </h6>


                  <div className="space-y-3">

                    <div className="d-flex gap-3">

                      <div
                        className="d-flex flex-column align-items-center justify-content-center"
                        style={{
                          minWidth: "56px",
                          height: "56px",
                          background: "#f8f9fa",
                          borderRadius: "0.5rem",
                          border:
                            "1px solid #e9ecef",
                        }}
                      >

                        <span className="small fw-bold">
                          JAN
                        </span>

                        <span className="fw-bold">
                          22
                        </span>

                      </div>


                      <div>

                        <h6 className="fw-semibold">

                          Departmental Town Hall

                        </h6>

                        <p className="small text-muted">

                          09:00 AM • Main Atrium

                        </p>

                      </div>

                    </div>


                    <div className="d-flex gap-3">

                      <div
                        className="d-flex flex-column align-items-center justify-content-center"
                        style={{
                          minWidth: "56px",
                          height: "56px",
                          background: "#f8f9fa",
                          borderRadius: "0.5rem",
                          border:
                            "1px solid #e9ecef",
                        }}
                      >

                        <span className="small fw-bold">
                          JAN
                        </span>

                        <span className="fw-bold">
                          25
                        </span>

                      </div>


                      <div>

                        <h6 className="fw-semibold">

                          Project Management Circle

                        </h6>

                        <p className="small text-muted">

                          02:00 PM • Virtual (Teams)

                        </p>

                      </div>

                    </div>


                    <div className="d-flex gap-3">

                      <div
                        className="d-flex flex-column align-items-center justify-content-center"
                        style={{
                          minWidth: "56px",
                          height: "56px",
                          background: "#f8f9fa",
                          borderRadius: "0.5rem",
                          border:
                            "1px solid #e9ecef",
                        }}
                      >

                        <span className="small fw-bold">
                          FEB
                        </span>

                        <span className="fw-bold">
                          05
                        </span>

                      </div>


                      <div>

                        <h6 className="fw-semibold">

                          Regional Stakeholder Summit

                        </h6>

                        <p className="small text-muted">

                          10:00 AM • Kimberley ICC

                        </p>

                      </div>

                    </div>

                  </div>


                  <button className="btn btn-outline-primary w-100 mt-3">

                    View All Events

                  </button>

                </div>


                {/* ==================================================
                    TRAINING
                ================================================== */}

                <div className="sidebar-widget">

                  <h6 className="widget-title">

                    Active Training Sessions

                  </h6>


                  <div className="space-y-2">

                    <div className="d-flex justify-content-between align-items-center p-2">

                      <span className="fw-semibold">

                        Data Ethics 101

                      </span>


                      <Badge>

                        In Progress

                      </Badge>

                    </div>


                    <div className="d-flex justify-content-between align-items-center p-2">

                      <span>

                        Advanced Excel for HR

                      </span>


                      <Badge>

                        Starting Soon

                      </Badge>

                    </div>

                  </div>

                </div>


                {/* ==================================================
                    FEATURED CAMPAIGN
                ================================================== */}

                <div className="position-relative rounded-3 overflow-hidden">

                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeORVV7ETsPlTyEXotjnt_0WofPtW3skpp7msQVgX77B9yCK2StEU58K0CjYaWRUQWE6YpXhqDzuvlGXnlBfOpvyhzEUp-Y1Sbry1jMP6YtKUtQ-xN93HCOSRIsuy20eF1ILQfDiTy7EJ2PeIaDAzuY5zTrW9cC5p89KfjbNlnZLQNSkkKAVtPScD8JN-bWUgjo1neGJ5tRDZNjMvXqgC5vx4h0jVyHW_oJXsw-VVqXaRhCuYWoc767Ro4kF18bsv97Yv_RIcljcw"
                    alt="Wellness Month"
                    className="w-100 h-100 object-fit-cover"
                  />


                  <div className="position-absolute inset-0 d-flex flex-column justify-content-end p-3">

                    <h6 className="text-white fw-bold">

                      Wellness Month 2024

                    </h6>


                    <p className="text-white-50 small">

                      Prioritizing your mental health
                      in the workplace.

                    </p>

                  </div>

                </div>

              </div>

            </Col>

          </Row>

        </div>

      </Container>

    </div>
  );
};


export default NewsPage;

