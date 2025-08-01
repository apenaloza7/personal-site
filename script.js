document.addEventListener('DOMContentLoaded', () => {

    // --- Live Clock Functionality --- //
    const timeElement = document.getElementById('local-time');

    function updateTime() {
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            timeElement.textContent = timeString;
        }
    }

    // --- Ticker Simulation --- //
    const priceElement = document.querySelector('.price');
    const changeElement = document.querySelector('.change');
    const slidingTickers = document.querySelectorAll('.sliding-ticker-content .ticker-item');

    let currentPrice = 1998.05;
    const basePrice = currentPrice;

    function simulateTicker() {
        // Simulate main ticker
        const priceChange = (Math.random() - 0.5) * 5;
        currentPrice += priceChange;

        const changeValue = currentPrice - basePrice;
        const changePercent = (changeValue / basePrice) * 100;

        priceElement.textContent = currentPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        changeElement.textContent = `${changeValue.toFixed(2)} (${changePercent.toFixed(2)}%)`;

        changeElement.classList.remove('bullish', 'bearish', 'neutral');
        if (changeValue > 0) {
            changeElement.classList.add('bullish');
            changeElement.textContent = `+${changeElement.textContent}`;
        } else if (changeValue < 0) {
            changeElement.classList.add('bearish');
        } else {
            changeElement.classList.add('neutral');
        }

        // Simulate sliding tickers
        slidingTickers.forEach(item => {
            const changeSpan = item.querySelector('.ticker-change');
            const currentChangeText = changeSpan.textContent;
            const currentChangeMatch = currentChangeText.match(/([+-]?[\d.]+)/);
            if (!currentChangeMatch) return;

            let currentChange = parseFloat(currentChangeMatch[0]);
            const movement = (Math.random() - 0.48) * 0.5; // Skew towards positive
            let newChange = currentChange + movement;

            changeSpan.classList.remove('bullish', 'bearish', 'neutral');
            
            let arrow = '▶';
            if (newChange > 0.1) {
                changeSpan.classList.add('bullish');
                arrow = '▲';
            } else if (newChange < -0.1) {
                changeSpan.classList.add('bearish');
                 arrow = '▼';
            } else {
                changeSpan.classList.add('neutral');
            }

            const sign = newChange > 0 ? '+' : '';
            changeSpan.textContent = `${sign}${newChange.toFixed(2)}% ${arrow}`;
        });
    }


    // --- Terminal Focus --- //
    const terminalPanel = document.getElementById('panel-terminal');
    const terminalInput = document.getElementById('terminal-input');

    if (terminalPanel && terminalInput) {
        terminalPanel.addEventListener('click', () => {
            terminalInput.focus();
        });
    }
    
    // Initial and interval calls
    updateTime();
    setInterval(updateTime, 1000);
    setInterval(simulateTicker, 2000); // Update ticker every 2 seconds
});