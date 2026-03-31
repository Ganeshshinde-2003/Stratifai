import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/SuccessAnimation.module.css';

interface SuccessAnimationProps {
  message?: string;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ message = 'Success!' }) => {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={styles.checkmark}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        ✓
      </motion.div>
      <motion.p
        className={styles.message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default SuccessAnimation;
