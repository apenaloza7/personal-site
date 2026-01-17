/**
 * Marquee message functionality using Contentful CMS
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'

const DEFAULT_MESSAGE = 'Welcome to the Pena Terminal...'

/**
 * Fetches the active marquee message from Contentful
 * @returns {Promise<string>} - The marquee message or default message
 */
async function fetchMarqueeMessage() {
	try {
		const entries = await getContentfulEntries({
			content_type: 'marqueeMessage',
			'fields.isActive': true,
			limit: 1
		})
		
		if (entries.length > 0 && entries[0].fields.message) {
			return entries[0].fields.message
		}
		
		return DEFAULT_MESSAGE
	} catch (error) {
		console.error('Error fetching marquee message:', error)
		return DEFAULT_MESSAGE
	}
}

/**
 * Updates the marquee display element
 * @function updateMarqueeDisplay
 */
async function updateMarqueeDisplay() {
	const marqueeElement = document.getElementById('marquee-text')
	if (!marqueeElement) return
	
	const message = await fetchMarqueeMessage()
	
	// Create duplicated content for seamless infinite scroll
	marqueeElement.innerHTML = `
		<span class="marquee-content">${message}</span>
		<span class="marquee-content">${message}</span>
	`
}

/**
 * Initializes the marquee display
 * @function initializeMarquee
 */
export function initializeMarquee() {
	// Wait for Contentful client to be ready, then update
	// Use a small delay to ensure contentfulClient is initialized
	setTimeout(updateMarqueeDisplay, 100)
}
