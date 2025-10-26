/**
 * Calculate pagination parameters from query string
 * @param {Object} query - Express request query object
 * @returns {Object} Object with page, limit, and skip values for pagination
 */
export const getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 12, 100); // Max 100 items per page
  const skip = (page - 1) * limit; // Skip items for pagination
  
  return {
    page,
    limit,
    skip
  };
};

/**
 * Generate pagination metadata for response
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} totalItems - Total number of items
 * @returns {Object} Pagination metadata object
 */
export const getPaginationMetadata = (page, limit, totalItems) => {
  const totalPages = Math.ceil(totalItems / limit); // Total number of pages for pagination
  
  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Parse sort parameter to Mongoose sort object
 * Examples: 
 * - "-datePosted" = { datePosted: -1 } (descending)
 * - "datePosted" or "+datePosted" = { datePosted: 1 } (ascending)
 * @param {string} sortParam - Sort parameter from query string
 * @param {string} defaultSort - Default sort field if none provided
 * @returns {Object} Mongoose sort object
 */
export const parseSortParam = (sortParam, defaultSort = '-datePosted') => {
  if (!sortParam) return defaultSort;
  
  const sortOrder = sortParam.startsWith('-') ? -1 : 1;
  const sortField = sortParam.replace(/^[+-]/, '');
  
  return { [sortField]: sortOrder };
};
