/**
 * Writing / blog list section rendering
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { setLoadingState } from '../utils/ui-utils.js'
import { createElement } from '../utils/dom-utils.js'

/**
 * @param {string|Date} date
 * @returns {string}
 */
export function formatPostDate(date) {
	if (!date) return ''
	const d = new Date(date)
	if (Number.isNaN(d.getTime())) return ''
	const year = d.getFullYear()
	const month = String(d.getMonth() + 1).padStart(2, '0')
	return `${year}.${month}`
}

/**
 * @param {Object} item
 * @returns {Element}
 */
const createBlogRow = (item) => {
	const link = createElement('a', 'list-row')
	link.href = `pages/blog.html?id=${item.sys.id}`

	link.innerHTML = `
		<span class="list-row-title">${item.fields.title || 'Untitled Post'}</span>
		<span class="list-row-meta">${formatPostDate(item.fields.publishDate)}</span>
	`

	const li = createElement('li')
	li.appendChild(link)
	return li
}

/**
 * Renders the writing section from Contentful blog entries
 * @async
 * @function renderBlogPosts
 */
export async function renderBlogPosts() {
	const container = document.getElementById('writing-content')
	if (!container) return

	setLoadingState(container)
	const entries = await getContentfulEntries({
		content_type: 'blog',
		order: '-fields.publishDate',
	})

	if (entries.length === 0) {
		container.innerHTML = '<p class="empty-state">No posts yet.</p>'
		return
	}

	const list = createElement('ul', 'list-rows')
	entries
		.map(createBlogRow)
		.forEach((row) => list.appendChild(row))

	container.innerHTML = ''
	container.appendChild(list)
}
