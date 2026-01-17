/**
 * Marquee message functionality using Contentful CMS
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'

const DEFAULT_MESSAGE = 'Welcome to the Pena Terminal...'
const SCROLL_SPEED_PX_PER_SEC = 50 // Consistent scroll speed

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
 * Creates enough duplicate content to ensure seamless scrolling
 * @param {string} message - The message to display
 * @param {HTMLElement} container - The container element
 * @returns {string} - HTML string with enough duplicates for seamless scroll
 */
function createMarqueeContent(message, container) {
	// Create a temporary span to measure single message width
	const tempSpan = document.createElement('span')
	tempSpan.className = 'marquee-content'
	tempSpan.style.visibility = 'hidden'
	tempSpan.style.position = 'absolute'
	tempSpan.textContent = message
	document.body.appendChild(tempSpan)
	
	const singleWidth = tempSpan.offsetWidth
	document.body.removeChild(tempSpan)
	
	const containerWidth = container.offsetWidth
	
	// Calculate how many copies needed to fill container + one extra for seamless loop
	// Minimum of 2 copies to ensure animation works
	const copiesNeeded = Math.max(2, Math.ceil((containerWidth * 2) / singleWidth) + 1)
	
	// Generate the HTML
	let html = ''
	for (let i = 0; i < copiesNeeded; i++) {
		html += `<span class="marquee-content">${message}</span>`
	}
	
	return { html, singleWidth, copiesNeeded }
}

/**
 * Calculates animation duration based on content width for consistent speed
 * @param {number} singleWidth - Width of one message copy in pixels
 * @returns {number} - Duration in seconds
 */
function calculateDuration(singleWidth) {
	// Time = distance / speed
	return singleWidth / SCROLL_SPEED_PX_PER_SEC
}

/**
 * Updates the marquee display element
 * @function updateMarqueeDisplay
 */
async function updateMarqueeDisplay() {
	const marqueeElement = document.getElementById('marquee-text')
	const container = document.querySelector('.marquee-container')
	if (!marqueeElement || !container) return
	
	const message = await fetchMarqueeMessage()
	
	// Create content with enough duplicates for seamless scrolling
	const { html, singleWidth, copiesNeeded } = createMarqueeContent(message, container)
	marqueeElement.innerHTML = html
	
	// Calculate the percentage to translate (one copy's worth)
	const translatePercent = 100 / copiesNeeded
	
	// Set dynamic animation duration based on content length
	const duration = calculateDuration(singleWidth)
	
	// Apply dynamic animation via CSS custom properties
	marqueeElement.style.setProperty('--marquee-duration', `${duration}s`)
	marqueeElement.style.setProperty('--marquee-translate', `-${translatePercent}%`)
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
