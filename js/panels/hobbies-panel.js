/**
 * Hobbies panel rendering logic
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { setLoadingState, setErrorState } from '../utils/ui-utils.js'
import { createElement } from '../utils/dom-utils.js'

/**
 * Creates a hobby asset element
 * @function createHobbyAsset
 * @param {Object} hobby - Hobby fields object
 * @returns {Element} The hobby asset element
 */
const createHobbyAsset = (hobby) => {
	const performanceClass = hobby.performance ? hobby.performance.toLowerCase().split(' ')[0] : ''
	return createElement('div', 'hobby-asset', `
		<span class="asset-ticker">[${hobby.ticker || ''}]</span>
		<span class="asset-name">${hobby.name || ''}</span>
		<span class="asset-performance ${performanceClass}">${hobby.performance || ''}</span>
	`)
}

/**
 * Renders the hobbies section with hobby data from Contentful
 * @async
 * @function renderHobbies
 */
export async function renderHobbies() {
	const panel = document.querySelector('#panel-hobbies .panel-content')
	if (!panel) return

	setLoadingState(panel)
	const entries = await getContentfulEntries({ content_type: 'hobby', order: 'fields.name' })

	if (entries.length === 0) {
		setErrorState(panel, 'No hobbies data available.')
		return
	}

	panel.innerHTML = '' // Clear loading state
	entries
		.map(item => createHobbyAsset(item.fields))
		.forEach(hobbyAsset => panel.appendChild(hobbyAsset))
}
