/**
 * Format a number as Pakistani Rupees
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted string e.g. "Rs. 1,250"
 */
const formatPKR = (amount) => {
  if (amount === null || amount === undefined) return "Rs. 0";
  const num = Number(amount);
  if (isNaN(num)) return "Rs. 0";
  return `Rs. ${num.toLocaleString("en-IN")}`;
};

export default formatPKR;
