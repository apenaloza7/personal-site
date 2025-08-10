/**
 * Contentful API utilities
 */

/**
 * Safely gets Contentful entries with error handling
 * @async
 * @function getContentfulEntries
 * @param {Object} query - Query parameters for Contentful
 * @returns {Promise<Array>} Array of entries or empty array on error
 */
export const getContentfulEntries = async (query) => {
	try {
		const entries = await window.contentfulClient.getEntries(query)
		return entries.items
	} catch (error) {
		console.error('Error fetching Contentful entries:', error)
		return []
	}
}
