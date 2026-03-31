import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SavedStrategy, getAllStrategies, deleteStrategy, searchStrategies } from '../utils/storage';
import styles from '../styles/HistoryDashboard.module.css';

interface HistoryDashboardProps {
  onSelectStrategy: (strategy: SavedStrategy) => void;
  onNewStrategy: () => void;
}

const HistoryDashboard: React.FC<HistoryDashboardProps> = ({ onSelectStrategy, onNewStrategy }) => {
  const [strategies, setStrategies] = useState<SavedStrategy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStrategies, setFilteredStrategies] = useState<SavedStrategy[]>([]);

  useEffect(() => {
    loadStrategies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredStrategies(searchStrategies(searchQuery));
    } else {
      setFilteredStrategies(strategies);
    }
  }, [searchQuery, strategies]);

  const loadStrategies = () => {
    const saved = getAllStrategies();
    setStrategies(saved);
    setFilteredStrategies(saved);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this strategy?')) {
      deleteStrategy(id);
      loadStrategies();
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Marketing Strategies</h1>
          <p className={styles.subtitle}>
            {strategies.length} strateg{strategies.length === 1 ? 'y' : 'ies'} saved
          </p>
        </div>
        <button className={styles.newButton} onClick={onNewStrategy}>
          New Strategy
        </button>
      </div>

      {/* Search */}
      {strategies.length > 0 && (
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.clearButton} onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Strategies Grid */}
      {filteredStrategies.length === 0 ? (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>
            {searchQuery ? 'No strategies found' : 'No strategies yet'}
          </h2>
          <p className={styles.emptyText}>
            {searchQuery
              ? 'Try a different search term'
              : 'Create your first marketing strategy to get started'}
          </p>
          {!searchQuery && (
            <button className={styles.emptyButton} onClick={onNewStrategy}>
              Create First Strategy
            </button>
          )}
        </div>
      ) : (
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredStrategies.map((saved) => (
            <motion.div
              key={saved.id}
              className={styles.card}
              variants={cardVariants}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectStrategy(saved)}
            >
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <span className={styles.badge}>
                  {saved.inputType === 'url' ? 'URL' : 'Text'}
                </span>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDelete(saved.id, e)}
                  title="Delete strategy"
                >
                  ×
                </button>
              </div>

              {/* Product Name */}
              <h3 className={styles.cardTitle}>{saved.productName}</h3>

              {/* Summary Preview */}
              <p className={styles.cardSummary}>
                {saved.strategy.product_summary.substring(0, 120)}
                {saved.strategy.product_summary.length > 120 ? '...' : ''}
              </p>

              {/* Metrics */}
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>{saved.strategy.ad_copy.length}</span>
                  <span className={styles.metricLabel}>Ads</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>{saved.strategy.email_sequence.length}</span>
                  <span className={styles.metricLabel}>Emails</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>
                    {saved.strategy.landing_page.sections.length}
                  </span>
                  <span className={styles.metricLabel}>Sections</span>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <span className={styles.timestamp}>{formatDate(saved.timestamp)}</span>
                <span className={styles.viewButton}>View →</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default HistoryDashboard;
