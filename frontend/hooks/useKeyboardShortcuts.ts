import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlOrCmd?: boolean;
  shift?: boolean;
  callback: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const isCtrlOrCmd = event.ctrlKey || event.metaKey;
        const matchesModifiers =
          (!shortcut.ctrlOrCmd || isCtrlOrCmd) &&
          (!shortcut.shift || event.shiftKey);

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          matchesModifiers
        ) {
          event.preventDefault();
          shortcut.callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

// Common keyboard shortcuts
export const SHORTCUTS = {
  NEW_STRATEGY: { key: 'n', ctrlOrCmd: true, description: 'New Strategy' },
  SEARCH: { key: 'k', ctrlOrCmd: true, description: 'Search Strategies' },
  HISTORY: { key: 'h', ctrlOrCmd: true, description: 'View History' },
  ANALYTICS: { key: 'a', ctrlOrCmd: true, description: 'View Analytics' },
  ESCAPE: { key: 'Escape', description: 'Close/Reset' },
};
