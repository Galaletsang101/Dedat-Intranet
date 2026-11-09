// src/components/news/NewsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container, Row, Col, Badge,
} from 'react-bootstrap';
import {
  FaSearch, FaGavel, FaFileAlt, FaDownload,
  FaArrowRight, FaClock, FaExclamationTriangle,
} from 'react-icons/fa';
import { getNews } from "../../services/newsService";
import { getCirculus } from "../../services/circulusService";
import { formatDate, formatRelative } from "../../utils/dateUtils";
import "../../styles/homepage.css";
import './NewsPage.css';

const categories = ['All', 'News', 'Circulars', 'Events', 'Training'];

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [newsItems, setNewsItems] = useState([]);
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchNewsAndCirculars() {
      setLoading(true);
      setError('');

      try {
        const [newsData, circularsData] = await Promise.all([
          getNews(),
          getCirculus().catch((err) => {
            console.error('Failed to load circulars:', err);
            return [];
          }),
        ]);

        if (!isMounted) return;

        setNewsItems(Array.isArray(newsData) ? newsData : []);
        setCirculars(Array.isArray(circularsData) ? circularsData : []);
      } catch (err) {
        console.error('Error loading news:', err);
        if (isMounted) setError('Unable to load news right now.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchNewsAndCirculars();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredNews = useMemo(() => {
    return newsItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' ||
        (item.category || '').toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [newsItems, activeCategory, searchTerm]);

  const featuredArticle =
    filteredNews.find((item) => item.is_featured) || filteredNews[0] || null;

  const gridArticles = featuredArticle
    ? filteredNews.filter((item) => item.id !== featuredArticle.id)
    : filteredNews;

  if (loading) {
    return (
      <div className="news-page">
        <Container className="py-5">
          <div className="news-skeleton-hero" />
          <Row className="g-4 mt-3">
            {[1, 2, 3, 4].map((key) => (
              <Col md={6} key={key}>
                <div className="news-skeleton-card" />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page">
        <Container className="py-5">
          <p>{error}</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="news-page">
      <Container fluid className="px-4 py-4">
        <div className="news-container">
          <Row className="g-4">
            {/* Main Content - 8 Columns */}
            <Col lg={8}>
              {/* Search */}
              <div className="news-search-row mb-3">
                <div className="news-search-wrapper">
                  <FaSearch className="news-search-icon" />
                  <input
                    type="text"
                    className="news-search-input"
                    placeholder="Search news and announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search news"
                  />
                </div>
              </div>

              {/* Category Filters */}
              <div className="d-flex gap-2 mb-4 overflow-auto pb-2" style={{ flexWrap: 'nowrap' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`category-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {!featuredArticle && gridArticles.length === 0 ? (
                <div className="news-empty-state">
                  <h4>No news articles yet</h4>
                  <p>Check back soon, or try a different search/filter.</p>
                </div>
              ) : (
                <>
                  {/* Hero Section */}
                  {featuredArticle && (
                    <Link
                      to={`/news/${featuredArticle.id}`}
                      className="news-hero mb-4 d-block"
                    >
                      <img
                        src={featuredArticle.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"}
                        alt={featuredArticle.title}
                      />
                      <div className="news-hero-overlay">
                        <Badge className="badge-featured mb-2">{featuredArticle.category || "News"}</Badge>
                        <h1>{featuredArticle.title}</h1>
                        {featuredArticle.excerpt && <p>{featuredArticle.excerpt}</p>}
                        <div className="d-flex align-items-center gap-3 meta-text">
                          <span><FaClock className="me-1" /> {formatRelative(featuredArticle.publication_date || featuredArticle.created_date)}</span>
                          <span className="news-read-link text-white">
                            Read Full Article <FaArrowRight className="ms-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* News Grid - matches Homepage "Latest Departmental News" cards */}
                  <Row className="g-4 mb-4">
                    {gridArticles.map(item => (
                      <Col md={6} key={item.id}>
                        <Link to={`/news/${item.id}`} className="news-card-link">
                          <div className="news-card">
                            <img
                              src={item.image_url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"}
                              alt={item.title}
                            />
                            <div className="news-body">
                              <div className="news-category">{item.category || "News"}</div>
                              <h5 className="news-title">{item.title}</h5>
                              <p className="news-excerpt">{item.excerpt || "No summary available."}</p>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  {formatDate(item.publication_date || item.created_date)}
                                </small>
                                <span className="news-read-link">
                                  Read Article <FaArrowRight className="ms-1" style={{ fontSize: '0.65rem' }} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Col>
                    ))}
                  </Row>
                </>
              )}

              {/* Circulars Section */}
              <div className="bg-light p-4 rounded-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="d-flex align-items-center gap-2">
                    <FaGavel /> Official Circulars & Gazettes
                  </h5>
                </div>
                <div>
                  {circulars.length === 0 ? (
                    <p className="text-muted mb-0">No circulars available.</p>
                  ) : (
                    circulars.map(circ => (
                      <div key={circ.id} className="circular-item">
                        <div className="d-flex align-items-center gap-3">
                          <div className="d-flex align-items-center justify-content-center">
                            <FaFileAlt />
                          </div>

                          <div>
                            <h6 className="circular-title">{circ.title}</h6>

                            {circ.description && (
                              <p className="circular-meta">{circ.description}</p>
                            )}

                            <small className="text-muted">
                              {formatDate(circ.publication_date || circ.created_at)}
                            </small>
                          </div>
                        </div>

                        <div className="d-flex gap-2 flex-shrink-0">
                          <button
                            className="btn btn-sm btn-primary"
                            disabled={!circ.file_url}
                            onClick={() => {
                              if (circ.file_url) window.open(circ.file_url, '_blank');
                            }}
                          >
                            <FaDownload className="me-1" />
                            {circ.file_url ? "View PDF" : "No file"}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Col>

            {/* Sidebar - 4 Columns */}
            <Col lg={4}>
              <div className="d-flex flex-column gap-4">
                {/* Executive Corner */}
                <div className="executive-corner">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
                    alt="MEC"
                    className="executive-image"
                  />
                  <div className="executive-body">
                    <Badge className="mb-2">MEC'S CORNER</Badge>
                    <blockquote className="executive-quote">
                      "Our collective efforts in digitizing the workplace are a testament to our commitment to efficiency and transparency for the people of Northern Cape."
                    </blockquote>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-semibold">Hon. Abraham Vosloo</span>
                    </div>
                  </div>
                </div>

                {/* Training Notices */}
                <div className="sidebar-widget">
                  <h6 className="widget-title d-flex justify-content-between align-items-center">
                    Latest Updates
                    <FaExclamationTriangle />
                  </h6>
                  <p className="small text-muted mb-0">
                    Use the category filters to browse News, Circulars, Events
                    and Training updates published by the department.
                  </p>
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
