// src/pages/Homepage.jsx
import React, { useState } from 'react';
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
// PROFESSIONAL CAROUSEL IMAGES (Unsplash - High Quality)
// ============================================================
const carouselItems = [
  {
    id: 1,
    title: "New Industrial Hub Launched in Upington",
    excerpt: "MEC highlights the project's role in creating 5,000 local jobs over three years, fostering economic growth and infrastructure development.",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    time: "2 hours ago"
  },
  {
    id: 2,
    title: "Tourism Recovery Programme Exceeds Targets",
    excerpt: "The Northern Cape welcomed over 1.2 million visitors in Q1 2026, surpassing pre-pandemic levels and boosting local economy.",
    category: "Tourism",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    time: "5 hours ago"
  },
  {
    id: 3,
    title: "Skills Development Programme Exceeds Targets",
    excerpt: "Over 200 staff members completed the advanced project management course, with 95% passing rate across all districts.",
    category: "Skills Development",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80",
    time: "1 day ago"
  }
];

// ============================================================
// NEWS ITEMS
// ============================================================
const newsItems = [
  {
    id: 1,
    title: "Enhanced Data Protection for E-Gov Services",
    excerpt: "New encryption protocols implemented across all provincial digital portals to safeguard citizen data.",
    category: "Cybersecurity",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
  },
  {
    id: 2,
    title: "Internal Training Programme Exceeds Targets",
    excerpt: "Over 200 staff members completed the advanced project management course with 95% passing rate.",
    category: "Skills Development",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"
  }
];

// ============================================================
// CALENDAR EVENTS
// ============================================================
const calendarEvents = [
  {
    id: 1,
    title: "Skills Development Workshop",
    date: "24",
    month: "OCT",
    time: "09:00 AM - Boardroom 3",
    expiry: "EXPIRES SOON (Apply by 16:00)"
  },
  {
    id: 2,
    title: "Quarterly Performance Review",
    date: "26",
    month: "OCT",
    time: "All Day - Virtual Meeting",
    expiry: "MANDATORY ATTENDANCE"
  }
];

// ============================================================
// CIRCULARS
// ============================================================
const circulars = [
  { id: 1, title: "Circular No. 12 of 2024: New Recruitment Protocols", classification: "U", time: "Posted 2 hours ago" },
  { id: 2, title: "Information Security Guidelines - Update", classification: "I", time: "Posted Yesterday" },
  { id: 3, title: "Budget Adjustment for Q3 2026", classification: "C", time: "Posted 3 days ago" }
];

// ============================================================
// EXPIRING DOCUMENTS
// ============================================================
const expiringDocuments = [
  { id: 1, title: "Tourism Policy Update v2", expiry: "Expires in 12 days", urgency: "urgent" },
  { id: 2, title: "Annual Procurement Plan 2025/26", expiry: "Expires in 28 days", urgency: "warning" }
];

// ============================================================
// MAIN COMPONENT
// ============================================================
const latestUpdates = [
  {
    id: 1,
    icon: FaNewspaper,
    title: "New Department News",
    description: "New Industrial Hub project announcement has been published.",
    type: "News"
  },
  {
    id: 2,
    icon: FaCalendarAlt,
    title: "Upcoming Calendar Event",
    description: "Quarterly Performance Review scheduled for 26 October.",
    type: "Calendar"
  },
  {
    id: 3,
    icon: FaFileAlt,
    title: "New HR Circular Available",
    description: "Updated Information Security Guidelines have been uploaded.",
    type: "Circular"
  },
  {
    id: 4,
    icon: FaUserCircle,
    title: "Appointment Update",
    description: "New acting appointments have been announced.",
    type: "HR"
  }
];





const Homepage = () => {
  const [emergencyVisible, setEmergencyVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

const [showUpdates, setShowUpdates] = useState(() => {
  const seenUpdates = localStorage.getItem("dedat_updates_seen");

  return !seenUpdates;
});
  // Quick access items
  const quickAccessItems = [
    { icon: FaHeadset, label: "IT Support" },
    { icon: FaDoorOpen, label: "Boardrooms" },
    { icon: FaSearchPlus, label: "Search Employees" },
    { icon: FaEnvelope, label: "Groupwise" },
    { icon: FaFileAlt, label: "SAES eFiling" },
    { icon: FaCalendarAlt, label: "E-Leave" },
    { icon: FaPaperPlane, label: "E-Submission" },
    { icon: FaShieldAlt, label: "Cybersecurity" }
  ];

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

  return (
    <div className="homepage">


      {/* Emergency Notices Bar
      
      
      {emergencyVisible && (
        <div className="emergency-banner">
          <div className="d-flex align-items-center gap-2">
            <FaExclamationTriangle className="text-white" />
            <span>URGENT: Scheduled system maintenance for SAES eFiling this Friday from 18:00 PM.</span>
          </div>
          <button className="close-btn" onClick={() => setEmergencyVisible(false)}>
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
    localStorage.setItem("dedat_updates_seen", "true");
    setShowUpdates(false);
  }}
>
  Continue to Intranet
</Button>

  </Modal.Footer>

</Modal>
        <div className="homepage-container">

          {/* Hero Carousel */}
          <Carousel 
            className="hero-carousel mb-4"
            activeIndex={currentSlide}
            onSelect={(index) => setCurrentSlide(index)}
            indicators={true}
            controls={true}
            interval={5000}
          >
            {carouselItems.map((item) => (
              <Carousel.Item key={item.id}>
                <img src={item.image} alt={item.title} />
                <Carousel.Caption className="text-md-left">
                  <Badge className="badge-featured mb-2">{item.category}</Badge>
                  <h2>{item.title}</h2>
                  <p>{item.excerpt}</p>
                  <div className="d-flex align-items-center gap-3">
                    <Button className="btn-read">Read Full Article <FaArrowRight className="ms-2" /></Button>
                    <span className="text-white-50">{item.time}</span>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>

          <Row className="g-4">
            {/* Left Column - 8 Columns */}
            <Col lg={8}>

              {/* Quick Access Portal */}
              <section className="mb-4">
                <h4 className="d-flex align-items-center gap-2 mb-3" style={{ color: '#5c5b5b' }}>
                  <FaTh style={{ color: '#d85f06' }} />
                  Quick Access Portal
                </h4>
                <Row className="g-3">
                  {quickAccessItems.map((item, index) => (
                    <Col xs={6} sm={4} md={3} key={index}>
                      <div className="quick-access-card">
                        <div className="icon-wrapper">
                          <item.icon />
                        </div>
                        <span className="card-label">{item.label}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </section>

              {/* Latest Departmental News */}
              <section className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="d-flex align-items-center gap-2" style={{ color: '#5c5b5b' }}>
                    <FaNewspaper style={{ color: '#d85f06' }} />
                    Latest Departmental News
                  </h4>
                  <Button variant="link" className="text-decoration-none" style={{ color: '#d85f06', fontWeight: 600 }}>
                    Explore Archive <FaArrowRight className="ms-1" />
                  </Button>
                </div>
                <Row className="g-4">
                  {newsItems.map((item) => (
                    <Col md={6} key={item.id}>
                      <div className="news-card">
                        <img src={item.image} alt={item.title} />
                        <div className="news-body">
                          <div className="news-category">{item.category}</div>
                          <h5 className="news-title">{item.title}</h5>
                          <p className="news-excerpt">{item.excerpt}</p>
                          <a href="#" className="news-read-link">
                            Read Article <FaArrowRight className="ms-1" style={{ fontSize: '0.65rem' }} />
                          </a>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </section>

              {/* Departmental Calendar */}
              <section>
                <div className="calendar-widget">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 style={{ color: '#5c5b5b', fontWeight: 600 }}>Departmental Calendar</h5>
                    <div className="d-flex align-items-center gap-2">
                      <Button variant="link" className="p-0 text-secondary">
                        <FaChevronLeft />
                      </Button>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>October 2024</span>
                      <Button variant="link" className="p-0 text-secondary">
                        <FaChevronRight />
                      </Button>
                    </div>
                  </div>
                  <Row className="g-3">
                    {calendarEvents.map((event) => (
                      <Col md={6} key={event.id}>
                        <div className="event-item">
                          <div className="event-date">
                            <div className="month">{event.month}</div>
                            <div className="day">{event.date}</div>
                          </div>
                          <div>
                            <div className="event-title">{event.title}</div>
                            <div className="event-time">{event.time}</div>
                            <div className="mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.6rem', fontWeight: 700, color: event.expiry.includes('EXPIRES') ? '#dc3545' : '#5c5b5b' }}>
                              <FaClock style={{ fontSize: '0.6rem' }} />
                              {event.expiry}
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </section>
            </Col>

            {/* Right Column - 4 Columns */}
            <Col lg={4}>

              {/* MEC Vision Widget */}
              <div className="mec-widget mb-4">
                <div className="position-relative" style={{ height: '100px', overflow: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
                    alt="Northern Cape Landscape"
                    className="mec-image"
                  />
                  <div className="position-absolute bottom-0 start-0 p-3 w-100" >
                    <Badge className="mec-badge">Our Vision</Badge>
                    <h6 className="text-white mt-1">Radical Economic Transformation</h6>
                  </div>
                </div>
                <div className="mec-body d-flex align-items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80"
                    alt="MEC"
                    className="expert-avatar"
                  />
                  <div className="flex-grow-1">
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>MEC's Welcome</div>
                    <div className="mec-quote">"Building a prosperous future together..."</div>
                  </div>
                  <FaArrowRight style={{ opacity: 0.5, cursor: 'pointer' }} />
                </div>
              </div>

              {/* Expiring Documents */}
              <section className="mb-4">
                <h5 className="d-flex align-items-center gap-2 mb-3" style={{ color: '#5c5b5b' }}>
                  <FaExclamationTriangle style={{ color: '#dc3545' }} />
                  Expiring Documents
                </h5>
                <div className="bg-white p-3 rounded-3 border">
                  {expiringDocuments.map((doc) => (
                    <div key={doc.id} className={`expiring-doc-item ${doc.urgency}`}>
                      <div className='expired-docs-card'>
                        <div className="doc-title">{doc.title}</div>
                        <div className="doc-expiry">{doc.expiry}</div>
                        <button className="doc-btn mt-1">Review Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Circulars */}
              <section className="mb-4">
                <div className="bg-white p-3 rounded-3 border">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 style={{ color: '#5c5b5b', fontWeight: 600 }}>Circulars</h5>
                    <FaClock style={{ color: '#6c757d' }} />
                  </div>
                  {circulars.map((circular) => (
                    <div key={circular.id} className="circular-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Badge bg={getClassificationBadge(circular.classification)} className="me-2">
                            {circular.classification}
                          </Badge>
                        </div>
                      </div>
                      <div className="circular-title">{circular.title}</div>
                      <div className="circular-date">{circular.time}</div>
                    </div>
                  ))}
                  <Button variant="link" className="w-100 mt-2 text-decoration-none" style={{ color: '#d85f06', fontWeight: 600 }}>
                    View All
                  </Button>
                </div>
              </section>

              {/* Expert Spotlight */}
              <section>
                <div className="expert-spotlight">
                  <div className="spotlight-bg"></div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80"
                      alt="Expert"
                      className="expert-avatar"
                    />
                    <div>
                      <div className="expert-name">Thandiwe Molefe</div>
                      <div className="expert-title">Senior Economist</div>
                    </div>
                  </div>
                  <button className="btn-contact">
                    <FaStar className="me-2" /> Contact Expert
                  </button>
                </div>
              </section>
            </Col>
          </Row>
        </div>
      </Container>

      
    </div>
    
  );
};

export default Homepage;