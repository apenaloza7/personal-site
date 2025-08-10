/**
 * Blog panel rendering logic
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { setLoadingState } from '../utils/ui-utils.js'
import { createElement } from '../utils/dom-utils.js'

/**
 * Creates a blog post list item
 * @function createBlogPostItem
 * @param {Object} item - Blog post item with sys and fields    
 * @returns {Element} The list item element
 */
const createBlogPostItem = (item) => {
	const link = createElement('a')
	link.href = `pages/blog.html?id=${item.sys.id}`
	link.textContent = item.fields.title || 'Untitled Post'

	const listItem = createElement('li')
	listItem.appendChild(link)
	return listItem
}

/**
 * Renders the blog posts section with blog data from Contentful
 * @async
 * @function renderBlogPosts
 */
export async function renderBlogPosts() {
	const panel = document.querySelector('#panel-blog .panel-content')
	if (!panel) return

	setLoadingState(panel)
	const entries = await getContentfulEntries({
		content_type: 'blog',
		order: '-fields.publishDate' // Order by publish date, most recent first
	})

	if (entries.length === 0) {
		panel.innerHTML = '<em>No blog posts yet.</em>'
		return
	}

	panel.innerHTML = '' // Clear loading
	const postList = createElement('ul', 'blog-post-list')

	entries
		.map(createBlogPostItem)
		.forEach(listItem => postList.appendChild(listItem))

	panel.appendChild(postList)
}
