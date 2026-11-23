import React, { useEffect, useState } from "react";
import "../styles/faq.css";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/faqs");

      if (!response.ok) {
        throw new Error("Failed to fetch FAQs");
      }

      const data = await response.json();

      setFaqs(data);
    } catch (error) {
      console.error("Error loading FAQs:", error);
      setError("Unable to load FAQs.");
    } finally {
      setLoading(false);
    }
  };

  // Group FAQs by category
  const groupedFAQs = faqs.reduce((groups, faq) => {
    const category = faq.category || "General";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(faq);

    return groups;
  }, {});

  return (
    <div className="faq-page" id="top">
      <h1>Frequently Asked Questions</h1>

      {loading && <p>Loading FAQs...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && faqs.length === 0 && (
        <p>No FAQs available.</p>
      )}

      {!loading &&
        !error &&
        Object.entries(groupedFAQs).map(([category, categoryFAQs]) => (
          <section className="faq-section" key={category}>
            <h2>{category}</h2>

            {categoryFAQs.map((faq) => (
              <details key={faq.id}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </section>
        ))}
    </div>
  );
}