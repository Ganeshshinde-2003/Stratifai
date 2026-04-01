import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import LandingPage from '../components/LandingPage';
import InputForm from '../components/InputForm';
import LoadingProgress from '../components/LoadingProgress';
import ResultsTabs from '../components/ResultsTabs';
import HistoryDashboard from '../components/HistoryDashboard';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import ThemeToggle from '../components/ThemeToggle';
import KeyboardShortcutsHelp from '../components/KeyboardShortcutsHelp';
import { api, MarketingStrategy } from '../services/api';
import { saveStrategy, SavedStrategy } from '../utils/storage';
import { useKeyboardShortcuts, SHORTCUTS } from '../hooks/useKeyboardShortcuts';
import styles from '../styles/Home.module.css';

type ViewType = 'form' | 'history' | 'analytics' | 'results' | 'loading' | 'error';

export default function Home() {
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [view, setView] = useState<ViewType>('form');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MarketingStrategy | null>(null);
  const [currentInput, setCurrentInput] = useState<{ data: string; type: 'url' | 'text' } | null>(null);
  const [currentBrandVoice, setCurrentBrandVoice] = useState<string>('professional');

  // Wake up backend on page load (for free tier hosting that spins down)
  useEffect(() => {
    api.healthCheck();
  }, []);

  const handleSubmit = async (inputData: string, inputType: 'url' | 'text', brandVoice: string, competitorUrls: string[], autoDetect: boolean) => {
    setView('loading');
    setError(null);
    setResult(null);
    setCurrentInput({ data: inputData, type: inputType });
    setCurrentBrandVoice(brandVoice);

    try {
      const strategy = await api.generateStrategy({
        input_data: inputData,
        input_type: inputType,
        brand_voice: brandVoice as 'professional' | 'casual' | 'playful' | 'technical',
        competitor_urls: competitorUrls.length > 0 ? competitorUrls : undefined,
        auto_detect_competitors: autoDetect,
      });

      setResult(strategy);
      setView('results');

      // Auto-save to localStorage
      saveStrategy(inputData, inputType, strategy, brandVoice);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setView('error');
      console.error('Error:', err);
    }
  };

  const handleDownloadPDF = async () => {
    if (!result) return;

    try {
      await api.downloadPDF(result);
    } catch (err: any) {
      alert('Failed to download PDF. Please try again.');
      console.error('PDF Error:', err);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setCurrentInput(null);
    setView('form');
  };

  const handleViewHistory = () => {
    setView('history');
  };

  const handleViewAnalytics = () => {
    setView('analytics');
  };

  const handleSelectStrategy = (saved: SavedStrategy) => {
    setResult(saved.strategy);
    setCurrentInput({ data: saved.inputData, type: saved.inputType });
    setView('results');
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    setView('form');
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      ...SHORTCUTS.NEW_STRATEGY,
      callback: () => {
        if (view !== 'loading') handleReset();
      },
    },
    {
      ...SHORTCUTS.HISTORY,
      callback: () => {
        if (view !== 'loading') handleViewHistory();
      },
    },
    {
      ...SHORTCUTS.ANALYTICS,
      callback: () => {
        if (view !== 'loading') handleViewAnalytics();
      },
    },
    {
      ...SHORTCUTS.ESCAPE,
      callback: () => {
        if (view === 'error') handleReset();
      },
    },
  ]);

  // Show landing page first
  if (showLanding) {
    return (
      <>
        <Head>
          <title>Stratifai - Complete Marketing Strategy in 60 Seconds</title>
          <meta
            name="description"
            content="Generate complete marketing strategies using AI. Get ad copy, email sequences, landing pages, and more in 60 seconds."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <LandingPage onGetStarted={handleGetStarted} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Stratifai - AI Marketing Strategy Generator</title>
        <meta
          name="description"
          content="Generate complete marketing strategies using AI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcutsHelp />

        {/* Navigation Bar */}
        {view !== 'loading' && (
          <div className={styles.navbar}>
            <button
              className={`${styles.navButton} ${view === 'form' ? styles.navButtonActive : ''}`}
              onClick={handleReset}
            >
              New Strategy
            </button>
            <button
              className={`${styles.navButton} ${view === 'history' ? styles.navButtonActive : ''}`}
              onClick={handleViewHistory}
            >
              History
            </button>
            <button
              className={`${styles.navButton} ${view === 'analytics' ? styles.navButtonActive : ''}`}
              onClick={handleViewAnalytics}
            >
              Analytics
            </button>
          </div>
        )}

        {/* Form View */}
        {view === 'form' && (
          <InputForm onSubmit={handleSubmit} loading={false} />
        )}

        {/* Loading View */}
        {view === 'loading' && <LoadingProgress />}

        {/* Error View */}
        {view === 'error' && (
          <div className={styles.errorContainer}>
            <div className={styles.errorCard}>
              <h2 className={styles.errorTitle}>Error</h2>
              <p className={styles.errorMessage}>{error}</p>
              <button className={styles.retryButton} onClick={handleReset}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results View */}
        {view === 'results' && result && (
          <ResultsTabs
            data={result}
            onDownloadPDF={handleDownloadPDF}
            onReset={handleReset}
          />
        )}

        {/* History View */}
        {view === 'history' && (
          <HistoryDashboard
            onSelectStrategy={handleSelectStrategy}
            onNewStrategy={handleReset}
          />
        )}

        {/* Analytics View */}
        {view === 'analytics' && <AnalyticsDashboard />}
      </main>
    </>
  );
}
