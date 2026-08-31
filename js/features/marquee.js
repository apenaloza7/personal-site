/**
 * Homepage ticker band — slim scrolling status line
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { getCurrentlyReadingTitle } from '../panels/books-panel.js'

const DEFAULT_ITEMS = [
	'shipping small, reliable tools',
	'say hello ↓',
]

/**
 * @param {string} text
 * @returns {string}
 */
function tickerItemHtml(text) {
	return `<span class="ticker-item"><span class="ticker-marker">·</span>${text}</span>`
}

/**
 * @param {string[]} items
 * @param {boolean} [hidden]
 * @returns {string}
 */
function buildTickerGroup(items, hidden = false) {
	const hiddenAttr = hidden ? ' aria-hidden="true"' : ''
	return `<div class="ticker-group"${hiddenAttr}>${items.map(tickerItemHtml).join('')}</div>`
}

/**
 * @returns {Promise<string[]>}
 */
async function fetchTickerItems() {
	const items = []

	const readingTitle = await getCurrentlyReadingTitle()
	if (readingTitle) {
		items.push(`now reading — ${readingTitle}`)
	}

	try {
		const entries = await getContentfulEntries({
			content_type: 'marqueeMessage',
			'fields.isActive': true,
			limit: 3,
		})

		for (const entry of entries) {
			if (entry.fields.message) {
				items.push(entry.fields.message)
			}
		}
	} catch (error) {
		console.error('Error fetching marquee messages:', error)
	}

	if (items.length === 0) {
		return DEFAULT_ITEMS
	}

	// Ensure "say hello" is always present
	if (!items.some((item) => item.toLowerCase().includes('say hello'))) {
		items.push('say hello ↓')
	}

	return items
}

/**
 * Initializes the homepage ticker band
 * @function initializeMarquee
 */
export async function initializeMarquee() {
	const track = document.getElementById('ticker-track')
	if (!track) return

	const items = await fetchTickerItems()
	track.innerHTML = buildTickerGroup(items) + buildTickerGroup(items, true)
}
