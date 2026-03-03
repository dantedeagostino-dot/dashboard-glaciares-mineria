/**
 * Chat Interface Module for Gemini AI Integration
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initChatUI();
    });

    function initChatUI() {
        // Toggle chat window
        const toggleBtn = document.getElementById('chatToggleBtn');
        const closeBtn = document.getElementById('chatCloseBtn');
        const chatWindow = document.getElementById('chatWindow');
        const chatForm = document.getElementById('chatForm');
        const chatInput = document.getElementById('chatInput');

        if (!toggleBtn || !chatWindow) return;

        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) {
                chatInput.focus();
            }
        });

        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });

        // Suggestion chips - fill input on click, hide when typing
        const suggestions = document.getElementById('chatSuggestions');
        if (suggestions) {
            suggestions.querySelectorAll('.suggestion-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    // strip leading emoji
                    chatInput.value = chip.innerText.replace(/^\S+\s/, '');
                    chatInput.focus();
                    suggestions.style.display = 'none';
                });
            });
            chatInput.addEventListener('input', () => {
                suggestions.style.display = chatInput.value.length > 0 ? 'none' : 'flex';
            });
        }

        // Handle form submission
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;

            // Clear input and add user message
            chatInput.value = '';
            appendMessage('user', message);

            // Show typing indicator
            const typingId = showTypingIndicator();

            try {
                // Collect context from dashboard
                const context = collectDashboardContext();

                // Send to backend
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, context })
                });

                removeTypingIndicator(typingId);

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();

                if (data.error) {
                    appendMessage('error', 'Error del servidor: ' + data.error);
                } else if (data.text) {
                    appendMessage('ai', formatMarkdown(data.text));
                } else {
                    appendMessage('error', 'Respuesta inesperada del servidor.');
                }
            } catch (err) {
                removeTypingIndicator(typingId);
                console.error('Chat error:', err);
                appendMessage('error', 'No se pudo conectar con la Inteligencia Artificial. Por favor intenta más tarde.');
            }
        });
    }

    // ── Helper: Format basic markdown (bold, lists) ──
    function formatMarkdown(text) {
        // Very simple markdown parser for bold and asterisks
        let html = text
            // Replace bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Add paragraphs
            .split('\n')
            .map(line => {
                line = line.trim();
                if (line.startsWith('* ')) {
                    return `<li>${line.substring(2)}</li>`;
                }
                return line ? `<p>${line}</p>` : '';
            })
            .join('');

        // Wrap logic for lists
        html = html.replace(/(<li>.*?<\/li>)+/g, match => `<ul>${match}</ul>`);
        return html;
    }

    // ── Helper: Append message to chat ──
    function appendMessage(sender, content) {
        const chatMessages = document.getElementById('chatMessages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-bubble ${sender}`;

        if (sender === 'ai' || sender === 'error') {
            msgDiv.innerHTML = `
                <div class="bubble-icon"><i class="fa-solid ${sender === 'error' ? 'fa-triangle-exclamation' : 'fa-brain'}"></i></div>
                <div class="bubble-text">${content}</div>
            `;
        } else {
            msgDiv.innerHTML = `<div class="bubble-text">${content}</div>`;
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const chatMessages = document.getElementById('chatMessages');
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.className = 'chat-bubble ai typing';
        msgDiv.innerHTML = `
            <div class="bubble-icon"><i class="fa-solid fa-brain"></i></div>
            <div class="bubble-text">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // ── Context Gathering ──
    function collectDashboardContext() {
        // Collect currently active filters safely
        const state = typeof Filters !== 'undefined' ? Filters.state : {};
        const activeProvince = state.provincia || 'Todas';
        const activeRadius = state.proximityRadius || 25;

        const activeTypes = [];
        document.querySelectorAll('#filterTipoGlaciar .chip.active').forEach(c => activeTypes.push(c.dataset.value));

        const activeMinerals = [];
        document.querySelectorAll('#filterMineral .chip.active').forEach(c => activeMinerals.push(c.dataset.value));

        const activeStages = [];
        document.querySelectorAll('#filterEtapa .chip.active').forEach(c => activeStages.push(c.dataset.value));

        // Read UI text content for stats
        const dText = (id) => {
            const el = document.getElementById(id);
            return el ? el.textContent : '0';
        };

        return {
            filters: `Provincia: ${activeProvince}, Tipos: ${activeTypes.join(', ')}, Minerales: ${activeMinerals.join(', ')}, Etapas: ${activeStages.join(', ')}`,
            stats: `Superficie: ${dText('statSuperficie')} km², Geoformas totales: ${dText('statTotalGlaciares')}`,
            glaciersCount: dText('countGlaciares'),
            miningCount: dText('countMineria'),
            alertSummary: `${dText('statAlertas')} alertas de proyectos mineros a menos de ${activeRadius} km de glaciares.`
        };
    }

})();
