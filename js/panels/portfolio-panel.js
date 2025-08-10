/**
 * Portfolio panel rendering logic
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { setLoadingState, setErrorState } from '../utils/ui-utils.js'
import { createElement } from '../utils/dom-utils.js'

/**
 * Creates role HTML for a job
 * @function createRoleHtml
 * @param {Array} roles - Array of role objects
 * @returns {string} HTML string for roles
 */
const createRoleHtml = (roles = []) => {
	return roles
		.filter(role => role && role.fields)
		.map(role => `
			<div class="asset-sub">
				<span class="asset-details">${role.fields.jobTitle || ''}</span>
				<span class="asset-status-sub">${role.fields.dateRange || ''}</span>
			</div>
		`)
		.join('')
}

/**
 * Creates a job asset group element
 * @function createJobAssetGroup
 * @param {Object} job - Job fields object
 * @returns {Element} The asset group element
 */
const createJobAssetGroup = (job) => {
	const rolesHtml = createRoleHtml(job.roles)
	return createElement('div', 'asset-group', `
		<div class="asset-main">
			<span class="asset-ticker">[${job.companyName || 'N/A'}]</span>
			<span class="asset-status">${job.employmentDateRange || ''}</span>
		</div>
		${rolesHtml}
	`)
}

/**
 * Renders the portfolio section with job data from Contentful
 * @async
 * @function renderPortfolio
 */
export async function renderPortfolio() {
	const panel = document.querySelector('#panel-portfolio .panel-content')
	if (!panel) return

	setLoadingState(panel)
	const entries = await getContentfulEntries({
		content_type: 'job',
		include: 2 // Include linked roles
	})

	if (entries.length === 0) {
		setErrorState(panel, 'No portfolio data available.')
		return
	}

	panel.innerHTML = '' // Clear loading state
	entries
		.map(entry => createJobAssetGroup(entry.fields))
		.forEach(assetGroup => panel.appendChild(assetGroup))
}
