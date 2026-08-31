/**
 * Main application coordination and initialization
 */

import { renderProfile } from './panels/profile-panel.js'
import { renderPortfolio } from './panels/portfolio-panel.js'
import { renderProjects } from './panels/projects-panel.js'
import { renderBooks } from './panels/books-panel.js'
import { renderBlogPosts } from './panels/blog-panel.js'
import { initializeMarquee } from './features/marquee.js'
import { initializeCodeInput } from './features/code-input.js'

/**
 * Loads all content sections in parallel
 * @function loadAllContent
 */
function loadAllContent() {
	renderProfile()
	renderPortfolio()
	renderProjects()
	renderBooks()
	renderBlogPosts()
}

/**
 * Initialize the application
 * @function initializeApp
 */
function initializeApp() {
	try {
		initializeMarquee()
		initializeCodeInput()
	} catch (error) {
		console.error('Error initializing interactive features:', error)
	}

	try {
		initializeContentfulClient()
	} catch (error) {
		console.error('Error initializing Contentful client:', error)
	}

	try {
		loadAllContent()
	} catch (error) {
		console.error('Error loading content:', error)
	}
}

document.addEventListener('DOMContentLoaded', initializeApp)
