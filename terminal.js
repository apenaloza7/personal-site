document.addEventListener('DOMContentLoaded', () => {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const terminalContainer = document.getElementById('terminal');
    const snakeCanvas = document.getElementById('snake-canvas');
    const prompt = 'user@pena-site:~$';
    const commandHistory = [];
    let historyIndex = -1;

    // Focus on input when terminal container is clicked
    if (terminalContainer) {
        terminalContainer.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // Handle input
    if (terminalInput) {
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
                    commandLine.innerHTML = `<span class="prompt">${prompt}</span> <span class="command">${escapeHtml(command)}</span>`;
                    terminalOutput.appendChild(commandLine);

                    // Process command
                    processCommand(command);

                    // Clear input
                    terminalInput.value = '';

                    // Scroll to bottom
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                }
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (commandHistory.length > 0 && historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                    terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length);
                }
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                    terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length);
                } else if (historyIndex === commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = '';
                }
            }
        });
    }

    function processCommand(command) {
        const outputLine = document.createElement('div');
        outputLine.classList.add('output');
        const args = command.split(' ').filter(Boolean);
        const cmd = args[0]?.toLowerCase();

        switch (cmd) {
            case 'help':
                outputLine.innerHTML = `Available commands:<br>
                    help - Show this help message<br>
                    profile - Display information from ENGINEER_PROFILE<br>
                    portfolio - Show professional experience<br>
                    hobbies - List personal assets and their performance<br>
                    contact - List social media and contact links<br>
                    clear - Clear the terminal screen<br>
                    whoami - Display current user`;
                break;
            case 'profile':
                outputLine.textContent = 'Alejandro Penaloza: Software Engineer @ The Hartford, based in Charlotte, NC. Specializing in Java & Gosu development, passionate about solving complex problems.';
                break;
            case 'portfolio':
                 outputLine.innerHTML = `[THE-HARTFORD] (Jun 2021 - Present)<br>
                    &nbsp;&nbsp;&nbsp;Software Engineer (Aug 2023 - Present)<br>
                    &nbsp;&nbsp;&nbsp;Associate Software Engineer (Jun 2021 - Aug 2023)`;
                 break;
            case 'hobbies':
                outputLine.innerHTML = `[PKBL] Pickleball - BULLISH ▲<br>
                    [GOLF] Golf - BULLISH ▲<br>
                    [RUN] Running - NEUTRAL ▶<br>
                    [SOCR] Soccer - NEUTRAL ▶`;
                break;
            case 'contact':
                outputLine.innerHTML = `You can find me on:<br>
                - GitHub: apenaloza7<br>
                - LinkedIn: in/penalozaalejandro<br>
                - YouTube: @penapoppin`;
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                return;
            case 'whoami':
                outputLine.textContent = 'guest_user';
                break;
            case 'snake':
                if (terminalContainer && snakeCanvas) {
                    terminalContainer.classList.add('hidden');
                    snakeCanvas.classList.remove('hidden');
                    snakeCanvas.focus();

                    if (typeof startSnakeGame === 'function') {
                        startSnakeGame(snakeCanvas, () => {
                            // Callback when game ends
                            snakeCanvas.classList.add('hidden');
                            terminalContainer.classList.remove('hidden');
                            
                            const gameOverLine = document.createElement('div');
                            gameOverLine.classList.add('output');
                            gameOverLine.textContent = "Game over! Type 'snake' to play again.";
                            terminalOutput.appendChild(gameOverLine);

                            terminalOutput.scrollTop = terminalOutput.scrollHeight;
                            terminalInput.focus();
                        });
                    } else {
                        const errorLine = document.createElement('div');
                        errorLine.textContent = "Error: Snake game module not loaded.";
                        terminalOutput.appendChild(errorLine);
                        snakeCanvas.classList.add('hidden');
                        terminalContainer.classList.remove('hidden');
                    }
                }
                return; // Prevent default output
            default:
                outputLine.textContent = `Command not found: ${escapeHtml(command)}. Type 'help' for available commands.`;
                break;
        }

        terminalOutput.appendChild(outputLine);
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Initial focus
    if (terminalInput) {
        terminalInput.focus();
    }
});
