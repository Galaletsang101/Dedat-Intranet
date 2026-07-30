import { useMemo, useRef, useState } from "react";

import {
  FaHeart,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaCloudUploadAlt,
  FaPlay,
} from "react-icons/fa";

import { storage, db } from "../firebase/firebase";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import "../styles/wellness.css";

function Wellness() {
  const fileInputRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "Mindfulness at Work",
      description:
        "Practical techniques to stay grounded and focused during high-pressure work days.",
      duration: "45 mins",
      category: "Mental Health",
      thumbnail:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900",
      video:
        "https://www.w3schools.com/html/mov_bbb.mp4",
      featured: true,
    },
    {
      id: 2,
      title: "Managing Stress",
      description:
        "Learn practical ways to reduce workplace stress and avoid burnout.",
      duration: "60 mins",
      category: "Mental Health",
      thumbnail:
        "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=900",
      video:
        "https://www.w3schools.com/html/movie.mp4",
    },
    {
      id: 3,
      title: "Healthy Sleep",
      description:
        "Improve your sleeping habits and increase productivity every day.",
      duration: "35 mins",
      category: "Physical Care",
      thumbnail:
        "https://images.unsplash.com/photo-1511296265581-c2450046447d?w=900",
      video:
        "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 4,
      title: "Work-Life Balance",
      description:
        "Finding balance between your career and your personal life.",
      duration: "52 mins",
      category: "Productivity",
      thumbnail:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900",
      video:
        "https://www.w3schools.com/html/movie.mp4",
    },
  ]);

  const categories = [
    "All",
    "Mental Health",
    "Productivity",
    "Physical Care",
  ];

    const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory =
        selectedCategory === "All" ||
        video.category === selectedCategory;

      const matchesSearch =
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, searchTerm]);

  const openVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const uploadVideo = async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  try {
    // Create a unique filename
    const fileName = `${Date.now()}-${file.name}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, `wellnessVideos/${fileName}`);

    await uploadBytes(storageRef, file);

    // Get the video's download URL
    const videoURL = await getDownloadURL(storageRef);

    // Default thumbnail (we'll improve this later)
    const thumbnail =
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900";

    // Save metadata to Firestore
    const docRef = await addDoc(collection(db, "wellnessVideos"), {
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: "Uploaded webinar",
      duration: "--",
      category: "Mental Health",
      thumbnail,
      video: videoURL,
      createdAt: serverTimestamp(),
    });

    // Immediately show the uploaded video in the UI
    const newVideo = {
      id: docRef.id,
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: "Uploaded webinar",
      duration: "--",
      category: "Mental Health",
      thumbnail,
      video: videoURL,
    };

    setVideos((prev) => [newVideo, ...prev]);

    event.target.value = "";

    alert("Video uploaded successfully!");

  } catch (error) {
    console.error(error);
    alert("Upload failed. Check the console for details.");
  }
};

    return (
    <div className="wellness-page">

      {/* ================= HEADER ================= */}

    

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">

          <h1>

            Find your balance,

            <span> anytime, anywhere.</span>

          </h1>

          <p>

            Welcome to your dedicated Employee Health and Wellness
            space where you can discover wellness resources,
            webinars and support whenever you need them.

          </p>

        </div>

      </section>

      {/* ================= TOP CARDS ================= */}

      <section className="top-section">

        {/* Contact Card */}

        <div className="contact-card">

          <h2>Lyra Contact Details</h2>

          <div className="contact-item">

            <FaPhoneAlt />

            <div>

              <small>Phone</small>

              <h3>1-800-LYRA-HELP</h3>

            </div>

          </div>

          <div className="contact-item">

            <FaEnvelope />

            <div>

              <small>Email</small>

              <h3>support@lyrahealth.com</h3>

            </div>

          </div>

          <div className="contact-item">

            <FaGlobe />

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

        {/* Upload Card */}

        <div className="upload-card">

          <FaCloudUploadAlt className="upload-icon" />

          <h2>Submit Recording</h2>

          <p>

            Upload a webinar recording for review.

          </p>

          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={uploadVideo}
            hidden
          />

          <button
            onClick={() => fileInputRef.current.click()}
          >
            Upload Video
          </button>

        </div>

      </section>

      {/* ================= WEBINAR SECTION ================= */}

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
              placeholder="Search webinars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

          </div>

        </div>

        <div className="category-buttons">

          {categories.map((category) => (

            <button
              key={category}
              className={
                selectedCategory === category
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>

          ))}

        </div>

        <div className="video-grid">

          {filteredVideos.length > 0 ? (

            filteredVideos.map((video) => (

              <div
                className="video-card"
                key={video.id}
              >

                <div className="thumbnail">

                  <img
                    src={video.thumbnail}
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

                <div className="video-content">

                  <h3>{video.title}</h3>

                  <p>{video.description}</p>

                  <div className="video-footer">

                    <span>
                      {video.duration}
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

              <h2>No videos found</h2>

              <p>
                Try another search or category.
              </p>

            </div>

          )}

        </div>

      </section>

            {/* ================= VIDEO MODAL ================= */}

      {selectedVideo && (
        <div className="video-modal" onClick={closeVideo}>

          <div
            className="video-container"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-btn"
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

              <h2>{selectedVideo.title}</h2>

              <p>{selectedVideo.description}</p>

              <div className="video-info">

                <span>{selectedVideo.duration}</span>

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