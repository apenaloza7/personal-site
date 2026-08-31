/**
 * Blog post page logic
 */

import { getContentfulEntries } from './utils/contentful-utils.js'
import { formatPostDate } from './panels/blog-panel.js'
import {
	renderRichTextToContainer,
	estimateReadTimeMinutes,
} from './utils/rich-text-renderer.js'

/**
 * @returns {Function|null}
 */
function getRichTextRenderer() {
	if (typeof window.documentToHtmlString === 'function') return window.documentToHtmlString
	if (window.richTextHtmlRenderer?.documentToHtmlString) {
		return window.richTextHtmlRenderer.documentToHtmlString
	}
	if (window.exports?.documentToHtmlString) {
		return window.exports.documentToHtmlString
	}
	return null
}

/**
 * @param {string} date
 * @returns {string}
 */
function formatLongDate(date) {
	if (!date) return ''
	const d = new Date(date)
	if (Number.isNaN(d.getTime())) return ''
	return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * @param {string} excludeId
 */
async function renderMoreWriting(excludeId) {
	const container = document.getElementById('more-writing-content')
	if (!container) return

	const entries = await getContentfulEntries({
		content_type: 'blog',
		order: '-fields.publishDate',
		limit: 3,
	})

	const others = entries.filter((e) => e.sys.id !== excludeId).slice(0, 2)

	if (others.length === 0) {
		container.innerHTML = '<p class="empty-state">No other posts yet.</p>'
		return
	}

	const rows = others.map((item) => `
		<a href="blog.html?id=${item.sys.id}" class="list-row">
			<span class="list-row-title">${item.fields.title || 'Untitled Post'}</span>
			<span class="list-row-meta">${formatPostDate(item.fields.publishDate)}</span>
		</a>
	`).join('')

	container.innerHTML = `<div class="list-rows">${rows}</div>`
}

async function fetchAndRenderPost() {
	const article = document.getElementById('post-article')
	if (!article) return

	article.innerHTML = '<p class="empty-state">Loading post…</p>'

	try {
		const postId = new URLSearchParams(window.location.search).get('id')

		if (!postId) {
			article.innerHTML = '<p class="empty-state">No post ID provided. <a href="../#writing">Back to writing</a>.</p>'
			return
		}

		const entry = await window.contentfulClient.getEntry(postId)

		if (!entry) {
			article.innerHTML = '<p class="empty-state">Post not found. <a href="../#writing">Back to writing</a>.</p>'
			return
		}

		const post = entry.fields
		document.title = `${post.title || 'Blog Post'} | Alejandro Penaloza`

		const publishDate = formatLongDate(post.publishDate)
		const readTime = post.readTime
			|| `${estimateReadTimeMinutes(post.postBody)} min read`

		const categoryHtml = post.category
			? `<span class="post-category">${String(post.category).toUpperCase()}</span>`
			: ''

		article.innerHTML = `
			<a href="../#writing" class="post-back">← writing</a>
			${categoryHtml}
			<h1 class="post-title">${post.title || 'Untitled Post'}</h1>
			<div class="post-meta">${publishDate} &nbsp;·&nbsp; ${readTime} &nbsp;·&nbsp; Alejandro Penaloza</div>
			<div class="post-divider" aria-hidden="true"></div>
			<div class="post-body" id="post-body"></div>
		`

		const bodyContainer = document.getElementById('post-body')

		if (!post.postBody) {
			bodyContainer.innerHTML = '<p>This post has no content.</p>'
		} else {
			const documentToHtml = getRichTextRenderer()
			if (documentToHtml) {
				bodyContainer.innerHTML = documentToHtml(post.postBody)
			} else {
				renderRichTextToContainer(post.postBody, bodyContainer)
			}
		}

		await renderMoreWriting(postId)
	} catch (error) {
		article.innerHTML = '<p class="empty-state">Error loading the post. <a href="../#writing">Back to writing</a>.</p>'
		console.error(error)
	}
}

document.addEventListener('DOMContentLoaded', () => {
	initializeContentfulClient()
	fetchAndRenderPost()
})
