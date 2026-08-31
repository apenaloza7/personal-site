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

const MIN_GROUPS = 3

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
 * @param {HTMLElement} track
 * @param {string[]} items
 */
function renderTicker(track, items) {
	const container = track.parentElement
	const groups = Array.from({ length: MIN_GROUPS }, (_, index) =>
		buildTickerGroup(items, index > 0)
	)
	track.innerHTML = groups.join('')

	const group = track.querySelector('.ticker-group')
	const groupWidth = group?.offsetWidth ?? 0
	const containerWidth = container?.offsetWidth ?? window.innerWidth

	if (groupWidth > 0 && groupWidth * MIN_GROUPS < containerWidth * 2) {
		const totalGroups = Math.max(MIN_GROUPS, Math.ceil((containerWidth * 2) / groupWidth))
		track.innerHTML = Array.from({ length: totalGroups }, (_, index) =>
			buildTickerGroup(items, index > 0)
		).join('')
	}

	const groupCount = track.querySelectorAll('.ticker-group').length
	track.style.setProperty('--ticker-shift', `-${100 / groupCount}%`)
	restartAnimation(track)
}

/**
 * @param {HTMLElement} track
 */
function restartAnimation(track) {
	track.style.animation = 'none'
	void track.offsetWidth
	track.style.animation = ''
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
export function initializeMarquee() {
	const track = document.getElementById('ticker-track')
	if (!track) return

	renderTicker(track, DEFAULT_ITEMS)

	fetchTickerItems()
		.then((items) => renderTicker(track, items))
		.catch((error) => console.error('Error initializing ticker:', error))
}
