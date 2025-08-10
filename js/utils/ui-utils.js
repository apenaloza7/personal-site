/**
 * UI state management utilities
 */

/**
 * Sets loading state for a panel
 * @function setLoadingState
 * @param {Element} panel - The panel element
 * @param {string} message - Loading message
 */
export const setLoadingState = (panel, message = 'Loading...') => {
	if (panel) panel.innerHTML = `<em>${message}</em>`
}

/**
 * Sets error state for a panel
 * @function setErrorState
 * @param {Element} panel - The panel element
 * @param {string} message - Error message
 * @param {Error} error - The error object for logging
 */
export const setErrorState = (panel, message, error) => {
	if (panel) panel.innerHTML = `<em>${message}</em>`
	if (error) console.error(error)
}
