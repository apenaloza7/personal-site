document.addEventListener('DOMContentLoaded', () => {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const terminal = document.getElementById('terminal');
    const prompt = 'user@pena-site:~$';
    const commandHistory = [];
    let historyIndex = -1;

    // Focus on input when terminal is clicked
    terminal.addEventListener('click', () => {
        terminalInput.focus();
    });

    // Handle input
    terminalInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const command = terminalInput.value.trim();
            if (command) {
                // Add to history if it's not the same as the last command
                if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== command) {
                    commandHistory.push(command);
                }
                historyIndex = commandHistory.length; // Reset history index

                // Display command
                const commandLine = document.createElement('div');
                commandLine.innerHTML = `<span class="terminal-prompt">${prompt}</span> <span class="command">${escapeHtml(command)}</span>`;
                terminalOutput.appendChild(commandLine);

                // Process command
                processCommand(command);

                // Clear input
                terminalInput.value = '';

                // Scroll to bottom
                terminal.scrollTop = terminal.scrollHeight;
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault(); // Prevent cursor jump
            if (commandHistory.length > 0 && historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
                terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length); // Move cursor to end
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault(); // Prevent cursor jump
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
                terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length); // Move cursor to end
            } else if (historyIndex === commandHistory.length - 1) {
                // If at the newest entry, pressing down clears the input
                historyIndex++;
                terminalInput.value = '';
            }
        }
    });

    function processCommand(command) {
        const outputLine = document.createElement('div');
        outputLine.classList.add('output');
        const args = command.split(' ').filter(Boolean); // Split command into args
        const cmd = args[0]?.toLowerCase();

        switch (cmd) {
            case 'help':
                outputLine.innerHTML = `Available commands:<br>
                    help - Show this help message<br>
                    about - Display information about me<br>
                    experience - Show my professional experience<br>
                    hobbies - What I do for fun<br>
                    socials - List my social media links<br>
                    contact - How to reach me<br>
                    clear - Clear the terminal screen<br>
                    whoami - Display current user`;
                break;
            case 'about':
                outputLine.textContent = 'Too lazy to write about me right now, check back later! //TODO: Add about me text lazy';
                break;
            case 'experience':
                 outputLine.textContent = 'THE HARTFORD! in the heart of Southend Charlotte, NC';
                 break;
            case 'hobbies':
                 outputLine.textContent = 'Soccer\nRunning\nEating\nSleeping\nCoding\nAnd now pickleball lol';
                 break;
            case 'socials': 
                outputLine.innerHTML = `👻`;
                break;
            case 'contact': 
                outputLine.innerHTML = `336-###-#### (call me!)`;
                break;
            case 'clear':
                terminalOutput.innerHTML = ''; // Clear history
                return; // Don't add an empty output line
            case 'whoami':
                outputLine.textContent = 'guest_user (Tell me your name!)';
                break;
            default:
                outputLine.textContent = `Command not found: ${escapeHtml(command)}. Type 'help' for available commands.`;
                break;
        }

        terminalOutput.appendChild(outputLine);
    }

    // Helper function to escape HTML characters
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Initial focus
    terminalInput.focus();
}); 