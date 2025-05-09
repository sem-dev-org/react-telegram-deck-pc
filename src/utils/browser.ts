/**
 * Get browser locale
 * @returns {string} Browser locale in format like 'en-US', 'zh-CN', etc.
 */
export const getBrowserLocale = (): string => {
  // Try to get the primary language
  const language = navigator.language || navigator.languages[0];
  return language;
};

/**
 * Get browser country code
 * @returns {string} Two-letter country code (ISO 3166-1 alpha-2)
 */
export const getBrowserCountryCode = (): string => {
  const locale = getBrowserLocale();
  // Extract country code from locale (e.g. 'en-US' -> 'US')
  return locale.split('-')[1] || '';
}; 