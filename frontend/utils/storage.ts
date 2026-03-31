import { MarketingStrategy } from '../services/api';

export interface SavedStrategy {
  id: string;
  timestamp: number;
  productName: string;
  inputType: 'url' | 'text';
  inputData: string;
  brandVoice?: string;
  strategy: MarketingStrategy;
}

const STORAGE_KEY = 'marketing_strategies';

/**
 * Save a marketing strategy to localStorage
 */
export const saveStrategy = (
  inputData: string,
  inputType: 'url' | 'text',
  strategy: MarketingStrategy,
  brandVoice?: string
): SavedStrategy => {
  const strategies = getAllStrategies();

  // Extract product name from summary (first sentence)
  const productName = strategy.product_summary.split('.')[0].substring(0, 50);

  const newStrategy: SavedStrategy = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    productName,
    inputType,
    inputData,
    brandVoice,
    strategy,
  };

  strategies.unshift(newStrategy); // Add to beginning

  // Keep only last 50 strategies
  const limitedStrategies = strategies.slice(0, 50);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedStrategies));

  return newStrategy;
};

/**
 * Get all saved strategies
 */
export const getAllStrategies = (): SavedStrategy[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading strategies from localStorage:', error);
    return [];
  }
};

/**
 * Get a single strategy by ID
 */
export const getStrategyById = (id: string): SavedStrategy | null => {
  const strategies = getAllStrategies();
  return strategies.find((s) => s.id === id) || null;
};

/**
 * Delete a strategy by ID
 */
export const deleteStrategy = (id: string): void => {
  const strategies = getAllStrategies();
  const filtered = strategies.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

/**
 * Clear all strategies
 */
export const clearAllStrategies = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Get strategies count
 */
export const getStrategiesCount = (): number => {
  return getAllStrategies().length;
};

/**
 * Search strategies by keyword
 */
export const searchStrategies = (keyword: string): SavedStrategy[] => {
  const strategies = getAllStrategies();
  const lowerKeyword = keyword.toLowerCase();

  return strategies.filter(
    (s) =>
      s.productName.toLowerCase().includes(lowerKeyword) ||
      s.strategy.product_summary.toLowerCase().includes(lowerKeyword) ||
      s.strategy.target_audience.toLowerCase().includes(lowerKeyword)
  );
};
