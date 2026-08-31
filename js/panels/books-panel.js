/**
 * Reading / books section rendering
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { setLoadingState, setErrorState } from '../utils/ui-utils.js'
import { createElement } from '../utils/dom-utils.js'

/**
 * @param {string} status
 * @returns {string}
 */
function formatBookStatus(status = '') {
	const lower = status.toLowerCase()
	if (lower.includes('reading')) return '★ reading'
	if (lower.includes('unread') || lower.includes('tbr')) return 'tbr'
	if (lower.includes('read')) return '★ read'
	return status || ''
}

/**
 * @param {Object} book
 * @returns {Element}
 */
const createBookRow = (book) => {
	const title = book.shortTitle || book.title || 'Untitled'
	const row = createElement('div', 'list-row list-row--reading')
	row.innerHTML = `
		<span class="list-row-title list-row-title--muted">${title}</span>
		<span class="list-row-meta">${formatBookStatus(book.status)}</span>
	`
	return row
}

/**
 * Renders the reading section from Contentful book entries
 * @async
 * @function renderBooks
 */
export async function renderBooks() {
	const container = document.getElementById('reading-content')
	if (!container) return

	setLoadingState(container)

	const entries = await getContentfulEntries({
		content_type: 'book',
		order: '-sys.createdAt',
	})

	if (entries.length === 0) {
		setErrorState(container, 'Nothing on the shelf yet.')
		return
	}

	const grid = createElement('div', 'reading-grid')
	entries
		.map((item) => createBookRow(item.fields))
		.forEach((row) => grid.appendChild(row))

	container.innerHTML = ''
	container.appendChild(grid)
}

/**
 * Returns the title of the first book currently being read
 * @async
 * @returns {Promise<string|null>}
 */
export async function getCurrentlyReadingTitle() {
	const entries = await getContentfulEntries({
		content_type: 'book',
		order: '-sys.createdAt',
	})

	const reading = entries.find((entry) => {
		const status = (entry.fields.status || '').toLowerCase()
		return status.includes('reading')
	})

	if (!reading) return null
	return reading.fields.shortTitle || reading.fields.title || null
}
