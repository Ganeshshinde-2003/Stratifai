import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/InputForm.module.css';

interface InputFormProps {
  onSubmit: (inputData: string, inputType: 'url' | 'text', brandVoice: string, competitorUrls: string[], autoDetect: boolean) => void;
  loading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [brandVoice, setBrandVoice] = useState<string>('professional');
  const [competitorUrl1, setCompetitorUrl1] = useState('');
  const [competitorUrl2, setCompetitorUrl2] = useState('');
  const [competitorUrl3, setCompetitorUrl3] = useState('');
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [autoDetectCompetitors, setAutoDetectCompetitors] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!inputValue.trim()) {
      setError('Please enter a URL or product description');
      return;
    }

    if (inputType === 'url') {
      // Basic URL validation
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(inputValue)) {
        setError('Please enter a valid URL');
        return;
      }
    } else {
      if (inputValue.trim().length < 50) {
        setError('Product description should be at least 50 characters');
        return;
      }
    }

    // Collect competitor URLs (only if not using auto-detect)
    const competitorUrls = autoDetectCompetitors
      ? []
      : [competitorUrl1, competitorUrl2, competitorUrl3].filter(url => url.trim() !== '');

    // Validate competitor URLs if provided manually
    if (!autoDetectCompetitors && competitorUrls.length > 0) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      for (const url of competitorUrls) {
        if (!urlPattern.test(url)) {
          setError(`Invalid competitor URL: ${url}`);
          return;
        }
      }
    }

    onSubmit(inputValue, inputType, brandVoice, competitorUrls, autoDetectCompetitors);
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.formCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.title}>AI Marketing Intelligence Engine</h1>
        <p className={styles.subtitle}>
          Generate a complete marketing strategy for your product in seconds
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.toggleGroup}>
            <button
              type="button"
              className={`${styles.toggleButton} ${inputType === 'url' ? styles.active : ''}`}
              onClick={() => setInputType('url')}
            >
              Product URL
            </button>
            <button
              type="button"
              className={`${styles.toggleButton} ${inputType === 'text' ? styles.active : ''}`}
              onClick={() => setInputType('text')}
            >
              Product Description
            </button>
          </div>

          {inputType === 'url' ? (
            <input
              type="text"
              className={styles.input}
              placeholder="https://example.com/product"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
            />
          ) : (
            <textarea
              className={styles.textarea}
              placeholder="Describe your product in detail (min 50 characters)..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              rows={6}
            />
          )}

          <div className={styles.voiceSelector}>
            <label htmlFor="brandVoice" className={styles.voiceLabel}>
              Brand Voice:
            </label>
            <select
              id="brandVoice"
              className={styles.voiceSelect}
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              disabled={loading}
            >
              <option value="professional">Professional - Authoritative and trustworthy</option>
              <option value="casual">Casual - Friendly and conversational</option>
              <option value="playful">Playful - Fun and creative</option>
              <option value="technical">Technical - Data-driven and precise</option>
            </select>
          </div>

          <div className={styles.competitorSection}>
            <button
              type="button"
              className={styles.toggleCompetitors}
              onClick={() => setShowCompetitors(!showCompetitors)}
              disabled={loading}
            >
              {showCompetitors ? '▼' : '▶'} Competitor Analysis (Optional)
            </button>

            {showCompetitors && (
              <div className={styles.competitorInputs}>
                <p className={styles.competitorHelp}>
                  Choose how you want to analyze competitors
                </p>

                {/* Auto-detect checkbox */}
                <div className={styles.checkboxContainer}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={autoDetectCompetitors}
                      onChange={(e) => setAutoDetectCompetitors(e.target.checked)}
                      disabled={loading}
                    />
                    <span className={styles.checkboxText}>
                      🤖 Let AI find and analyze competitors automatically
                    </span>
                  </label>
                  {autoDetectCompetitors && (
                    <p className={styles.autoDetectNote}>
                      AI will identify 2-3 direct competitors based on your product and analyze them
                    </p>
                  )}
                </div>

                {/* Manual URL inputs - only show if auto-detect is OFF */}
                {!autoDetectCompetitors && (
                  <>
                    <p className={styles.orDivider}>OR enter competitor URLs manually:</p>
                    <input
                      type="text"
                      className={styles.competitorInput}
                      placeholder="Competitor 1 URL (e.g., https://competitor1.com)"
                      value={competitorUrl1}
                      onChange={(e) => setCompetitorUrl1(e.target.value)}
                      disabled={loading}
                    />
                    <input
                      type="text"
                      className={styles.competitorInput}
                      placeholder="Competitor 2 URL (optional)"
                      value={competitorUrl2}
                      onChange={(e) => setCompetitorUrl2(e.target.value)}
                      disabled={loading}
                    />
                    <input
                      type="text"
                      className={styles.competitorInput}
                      placeholder="Competitor 3 URL (optional)"
                      value={competitorUrl3}
                      onChange={(e) => setCompetitorUrl3(e.target.value)}
                      disabled={loading}
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <motion.button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)' } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            transition={{ duration: 0.2 }}
          >
            {loading ? 'Generating...' : 'Generate Marketing Strategy'}
          </motion.button>
        </form>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span>Target Audience Analysis</span>
          </div>
          <div className={styles.feature}>
            <span>AI-Generated Copy</span>
          </div>
          <div className={styles.feature}>
            <span>Email Sequences</span>
          </div>
          <div className={styles.feature}>
            <span>PDF Export</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InputForm;
