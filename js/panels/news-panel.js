/**
 * News panel rendering logic
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { setLoadingState, setErrorState } from '../utils/ui-utils.js'
import { createElement } from '../utils/dom-utils.js'

/**
 * Creates a news item element
 * @function createNewsItem
 * @param {Object} news - News fields object
 * @returns {Element} The news item element
 */
const createNewsItem = (news) => {
	const tagClass = news.tag ? news.tag.toLowerCase() : ''
	return createElement('div', 'news-item', `
		<span class="news-time">${news.time || ''}</span>
		<span class="news-tag ${tagClass}">${news.tag || ''}</span>
		<span class="news-headline">${news.headline || ''}</span>
	`)
}

/**
 * Renders the news section with news items from Contentful
 * @async
 * @function renderNews
 */
export async function renderNews() {
	const panel = document.querySelector('#panel-news .panel-content')
	if (!panel) return

	setLoadingState(panel)
	const entries = await getContentfulEntries({ content_type: 'newsItem', order: '-sys.createdAt' })

	if (entries.length === 0) {
		setErrorState(panel, 'No news available.')
		return
	}

	panel.innerHTML = ''
	entries
		.map(item => createNewsItem(item.fields))
		.forEach(newsItem => panel.appendChild(newsItem))
}
