import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTag } from "react-icons/fa";
import { getNewsById } from "../services/newsService";
import { formatDate } from "../utils/dateUtils";
import "../styles/newsArticle.css";

/*
 * Full-article reading view, backing the "Read Article" links on the
 * Homepage and News & Circulars listing. Renders the complete
 * content_markdown (not just the excerpt) via ReactMarkdown, which does
 * not render raw HTML by default - no rehype-raw plugin is used here, so
 * untrusted HTML in article content can't execute as markup/script.
 */
function NewsArticle() {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError("");

    getNewsById(id)
      .then((data) => {
        if (isMounted) setArticle(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="news-article-page">
        <div className="news-article-container">
          <div className="article-skeleton-image" />
          <div className="article-skeleton-line" style={{ width: "40%" }} />
          <div className="article-skeleton-line" style={{ width: "80%", height: 32 }} />
          <div className="article-skeleton-line" />
          <div className="article-skeleton-line" />
          <div className="article-skeleton-line" style={{ width: "60%" }} />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="news-article-page">
        <div className="news-article-container article-empty-state">
          <h1>Article not found</h1>
          <p>
            {error ||
              "This article may have been removed, unpublished, or the link is incorrect."}
          </p>
          <Link to="/news-circulus" className="article-back-link">
            <FaArrowLeft /> Back to News & Circulars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="news-article-page">
      <div className="news-article-container">
        <Link to="/news-circulus" className="article-back-link">
          <FaArrowLeft /> Back to News & Circulars
        </Link>

        {article.status === "Draft" && (
          <div className="article-draft-banner">
            This article is a Draft - only visible to Admins. It will not be
            visible to other staff until it's published.
          </div>
        )}

        {article.image_url && (
          <div className="article-hero-image">
            <img src={article.image_url} alt={article.title} />
          </div>
        )}

        <div className="article-meta-row">
          {article.category && (
            <span className="article-meta-item">
              <FaTag /> {article.category}
            </span>
          )}

          <span className="article-meta-item">
            <FaCalendarAlt /> {formatDate(article.publication_date || article.created_date)}
          </span>

          {article.author && (
            <span className="article-meta-item">
              <FaUser /> {article.author}
            </span>
          )}
        </div>

        <h1 className="article-title">{article.title}</h1>

        {article.excerpt && <p className="article-excerpt">{article.excerpt}</p>}

        <div className="article-body">
          <ReactMarkdown>{article.content_markdown}</ReactMarkdown>
        </div>

        <div className="article-footer">
          <Link to="/news-circulus" className="article-back-link">
            <FaArrowLeft /> Back to News & Circulars
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NewsArticle;
