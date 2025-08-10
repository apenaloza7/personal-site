/**
 * Initializes the Contentful client and exposes it globally
 * @function initializeContentfulClient
 */
function initializeContentfulClient() {
	// --- Contentful Setup --- //
	const CONTENTFUL_SPACE_ID = 'uhcip1ivkuft'
	const CONTENTFUL_ACCESS_TOKEN = 'eRQiXFljDH30a6B4AEZRpGiQczrIJxV5LVK-o_lG7tE'

	const client = contentful.createClient({
		space: CONTENTFUL_SPACE_ID,
		accessToken: CONTENTFUL_ACCESS_TOKEN
	})

	// Expose the client to the global window object so all scripts can use it
	window.contentfulClient = client
}
