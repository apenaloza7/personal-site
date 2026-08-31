/**
 * Command-input easter egg — triggered from header >_
 */

const SIX_SEVEN_CSS = `
.six-seven-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 9999; display: flex;
    justify-content: space-between; overflow: hidden;
    background-color: white; opacity: 0;
    animation: fadeInOut 5s ease-in-out forwards;
}
@keyframes fadeInOut {
    0% { opacity: 0; } 5% { opacity: 1; } 95% { opacity: 1; } 100% { opacity: 0; }
}
.hand-img { position: absolute; width: 200px; top: -300px; }
.hand-left { left: 10%; animation: dropAndBobLeft 5s ease-in-out forwards; }
.hand-right { right: 10%; animation: dropAndBobRight 5s ease-in-out forwards; }
@keyframes dropAndBobLeft {
    0% { top: -300px; } 10% { top: 0; }
    20% { top: -30px; } 30% { top: 0; } 40% { top: -30px; }
    50% { top: 0; } 60% { top: -30px; } 70% { top: 0; }
    80% { top: -30px; } 90% { top: 0; } 100% { top: -300px; }
}
@keyframes dropAndBobRight {
    0% { top: -300px; } 10% { top: 0; }
    20% { top: 30px; } 30% { top: 0; } 40% { top: 30px; }
    50% { top: 0; } 60% { top: 30px; } 70% { top: 0; }
    80% { top: 30px; } 90% { top: 0; } 100% { top: -300px; }
}
`

let sixSevenStyleInjected = false

function ensureSixSevenStyles() {
	if (sixSevenStyleInjected) return
	const style = document.createElement('style')
	style.textContent = SIX_SEVEN_CSS
	document.head.appendChild(style)
	sixSevenStyleInjected = true
}

function triggerHandAnimation() {
	if (document.querySelector('.six-seven-overlay')) return

	ensureSixSevenStyles()

	const overlay = document.createElement('div')
	overlay.className = 'six-seven-overlay'

	const assetBase = window.location.pathname.includes('/pages/') ? '../assets/' : 'assets/'

	const leftHand = document.createElement('img')
	leftHand.src = `${assetBase}left_hand.png`
	leftHand.className = 'hand-img hand-right'
	leftHand.alt = ''

	const rightHand = document.createElement('img')
	rightHand.src = `${assetBase}right_hand.png`
	rightHand.className = 'hand-img hand-left'
	rightHand.alt = ''

	overlay.appendChild(rightHand)
	overlay.appendChild(leftHand)
	document.body.appendChild(overlay)

	setTimeout(() => {
		if (document.body.contains(overlay)) {
			document.body.removeChild(overlay)
		}
	}, 5000)
}

/**
 * Initializes the command-input easter egg
 * @function initializeCodeInput
 */
export function initializeCodeInput() {
	const container = document.getElementById('code-input-container')
	const toggleBtn = document.getElementById('code-toggle-btn')
	const input = document.getElementById('code-input')

	if (!container || !toggleBtn || !input) return

	toggleBtn.addEventListener('click', (e) => {
		e.stopPropagation()
		container.classList.toggle('expanded')

		if (container.classList.contains('expanded')) {
			setTimeout(() => input.focus(), 50)
		}
	})

	input.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			container.classList.remove('expanded')
			input.blur()
		}
		if (e.key === 'Enter') {
			const code = input.value.trim()

			if (code === '67') {
				triggerHandAnimation()
			}

			input.value = ''
			container.classList.remove('expanded')
			input.blur()
		}
	})

	document.addEventListener('click', (e) => {
		if (!container.contains(e.target) && !toggleBtn.contains(e.target) && container.classList.contains('expanded')) {
			container.classList.remove('expanded')
		}
	})
}
