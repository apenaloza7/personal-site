/**
 * Contentful Rich Text → DOM renderer for blog posts
 */

/**
 * @param {Object} node
 * @returns {DocumentFragment|Element|null}
 */
export function renderRichTextNode(node) {
	const nodeType = node.nodeType

	switch (nodeType) {
		case 'document': {
			const fragment = document.createDocumentFragment()
			for (const child of node.content || []) {
				const childEl = renderRichTextNode(child)
				if (childEl) fragment.appendChild(childEl)
			}
			return fragment
		}
		case 'paragraph': {
			const p = document.createElement('p')
			for (const child of node.content || []) {
				const childEl = renderRichTextNode(child)
				if (childEl) p.appendChild(childEl)
			}
			return p
		}
		case 'heading-1':
		case 'heading-2':
		case 'heading-3':
		case 'heading-4':
		case 'heading-5':
		case 'heading-6': {
			const level = parseInt(nodeType.split('-')[1], 10)
			const tag = level <= 2 ? 'h2' : 'h3'
			const h = document.createElement(tag)
			for (const child of node.content || []) {
				const childEl = renderRichTextNode(child)
				if (childEl) h.appendChild(childEl)
			}
			return h
		}
		case 'unordered-list': {
			const ul = document.createElement('ul')
			for (const child of node.content || []) {
				const li = renderRichTextNode(child)
				if (li) ul.appendChild(li)
			}
			return ul
		}
		case 'ordered-list': {
			const ol = document.createElement('ol')
			for (const child of node.content || []) {
				const li = renderRichTextNode(child)
				if (li) ol.appendChild(li)
			}
			return ol
		}
		case 'list-item': {
			const li = document.createElement('li')
			for (const child of node.content || []) {
				const childEl = renderRichTextNode(child)
				if (childEl) li.appendChild(childEl)
			}
			return li
		}
		case 'blockquote': {
			const bq = document.createElement('blockquote')
			for (const child of node.content || []) {
				const childEl = renderRichTextNode(child)
				if (childEl) bq.appendChild(childEl)
			}
			return bq
		}
		case 'hr': {
			return document.createElement('hr')
		}
		case 'hyperlink': {
			const a = document.createElement('a')
			const href = typeof node.data?.uri === 'string' ? node.data.uri : ''
			a.setAttribute('href', href)
			for (const child of node.content || []) {
				const childEl = renderRichTextNode(child)
				if (childEl) a.appendChild(childEl)
			}
			return a
		}
		case 'text': {
			const value = typeof node.value === 'string' ? node.value : ''
			const marks = Array.isArray(node.marks) ? node.marks : []

			const hasCode = marks.some((m) => m.type === 'code')
			if (hasCode) {
				if (value.includes('\n')) {
					const pre = document.createElement('pre')
					const code = document.createElement('code')
					code.textContent = value
					pre.appendChild(code)
					return pre
				}
				const code = document.createElement('code')
				code.textContent = value
				return code
			}

			let contentNode
			if (value.includes('\n')) {
				const frag = document.createDocumentFragment()
				const parts = value.split('\n')
				parts.forEach((part, idx) => {
					frag.appendChild(document.createTextNode(part))
					if (idx < parts.length - 1) frag.appendChild(document.createElement('br'))
				})
				contentNode = frag
			} else {
				contentNode = document.createTextNode(value)
			}

			let current = contentNode
			for (const mark of marks) {
				if (mark.type === 'code') continue
				let wrapper = null
				switch (mark.type) {
					case 'bold':
						wrapper = document.createElement('strong')
						break
					case 'italic':
						wrapper = document.createElement('em')
						break
					case 'underline':
						wrapper = document.createElement('u')
						break
					default:
						wrapper = null
				}
				if (wrapper) {
					wrapper.appendChild(current)
					current = wrapper
				}
			}
			return current
		}
		default:
			return document.createDocumentFragment()
	}
}

/**
 * @param {Object} richTextDocument
 * @param {Element} container
 */
export function renderRichTextToContainer(richTextDocument, container) {
	const rendered = renderRichTextNode(richTextDocument)
	container.appendChild(rendered)
}

/**
 * @param {Object} richTextDocument
 * @returns {number}
 */
export function estimateReadTimeMinutes(richTextDocument) {
	let wordCount = 0

	function walk(node) {
		if (!node) return
		if (node.nodeType === 'text' && typeof node.value === 'string') {
			wordCount += node.value.split(/\s+/).filter(Boolean).length
		}
		for (const child of node.content || []) {
			walk(child)
		}
	}

	walk(richTextDocument)
	const minutes = Math.max(1, Math.ceil(wordCount / 200))
	return minutes
}
