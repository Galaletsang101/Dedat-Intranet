import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaCloudUploadAlt,
  FaPlay,
  FaArrowRight,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "../styles/wellness.css";

const webinars = [
  {
    id: 1,
    title: "Mindfulness at Work",
    category: "Mental Health",
    description:
      "Practical techniques to stay grounded and focused during high-pressure work days.",
    duration: "45 mins",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
      video: "/videos/mindfulness.mp4",
    tag: "NEW",
  },
  {
    id: 2,
    title: "Managing Stress",
    category: "Mental Health",
    description:
      "A deep dive into cognitive tools for identifying and mitigating burnout before it starts.",
    duration: "60 mins",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      video: "/videos/stress.mp4"
  },
  {
    id: 3,
    title: "Sleep Hygiene",
    category: "Physical Care",
    description:
      "Optimize your nightly routine to improve recovery and overall wellbeing.",
    duration: "35 mins",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    video: "/videos/sleep.mp4"
  },
  {
    id: 4,
    title: "Work-Life Balance",
    category: "Productivity",
    description:
      "Learn practical strategies for balancing work responsibilities and personal wellbeing.",
    duration: "40 mins",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800",
    video: "/videos/worklife.mp4",
  },
];
  


function Wellness() {

const [selectedCategory, setSelectedCategory] = useState("All");

const [selectedWebinar, setSelectedWebinar] = useState(null);

const categories = [
  "All",
  ...new Set(webinars.map((webinar) => webinar.category)),
];

const filteredWebinars =
  selectedCategory === "All"
    ? webinars
    : webinars.filter(
        (webinar) => webinar.category === selectedCategory
      );
  return (
    <div className="wellness-page">

      {/* HERO */}

      <section className="wellness-hero">

        <div className="hero-content">

          <span className="hero-tag">
            Employee Health & Wellness
          </span>

          <h1>
            Find your balance,
            <br />
            <span>anytime, anywhere.</span>
          </h1>

          <p>
            Welcome to your dedicated Employee Health and Wellness
            space. Access wellness resources, webinars and support
            services designed to help you stay healthy,
            productive and resilient.
          </p>

        </div>

      </section>

      {/* TOP CARDS */}

      <section className="wellness-grid">

        {/* CONTACT CARD */}

        <div className="wellness-card contact-card">

          <div className="card-header">
            <h2>Lyra Contact Details</h2>
          </div>

          <div className="contact-item">

            <div className="icon-circle">
              <FaPhoneAlt />
            </div>

            <div>
              <span>Phone Support</span>
              <h4>1-800-LYRA-HELP</h4>
            </div>

          </div>

          <div className="contact-item">

            <div className="icon-circle">
              <FaEnvelope />
            </div>

            <div>
              <span>Email</span>
              <h4>support@lyrahealth.com</h4>
            </div>

          </div>

          <div className="contact-item">

            <div className="icon-circle">
              <FaGlobe />
            </div>

            <div>
              <span>Website</span>

              <a
                href="https://www.lyrahealth.com"
                target="_blank"
                rel="noreferrer"
              >
                www.lyrahealth.com
              </a>

            </div>

          </div>

        </div>

        {/* UPLOAD CARD */}

        <div className="wellness-card upload-card">

          <div className="upload-icon">
            <FaCloudUploadAlt />
          </div>

          <h2>Submit Recording</h2>

          <p>
            Upload webinar recordings for review and publication
            by the Wellness Administration team.
          </p>

          <button className="upload-btn">
            <FaCloudUploadAlt />
            Select File
          </button>

        </div>

      </section>

            {/* WEBINAR LIBRARY */}

      <section className="webinar-section">

        <div className="section-header">

          <div>
            <h2>Webinar Library</h2>

            <p>
              Explore expert-led wellness sessions designed to support
              your physical, emotional and mental wellbeing.
            </p>
          </div>

          <div className="category-list">
           {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                selectedCategory === category ? "active" : ""
                 }`}
              onClick={() => setSelectedCategory(category)}
    >
             {category}
             </button>
             ))}
     </div>

        </div>

        <div className="webinar-grid">

          {filteredWebinars.map((webinar) => (

            <div
              key={webinar.id}
              className="webinar-card"
            >

              <div className="image-wrapper">

                <img
                  src={webinar.image}
                  alt={webinar.title}
                />

                {webinar.tag && (
                  <div className="new-tag">
                    {webinar.tag}
                  </div>
                )}

                <div className="play-overlay">

                  <button
                  className="play-button"
                  onClick={() => setSelectedWebinar(webinar)}
>
                  <FaPlay />
                  </button>

                </div>

              </div>

              <div className="webinar-content">

                <h3>{webinar.title}</h3>

                <p>
                  {webinar.description}
                </p>

                <div className="webinar-footer">

                  <div className="duration">

                    <FaClock />

                    <span>
                      {webinar.duration}
                    </span>

                  </div>

                  <button
                  className="watch-btn"
                   onClick={() => setSelectedWebinar(webinar)}
>
                    Watch Now
                  <FaArrowRight />
                </button>

                </div>

              </div>

            </div>

          ))}

        </div>

           </section>

      {selectedWebinar && (
        <div
          className="video-modal"
          onClick={() => setSelectedWebinar(null)}
        >
          <div
            className="video-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-video"
              onClick={() => setSelectedWebinar(null)}
            >
              ✕
            </button>


            <video controls autoPlay width="100%">
              <source
                src={selectedWebinar.video}
                type="video/mp4"
              />
              Your browser does not support this video.
            </video>

            <div className="video-info">

    <div className="video-header">

        <div>

            <span className="video-category">
                {selectedWebinar.category}
            </span>

            <h2>{selectedWebinar.title}</h2>

        </div>

        <span className="video-duration">
            <FaClock />
            {selectedWebinar.duration}
        </span>

    </div>

    <p>
        {selectedWebinar.description}
    </p>

</div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Wellness;