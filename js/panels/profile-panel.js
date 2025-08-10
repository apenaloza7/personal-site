/**
 * Profile panel rendering logic
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { setLoadingState, setErrorState } from '../utils/ui-utils.js'

/**
 * Renders the profile section with data from Contentful
 * @async
 * @function renderProfile
 */
export async function renderProfile() {
	const panel = document.querySelector('#panel-profile .panel-content')
	if (!panel) return

	setLoadingState(panel)
	const entries = await getContentfulEntries({ content_type: 'profile', limit: 1 })

	if (entries.length === 0) {
		setErrorState(panel, 'No profile data available.')
		return
	}

	const profile = entries[0].fields
	panel.innerHTML = `
		<h1 class="name">${profile.name || ''}</h1>
		<h2 class="title">${profile.title || ''}</h2>
		<h3 class="location">${profile.location || ''}</h3>
		<p class="description">${profile.description || ''}</p>
	`
}
