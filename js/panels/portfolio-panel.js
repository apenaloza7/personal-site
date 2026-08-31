/**
 * Work / portfolio section rendering
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { setLoadingState, setErrorState } from '../utils/ui-utils.js'

/**
 * @param {Array} roles
 * @returns {string}
 */
function buildRolePills(roles = []) {
	return roles
		.filter((role) => role?.fields)
		.map((role, index) => {
			const isCurrent = index === 0
			const pillClass = isCurrent ? 'role-pill role-pill--current' : 'role-pill'
			return `
				<span class="${pillClass}">
					<span class="role-pill-title">${role.fields.jobTitle || ''}</span>
					<span class="role-pill-range">${role.fields.dateRange || ''}</span>
				</span>
			`
		})
		.join('')
}

/**
 * Renders the work section from Contentful job data
 * @async
 * @function renderPortfolio
 */
export async function renderPortfolio() {
	const container = document.getElementById('work-content')
	if (!container) return

	setLoadingState(container)
	const entries = await getContentfulEntries({
		content_type: 'job',
		include: 2,
	})

	if (entries.length === 0) {
		setErrorState(container, 'No work data available.')
		return
	}

	const job = entries[0].fields
	const roles = (job.roles || []).slice().reverse()
	const promotionCount = roles.length - 1
	const promotionNote = promotionCount > 0
		? `<span class="work-promotion">${promotionCount}× promoted</span>`
		: ''

	container.innerHTML = `
		<div class="work-company-row">
			<span class="work-company">${job.companyName || ''}</span>
			<span class="work-tenure">${job.employmentDateRange || ''}</span>
			${promotionNote}
		</div>
		<div class="role-pills">${buildRolePills(roles)}</div>
	`
}
