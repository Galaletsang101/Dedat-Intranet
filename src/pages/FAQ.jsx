import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getFaqs } from "../services/faqsService";
import "../styles/faq.css";

/* =========================================================
   DEFAULT FAQ CONTENT
========================================================= */

const DEFAULT_FAQS = [
  {
    id: "default-1",
    category: "General & Mandate",
    question: "What is DEDaT’s primary mission?",
    answer:
      "We drive provincial economic growth and job creation by supporting tourism, green energy, and small businesses.",
  },

  {
    id: "default-2",
    category: "General & Mandate",
    question: "Where are our main head offices located?",
    answer:
      "The Western Cape office is in Cape Town (80 St George's Mall) and the Northern Cape office is in Kimberley (Metlife Towers).",
  },

  {
    id: "default-3",
    category: "Youth & Internship Programs",
    question: "What is the DEDaT Youth Stipend Funding Program?",
    answer:
      "We fund stipends for unemployed youth placed at host companies to provide them with workplace experience.",
  },

  {
    id: "default-4",
    category: "Youth & Internship Programs",
    question: "Who qualifies to be an intern under our programs?",
    answer:
      "Unemployed South African citizens aged 18 to 35 who live in the province and have not received this stipend before.",
  },

  {
    id: "default-5",
    category: "Youth & Internship Programs",
    question: "How do external companies apply to host our interns?",
    answer:
      "Companies must submit an Expression of Interest, commit to a stipend co-payment, and offer employment guarantees post-training.",
  },

  {
    id: "default-6",
    category: "Tourism & Tour Guide Registration",
    question: "How does someone apply for a tourist guide license through us?",
    answer:
      "Applicants submit forms to our provincial registrar with a certified ID, First-Aid certificate, CATHSSETA certificate, and competence letter.",
  },

  {
    id: "default-7",
    category: "Tourism & Tour Guide Registration",
    question: "What are the three categories of tour guides we register?",
    answer:
      "Site Guides (specific local areas), Provincial Guides (entire province), and National Guides (anywhere in South Africa).",
  },

  {
    id: "default-8",
    category: "Business Support & Procurement",
    question: "Do we offer direct funding to small businesses (SMMEs)?",
    answer:
      "Yes, we provide financial boosts through specific joint funds like the Blended SMME Fund partnered with the NEF.",
  },

  {
    id: "default-9",
    category: "Business Support & Procurement",
    question: "Where do we publish our official departmental tenders?",
    answer:
      "All active tenders are uploaded to our provincial website's Tender Directory and the National Treasury e-Tender portal.",
  },

  {
    id: "default-10",
    category: "Consumer Rights",
    question: "What does our Consumer Protection Authority (CPA) unit do?",
    answer:
      "We protect citizens by investigating consumer complaints, running workshops, and conducting inspections to enforce the Consumer Protection Act.",
  },
];

/* =========================================================
   FAQ COMPONENT
========================================================= */

export default function FAQ() {
  const [publishedFaqs, setPublishedFaqs] = useState([]);

  /* =======================================================
     LOAD FAQS WHEN PAGE OPENS
  ======================================================= */

  useEffect(() => {
    loadFaqs();

    const handleStorageChange = () => {
      loadFaqs();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  /* =======================================================
     GET FAQS FROM THE POSTGRESQL-SHAPED SERVICE
  ======================================================= */

  const loadFaqs = async () => {
    try {
      const faqRows = await getFaqs();

      const faqContent = Array.isArray(faqRows)
        ? faqRows
            .filter((item) => item && item.question && item.answer && item.category)
            .map((item) => ({
              id: item.id || `faq-${Date.now()}-${Math.random()}`,
              question: item.question,
              answer: item.answer,
              category: item.category,
              publishedDate: item.publication_date || item.created_at || "",
              createdAt: item.created_at || "",
            }))
        : [];

      setPublishedFaqs(faqContent);
    } catch (error) {
      console.error("Failed to load FAQ content:", error);
      setPublishedFaqs([]);
    }
  };

  /* =======================================================
     COMBINE DEFAULT + ADMIN FAQ CONTENT
  ======================================================= */

  const allFaqs = useMemo(() => {
    return [...DEFAULT_FAQS, ...publishedFaqs];
  }, [publishedFaqs]);

  /* =======================================================
     GROUP FAQs BY CATEGORY
  ======================================================= */

  const groupedFaqs = useMemo(() => {
    const groups = {};

    allFaqs.forEach((faq) => {
      if (!faq.category) {
        return;
      }

      const category = faq.category.trim();

      if (!category) {
        return;
      }

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(faq);
    });

    return groups;
  }, [allFaqs]);

  /* =======================================================
     DISPLAY FAQ PAGE
  ======================================================= */

  return (
    <div className="faq-page" id="top">

      <h1>Frequently Asked Questions</h1>

      {Object.entries(groupedFaqs).map(
        ([category, faqs]) => (
          <section
            className="faq-section"
            key={category}
          >

            <h2>{category}</h2>

            {faqs.map((faq) => (
              <details key={faq.id}>

                <summary>
                  {faq.question}
                </summary>

                <div>
                  <ReactMarkdown>
                    {faq.answer}
                  </ReactMarkdown>
                </div>

              </details>
            ))}

          </section>
        )
      )}

    </div>
  );
}