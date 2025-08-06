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
                    if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== command) {
                        commandHistory.push(command);
                    }
                    historyIndex = commandHistory.length;

                    const commandLine = document.createElement('div');
                    commandLine.innerHTML = `<span class="prompt">${prompt}</span> <span class="command">${escapeHtml(command)}</span>`;
                    terminalOutput.appendChild(commandLine);

                    processCommand(command);

                    terminalInput.value = '';
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

    async function processCommand(command) {
        const outputLine = document.createElement('div');
        outputLine.classList.add('output');
        const args = command.split(' ').filter(Boolean);
        const cmd = args[0]?.toLowerCase();
        
        // Ensure the client is available
        if (!window.contentfulClient) {
            outputLine.textContent = 'Error: Content service not available.';
            terminalOutput.appendChild(outputLine);
            return;
        }

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
                try {
                    const entries = await window.contentfulClient.getEntries({ content_type: 'profile', limit: 1 });
                    if (entries.items.length > 0) {
                        const p = entries.items[0].fields;
                        outputLine.textContent = `${p.name}: ${p.title}, based in ${p.location}. ${p.description}`;
                    } else {
                        outputLine.textContent = 'Profile data not found.';
                    }
                } catch (e) {
                    outputLine.textContent = 'Error fetching profile data.';
                }
                break;
            case 'portfolio':
                try {
                    const entries = await window.contentfulClient.getEntries({ content_type: 'job', include: 2, order: '-fields.startDate' });
                    let portfolioHtml = '';
                    entries.items.forEach(entry => {
                        const job = entry.fields;
                        portfolioHtml += `[${job.companyName}] (${job.employmentDateRange})<br>`;
                        if (job.roles) {
                            job.roles.forEach(role => {
                                portfolioHtml += `&nbsp;&nbsp;&nbsp;${role.fields.jobTitle} (${role.fields.dateRange})<br>`;
                            });
                        }
                    });
                    outputLine.innerHTML = portfolioHtml || 'No portfolio data found.';
                } catch (e) {
                    outputLine.textContent = 'Error fetching portfolio data.';
                }
                break;
            case 'hobbies':
                try {
                    const entries = await window.contentfulClient.getEntries({ content_type: 'hobby', order: 'fields.name' });
                    let hobbiesHtml = '';
                    entries.items.forEach(item => {
                        const hobby = item.fields;
                        hobbiesHtml += `[${hobby.ticker}] ${hobby.name} - ${hobby.performance}<br>`;
                    });
                    outputLine.innerHTML = hobbiesHtml || 'No hobbies found.';
                } catch (e) {
                    outputLine.textContent = 'Error fetching hobbies.';
                }
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
                return;
            default:
                outputLine.textContent = `Command not found: ${escapeHtml(command)}. Type 'help' for available commands.`;
                break;
        }

        terminalOutput.appendChild(outputLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    if (terminalInput) {
        terminalInput.focus();
    }
});