import React, { useState, useEffect } from 'react';
import styles from '../styles/LoadingProgress.module.css';

const LoadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Analyzing product', duration: 15 },
    { label: 'Building strategy', duration: 20 },
    { label: 'Generating content', duration: 20 },
    { label: 'Creating social media', duration: 20 },
    { label: 'Optimizing SEO', duration: 15 },
    { label: 'Finalizing', duration: 10 },
  ];

  useEffect(() => {
    const totalDuration = 90; // 90 seconds estimated for 5-step pipeline
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // Stop at 95% until actual completion
        return prev + (100 / totalDuration) * 0.5; // Increment every 500ms
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update current step based on progress
    if (progress < 15) setCurrentStep(0);
    else if (progress < 35) setCurrentStep(1);
    else if (progress < 55) setCurrentStep(2);
    else if (progress < 75) setCurrentStep(3);
    else if (progress < 90) setCurrentStep(4);
    else setCurrentStep(5);
  }, [progress]);

  return (
    <div className={styles.container}>
      <div className={styles.loadingCard}>
        {/* Animated Logo/Icon */}
        <div className={styles.iconContainer}>
          <div className={styles.spinner}>
            <div className={styles.spinnerRing}></div>
            <div className={styles.spinnerRing}></div>
            <div className={styles.spinnerRing}></div>
          </div>
        </div>

        {/* Title */}
        <h2 className={styles.title}>Generating Your Marketing Strategy</h2>
        <p className={styles.subtitle}>Our AI is analyzing your product and crafting a comprehensive strategy...</p>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className={styles.progressText}>{Math.round(progress)}%</div>
        </div>

        {/* Current Step */}
        <div className={styles.currentStep}>
          <span className={styles.stepLabel}>{steps[currentStep].label}...</span>
        </div>

        {/* Steps Timeline */}
        <div className={styles.stepsTimeline}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${styles.step} ${
                index < currentStep
                  ? styles.stepCompleted
                  : index === currentStep
                  ? styles.stepActive
                  : styles.stepPending
              }`}
            >
              <div className={styles.stepNumber}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <div className={styles.stepInfo}>
                <span className={styles.stepText}>{step.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Estimated Time */}
        <div className={styles.estimatedTime}>
          <svg className={styles.clockIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Estimated time: 60-90 seconds</span>
        </div>

        {/* Fun Facts */}
        <div className={styles.funFact}>
          <p className={styles.funFactTitle}>Did you know?</p>
          <p className={styles.funFactText}>
            {currentStep === 0 && "We're using a 5-step AI pipeline to ensure high-quality, coherent outputs across all channels."}
            {currentStep === 1 && "Your strategy is being generated with different creativity levels optimized for each section."}
            {currentStep === 2 && "We're creating 5 ad variations, 3 emails, and a complete landing page structure tailored to your brand voice."}
            {currentStep === 3 && "Generating platform-specific social media content for Twitter, LinkedIn, and Instagram."}
            {currentStep === 4 && "Optimizing your content for search engines with targeted keywords and meta tags."}
            {currentStep === 5 && "Almost there! Your comprehensive marketing strategy will be ready in seconds."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingProgress;
