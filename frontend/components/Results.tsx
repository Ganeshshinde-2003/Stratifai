import React from 'react';
import { MarketingStrategy } from '../services/api';
import styles from '../styles/Results.module.css';

interface ResultsProps {
  data: MarketingStrategy;
  onDownloadPDF: () => void;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ data, onDownloadPDF, onReset }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Marketing Strategy</h1>
        <div className={styles.actions}>
          <button className={styles.pdfButton} onClick={onDownloadPDF}>
            📄 Download PDF
          </button>
          <button className={styles.resetButton} onClick={onReset}>
            ← New Strategy
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Product Summary */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Product Summary</h2>
          <div className={styles.card}>
            <p className={styles.text}>{data.product_summary}</p>
          </div>
        </section>

        {/* Target Audience */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Target Audience</h2>
          <div className={styles.card}>
            <p className={styles.text}>{data.target_audience}</p>
          </div>
        </section>

        {/* Positioning */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Market Positioning</h2>
          <div className={styles.card}>
            <p className={styles.text}>{data.positioning}</p>
          </div>
        </section>

        {/* Ad Copy */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ad Copy Variations</h2>
          <div className={styles.grid}>
            {data.ad_copy.map((ad, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.badgeContainer}>
                  <span className={styles.badge}>Variation {index + 1}</span>
                </div>
                <p className={styles.text}>{ad}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Email Sequence */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Email Sequence</h2>
          <div className={styles.emailGrid}>
            {data.email_sequence.map((emailObj, index) => {
              const emailKey = `email_${index + 1}`;
              const emailContent = emailObj[emailKey];
              const lines = emailContent.split('\n');
              const subject = lines[0].replace('Subject:', '').trim();
              const body = lines.slice(1).join('\n').trim();

              return (
                <div key={index} className={styles.emailCard}>
                  <div className={styles.emailHeader}>
                    <span className={styles.emailBadge}>Email {index + 1}</span>
                    <span className={styles.emailSubject}>{subject}</span>
                  </div>
                  <div className={styles.emailBody}>
                    <pre className={styles.emailText}>{body}</pre>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Landing Page */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Landing Page Structure</h2>
          <div className={styles.landingPage}>
            <div className={styles.card}>
              <h3 className={styles.subsectionTitle}>Headline</h3>
              <p className={styles.headline}>{data.landing_page.headline}</p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.subsectionTitle}>Subheadline</h3>
              <p className={styles.text}>{data.landing_page.subheadline}</p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.subsectionTitle}>Page Sections</h3>
              <ol className={styles.sectionList}>
                {data.landing_page.sections.map((section, index) => (
                  <li key={index} className={styles.sectionItem}>
                    {section}
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.card}>
              <h3 className={styles.subsectionTitle}>Call-to-Action</h3>
              <button className={styles.ctaPreview}>{data.landing_page.cta}</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Results;
