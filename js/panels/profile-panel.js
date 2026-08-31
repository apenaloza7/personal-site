/**
 * Profile / hero section rendering
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { setLoadingState, setErrorState } from '../utils/ui-utils.js'

/**
 * Renders the hero section from Contentful profile data
 * @async
 * @function renderProfile
 */
export async function renderProfile() {
	const container = document.getElementById('hero-content')
	if (!container) return

	setLoadingState(container)
	const entries = await getContentfulEntries({ content_type: 'profile', limit: 1 })

	if (entries.length === 0) {
		setErrorState(container, 'No profile data available.')
		return
	}

	const profile = entries[0].fields
	const location = profile.location || 'charlotte, nc'

	container.innerHTML = `
		<h1 class="hero-name">${profile.name || ''}</h1>
		<p class="hero-bio">${profile.description || ''}</p>
		<div class="hero-status">${location.toLowerCase()}</div>
	`
}
