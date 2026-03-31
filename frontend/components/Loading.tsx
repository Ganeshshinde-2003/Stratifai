import React from 'react';
import styles from '../styles/Loading.module.css';

const Loading: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loadingCard}>
        <div className={styles.spinner}></div>
        <h2 className={styles.title}>Generating Your Marketing Strategy</h2>
        <p className={styles.subtitle}>This may take 30-60 seconds...</p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepIcon}>1</div>
            <p>Analyzing product</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>2</div>
            <p>Building strategy</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>3</div>
            <p>Creating content</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
