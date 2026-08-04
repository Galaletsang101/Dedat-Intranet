// src/components/news/NewsPage.jsx
import React, { useState } from 'react';
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

// Mock Data
const newsItems = [
  {
    id: 1,
    title: "Strategic Economic Outlook 2024: Growth Initiatives for the Northern Cape",
    excerpt: "The Department outlines key economic growth strategies focusing on infrastructure development, renewable energy, and job creation for the coming year.",
    category: "News",
    date: "Jan 15, 2024",
    readTime: "8 min read",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWvOet0BgwXESd_oMHhwhlXbd4kS8zeFRVvlKKbskAKlxImlIjVnp60jsNur76tz7D33OKgX_shxGWeSzc1-XMu3tH3O3qcGBePLzA6uiFOsyHnxFqT6MCFKIWG6HJ-wq_SKB5l-rTaag0s8MZTxBaLPPhgB3Amlmc503XgXDiZzyF_aGCxUPaCATe2tqhUTVFHl9WTzZpeks-IMGvsEGzsskE_rEAh40cy3VHV0WI8LWDbiTBCceKc5v2pxlxQ20-6ZfzUb0W2wU",
    isFeatured: true
  },
  {
    id: 2,
    title: "Quarterly Digital Literacy Workshops: Enrollment Now Open",
    excerpt: "Enhance your digital proficiency with our upcoming series of internal workshops focused on advanced productivity tools.",
    category: "Training",
    date: "Jan 14, 2024",
    readTime: "4 min read",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2bv2ELQygbrGIHfbb4OZuSxkVQwfTXJekOHeECbdvRM46QaRCDBJ8kiBFk68A9lw5GcvSYeLJ4kVy0keI0nlHE-6A1BPQZEHyhub92ZnA1PjucxRRbfiNx9eZlRceLiZv5jbvnfaywD9dRiKnk4t7lzzZIRG6QarCfaHjxdDm9GDbqCi3o9XDow8OE7hVdP1WZydNIS7RGr3hTRinMxuuCY5VVO_THlhhrl7WGczBZZlTU6-HJNobZBU9Un40f5-S7gLGEGb2bOY"
  },
  {
    id: 3,
    title: "Sustainable Tourism Launch: Reimagining the Diamond Fields",
    excerpt: "The Department officially unveils its 2024 Tourism Strategy focused on community-led heritage conservation.",
    category: "Campaign",
    date: "Jan 12, 2024",
    readTime: "5 min read",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAo3vzdfrvfwq93-tCqPzJFkSrjNpdWybHgglEHEsb_eqVxYRAd9FnQc8KP7lgN7o4ekbaWH5s4tY0qXFJQQajhDBm3ZY7wLA8ylm0MSlqtbws703aYn0W2-6sg1A6751wmmHfk_m3zws-Y2B71L6lpqI1Y-gX1KWUNFY9g5bhV5Rpiprwsdo8jsk1AX1I_A3rE3XyT5_3prDC67ipfmpn_kXYvaMyafkJEvHBAhhlw4XUYn5XlfXq0CqF9VHh72-lco9Wv7FYR8R0"
  }
];

const circulars = [
  {
    id: 1,
    title: "Circular 04 of 2024: Revised Travel & Subsistence Policy",
    description: "Effective from Feb 1st, 2024. Mandatory for all departmental travel claims.",
    date: "Jan 10, 2024"
  },
  {
    id: 2,
    title: "Gazette 112: Economic Development Amendments",
    description: "Key changes to provincial tender evaluation criteria for SME support.",
    date: "Jan 8, 2024"
  }
];

const newsletters = [
  { id: 1, title: "January 2024", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyMWt37Gw_Su-ShdDe9vBf7Iu31UwOYcMA8QhzTII18AWfSBtOgFe5dqERJd5NhgUhmv2d7JAmBRsA8ls_2HfPxIiEwkdds2zUGW6PBN7lEmRf6k0KOj2--r_KAxW4sagLttyU4RbOooSMPOCCRQDyVmLhhrKwwtzBnovp5RlV19ygLAGFohOXBH0gP70B5Dfjt-4igQuIb9Wt6mgpIkgACUj7JxSbFYjIWtmRZGOrKcJNtLt35duKKHckmhVkEg-_LFpNZWWwA4U" },
  { id: 2, title: "December 2023", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBD8JvKBnRRDpqrhSUhH736LfYLgWB12TyJfUBOo6gfZyd1N9PvmJ00rY8kL8EA1Qh4vcrmHmMjXjJhJVXkK654h0PbZiwrRb_JiWk3pxs5PaFmEeCVtTpbVRCtdarqHllpX5O2O4O8Si9fuOTl9vAvy2IXOx7tKZZRAP4aZLeo4RtZS3Ja8aQATouyPL9GzxalHQwPnT8Ax71uJ0e-StjyMdGcHpICYev6i52zCu21iV1zjY_EOPNWTUdGPf5LqhKLiBVWr1f0iVI" },
  { id: 3, title: "November 2023", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBK7bMcK4K_zQocMW7nf67p2GDAwZahFyMRMzhyGeUfEvCgCYDTQD1fZy5aB1fX3TF2pF_NHVxSk0VFMuAz_HSl74UctMDVTv77ZMJdOfAlAqGaUe4mgIJgRTF3lyNZR7-bBLD0iKgY_1QkrRq3On-Bajzj-Ch9EwHegWjhRwO-OOVR9oC5_vZqdyuRYdoXttoJKvEH7QTI8Y-YiuQ6xtleK-w19wHiFaL0GCAsTOlPRGtBuECjUtl5TyL_6tiX3iZWnlCmVRlP_JI" },
  { id: 4, title: "October 2023", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ0IHurd4i9gkbt4NbiV6zOoQHexhdzbkzxuE2U58ykAPzlDGMLV4WzZnzqbKMxCdAUPQ0MF9U_huzXVPHHLkMqL4rftPzXTAd11ccSz2LNnmtVSSVgo4awgduPOGliz3KwP5WSGIesHmdgEiRZEQeiQHhZlBvuKTL75fXvT30DlatBXl6n_sqFc6xCMIDiuYZ39tAIvCzCtOA3X80HeOaMKxi6YNaFS8zOIan08p7rERX2qL_5hMPq0xuI1VgA1wWe-UgSSLLKU0" }
];

const categories = ['All', 'News', 'Circulars', 'Events', 'Training'];

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const getCategoryColor = (category) => {
    const colors = {
      'Training': '#198038',
      'Campaign': '#d85f06',
      'News': '#0a58ca',
      'Circulars': '#6a1b9a',
      'Events': '#d97706'
    };
    return colors[category] || '#6c757d';
  };

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
                  <img src={item.image} alt={item.title} />
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
                        <img src={item.image} alt={item.title} />
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

              {/* Circulars Section */}
              <div className="bg-light p-4 rounded-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="d-flex align-items-center gap-2" style={{ color: '#5c5b5b' }}>
                    <FaGavel style={{ color: '#d85f06' }} /> Official Circulars & Gazettes
                  </h5>
                  <div className="position-relative">
                    <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-2 text-secondary" style={{ fontSize: '0.75rem' }} />
                    <input className="form-control form-control-sm ps-4" placeholder="Search gazettes..." style={{ width: '200px' }} />
                  </div>
                </div>
                <div className="space-y-3">
                  {circulars.map(circ => (
                    <div key={circ.id} className="circular-item">
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(220,53,69,0.08)', borderRadius: '0.5rem' }}>
                          <FaFileAlt style={{ color: '#dc3545' }} />
                        </div>
                        <div>
                          <h6 className="circular-title">{circ.title}</h6>
                          <p className="circular-meta">{circ.description}</p>
                        </div>
                      </div>
                      <div className="d-flex gap-2 flex-shrink-0">
                        <button className="btn btn-sm btn-outline-primary">View Summary</button>
                        <button className="btn btn-sm btn-primary"><FaDownload className="me-1" /> PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter Archive */}
              <div>
                <h5 className="mb-3" style={{ color: '#5c5b5b' }}>Digital Newsletters</h5>
                <Row className="g-3">
                  {newsletters.map(item => (
                    <Col xs-6 md-3 key={item.id}>
                      <div className="newsletter-item">
                        <div className="newsletter-cover">
                          <img src={item.image} alt={item.title} />
                          <div className="hover-overlay">
                            <FaEye style={{ color: '#ffffff', fontSize: '2rem' }} />
                          </div>
                        </div>
                        <p className="text-center small fw-semibold mt-2" style={{ color: '#d85f06' }}>{item.title}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>

            {/* Sidebar - 4 Columns */}
            <Col lg={4}>
              <div className="d-flex flex-column gap-4">
                {/* Executive Corner */}
                <div className="executive-corner">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIuaCHIKONYb8pily3ScVoHCWW8PIgxECayfgVWNbYhWyy2kvRSLAnv9X9QbFwtdkcajMVCKUjS68PW_nXb8RiLSatjs_vqTOuONWWtG7IZbutf29NdqQJbuw2In3s4YTLu0tUt3bIDcsO9DhnVuObxCUp98jGD6aGU4NlVlhM6lIpzN06SeO1U_osGnh2wYv7awOCPMIMCjhpLW8N5a77-lrE9tAaCXN3y7ffTf-ml_1CPlms1ZaJyiXRIoHaahoZ9nlKQVhwUsA" 
                    alt="MEC" 
                    className="executive-image"
                  />
                  <div className="executive-body">
                    <Badge className="mb-2" style={{ background: '#e5c19b', color: '#5c5b5b' }}>MEC'S CORNER</Badge>
                    <blockquote className="executive-quote">
                      "Our collective efforts in digitizing the workplace are a testament to our commitment to efficiency and transparency for the people of Northern Cape."
                    </blockquote>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: '32px', height: '3px', background: '#e5c19b' }}></div>
                      <span className="fw-semibold">Hon. Abraham Vosloo</span>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="sidebar-widget">
                  <h6 className="widget-title d-flex justify-content-between align-items-center">
                    Upcoming Highlights
                    <FaCalendarAlt style={{ color: '#6c757d' }} />
                  </h6>
                  <div className="space-y-3">
                    <div className="d-flex gap-3">
                      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minWidth: '56px', height: '56px', background: '#f8f9fa', borderRadius: '0.5rem', border: '1px solid #e9ecef' }}>
                        <span className="small fw-bold" style={{ color: '#d85f06' }}>JAN</span>
                        <span className="fw-bold" style={{ color: '#5c5b5b' }}>22</span>
                      </div>
                      <div>
                        <h6 className="fw-semibold" style={{ color: '#5c5b5b' }}>Departmental Town Hall</h6>
                        <p className="small text-muted">09:00 AM • Main Atrium</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minWidth: '56px', height: '56px', background: '#f8f9fa', borderRadius: '0.5rem', border: '1px solid #e9ecef' }}>
                        <span className="small fw-bold" style={{ color: '#d85f06' }}>JAN</span>
                        <span className="fw-bold" style={{ color: '#5c5b5b' }}>25</span>
                      </div>
                      <div>
                        <h6 className="fw-semibold" style={{ color: '#5c5b5b' }}>Project Management Circle</h6>
                        <p className="small text-muted">02:00 PM • Virtual (Teams)</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minWidth: '56px', height: '56px', background: '#f8f9fa', borderRadius: '0.5rem', border: '1px solid #e9ecef' }}>
                        <span className="small fw-bold" style={{ color: '#d85f06' }}>FEB</span>
                        <span className="fw-bold" style={{ color: '#5c5b5b' }}>05</span>
                      </div>
                      <div>
                        <h6 className="fw-semibold" style={{ color: '#5c5b5b' }}>Regional Stakeholder Summit</h6>
                        <p className="small text-muted">10:00 AM • Kimberley ICC</p>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-outline-primary w-100 mt-3">View All Events</button>
                </div>

                {/* Training Notices */}
                <div className="sidebar-widget">
                  <h6 className="widget-title">Active Training Sessions</h6>
                  <div className="space-y-2">
                    <div className="d-flex justify-content-between align-items-center p-2" style={{ background: 'rgba(0,25,6,0.05)', borderRadius: '0.5rem' }}>
                      <span className="fw-semibold" style={{ color: '#198038' }}>Data Ethics 101</span>
                      <Badge style={{ background: '#001906', color: '#ffffff', fontSize: '0.55rem' }}>In Progress</Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-2" style={{ background: '#f8f9fa', borderRadius: '0.5rem' }}>
                      <span style={{ color: '#6c757d' }}>Advanced Excel for HR</span>
                      <Badge style={{ background: '#6c757d', color: '#ffffff', fontSize: '0.55rem' }}>Starting Soon</Badge>
                    </div>
                  </div>
                </div>

                {/* Featured Campaign */}
                <div className="position-relative rounded-3 overflow-hidden" style={{ aspectRatio: '16/9', cursor: 'pointer' }}>
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeORVV7ETsPlTyEXotjnt_0WofPtW3skpp7msQVgX77B9yCK2StEU58K0CjYaWRUQWE6YpXhqDzuvlGXnlBfOpvyhzEUp-Y1Sbry1jMP6YtKUtQ-xN93HCOSRIsuy20eF1ILQfDiTy7EJ2PeIaDAzuY5zTrW9cC5p89KfjbNlnZLQNSkkKAVtPScD8JN-bWUgjo1neGJ5tRDZNjMvXqgC5vx4h0jVyHW_oJXsw-VVqXaRhCuYWoc767Ro4kF18bsv97Yv_RIcljcw" 
                    alt="Wellness Month" 
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div className="position-absolute inset-0 d-flex flex-column justify-content-end p-3" style={{ background: 'rgba(144,77,0,0.6)' }}>
                    <h6 className="text-white fw-bold">Wellness Month 2024</h6>
                    <p className="text-white-50 small">Prioritizing your mental health in the workplace.</p>
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