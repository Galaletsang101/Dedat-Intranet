import React from 'react'
import '../styles/faq.css'

export default function FAQ() {
  return (
    <div className="faq-page" id="top">
      <h1>Frequently Asked Questions</h1>

      <section className="faq-section">
        <h2>General & Mandate</h2>
        <details>
          <summary>What is DEDAT’s primary mission?</summary>
          <p>We drive provincial economic growth and job creation by supporting tourism, green energy, and small businesses.</p>
        </details>
        <details>
          <summary>Where are our main head offices located?</summary>
          <p>The Western Cape office is in Cape Town (80 St George's Mall) and the Northern Cape office is in Kimberley (Metlife Towers).</p>
        </details>
      </section>

      <section className="faq-section">
        <h2>Youth & Internship Programs</h2>
        <details>
          <summary>What is the DEDAT Youth Stipend Funding Program?</summary>
          <p>We fund stipends for unemployed youth placed at host companies to provide them with workplace experience.</p>
        </details>
        <details>
          <summary>Who qualifies to be an intern under our programs?</summary>
          <p>Unemployed South African citizens aged 18 to 35 who live in the province and have not received this stipend before.</p>
        </details>
        <details>
          <summary>How do external companies apply to host our interns?</summary>
          <p>Companies must submit an Expression of Interest, commit to a stipend co-payment, and offer employment guarantees post-training.</p>
        </details>
      </section>

      <section className="faq-section">
        <h2>Tourism & Tour Guide Registration</h2>
        <details>
          <summary>How does someone apply for a tourist guide license through us?</summary>
          <p>Applicants submit forms to our provincial registrar with a certified ID, First-Aid certificate, CATHSSETA certificate, and competence letter.</p>
        </details>
        <details>
          <summary>What are the three categories of tour guides we register?</summary>
          <p>Site Guides (specific local areas), Provincial Guides (entire province), and National Guides (anywhere in South Africa).</p>
        </details>
      </section>

      <section className="faq-section">
        <h2>Business Support & Procurement</h2>
        <details>
          <summary>Do we offer direct funding to small businesses (SMMEs)?</summary>
          <p>Yes, we provide financial boosts through specific joint funds like the Blended SMME Fund partnered with the NEF.</p>
        </details>
        <details>
          <summary>Where do we publish our official departmental tenders?</summary>
          <p>All active tenders are uploaded to our provincial website's Tender Directory and the National Treasury e-Tender portal.</p>
        </details>
      </section>

      <section className="faq-section">
        <h2>Consumer Rights</h2>
        <details>
          <summary>What does our Consumer Protection Authority (CPA) unit do?</summary>
          <p>We protect citizens by investigating consumer complaints, running workshops, and conducting inspections to enforce the Consumer Protection Act.</p>
        </details>
      </section>
    </div>
  )
}
