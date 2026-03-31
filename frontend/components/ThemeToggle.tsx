import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import styles from '../styles/ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      className={styles.toggle}
      onClick={toggleTheme}
      whileHover={{ opacity: 0.8 }}
      whileTap={{ opacity: 0.6 }}
      aria-label="Toggle theme"
    >
      <span className={styles.text}>{theme === 'light' ? 'Dark' : 'Light'}</span>
    </motion.button>
  );
};

export default ThemeToggle;
