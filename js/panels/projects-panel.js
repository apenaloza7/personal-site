/**
 * Projects section rendering
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { setLoadingState, setErrorState } from '../utils/ui-utils.js'
import { createElement } from '../utils/dom-utils.js'

/**
 * @param {Object} project
 * @returns {Element}
 */
const createProjectRow = (project) => {
	const fields = project.fields
	const link = createElement('a', 'list-row')
	link.href = fields.url || '#'

	if (fields.url) {
		link.target = '_blank'
		link.rel = 'noopener noreferrer'
	}

	const blurbHtml = fields.blurb
		? `<span class="list-row-blurb">${fields.blurb}</span>`
		: ''
	const tagHtml = fields.tag
		? `<span class="list-row-tag">${fields.tag}</span>`
		: ''

	link.innerHTML = `
		<span class="list-row-title">${fields.name || 'Untitled Project'}</span>
		${blurbHtml}
		${tagHtml}
	`

	const li = createElement('li')
	li.appendChild(link)
	return li
}

/**
 * Renders the projects section from Contentful
 * @async
 * @function renderProjects
 */
export async function renderProjects() {
	const container = document.getElementById('projects-content')
	if (!container) return

	setLoadingState(container)
	const entries = await getContentfulEntries({ content_type: 'project', order: 'fields.name' })

	if (entries.length === 0) {
		setErrorState(container, 'No projects yet.')
		return
	}

	const list = createElement('ul', 'list-rows')
	entries
		.map(createProjectRow)
		.forEach((row) => list.appendChild(row))

	container.innerHTML = ''
	container.appendChild(list)
}
