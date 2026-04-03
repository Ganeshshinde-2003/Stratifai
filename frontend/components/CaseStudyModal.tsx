import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/CaseStudyModal.module.css';

interface CaseStudy {
  title: string;
  type: string;
  productAnalyzed: {
    name: string;
    description: string;
  };
  toolUsed: {
    name: string;
    description: string;
  };
  whatIDid: {
    summary: string;
    outputsGenerated: string[];
  };
  keyInsight: {
    problem: string;
    newPositioning: string;
    reasoning: string;
  };
  sampleOutput: {
    adCopy: string;
  };
  whatWasMissingBefore: string[];
  founderFeedback: {
    role: string;
    quote: string;
  };
  impact: {
    timeToGenerateStrategy: string;
    benefits: string[];
  };
}

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseStudy: CaseStudy;
  founderName: string;
}

const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ isOpen, onClose, caseStudy, founderName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className={styles.modalContainer}>
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.header}>
                <div>
                  <h2 className={styles.title}>{caseStudy.title}</h2>
                  <p className={styles.subtitle}>{caseStudy.type}</p>
                </div>
                <button className={styles.closeButton} onClick={onClose}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className={styles.content}>
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Product Analyzed</h3>
                  <div className={styles.card}>
                    <p className={styles.productName}>{caseStudy.productAnalyzed.name}</p>
                    <p className={styles.description}>{caseStudy.productAnalyzed.description}</p>
                  </div>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>What I Did</h3>
                  <p className={styles.text}>{caseStudy.whatIDid.summary}</p>
                  <div className={styles.outputsList}>
                    <p className={styles.listTitle}>Outputs Generated:</p>
                    <ul className={styles.list}>
                      {caseStudy.whatIDid.outputsGenerated.map((output, index) => (
                        <li key={index}>{output}</li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Key Insight</h3>
                  <div className={styles.insightCard}>
                    <div className={styles.insightItem}>
                      <span className={styles.label}>Problem:</span>
                      <p className={styles.text}>{caseStudy.keyInsight.problem}</p>
                    </div>
                    <div className={styles.insightItem}>
                      <span className={styles.label}>New Positioning:</span>
                      <p className={styles.text}>{caseStudy.keyInsight.newPositioning}</p>
                    </div>
                    <div className={styles.insightItem}>
                      <span className={styles.label}>Reasoning:</span>
                      <p className={styles.text}>{caseStudy.keyInsight.reasoning}</p>
                    </div>
                  </div>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Sample Output</h3>
                  <div className={styles.sampleOutput}>
                    <p className={styles.adCopy}>{caseStudy.sampleOutput.adCopy}</p>
                  </div>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>What Was Missing Before</h3>
                  <ul className={styles.list}>
                    {caseStudy.whatWasMissingBefore.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Founder Feedback</h3>
                  <div className={styles.feedbackCard}>
                    <div className={styles.quoteIcon}>"</div>
                    <p className={styles.quote}>{caseStudy.founderFeedback.quote}</p>
                    <p className={styles.founderInfo}>— {founderName}, {caseStudy.founderFeedback.role}</p>
                  </div>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Impact</h3>
                  <div className={styles.impactCard}>
                    <div className={styles.timeChip}>
                      {caseStudy.impact.timeToGenerateStrategy}
                    </div>
                    <ul className={styles.benefitsList}>
                      {caseStudy.impact.benefits.map((benefit, index) => (
                        <li key={index} className={styles.benefitItem}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CaseStudyModal;
