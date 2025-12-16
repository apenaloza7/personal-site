/**
 * Projects panel rendering logic
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { setLoadingState, setErrorState } from '../utils/ui-utils.js'
import { createElement } from '../utils/dom-utils.js'

/**
 * Creates a project list item
 * @function createProjectItem
 * @param {Object} project - Project item with fields
 * @returns {Element} The list item element
 */
const createProjectItem = (project) => {
	const link = createElement('a')
	// Use fields.url if available, otherwise default to #
	link.href = project.fields.url || '#'
    if (project.fields.url) {
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
    }
	link.textContent = project.fields.name || 'Untitled Project'

	const listItem = createElement('li')
	listItem.appendChild(link)
	return listItem
}

/**
 * Renders the projects section with data from Contentful
 * @async
 * @function renderProjects
 */
export async function renderProjects() {
	const panel = document.querySelector('#panel-projects .panel-content')
	if (!panel) return

	setLoadingState(panel)
	const entries = await getContentfulEntries({ content_type: 'project', order: 'fields.name' })

	if (entries.length === 0) {
		setErrorState(panel, 'No projects data available.')
		return
	}

	panel.innerHTML = '' // Clear loading state
    const projectList = createElement('ul', 'project-list')

	entries
		.map(item => createProjectItem(item))
		.forEach(projectItem => projectList.appendChild(projectItem))

    panel.appendChild(projectList)
}
