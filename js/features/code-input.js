/**
 * Collapsible Code Input Feature
 * Handles the logic for expanding/collapsing the code input in the navbar
 */

export function initializeCodeInput() {
    const container = document.querySelector('.code-input-container');
    const toggleBtn = document.getElementById('code-toggle-btn');
    const input = document.getElementById('code-input');

    if (!container || !toggleBtn || !input) {
        console.error('Code Input elements not found:', { container, toggleBtn, input });
        return;
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click listener from firing immediately
        container.classList.toggle('expanded');
        
        if (container.classList.contains('expanded')) {
            setTimeout(() => input.focus(), 50); // Small delay to ensure transition starts
        }
    });

    // Close on blur or Escape key
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            container.classList.remove('expanded');
            input.blur();
        }
        if (e.key === 'Enter') {
            const code = input.value.trim();
            console.log('Code entered:', code);

            if (code === '67') {
                triggerHandAnimation();
            }

            input.value = '';
            container.classList.remove('expanded');
            input.blur();
        }
    });

    // Optional: Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && container.classList.contains('expanded')) {
            container.classList.remove('expanded');
        }
    });
}

function triggerHandAnimation() {
    // Check if animation is already running to prevent overlap
    if (document.querySelector('.six-seven-overlay')) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'six-seven-overlay';

    // Create left hand (Positioned on Right)
    const leftHand = document.createElement('img');
    leftHand.src = 'assets/left_hand.png';
    leftHand.className = 'hand-img hand-right'; // Use .hand-right class to position it on the right
    leftHand.alt = 'Left Hand';

    // Create right hand (Positioned on Left)
    const rightHand = document.createElement('img');
    rightHand.src = 'assets/right_hand.png';
    rightHand.className = 'hand-img hand-left'; // Use .hand-left class to position it on the left
    rightHand.alt = 'Right Hand';

    // Append hands to overlay
    overlay.appendChild(rightHand);
    overlay.appendChild(leftHand);

    // Append overlay to body
    document.body.appendChild(overlay);

    // Remove after animation (5s)
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
    }, 5000);
}
