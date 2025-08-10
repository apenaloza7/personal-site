/**
 * DOM manipulation utilities
 */

/**
 * Creates a DOM element with specified tag, className, and content
 * @function createElement
 * @param {string} tag - HTML tag name
 * @param {string} className - CSS class name
 * @param {string} innerHTML - Inner HTML content
 * @returns {Element} The created element
 */
export const createElement = (tag, className = '', innerHTML = '') => {
	const element = document.createElement(tag)
	if (className) element.className = className
	if (innerHTML) element.innerHTML = innerHTML
	return element
}
