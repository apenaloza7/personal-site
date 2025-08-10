/**
 * Live clock functionality
 */

/**
 * Updates the time display element
 * @function updateTime
 */
export function updateTime() {
	const timeElement = document.getElementById('local-time')
	if (timeElement) {
		const now = new Date()
		const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
		timeElement.textContent = timeString
	}
}

/**
 * Initializes the live clock with automatic updates
 * @function initializeClock
 */
export function initializeClock() {
	updateTime() // Initial update
	setInterval(updateTime, 1000) // Update every second
}
