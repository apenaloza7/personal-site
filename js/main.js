/**
 * Main application coordination and initialization
 */

import { renderProfile } from './panels/profile-panel.js'
import { renderPortfolio } from './panels/portfolio-panel.js'
import { renderHobbies } from './panels/hobbies-panel.js'
import { renderNews } from './panels/news-panel.js'
import { renderBlogPosts } from './panels/blog-panel.js'
import { initializeClock } from './features/live-clock.js'
import { initializeTicker } from './features/ticker-simulation.js'

/**
 * Loads all content sections in parallel
 * @function loadAllContent
 */
function loadAllContent() {
	renderProfile()
	renderPortfolio()
	renderHobbies()
	renderNews()
	renderBlogPosts()
}

/**
 * Initialize the application
 * @function initializeApp
 */
function initializeApp() {
	// Initialize Contentful client
	initializeContentfulClient()
	
	// Load all content panels
	loadAllContent()
	
	// Initialize interactive features
	initializeClock()
	initializeTicker()
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp)
