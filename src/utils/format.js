// src/utils/format.js

/**
 * Format a timestamp into a readable date string
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp, options = {}) {
  if (!timestamp) return "Unknown date";

  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };

  try {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", { ...defaultOptions, ...options });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid date";
  }
}

/**
 * Shorten a hash string for display
 * @param {string} hash - The full hash string
 * @param {number} start - Number of chars to keep at start
 * @param {number} end - Number of chars to keep at end
 * @returns {string} Shortened hash
 */
export function shortHash(hash, start = 6, end = 4) {
  if (!hash || hash.length < start + end) return hash;
  return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
}

/**
 * Format LOKI amount (atomic units to LOKI)
 * @param {number} amount - Amount in atomic units
 * @param {object} options - Formatting options
 * @param {boolean} options.round - Whether to round to 3 decimal places
 * @param {boolean} options.rawValue - Whether to skip locale string formatting
 * @returns {string|number} Formatted amount
 */
export function formatLoki(amount, { round = false, rawValue = false } = {}) {
  let value = amount / 1e9;
  if (round) value = value.toFixed(3);
  return rawValue ? value : value.toLocaleString();
}

/**
 * Format any currency amount (atomic units to whole units)
 * @param {number} amount - Amount in atomic units
 * @param {number} decimals - Number of decimal places (default 9 for LOKI)
 * @param {object} options - Formatting options
 * @param {boolean} options.round - Whether to round to fixed decimal places
 * @param {boolean} options.rawValue - Whether to skip locale string formatting
 * @returns {string|number} Formatted amount
 */
export function formatCurrency(amount, decimals = 9, { round = false, rawValue = false } = {}) {
  let value = amount / Math.pow(10, decimals);
  if (round) value = value.toFixed(decimals);
  return rawValue ? value : value.toLocaleString();
}
