import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/KeyboardShortcutsHelp.module.css';

const KeyboardShortcutsHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ['Cmd', 'N'], description: 'Create new strategy' },
    { keys: ['Cmd', 'H'], description: 'View history' },
    { keys: ['Cmd', 'A'], description: 'View analytics' },
    { keys: ['Esc'], description: 'Close/Reset' },
  ];

  return (
    <>
      {/* Help Button */}
      <motion.button
        className={styles.helpButton}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Keyboard Shortcuts"
      >
        ⌨️
      </motion.button>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.header}>
                <h2 className={styles.title}>Keyboard Shortcuts</h2>
                <button
                  className={styles.closeButton}
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className={styles.shortcuts}>
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className={styles.shortcutRow}>
                    <div className={styles.keys}>
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          <kbd className={styles.key}>{key}</kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className={styles.plus}>+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className={styles.description}>{shortcut.description}</div>
                  </div>
                ))}
              </div>

              <div className={styles.footer}>
                <p className={styles.footerText}>
                  Press <kbd className={styles.key}>?</kbd> to toggle this help
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcutsHelp;
