import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MarketingStrategy } from '../services/api';
import styles from '../styles/ResultsTabs.module.css';

interface ResultsTabsProps {
  data: MarketingStrategy;
  onDownloadPDF: () => void;
  onReset: () => void;
}

type TabType = 'overview' | 'adcopy' | 'emails' | 'landing' | 'social' | 'seo' | 'competitors' | 'export';

const ResultsTabs: React.FC<ResultsTabsProps> = ({ data, onDownloadPDF, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Animation variants for tab content
  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    }
  } as const;

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview' },
    { id: 'adcopy' as TabType, label: 'Ad Copy' },
    { id: 'emails' as TabType, label: 'Emails' },
    { id: 'landing' as TabType, label: 'Landing Page' },
    { id: 'social' as TabType, label: 'Social Media' },
    { id: 'seo' as TabType, label: 'SEO' },
    ...(data.competitor_analysis ? [{ id: 'competitors' as TabType, label: 'Competitors' }] : []),
    { id: 'export' as TabType, label: 'Export' },
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification in next step
    alert(`${label} copied to clipboard!`);
  };

  // Export helpers
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csvRows = [];

    // Header
    csvRows.push(['Section', 'Content'].join(','));

    // Product Summary
    csvRows.push(['Product Summary', `"${data.product_summary.replace(/"/g, '""')}"`].join(','));
    csvRows.push(['Target Audience', `"${data.target_audience.replace(/"/g, '""')}"`].join(','));
    csvRows.push(['Positioning', `"${data.positioning.replace(/"/g, '""')}"`].join(','));

    // Ad Copy
    data.ad_copy.forEach((ad, i) => {
      csvRows.push([`Ad Copy ${i + 1}`, `"${ad.replace(/"/g, '""')}"`].join(','));
    });

    // Emails
    data.email_sequence.forEach((email, i) => {
      const emailKey = `email_${i + 1}`;
      csvRows.push([`Email ${i + 1}`, `"${email[emailKey].replace(/"/g, '""')}"`].join(','));
    });

    // Landing Page
    csvRows.push(['Landing Page Headline', `"${data.landing_page.headline.replace(/"/g, '""')}"`].join(','));
    csvRows.push(['Landing Page Subheadline', `"${data.landing_page.subheadline.replace(/"/g, '""')}"`].join(','));
    csvRows.push(['Landing Page CTA', `"${data.landing_page.cta.replace(/"/g, '""')}"`].join(','));

    // Social Media
    if (data.social_media) {
      data.social_media!.twitter_thread.forEach((tweet, i) => {
        csvRows.push([`Twitter Tweet ${i + 1}`, `"${tweet.replace(/"/g, '""')}"`].join(','));
      });
      data.social_media!.linkedin_posts.forEach((post, i) => {
        csvRows.push([`LinkedIn Post ${i + 1}`, `"${post.replace(/"/g, '""')}"`].join(','));
      });
      data.social_media!.instagram_captions.forEach((caption, i) => {
        csvRows.push([`Instagram Caption ${i + 1}`, `"${caption.replace(/"/g, '""')}"`].join(','));
      });
    }

    // SEO
    if (data.seo) {
      csvRows.push(['SEO Keywords', `"${data.seo!.keywords.join(', ')}"`].join(','));
      csvRows.push(['SEO Meta Title', `"${data.seo!.meta_title.replace(/"/g, '""')}"`].join(','));
      csvRows.push(['SEO Meta Description', `"${data.seo!.meta_description.replace(/"/g, '""')}"`].join(','));
    }

    const csv = csvRows.join('\n');
    downloadFile(csv, 'marketing-strategy.csv', 'text/csv');
  };

  const exportSocialMediaTemplates = () => {
    if (!data.social_media) {
      alert('No social media content available');
      return;
    }

    const templates = `
==============================================
SOCIAL MEDIA CONTENT - READY TO POST
==============================================

TWITTER THREAD (Copy & Paste to Twitter/X)
----------------------------------------------
${data.social_media!.twitter_thread.map((tweet, i) => `${i + 1}/${data.social_media!.twitter_thread.length}\n${tweet}`).join('\n\n')}

💼 LINKEDIN POSTS (Copy & Paste to LinkedIn)
----------------------------------------------
${data.social_media!.linkedin_posts.map((post, i) => `POST ${i + 1}:\n${post}`).join('\n\n---\n\n')}

📸 INSTAGRAM CAPTIONS (Copy & Paste to Instagram)
----------------------------------------------
${data.social_media!.instagram_captions.map((caption, i) => `CAPTION ${i + 1}:\n${caption}`).join('\n\n---\n\n')}

==============================================
Generated by AI Marketing Intelligence
==============================================
    `.trim();

    downloadFile(templates, 'social-media-templates.txt', 'text/plain');
  };

  const exportContentCalendar = () => {
    const now = new Date();
    const startDate = new Date(now);
    const events: Array<{ title: string; description: string; date: Date }> = [];

    // Create calendar events for social media posts over next 30 days
    if (data.social_media) {
      // Twitter posts - every 3 days
      data.social_media!.twitter_thread.forEach((tweet, i) => {
        const eventDate = new Date(startDate);
        eventDate.setDate(eventDate.getDate() + (i * 3));
        events.push({
          title: `Post Twitter Thread ${i + 1}`,
          description: tweet,
          date: eventDate,
        });
      });

      // LinkedIn posts - every week
      data.social_media!.linkedin_posts.forEach((post, i) => {
        const eventDate = new Date(startDate);
        eventDate.setDate(eventDate.getDate() + (i * 7));
        events.push({
          title: `Post LinkedIn Update ${i + 1}`,
          description: post,
          date: eventDate,
        });
      });

      // Instagram posts - every 5 days
      data.social_media!.instagram_captions.forEach((caption, i) => {
        const eventDate = new Date(startDate);
        eventDate.setDate(eventDate.getDate() + (i * 5));
        events.push({
          title: `Post Instagram Content ${i + 1}`,
          description: caption,
          date: eventDate,
        });
      });
    }

    // Create .ics file content
    const icsEvents = events.map(event => {
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      return `BEGIN:VEVENT
UID:${Date.now()}-${Math.random()}@marketing-ai
DTSTAMP:${formatDate(now)}
DTSTART:${formatDate(event.date)}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
END:VEVENT`;
    }).join('\n');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AI Marketing Intelligence//Content Calendar//EN
CALNAME:Marketing Content Calendar
${icsEvents}
END:VCALENDAR`;

    downloadFile(icsContent, 'content-calendar.ics', 'text/calendar');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Your Marketing Strategy</h1>
          <p className={styles.subtitle}>AI-generated in 60 seconds</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.resetButton} onClick={onReset}>
            ← New Strategy
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              className={styles.tabPanel}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Product Summary</h2>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(data.product_summary, 'Product Summary')}
                >
                  Copy
                </button>
              </div>
              <p className={styles.cardContent}>{data.product_summary}</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Target Audience</h2>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(data.target_audience, 'Target Audience')}
                >
                  Copy
                </button>
              </div>
              <p className={styles.cardContent}>{data.target_audience}</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Market Positioning</h2>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(data.positioning, 'Positioning')}
                >
                  Copy
                </button>
              </div>
              <p className={styles.cardContent}>{data.positioning}</p>
            </div>
            </motion.div>
          )}

          {/* Ad Copy Tab */}
          {activeTab === 'adcopy' && (
            <motion.div
              key="adcopy"
              className={styles.tabPanel}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
            <div className={styles.grid}>
              {data.ad_copy.map((ad, index) => (
                <div key={index} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>Variation {index + 1}</h3>
                    <button
                      className={styles.copyButton}
                      onClick={() => copyToClipboard(ad, `Ad Copy ${index + 1}`)}
                    >
                      Copy
                    </button>
                  </div>
                  <p className={styles.cardContent}>{ad}</p>
                </div>
              ))}
            </div>
            </motion.div>
          )}

          {/* Emails Tab */}
          {activeTab === 'emails' && (
            <motion.div
              key="emails"
              className={styles.tabPanel}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
            {data.email_sequence.map((emailObj, index) => {
              const emailKey = `email_${index + 1}`;
              const emailContent = emailObj[emailKey];
              const lines = emailContent.split('\n');
              const subject = lines[0].replace('Subject:', '').trim();
              const body = lines.slice(1).join('\n').trim();

              return (
                <div key={index} className={styles.emailCard}>
                  <div className={styles.emailHeader}>
                    <div className={styles.emailBadge}>Email {index + 1}</div>
                    <button
                      className={styles.copyButton}
                      onClick={() => copyToClipboard(emailContent, `Email ${index + 1}`)}
                    >
                      Copy
                    </button>
                  </div>
                  <div className={styles.emailSubject}>
                    <strong>Subject:</strong> {subject}
                  </div>
                  <div className={styles.emailBody}>
                    <pre className={styles.emailText}>{body}</pre>
                  </div>
                </div>
              );
            })}
            </motion.div>
          )}

          {/* Landing Page Tab */}
          {activeTab === 'landing' && (
            <motion.div
              key="landing"
              className={styles.tabPanel}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Headline</h2>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(data.landing_page.headline, 'Headline')}
                >
                  Copy
                </button>
              </div>
              <p className={styles.headline}>{data.landing_page.headline}</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Subheadline</h2>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(data.landing_page.subheadline, 'Subheadline')}
                >
                  Copy
                </button>
              </div>
              <p className={styles.cardContent}>{data.landing_page.subheadline}</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Page Sections</h2>
              </div>
              <ol className={styles.sectionList}>
                {data.landing_page.sections.map((section, index) => (
                  <li key={index} className={styles.sectionItem}>
                    {section}
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Call-to-Action</h2>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(data.landing_page.cta, 'CTA')}
                >
                  Copy
                </button>
              </div>
              <button className={styles.ctaPreview}>{data.landing_page.cta}</button>
            </div>
            </motion.div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && data.social_media && (
            <motion.div
              key="social"
              className={styles.tabPanel}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
            {/* Twitter Thread */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>🐦 Twitter Thread</h2>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(data.social_media!.twitter_thread.join('\n\n'), 'Twitter Thread')}
                >
                  Copy All
                </button>
              </div>
              <div className={styles.tweetList}>
                {data.social_media!.twitter_thread.map((tweet, index) => (
                  <div key={index} className={styles.tweetCard}>
                    <div className={styles.tweetHeader}>
                      <span className={styles.tweetNumber}>Tweet {index + 1}/{data.social_media!.twitter_thread.length}</span>
                      <button
                        className={styles.copyButtonSmall}
                        onClick={() => copyToClipboard(tweet, `Tweet ${index + 1}`)}
                      >
                        Copy
                      </button>
                    </div>
                    <p className={styles.tweetText}>{tweet}</p>
                    <div className={styles.tweetMeta}>{tweet.length} characters</div>
                  </div>
                ))}
              </div>
            </div>

            {/* LinkedIn Posts */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>💼 LinkedIn Posts</h2>
              </div>
              <div className={styles.postList}>
                {data.social_media!.linkedin_posts.map((post, index) => (
                  <div key={index} className={styles.postCard}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.postTitle}>Post {index + 1}</h3>
                      <button
                        className={styles.copyButton}
                        onClick={() => copyToClipboard(post, `LinkedIn Post ${index + 1}`)}
                      >
                        Copy
                      </button>
                    </div>
                    <p className={styles.cardContent}>{post}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Instagram Captions */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>📸 Instagram Captions</h2>
              </div>
              <div className={styles.postList}>
                {data.social_media!.instagram_captions.map((caption, index) => (
                  <div key={index} className={styles.postCard}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.postTitle}>Caption {index + 1}</h3>
                      <button
                        className={styles.copyButton}
                        onClick={() => copyToClipboard(caption, `Instagram Caption ${index + 1}`)}
                      >
                        Copy
                      </button>
                    </div>
                    <p className={styles.cardContent}>{caption}</p>
                  </div>
                ))}
              </div>
            </div>
            </motion.div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && data.seo && (
            <motion.div
              key="seo"
              className={styles.tabPanel}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
            {/* Keywords */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>🔑 Target Keywords</h2>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(data.seo!.keywords.join(', '), 'Keywords')}
                >
                  Copy
                </button>
              </div>
              <div className={styles.keywordGrid}>
                {data.seo!.keywords.map((keyword, index) => (
                  <span key={index} className={styles.keywordTag}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Meta Tags */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Meta Title</h2>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(data.seo!.meta_title, 'Meta Title')}
                >
                  Copy
                </button>
              </div>
              <p className={styles.metaText}>{data.seo!.meta_title}</p>
              <p className={styles.metaLength}>{data.seo!.meta_title.length} characters</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Meta Description</h2>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(data.seo!.meta_description, 'Meta Description')}
                >
                  Copy
                </button>
              </div>
              <p className={styles.cardContent}>{data.seo!.meta_description}</p>
              <p className={styles.metaLength}>{data.seo!.meta_description.length} characters</p>
            </div>

            {/* Heading Structure */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Heading Structure</h2>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(data.seo!.heading_structure.join('\n'), 'Heading Structure')}
                >
                  Copy
                </button>
              </div>
              <ol className={styles.sectionList}>
                {data.seo!.heading_structure.map((heading, index) => (
                  <li key={index} className={styles.sectionItem}>
                    {heading}
                  </li>
                ))}
              </ol>
            </div>
            </motion.div>
          )}

          {/* Competitor Analysis Tab */}
          {activeTab === 'competitors' && data.competitor_analysis && (
            <motion.div
              key="competitors"
              className={styles.tabPanel}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
            {/* Competitor Summaries */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>🏢 Competitors Overview</h2>
              </div>
              <div className={styles.competitorList}>
                {data.competitor_analysis!.competitors.map((comp, index) => (
                  <div key={index} className={styles.competitorCard}>
                    <h3 className={styles.competitorName}>{comp.name}</h3>
                    <p className={styles.competitorSummary}>{comp.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Table */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Feature Comparison</h2>
              </div>
              <div className={styles.comparisonTableWrapper}>
                <table className={styles.comparisonTable}>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th className={styles.yourProduct}>Your Product</th>
                      {data.competitor_analysis!.competitors.map((comp, index) => (
                        <th key={index}>{comp.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.competitor_analysis!.comparison_table).map(([feature, values]) => (
                      <tr key={feature}>
                        <td className={styles.featureName}>{feature}</td>
                        {values.map((value, index) => (
                          <td key={index} className={index === 0 ? styles.yourProductCell : ''}>
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Differentiation Strategy */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Differentiation Strategy</h2>
                <button
                  className={styles.copyButton}
                  onClick={() =>
                    copyToClipboard(
                      data.competitor_analysis!.differentiation_strategy.join('\n\n'),
                      'Differentiation Strategy'
                    )
                  }
                >
                  Copy
                </button>
              </div>
              <ol className={styles.strategyList}>
                {data.competitor_analysis!.differentiation_strategy.map((strategy, index) => (
                  <li key={index} className={styles.strategyItem}>
                    {strategy}
                  </li>
                ))}
              </ol>
            </div>

            {/* Competitive Advantages */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Your Competitive Advantages</h2>
                <button
                  className={styles.copyButton}
                  onClick={() =>
                    copyToClipboard(
                      data.competitor_analysis!.competitive_advantages.join('\n'),
                      'Competitive Advantages'
                    )
                  }
                >
                  Copy
                </button>
              </div>
              <ul className={styles.advantagesList}>
                {data.competitor_analysis!.competitive_advantages.map((advantage, index) => (
                  <li key={index} className={styles.advantageItem}>
                    {advantage}
                  </li>
                ))}
              </ul>
            </div>

            {/* Market Gaps */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Market Opportunities</h2>
                <button
                  className={styles.copyButton}
                  onClick={() =>
                    copyToClipboard(data.competitor_analysis!.market_gaps.join('\n'), 'Market Opportunities')
                  }
                >
                  Copy
                </button>
              </div>
              <ul className={styles.gapsList}>
                {data.competitor_analysis!.market_gaps.map((gap, index) => (
                  <li key={index} className={styles.gapItem}>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
            </motion.div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <motion.div
              key="export"
              className={styles.tabPanel}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
            <div className={styles.exportGrid}>
              <div className={styles.exportCard} onClick={onDownloadPDF}>
                <div className={styles.exportIcon}>📄</div>
                <h3 className={styles.exportTitle}>Download PDF</h3>
                <p className={styles.exportDescription}>
                  Professional PDF report with all sections
                </p>
                <button className={styles.exportButton}>Download PDF</button>
              </div>

              <div className={styles.exportCard}>
                <div className={styles.exportIcon}>📋</div>
                <h3 className={styles.exportTitle}>Copy All</h3>
                <p className={styles.exportDescription}>
                  Copy entire strategy as formatted text
                </p>
                <button
                  className={styles.exportButton}
                  onClick={() => {
                    const allText = `
PRODUCT SUMMARY
${data.product_summary}

TARGET AUDIENCE
${data.target_audience}

POSITIONING
${data.positioning}

AD COPY
${data.ad_copy.map((ad, i) => `${i + 1}. ${ad}`).join('\n\n')}

EMAIL SEQUENCE
${data.email_sequence.map((email, i) => `Email ${i + 1}:\n${email[`email_${i + 1}`]}`).join('\n\n')}

LANDING PAGE
Headline: ${data.landing_page.headline}
Subheadline: ${data.landing_page.subheadline}
Sections: ${data.landing_page.sections.join(', ')}
CTA: ${data.landing_page.cta}
                    `.trim();
                    copyToClipboard(allText, 'Complete Strategy');
                  }}
                >
                  Copy All
                </button>
              </div>

              <div className={styles.exportCard}>
                <div className={styles.exportIcon}>📦</div>
                <h3 className={styles.exportTitle}>Download JSON</h3>
                <p className={styles.exportDescription}>
                  Raw JSON data for integrations
                </p>
                <button
                  className={styles.exportButton}
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(data, null, 2)], {
                      type: 'application/json',
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'marketing-strategy.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download JSON
                </button>
              </div>

              <div className={styles.exportCard}>
                <div className={styles.exportIcon}>📝</div>
                <h3 className={styles.exportTitle}>Download Markdown</h3>
                <p className={styles.exportDescription}>
                  Markdown format for documentation
                </p>
                <button
                  className={styles.exportButton}
                  onClick={() => {
                    const markdown = `
# Marketing Strategy

## Product Summary
${data.product_summary}

## Target Audience
${data.target_audience}

## Market Positioning
${data.positioning}

## Ad Copy Variations
${data.ad_copy.map((ad, i) => `### Variation ${i + 1}\n${ad}`).join('\n\n')}

## Email Sequence
${data.email_sequence.map((email, i) => `### Email ${i + 1}\n${email[`email_${i + 1}`]}`).join('\n\n')}

## Landing Page
**Headline:** ${data.landing_page.headline}

**Subheadline:** ${data.landing_page.subheadline}

**Sections:**
${data.landing_page.sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**CTA:** ${data.landing_page.cta}
                    `.trim();
                    const blob = new Blob([markdown], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'marketing-strategy.md';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download MD
                </button>
              </div>

              <div className={styles.exportCard}>
                <div className={styles.exportIcon}>📊</div>
                <h3 className={styles.exportTitle}>Export to CSV</h3>
                <p className={styles.exportDescription}>
                  Spreadsheet format for data analysis
                </p>
                <button
                  className={styles.exportButton}
                  onClick={exportToCSV}
                >
                  Download CSV
                </button>
              </div>

              {data.social_media && (
                <div className={styles.exportCard}>
                  <div className={styles.exportIcon}>📱</div>
                  <h3 className={styles.exportTitle}>Social Media Templates</h3>
                  <p className={styles.exportDescription}>
                    Ready-to-paste content for all platforms
                  </p>
                  <button
                    className={styles.exportButton}
                    onClick={exportSocialMediaTemplates}
                  >
                    Download Templates
                  </button>
                </div>
              )}

              {data.social_media && (
                <div className={styles.exportCard}>
                  <div className={styles.exportIcon}>📅</div>
                  <h3 className={styles.exportTitle}>Content Calendar</h3>
                  <p className={styles.exportDescription}>
                    30-day posting schedule (.ics file)
                  </p>
                  <button
                    className={styles.exportButton}
                    onClick={exportContentCalendar}
                  >
                    Download Calendar
                  </button>
                </div>
              )}
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResultsTabs;
