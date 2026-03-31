import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getAllStrategies } from '../utils/storage';
import styles from '../styles/AnalyticsDashboard.module.css';

const AnalyticsDashboard: React.FC = () => {
  const [strategies, setStrategies] = useState(getAllStrategies());

  useEffect(() => {
    setStrategies(getAllStrategies());
  }, []);

  // Calculate analytics
  const analytics = useMemo(() => {
    // Total strategies
    const total = strategies.length;

    // Strategies over time (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const count = strategies.filter((s) => {
        const sDate = new Date(s.timestamp);
        sDate.setHours(0, 0, 0, 0);
        return sDate.getTime() === date.getTime();
      }).length;

      last7Days.push({ day: dayName, count });
    }

    // Brand voice distribution
    const voiceCount: { [key: string]: number } = {};
    strategies.forEach((s) => {
      const voice = s.brandVoice || 'professional';
      voiceCount[voice] = (voiceCount[voice] || 0) + 1;
    });

    const voiceData = Object.entries(voiceCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));

    // Input type distribution
    const inputCount: { [key: string]: number } = { url: 0, text: 0 };
    strategies.forEach((s) => {
      inputCount[s.inputType] = (inputCount[s.inputType] || 0) + 1;
    });

    const inputData = [
      { name: 'URL Input', value: inputCount.url },
      { name: 'Text Input', value: inputCount.text },
    ];

    // Feature usage
    const featureData = [
      {
        name: 'Ad Copy',
        count: strategies.reduce((sum, s) => sum + (s.strategy.ad_copy?.length || 0), 0),
      },
      {
        name: 'Emails',
        count: strategies.reduce((sum, s) => sum + (s.strategy.email_sequence?.length || 0), 0),
      },
      {
        name: 'Social Media',
        count: strategies.filter((s) => s.strategy.social_media).length,
      },
      {
        name: 'SEO',
        count: strategies.filter((s) => s.strategy.seo).length,
      },
      {
        name: 'Competitors',
        count: strategies.filter((s) => s.strategy.competitor_analysis).length,
      },
    ];

    // Average sections per strategy
    const avgSections =
      total > 0
        ? (
            strategies.reduce((sum, s) => {
              let sections = 3; // Always have overview, ads, emails, landing
              if (s.strategy.social_media) sections++;
              if (s.strategy.seo) sections++;
              if (s.strategy.competitor_analysis) sections++;
              return sum + sections;
            }, 0) / total
          ).toFixed(1)
        : '0';

    return {
      total,
      last7Days,
      voiceData,
      inputData,
      featureData,
      avgSections,
    };
  }, [strategies]);

  const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Analytics Dashboard</h1>
          <p className={styles.subtitle}>Insights from your marketing strategies</p>
        </div>
      </div>

      {analytics.total === 0 ? (
        <motion.div
          className={styles.emptyState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.emptyIcon}>📊</div>
          <h2 className={styles.emptyTitle}>No Data Yet</h2>
          <p className={styles.emptyText}>
            Create some marketing strategies to see analytics and insights here.
          </p>
        </motion.div>
      ) : (
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <motion.div className={styles.statCard} variants={cardVariants}>
              <div className={styles.statIcon}>🎯</div>
              <div className={styles.statValue}>{analytics.total}</div>
              <div className={styles.statLabel}>Total Strategies</div>
            </motion.div>

            <motion.div className={styles.statCard} variants={cardVariants}>
              <div className={styles.statIcon}>📈</div>
              <div className={styles.statValue}>
                {analytics.last7Days.reduce((sum, d) => sum + d.count, 0)}
              </div>
              <div className={styles.statLabel}>Last 7 Days</div>
            </motion.div>

            <motion.div className={styles.statCard} variants={cardVariants}>
              <div className={styles.statIcon}>⭐</div>
              <div className={styles.statValue}>{analytics.avgSections}</div>
              <div className={styles.statLabel}>Avg Sections</div>
            </motion.div>

            <motion.div className={styles.statCard} variants={cardVariants}>
              <div className={styles.statIcon}>🔥</div>
              <div className={styles.statValue}>
                {analytics.voiceData[0]?.name || 'N/A'}
              </div>
              <div className={styles.statLabel}>Top Voice</div>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className={styles.chartsGrid}>
            {/* Strategies Over Time */}
            <motion.div className={styles.chartCard} variants={cardVariants}>
              <h3 className={styles.chartTitle}>Strategies Over Time</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analytics.last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={{ fill: '#6366F1', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Brand Voice Distribution */}
            <motion.div className={styles.chartCard} variants={cardVariants}>
              <h3 className={styles.chartTitle}>Brand Voice Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.voiceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.voiceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Input Type Distribution */}
            <motion.div className={styles.chartCard} variants={cardVariants}>
              <h3 className={styles.chartTitle}>Input Type Usage</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.inputData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.inputData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Feature Usage */}
            <motion.div className={styles.chartCard} variants={cardVariants}>
              <h3 className={styles.chartTitle}>Feature Usage</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.featureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
