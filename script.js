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

    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);

    // --- Terminal Focus --- //
    const terminalPanel = document.getElementById('panel-terminal');
    const terminalInput = document.getElementById('terminal-input');

    if (terminalPanel && terminalInput) {
        terminalPanel.addEventListener('click', () => {
            terminalInput.focus();
        });
    }
});
