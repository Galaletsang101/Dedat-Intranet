// src/components/news/NewsPage.jsx
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Container, Row, Col, Nav, Navbar, Button, Badge, 
  Form, InputGroup 
} from 'react-bootstrap';
import {
  FaSearch, FaBell, FaUserCircle, FaNewspaper, FaGavel,
  FaCalendarAlt, FaUsers, FaFileAlt, FaDownload,
  FaEye, FaArrowRight, FaClock, FaUser, FaBuilding,
  FaComments, FaChartLine, FaTools, FaInfoCircle
} from 'react-icons/fa';
import { MdEmail, MdVerified } from 'react-icons/md';
import './NewsPage.css';
import { getNews } from "../../services/newsService";
import { getCirculus } from "../../services/circulusService";
import { getSiteContent } from "../../services/siteContentService";
import { getCalendarEvents } from "../../services/calendarService";
import { getWellnessVideos } from "../../services/wellnessService";


const NewsPage = () => {
const [activeCategory, setActiveCategory] = useState('All');
const [newsItems, setNewsItems] = useState([]);
const [circulars, setCirculars] = useState([]);
const [upcomingEvents, setUpcomingEvents] = useState([]);
const [trainingSessions, setTrainingSessions] = useState([]);
const [featuredWellness, setFeaturedWellness] = useState(null);
const [highlightsLoading, setHighlightsLoading] = useState(true);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [pageContent, setPageContent] = useState(null);
const categories = ['All', ...new Set(newsItems.map((item) => item.category).filter(Boolean)), 'Circulars'];

 useEffect(() => {
  const fetchNewsAndCirculars = async () => {
    try {
      // Fetch News
      const newsData = await getNews();

      const formattedNews = newsData.map((item) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content_markdown,
        category: item.category || 'News',
        date: item.publication_date ? new Date(item.publication_date).toLocaleDateString('en-ZA', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : '',
        readTime: `${Math.max(1, Math.ceil((item.content_markdown || '').trim().split(/\s+/).length / 200))} min read`,
        image: item.image_url,
        isFeatured: item.is_featured
      }));

      setNewsItems(formattedNews);
      setTrainingSessions(
        newsData.filter((item) => item.category?.toLowerCase() === 'training').slice(0, 2)
      );


      // Fetch Circulus
      const circularsData = await getCirculus();

      const formattedCirculars = circularsData.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.publication_date
          ? new Date(item.publication_date).toLocaleDateString('en-ZA', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          : 'No date',
        circularNumber: item.category,
        author: item.author,
        fileUrl: item.file_url
      }));

      setCirculars(formattedCirculars);

    } catch (err) {
      console.error('Error loading news and circulars:', err);
      setError('Unable to load news and circulars.');
    } finally {
      setLoading(false);
    }
  };

  fetchNewsAndCirculars();
  Promise.all([getCalendarEvents(), getWellnessVideos()])
    .then(([events, videos]) => {
      const now = Date.now();
      setUpcomingEvents(
        events
          .filter((event) => new Date(event.start_time).getTime() >= now)
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
          .slice(0, 3)
      );
      setFeaturedWellness(
        videos.find((video) => video.featured) || videos[0] || null
      );
    })
    .catch((highlightsError) => {
      console.error('Error loading news page highlights:', highlightsError);
    })
    .finally(() => setHighlightsLoading(false));
  getSiteContent("news")
    .then(setPageContent)
    .catch((contentError) => {
      console.error("Error loading news page settings:", contentError);
    });
}, []);

  const getCategoryColor = (category) => {
    switch (category) {
        case 'Training':
            return 'var(--success)';

        case 'Campaign':
            return 'var(--primary)';

        case 'News':
            return 'var(--info)';

        case 'Circulars':
            return 'var(--secondary)';

        case 'Events':
            return 'var(--accent)';

        default:
            return 'var(--secondary-light)';
    }
};
if (loading) {
  return (
    <div className="news-page">
      <Container className="py-5">
        <p>Loading news...</p>
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

              {/* Hero Section */}
              {newsItems.filter(item => item.isFeatured).map(item => (
                <div key={item.id} className="news-hero mb-4">
                  {item.image && <img src={item.image} alt={item.title} />}
                  <div className="news-hero-overlay">
                    <Badge className="badge-featured mb-2">{item.category}</Badge>
                    <h1>{item.title}</h1>
                    <div className="d-flex align-items-center gap-3 meta-text">
                      <span><FaClock className="me-1" /> {item.readTime}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* News Grid */}
              <Row className="g-3 mb-4">
                {newsItems.filter(item => !item.isFeatured).map(item => (
                  <Col md={6} key={item.id}>
                    <div className="news-card-item">
                      <div className="card-img-wrapper">
                        {item.image && <img src={item.image} alt={item.title} />}
                        <Badge 
                          className="card-category-badge" 
                          style={{ backgroundColor: getCategoryColor(item.category) }}
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <div className="card-body">
                        <p className="text-muted small mb-1">{item.date}</p>
                        <h5 className="card-title">{item.title}</h5>
                        <p className="card-excerpt">{item.excerpt}</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

{/* News Content - Markdown */}
{newsItems.length > 0 && (
  <div className="bg-white p-4 rounded-3 mb-4">
    <h5>{newsItems[0].title}</h5>

    <ReactMarkdown>
      {newsItems[0].content}
    </ReactMarkdown>
  </div>
)}

              {/* Circulars Section */}
              <div className="bg-light p-4 rounded-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="d-flex align-items-center gap-2" >
                    <FaGavel /> Official Circulars & Gazettes
                  </h5>
                  <div className="position-relative">
                    <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-2 text-secondary" style={{ fontSize: '0.75rem' }} />
                    <input className="form-control form-control-sm ps-4" placeholder="Search gazettes..." style={{ width: '200px' }} />
                  </div>
                </div>
                <div className="space-y-3">
                  {circulars.length === 0 ? (
  <p className="text-muted">No circulars available.</p>
) : (
  circulars.map(circ => (
    <div key={circ.id} className="circular-item">
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

          <small className="text-muted">
            {circ.circularNumber && `${circ.circularNumber} • `}
            {circ.date}
          </small>
        </div>
      </div>

      <div className="d-flex gap-2 flex-shrink-0">

        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            if (circ.fileUrl) {
              window.open(circ.fileUrl, '_blank');
            }
          }}
        >
          View Summary
        </button>

        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            if (circ.fileUrl) {
              window.open(circ.fileUrl, '_blank');
            }
          }}
        >
          <FaDownload className="me-1" />
          PDF
        </button>

      </div>
    </div>
  ))
)}
                </div>
              </div>

              {/* Newsletter Archive */}
              <div>
                <h5 className="mb-3" >Digital Newsletters</h5>
                <Row className="g-3">
                  {newsItems.filter((item) => /newsletter/i.test(item.category || "")).map(item => (
                    <Col xs={6} md={3} key={item.id}>
                      <div className="newsletter-item">
                        <div className="newsletter-cover">
                          {item.image && <img src={item.image} alt={item.title} />}
                          <div className="hover-overlay">
                            <FaEye/>
                          </div>
                        </div>
                        <p className="text-center small fw-semibold mt-2">{item.title}</p>
                      </div>
                    </Col>
                  ))}
                  {!newsItems.some((item) => /newsletter/i.test(item.category || "")) && (
                    <p>No newsletters have been published.</p>
                  )}
                </Row>
              </div>
            </Col>

            {/* Sidebar - 4 Columns */}
            <Col lg={4}>
              <div className="d-flex flex-column gap-4">
                {/* Executive Corner */}
                <div className="executive-corner">
                  {pageContent?.content?.executive_image && <img src={pageContent.content.executive_image} alt={pageContent.content.executive_name || "Department representative"} className="executive-image" />}
                  <div className="executive-body">
                    <Badge className="mb-2">{pageContent?.content?.executive_heading || "Executive message"}</Badge>
                    <blockquote className="executive-quote">
                      {pageContent?.content?.executive_message || "No executive message has been published."}
                    </blockquote>
                    <div className="d-flex align-items-center gap-2">
                      <div ></div>
                      <span className="fw-semibold">{pageContent?.content?.executive_name || ""}</span>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="sidebar-widget">
                  <h6 className="widget-title d-flex justify-content-between align-items-center">
                    Upcoming Highlights
                    <FaCalendarAlt  />
                  </h6>
                  <div className="space-y-3">
                    {highlightsLoading ? (
                      <p className="text-muted">Loading upcoming events...</p>
                    ) : upcomingEvents.length ? upcomingEvents.map((event) => {
                      const start = new Date(event.start_time);
                      return (
                        <div className="d-flex gap-3" key={event.id}>
                          <div className="d-flex flex-column align-items-center justify-content-center" style={{ minWidth: '56px', height: '56px', background: '#f8f9fa', borderRadius: '0.5rem', border: '1px solid #e9ecef' }}>
                            <span className="small fw-bold">{start.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase()}</span>
                            <span className="fw-bold">{start.toLocaleDateString('en-ZA', { day: '2-digit' })}</span>
                          </div>
                          <div>
                            <h6 className="fw-semibold">{event.title}</h6>
                            <p className="small text-muted">
                              {start.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                              {event.description ? ` • ${event.description}` : ''}
                            </p>
                          </div>
                        </div>
                      );
                    }) : <p className="text-muted">No upcoming events have been published.</p>}
                  </div>
                  <a className="btn btn-outline-primary w-100 mt-3" href="#/calendar">View All Events</a>
                </div>

                {/* Training Notices */}
                <div className="sidebar-widget">
                  <h6 className="widget-title">Active Training Sessions</h6>
                  <div className="space-y-2">
                    {trainingSessions.map((session) => (
                      <div className="d-flex justify-content-between align-items-center p-2" key={session.id}>
                        <span className="fw-semibold">{session.title}</span>
                        <Badge>{session.publication_date ? new Date(session.publication_date).toLocaleDateString('en-ZA') : 'Training'}</Badge>
                      </div>
                    ))}
                    {!trainingSessions.length && <p className="text-muted">No training notices have been published.</p>}
                  </div>
                </div>

                {/* Featured Campaign */}
                {featuredWellness ? (
                  <div className="position-relative rounded-3 overflow-hidden">
                    {featuredWellness.thumbnail && (
                      <img
                        src={featuredWellness.thumbnail}
                        alt={featuredWellness.title}
                        className="w-100 h-100 object-fit-cover"
                      />
                    )}
                    <div className="position-absolute inset-0 d-flex flex-column justify-content-end p-3">
                      <h6 className="text-white fw-bold">{featuredWellness.title}</h6>
                      <p className="text-white-50 small">{featuredWellness.description}</p>
                    </div>
                  </div>
                ) : !highlightsLoading && <p className="text-muted">No wellness feature has been published.</p>}
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      
      
    </div>
  );
};

export default NewsPage;