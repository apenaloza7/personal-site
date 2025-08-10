/**
 * Stock ticker simulation functionality
 */

let currentPrice = 1998.05
const basePrice = currentPrice

/**
 * Simulates ticker price changes and updates display
 * @function simulateTicker
 */
export function simulateTicker() {
	const priceElement = document.querySelector('.price')
	const changeElement = document.querySelector('.change')
	const slidingTickers = document.querySelectorAll('.sliding-ticker-content .ticker-item')

	if (!priceElement || !changeElement) return

	const priceChange = (Math.random() - 0.5) * 5
	currentPrice += priceChange

	const changeValue = currentPrice - basePrice
	const changePercent = (changeValue / basePrice) * 100

	priceElement.textContent = currentPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
	changeElement.textContent = `${changeValue.toFixed(2)} (${changePercent.toFixed(2)}%)`

	changeElement.classList.remove('bullish', 'bearish', 'neutral')
	if (changeValue > 0) {
		changeElement.classList.add('bullish')
		changeElement.textContent = `+${changeElement.textContent}`
	} else if (changeValue < 0) {
		changeElement.classList.add('bearish')
	} else {
		changeElement.classList.add('neutral')
	}

	slidingTickers.forEach(item => {
		const changeSpan = item.querySelector('.ticker-change')
		if (!changeSpan) return

		const currentChangeText = changeSpan.textContent
		const currentChangeMatch = currentChangeText.match(/([+-]?[\d.]+)/)
		if (!currentChangeMatch) return

		let currentChange = parseFloat(currentChangeMatch[0])
		const movement = (Math.random() - 0.48) * 0.5
		let newChange = currentChange + movement

		changeSpan.classList.remove('bullish', 'bearish', 'neutral')

		let arrow = '▶'
		if (newChange > 0.1) {
			changeSpan.classList.add('bullish')
			arrow = '▲'
		} else if (newChange < -0.1) {
			changeSpan.classList.add('bearish')
			arrow = '▼'
		} else {
			changeSpan.classList.add('neutral')
		}

		const sign = newChange > 0 ? '+' : ''
		changeSpan.textContent = `${sign}${newChange.toFixed(2)}% ${arrow}`
	})
}

/**
 * Initializes the ticker simulation with automatic updates
 * @function initializeTicker
 */
export function initializeTicker() {
	setInterval(simulateTicker, 2000) // Update every 2 seconds
}
