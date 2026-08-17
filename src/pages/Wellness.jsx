import { useEffect, useMemo, useState } from "react";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaPlay,
} from "react-icons/fa";

import { getWellnessVideos } from "../firebase/wellnessService";

import "../styles/wellness.css";

function Wellness() {
  // ===========================
  // STATE
  // ===========================

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "All",
    "Mental Health",
    "Productivity",
    "Physical Care",
  ];

  // ===========================
  // FILTER VIDEOS
  // ===========================

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory =
        selectedCategory === "All" ||
        video.category === selectedCategory;

      const matchesSearch =
        (video.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (video.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, searchTerm]);

  // ===========================
  // VIDEO MODAL
  // ===========================

  const openVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  // ===========================
  // LOAD VIDEOS FROM FIRESTORE
  // ===========================

const loadVideos = async () => {
  try {
    const firebaseVideos = await getWellnessVideos();
    setVideos(firebaseVideos);
  } catch (error) {
    console.error(error);
  }
};

  // ===========================
  // PAGE LOAD
  // ===========================

  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <div className="wellness-page">

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">

        
  <h1>
  <span style={{ color: "black" }}>
    Find your balance,
  </span>
  <span> anytime, anywhere.</span>
</h1>

<p style={{ color: "black" }}>
  Welcome to your dedicated Employee Health and Wellness
  space where you can discover wellness resources,
  webinars and support whenever you need them.
</p>

        </div>

      </section>

      {/* ================= TOP SECTION ================= */}

      <section className="top-section">

        {/* CONTACT CARD */}

        <div className="contact-card hover-shadow transition">

          <h2>Lyra Contact Details</h2>

          <div className="contact-item">

            <div className="contact-icon">
              <FaPhoneAlt />
            </div>

            <div>

              <small>Phone Support</small>

              <h3>1-800-LYRA-HELP</h3>

            </div>

          </div>

          <div className="contact-item">

            <div className="contact-icon">
              <FaEnvelope />
            </div>

            <div>

              <small>Email</small>

              <h3>support@lyrahealth.com</h3>

            </div>

          </div>

          <div className="contact-item">

            <div className="contact-icon">
              <FaGlobe />
            </div>

            <div>

              <small>Website</small>

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

      </section>

      {/* ================= WEBINAR LIBRARY ================= */}

      <section className="library">

        <div className="library-top">

          <div>

            <h2>Webinar Library</h2>

            <p>
              Browse all employee wellness webinars.
            </p>

          </div>

          <div className="library-actions">

            <input
              type="text"
              className="search-input transition"
              placeholder="Search webinars..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>

        <div className="category-buttons">

          {categories.map((category) => (

            <button
              key={category}
              className={
                selectedCategory === category
                  ? "category-btn active transition"
                  : "category-btn transition"
              }
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>

          ))}

        </div>

                <div className="video-grid">

          {filteredVideos.length > 0 ? (

            filteredVideos.map((video) => (

              <div
                className="video-card hover-shadow transition"
                key={video.id}
              >

                {/* Thumbnail */}

                <div className="thumbnail">

                  <img
                    src={
                      video.thumbnail ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900"
                    }
                    alt={video.title}
                  />

                  {video.featured && (
                    <span className="featured">
                      NEW
                    </span>
                  )}

                  <button
                    className="play-button"
                    onClick={() => openVideo(video)}
                  >
                    <FaPlay />
                  </button>

                </div>

                {/* Content */}

                <div className="video-content">

                  <h3>
                    {video.title || "Untitled Webinar"}
                  </h3>

                  <p>
                    {video.description ||
                      "No description available."}
                  </p>

                  <div className="video-footer">

                    <span className="duration">
                      {video.duration || "--"}
                    </span>

                    <button
                      className="watch-btn"
                      onClick={() => openVideo(video)}
                    >
                      Watch Now
                    </button>

                  </div>

                </div>

              </div>

            ))

          ) : (

            <div className="empty-state">

              <h2>No webinars found</h2>

              <p>
                Try another search or check back later for new content.
              </p>

            </div>

          )}

        </div>

      </section>

            {/* ================= VIDEO MODAL ================= */}

      {selectedVideo && (
        <div
          className="video-modal"
          onClick={closeVideo}
        >

          <div
            className="video-container"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-btn2"
              onClick={closeVideo}
            >
              ✕
            </button>

            <video
              controls
              autoPlay
              className="video-player"
            >
              <source
                src={selectedVideo.video}
                type="video/mp4"
              />

              Your browser does not support the video tag.

            </video>

            <div className="video-details">

              <h2>
                {selectedVideo.title}
              </h2>

              <p>
                {selectedVideo.description}
              </p>

              <div className="video-info">

                <span>
                  Duration: {selectedVideo.duration || "--"}
                </span>

                <span className="category">
                  {selectedVideo.category}
                </span>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Wellness;