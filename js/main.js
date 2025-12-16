/**
 * Main application coordination and initialization
 */

import { renderProfile } from './panels/profile-panel.js'
import { renderPortfolio } from './panels/portfolio-panel.js'
import { renderProjects } from './panels/projects-panel.js'
import { renderNews } from './panels/news-panel.js'
import { renderBlogPosts } from './panels/blog-panel.js'
import { initializeClock } from './features/live-clock.js'
import { initializeTicker } from './features/ticker-simulation.js'
import { initializeCodeInput } from './features/code-input.js'

/**
 * Loads all content sections in parallel
 * @function loadAllContent
 */
function loadAllContent() {
	renderProfile()
	renderPortfolio()
	renderProjects()
	renderNews()
	renderBlogPosts()
}

/**
 * Initialize the application
 * @function initializeApp
 */
function initializeApp() {
	// Initialize interactive features (independent of content)
	try {
		initializeClock()
		initializeTicker()
		initializeCodeInput()
	} catch (error) {
		console.error('Error initializing interactive features:', error)
	}

	// Initialize Contentful client
	try {
		initializeContentfulClient()
	} catch (error) {
		console.error('Error initializing Contentful client:', error)
	}
	
	// Load all content panels
	try {
		loadAllContent()
	} catch (error) {
		console.error('Error loading content:', error)
	}
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp)
