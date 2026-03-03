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

    // ── Context Gathering ── Sends full dataset summaries to AI for real analysis ──
    function collectDashboardContext() {
        const state = typeof Filters !== 'undefined' ? Filters.state : {};
        const activeProvince = state.provincia || 'Todas';
        const activeRadius = state.proximityRadius || 25;

        // ── 1. Ranking provincial de glaciares por superficie (datos ING 2018) ──
        let rankingProvincias = '';
        if (typeof GLACIARES_STATS !== 'undefined') {
            rankingProvincias = Object.entries(GLACIARES_STATS)
                .sort((a, b) => b[1].superficie_km2 - a[1].superficie_km2)
                .map(([prov, s]) => `  • ${prov}: ${s.superficie_km2} km² | ${s.total_geoformas} geoformas | ${s.glaciares} glaciares | ${s.periglacial} periglaciales`)
                .join('\n');
        }

        // ── 2. Top 10 glaciares por superficie ──
        let topGlaciares = '';
        if (typeof GLACIARES_DATA !== 'undefined') {
            topGlaciares = [...GLACIARES_DATA]
                .sort((a, b) => b.superficie_km2 - a.superficie_km2)
                .slice(0, 10)
                .map(g => `  • ${g.nombre} (${g.provincia}): ${g.superficie_km2} km² | cuenca: ${g.cuenca} | tipo: ${g.tipo} ${g.subtipo}`)
                .join('\n');
        }

        // ── 3. Lista completa de glaciares (nombre, provincia, tipo, cuenca, superficie) ──
        let todosLosGlaciares = '';
        if (typeof GLACIARES_DATA !== 'undefined') {
            todosLosGlaciares = GLACIARES_DATA
                .map(g => `${g.nombre}|${g.provincia}|${g.tipo}|${g.subtipo}|${g.cuenca}|${g.superficie_km2}km²`)
                .join('\n');
        }

        // ── 4. Resumen de minería por mineral ──
        let resumenMineral = '';
        if (typeof MINERIA_DATA !== 'undefined') {
            const mineralMap = {};
            MINERIA_DATA.forEach(m => {
                if (!mineralMap[m.mineral]) mineralMap[m.mineral] = { total: 0, estados: {}, provincias: new Set() };
                mineralMap[m.mineral].total++;
                mineralMap[m.mineral].estados[m.estado] = (mineralMap[m.mineral].estados[m.estado] || 0) + 1;
                mineralMap[m.mineral].provincias.add(m.provincia);
            });
            resumenMineral = Object.entries(mineralMap)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([min, d]) => {
                    const estados = Object.entries(d.estados).map(([e, c]) => `${c} en ${e}`).join(', ');
                    return `  • ${min}: ${d.total} proyectos (${estados}) | Provincias: ${[...d.provincias].join(', ')}`;
                })
                .join('\n');
        }

        // ── 5. Lista completa de proyectos mineros ──
        let todosLosProyectos = '';
        if (typeof MINERIA_DATA !== 'undefined') {
            todosLosProyectos = MINERIA_DATA
                .map(m => `${m.nombre}|${m.empresa}|${m.mineral}|${m.estado}|${m.provincia}`)
                .join('\n');
        }

        // ── 6. Filtros activos actuales ──
        const activeTypes = [];
        document.querySelectorAll('#filterTipoGlaciar .chip.active').forEach(c => activeTypes.push(c.dataset.value));
        const activeMinerals = [];
        document.querySelectorAll('#filterMineral .chip.active').forEach(c => activeMinerals.push(c.dataset.value));

        return {
            filtrosActivos: `Provincia vista: ${activeProvince} | Radio proximidad: ${activeRadius} km | Tipos glaciar: ${activeTypes.join(', ')}`,
            rankingProvinciasGlaciar: rankingProvincias,
            topGlaciares,
            todosLosGlaciares,
            resumenPorMineral: resumenMineral,
            todosLosProyectos,
        };
    }

})();
