/**
 * Chat Interface Module — ColossusAI
 * v3.0: Context optimization · Retry fix · Timeout · XSS-safe Markdown · Code blocks
 */

(function () {
    'use strict';

    // ── Conversation history (in-memory, max 20 turns) ──────────
    const MAX_HISTORY = 20;
    const FETCH_TIMEOUT_MS = 45000; // 45 seconds
    let conversationHistory = [];
    let isSending = false; // double-submit guard

    // ── Cached proximity data (avoid duplicate Haversine) ───────
    let _cachedProximity = null;
    let _cachedProximityRadius = null;

    function getCachedProximity(radius) {
        if (
            _cachedProximity && _cachedProximityRadius === radius &&
            typeof SpatialAnalysis !== 'undefined' &&
            typeof GLACIARES_DATA !== 'undefined' &&
            typeof MINERIA_DATA !== 'undefined'
        ) {
            return _cachedProximity;
        }
        if (typeof SpatialAnalysis !== 'undefined' && typeof GLACIARES_DATA !== 'undefined' && typeof MINERIA_DATA !== 'undefined') {
            _cachedProximity = SpatialAnalysis.runProximityAnalysis(MINERIA_DATA, GLACIARES_DATA, radius);
            _cachedProximityRadius = radius;
            return _cachedProximity;
        }
        return null;
    }

    document.addEventListener('DOMContentLoaded', () => {
        initChatUI();
    });

    function initChatUI() {
        const toggleBtn = document.getElementById('chatToggleBtn');
        const closeBtn = document.getElementById('chatCloseBtn');
        const clearBtn = document.getElementById('chatClearBtn');
        const chatWindow = document.getElementById('chatWindow');
        const chatForm = document.getElementById('chatForm');
        const chatInput = document.getElementById('chatInput');

        if (!toggleBtn || !chatWindow) return;

        // ── Toggle open/close ──
        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) chatInput.focus();
        });
        closeBtn.addEventListener('click', () => chatWindow.classList.remove('active'));

        // ── Clear conversation ──
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                conversationHistory = [];
                const chatMessages = document.getElementById('chatMessages');
                const bubbles = chatMessages.querySelectorAll('.chat-bubble');
                bubbles.forEach(b => b.remove());
                const suggestions = document.getElementById('chatSuggestions');
                if (suggestions) suggestions.style.display = 'flex';
                chatInput.focus();
            });
        }

        // ── Export conversation as PDF ──
        const exportBtn = document.getElementById('chatExportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (conversationHistory.length === 0) return;

                const state = typeof Filters !== 'undefined' ? Filters.state : {};
                const now = new Date().toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short' });

                let html = `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; padding: 0;">
                    <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #00d4ff;">
                        <h1 style="font-size: 20px; margin: 0 0 4px; color: #0a0e1a;">🧠 Informe ColossusAI</h1>
                        <p style="font-size: 12px; color: #666; margin: 2px 0;">Dashboard Glaciares & Minería Argentina</p>
                        <p style="font-size: 11px; color: #888; margin: 2px 0;">${now}</p>
                        <p style="font-size: 11px; color: #888; margin: 2px 0;">Filtros: ${state.provincia || 'Todas'} | Radio: ${state.proximityRadius || 25} km</p>
                    </div>`;

                // FIX #3: Use msg.content (our format), not msg.parts[0].text
                conversationHistory.forEach(msg => {
                    const text = msg.content || '';
                    if (msg.role === 'user') {
                        html += `
                        <div style="margin: 12px 0; padding: 10px 14px; background: #e8f4fd; border-left: 3px solid #00a8e8; border-radius: 6px;">
                            <p style="font-size: 10px; color: #00a8e8; font-weight: 700; margin: 0 0 4px; text-transform: uppercase;">Usuario</p>
                            <p style="font-size: 13px; margin: 0; color: #1a1a2e;">${escapeHtml(text)}</p>
                        </div>`;
                    } else {
                        let rendered = text
                            .replace(/\[CHART:[^\]]+\]/g, '')
                            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br>');
                        html += `
                        <div style="margin: 12px 0; padding: 10px 14px; background: #f8f9fa; border-left: 3px solid #a78bfa; border-radius: 6px;">
                            <p style="font-size: 10px; color: #a78bfa; font-weight: 700; margin: 0 0 4px; text-transform: uppercase;">ColossusAI</p>
                            <div style="font-size: 12px; color: #2d2d44; line-height: 1.6;">${rendered}</div>
                        </div>`;
                    }
                });

                html += `
                    <div style="text-align: center; margin-top: 24px; padding-top: 12px; border-top: 1px solid #ddd;">
                        <p style="font-size: 10px; color: #aaa;">Generado por ColossusAI — ColossusLab.tech</p>
                    </div>
                </div>`;

                const container = document.createElement('div');
                container.innerHTML = html;

                html2pdf()
                    .set({
                        margin: [10, 12],
                        filename: `informe-colossusai-${new Date().toISOString().slice(0, 10)}.pdf`,
                        image: { type: 'jpeg', quality: 0.95 },
                        html2canvas: { scale: 2, useCORS: true },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    })
                    .from(container)
                    .save();
            });
        }

        // ── Suggestion chips ──
        const suggestions = document.getElementById('chatSuggestions');
        if (suggestions) {
            suggestions.querySelectorAll('.suggestion-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    // FIX #10: Use dataset attribute instead of fragile regex for emoji removal
                    const raw = chip.innerText.trim();
                    // Remove leading emoji (handles multi-codepoint emoji correctly)
                    chatInput.value = raw.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D]+\s*/u, '');
                    chatInput.focus();
                    suggestions.style.display = 'none';
                });
            });
            chatInput.addEventListener('input', () => {
                suggestions.style.display = chatInput.value.length > 0 ? 'none' : 'flex';
            });
        }

        // ── Submit ── (FIX #4: typing indicator flow, FIX #5: timeout, FIX #12: double-submit)
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message || isSending) return;

            isSending = true;
            const sendBtn = chatForm.querySelector('.chat-send');
            if (sendBtn) sendBtn.disabled = true;

            chatInput.value = '';
            if (suggestions) suggestions.style.display = 'none';
            appendMessage('user', message);

            conversationHistory.push({ role: 'user', content: message });

            const typingId = showTypingIndicator();
            const context = collectDashboardContext();

            let lastError = null;
            for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    // FIX #5: AbortController with timeout
                    const controller = new AbortController();
                    const timeoutHandle = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        signal: controller.signal,
                        body: JSON.stringify({
                            message,
                            context,
                            history: conversationHistory.slice(0, -1)
                        })
                    });

                    clearTimeout(timeoutHandle);

                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    const data = await response.json();
                    if (data.error) throw new Error(data.error);

                    // FIX #4: Only remove typing AFTER successful response
                    removeTypingIndicator(typingId);

                    const aiText = data.text;
                    appendMessage('ai', formatMarkdown(aiText));

                    conversationHistory.push({ role: 'model', content: aiText });

                    if (conversationHistory.length > MAX_HISTORY) {
                        conversationHistory = conversationHistory.slice(-MAX_HISTORY);
                    }

                    isSending = false;
                    if (sendBtn) sendBtn.disabled = false;
                    return; // success

                } catch (err) {
                    lastError = err;
                    if (attempt === 0) {
                        // FIX #4: Keep typing indicator visible during retry, just wait
                        await new Promise(r => setTimeout(r, 1500));
                    }
                }
            }

            // Both attempts failed
            removeTypingIndicator(typingId);
            conversationHistory.pop();
            console.error('Chat error:', lastError);

            const errorMsg = lastError?.name === 'AbortError'
                ? 'La solicitud tardó demasiado. Probá con una pregunta más específica o seleccioná una provincia para reducir los datos.'
                : 'No se pudo conectar con ColossusAI. Por favor intentá de nuevo en unos segundos.';
            appendMessage('error', errorMsg);

            isSending = false;
            if (sendBtn) sendBtn.disabled = false;
        });
    }

    // ── HTML escape helper (FIX #6: XSS prevention) ─────────────
    function escapeHtml(str) {
        const d = document.createElement('div');
        d.appendChild(document.createTextNode(str));
        return d.innerHTML;
    }

    // ── Full Markdown renderer (FIX #6, #7, #8) ────────────────
    function formatMarkdown(text) {
        let lines = text.split('\n');
        let html = '';
        let i = 0;

        while (i < lines.length) {
            const raw = lines[i];
            const line = raw.trim();

            // ── Fenced code blocks (FIX #8) ──
            if (/^```/.test(line)) {
                const lang = line.slice(3).trim();
                i++;
                const codeLines = [];
                while (i < lines.length && !/^```/.test(lines[i].trim())) {
                    codeLines.push(escapeHtml(lines[i]));
                    i++;
                }
                if (i < lines.length) i++; // skip closing ```
                html += `<pre class="ai-code-block"><code>${codeLines.join('\n')}</code></pre>`;
                continue;
            }

            // ── Headings ──
            if (/^### /.test(line)) {
                html += `<h4>${inlineMarkdown(escapeHtml(line.slice(4)))}</h4>`;
                i++; continue;
            }
            if (/^## /.test(line)) {
                html += `<h3>${inlineMarkdown(escapeHtml(line.slice(3)))}</h3>`;
                i++; continue;
            }
            if (/^# /.test(line)) {
                html += `<h2>${inlineMarkdown(escapeHtml(line.slice(2)))}</h2>`;
                i++; continue;
            }

            // ── Horizontal rule ──
            if (/^---+$/.test(line)) {
                html += '<hr>';
                i++; continue;
            }

            // ── Table detection (line starts with |) ──
            if (/^\|/.test(line)) {
                const tableLines = [];
                while (i < lines.length && /^\|/.test(lines[i].trim())) {
                    tableLines.push(lines[i].trim());
                    i++;
                }
                html += renderTable(tableLines);
                continue;
            }

            // ── Lists (FIX #7: supports nested lists) ──
            if (/^(\s*)([-*•]|\d+\.)\s/.test(raw)) {
                html += parseList(lines, i);
                // Advance past all list lines
                while (i < lines.length && /^(\s*)([-*•]|\d+\.)\s/.test(lines[i])) {
                    i++;
                }
                continue;
            }

            // ── Empty line → paragraph break ──
            if (!line) { html += '<br>'; i++; continue; }

            // ── Normal paragraph ──
            html += `<p>${inlineMarkdown(escapeHtml(line))}</p>`;
            i++;
        }

        return html;
    }

    // ── Nested list parser (FIX #7) ─────────────────────────────
    function parseList(lines, startIdx) {
        let i = startIdx;
        const result = [];
        const stack = []; // stack of {indent, type, items}

        while (i < lines.length) {
            const raw = lines[i];
            const match = raw.match(/^(\s*)([-*•]|\d+\.)\s+(.*)/);
            if (!match) break;

            const indent = match[1].length;
            const marker = match[2];
            const content = match[3];
            const type = /^\d+\./.test(marker) ? 'ol' : 'ul';

            // Find the right level
            while (stack.length > 0 && stack[stack.length - 1].indent >= indent && stack[stack.length - 1].indent !== indent) {
                stack.pop();
            }

            if (stack.length === 0 || indent > stack[stack.length - 1].indent) {
                const newLevel = { indent, type, items: [] };
                stack.push(newLevel);
            }

            stack[stack.length - 1].items.push(inlineMarkdown(escapeHtml(content)));
            i++;
        }

        // Build HTML from collected items — simplified flat render for reliability
        let html = '';
        let currentIndent = -1;
        let openTags = [];

        let j = startIdx;
        while (j < lines.length) {
            const raw = lines[j];
            const match = raw.match(/^(\s*)([-*•]|\d+\.)\s+(.*)/);
            if (!match) break;

            const indent = match[1].length;
            const marker = match[2];
            const content = match[3];
            const type = /^\d+\./.test(marker) ? 'ol' : 'ul';

            while (openTags.length > 0 && openTags[openTags.length - 1].indent >= indent && openTags[openTags.length - 1].indent !== indent) {
                const tag = openTags.pop();
                html += `</li></${tag.type}>`;
            }

            if (openTags.length === 0 || indent > openTags[openTags.length - 1].indent) {
                html += `<${type}>`;
                openTags.push({ indent, type });
            } else {
                html += '</li>';
            }

            html += `<li>${inlineMarkdown(escapeHtml(content))}`;
            j++;
        }

        // Close remaining tags
        while (openTags.length > 0) {
            const tag = openTags.pop();
            html += `</li></${tag.type}>`;
        }

        return html;
    }

    function inlineMarkdown(text) {
        return text
            .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`(.+?)`/g, '<code>$1</code>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    }

    function renderTable(lines) {
        if (lines.length < 2) return lines.map(l => `<p>${escapeHtml(l)}</p>`).join('');
        const parseRow = row => row.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim());
        const headers = parseRow(lines[0]);
        const isAlignRow = line => /^\|[\s:-]+\|/.test(line);
        const body = lines.slice(isAlignRow(lines[1]) ? 2 : 1);

        let t = '<div class="ai-table-wrap"><table class="ai-table"><thead><tr>';
        t += headers.map(h => `<th>${inlineMarkdown(escapeHtml(h))}</th>`).join('');
        t += '</tr></thead><tbody>';
        body.forEach(row => {
            const cells = parseRow(row);
            if (cells.length) {
                t += '<tr>' + cells.map(c => `<td>${inlineMarkdown(escapeHtml(c))}</td>`).join('') + '</tr>';
            }
        });
        t += '</tbody></table></div>';
        return t;
    }

    // ── Append message ──────────────────────────────────────────
    function appendMessage(sender, content) {
        const chatMessages = document.getElementById('chatMessages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-bubble ${sender}`;

        if (sender === 'ai') {
            msgDiv.innerHTML = `
                <div class="bubble-icon"><i class="fa-solid fa-brain"></i></div>
                <div class="bubble-text">${content}</div>
            `;
            chatMessages.appendChild(msgDiv);
            renderChatCharts(msgDiv);
        } else if (sender === 'error') {
            msgDiv.innerHTML = `
                <div class="bubble-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <div class="bubble-text"><p>${content}</p></div>
            `;
            chatMessages.appendChild(msgDiv);
        } else {
            // User message — escape to prevent XSS
            msgDiv.innerHTML = `<div class="bubble-text">${escapeHtml(content)}</div>`;
            chatMessages.appendChild(msgDiv);
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ── Inline Chart Renderer ────────────────────────────────────
    function renderChatCharts(container) {
        const bubbleText = container.querySelector('.bubble-text');
        if (!bubbleText) return;

        const chartRegex = /\[CHART:(bar|pie|doughnut)\|labels:([^|]+)\|values:([^|]+)\|title:([^\]]+)\]/g;
        let html = bubbleText.innerHTML;
        let chartIndex = 0;
        const chartConfigs = [];

        html = html.replace(chartRegex, (match, type, labelsStr, valuesStr, title) => {
            const id = `chat-chart-${Date.now()}-${chartIndex++}`;
            const labels = labelsStr.split(',').map(l => l.trim());
            const values = valuesStr.split(',').map(v => parseFloat(v.trim()));
            chartConfigs.push({ id, type, labels, values, title: title.trim() });
            return `<div class="chat-chart-container"><canvas id="${id}" height="200"></canvas></div>`;
        });

        if (chartConfigs.length === 0) return;
        bubbleText.innerHTML = html;

        const palette = [
            '#00d4ff', '#a78bfa', '#f59e0b', '#ef4444', '#10b981',
            '#3b82f6', '#e67e22', '#f1c40f', '#9b59b6', '#1abc9c'
        ];

        chartConfigs.forEach(cfg => {
            const canvas = document.getElementById(cfg.id);
            if (!canvas) return;

            const colors = cfg.labels.map((_, i) => palette[i % palette.length]);

            new Chart(canvas, {
                type: cfg.type,
                data: {
                    labels: cfg.labels,
                    datasets: [{
                        label: cfg.title,
                        data: cfg.values,
                        backgroundColor: cfg.type === 'bar'
                            ? colors.map(c => c + '99')
                            : colors,
                        borderColor: cfg.type === 'bar' ? colors : '#1a1f2e',
                        borderWidth: cfg.type === 'bar' ? 1 : 2,
                        borderRadius: cfg.type === 'bar' ? 4 : 0,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: cfg.type !== 'bar',
                            position: 'bottom',
                            labels: { color: '#94a3b8', font: { size: 10 } }
                        },
                        title: {
                            display: true,
                            text: cfg.title,
                            color: '#e2e8f0',
                            font: { size: 12, weight: '600' }
                        }
                    },
                    scales: cfg.type === 'bar' ? {
                        x: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } },
                        y: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { color: 'rgba(148,163,184,0.1)' } }
                    } : undefined
                }
            });
        });
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

    // ── Context Gathering (FIX #1: Optimized payload) ───────────
    function collectDashboardContext() {
        const state = typeof Filters !== 'undefined' ? Filters.state : {};
        const activeProvince = state.provincia || 'Todas';
        const activeRadius = state.proximityRadius || 25;

        // 1. Ranking provincial glaciares (always compact)
        let rankingProvincias = '';
        if (typeof GLACIARES_STATS !== 'undefined') {
            rankingProvincias = Object.entries(GLACIARES_STATS)
                .sort((a, b) => b[1].superficie_km2 - a[1].superficie_km2)
                .map(([prov, s]) => `  • ${prov}: ${s.superficie_km2} km² | ${s.total_geoformas} geoformas | ${s.glaciares} glaciares | ${s.periglacial} periglaciales`)
                .join('\n');
        }

        // 2. Top 10 glaciares
        let topGlaciares = '';
        if (typeof GLACIARES_DATA !== 'undefined') {
            topGlaciares = [...GLACIARES_DATA]
                .sort((a, b) => b.superficie_km2 - a.superficie_km2)
                .slice(0, 10)
                .map(g => `  • ${g.nombre} (${g.provincia}): ${g.superficie_km2} km² | cuenca: ${g.cuenca} | tipo: ${g.tipo} ${g.subtipo}`)
                .join('\n');
        }

        // 3. Glaciares — FIX #1: Smart context based on province selection
        let todosLosGlaciares = '';
        if (typeof GLACIARES_DATA !== 'undefined') {
            if (activeProvince !== 'Todas') {
                // Province selected → full detail for that province only, summary for rest
                const provGlaciares = GLACIARES_DATA.filter(g => g.provincia === activeProvince);
                todosLosGlaciares = `[DATOS DETALLADOS — ${activeProvince} (${provGlaciares.length} geoformas)]:\n` +
                    provGlaciares
                        .map(g => `${g.nombre}|${g.provincia}|${g.tipo}|${g.subtipo}|${g.cuenca}|${g.superficie_km2}km²|lat:${g.lat}|lng:${g.lng}`)
                        .join('\n') +
                    '\n\n[RESUMEN NACIONAL (otras provincias)]:\n' +
                    Object.entries(GLACIARES_STATS)
                        .filter(([prov]) => prov !== activeProvince)
                        .map(([prov, s]) => `${prov}: ${s.total_geoformas} geoformas | ${s.superficie_km2} km²`)
                        .join('\n');
            } else {
                // FIX #1: NO province selected → send SUMMARY ONLY, not all 16K records
                // Send top 50 largest + per-province aggregates + cuenca summary
                const top50 = [...GLACIARES_DATA]
                    .sort((a, b) => b.superficie_km2 - a.superficie_km2)
                    .slice(0, 50)
                    .map(g => `${g.nombre}|${g.provincia}|${g.tipo}|${g.subtipo}|${g.cuenca}|${g.superficie_km2}km²|lat:${g.lat}|lng:${g.lng}`)
                    .join('\n');

                // Per-cuenca summary
                const cuencaMap = {};
                GLACIARES_DATA.forEach(g => {
                    if (!cuencaMap[g.cuenca]) cuencaMap[g.cuenca] = { count: 0, sup: 0, provs: new Set() };
                    cuencaMap[g.cuenca].count++;
                    cuencaMap[g.cuenca].sup += g.superficie_km2;
                    cuencaMap[g.cuenca].provs.add(g.provincia);
                });
                const cuencaSummary = Object.entries(cuencaMap)
                    .sort((a, b) => b[1].sup - a[1].sup)
                    .slice(0, 30)
                    .map(([c, d]) => `${c}: ${d.sup.toFixed(1)}km² | ${d.count} geoformas | ${[...d.provs].join(',')}`)
                    .join('\n');

                todosLosGlaciares = `[TOP 50 GLACIARES MÁS GRANDES]:\n${top50}\n\n` +
                    `[RESUMEN POR CUENCA (top 30)]:\n${cuencaSummary}\n\n` +
                    `[NOTA: Hay ${GLACIARES_DATA.length} geoformas totales. Para ver todas, seleccioná una provincia en el dashboard. Se muestran los 50 más grandes y resúmenes por cuenca.]`;
            }
        }

        // 4. Resumen minería por mineral
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

        // 5. Proyectos mineros — smart filtering (mining data is small, always send full)
        let todosLosProyectos = '';
        if (typeof MINERIA_DATA !== 'undefined') {
            if (activeProvince !== 'Todas') {
                const provMineria = MINERIA_DATA.filter(m => m.provincia === activeProvince);
                const otrasProvincias = {};
                MINERIA_DATA.filter(m => m.provincia !== activeProvince).forEach(m => {
                    otrasProvincias[m.provincia] = (otrasProvincias[m.provincia] || 0) + 1;
                });
                todosLosProyectos = `[DATOS DETALLADOS — ${activeProvince} (${provMineria.length} proyectos)]:\n` +
                    provMineria
                        .map(m => `${m.nombre}|${m.empresa}|${m.mineral}|${m.estado}|${m.provincia}|lat:${m.lat}|lng:${m.lng}`)
                        .join('\n') +
                    '\n\n[RESUMEN NACIONAL (otras provincias)]:\n' +
                    Object.entries(otrasProvincias)
                        .sort((a, b) => b[1] - a[1])
                        .map(([prov, count]) => `${prov}: ${count} proyectos`)
                        .join('\n');
            } else {
                todosLosProyectos = MINERIA_DATA
                    .map(m => `${m.nombre}|${m.empresa}|${m.mineral}|${m.estado}|${m.provincia}|lat:${m.lat}|lng:${m.lng}`)
                    .join('\n');
            }
        }

        // 6. Filtros activos
        const activeTypes = [];
        document.querySelectorAll('#filterTipoGlaciar .chip.active').forEach(c => activeTypes.push(c.dataset.value));
        const activeMinerals = [];
        document.querySelectorAll('#filterMineral .chip.active').forEach(c => activeMinerals.push(c.dataset.value));

        // 7. Retracción ING 2024
        let retraccionData = '';
        if (typeof GLACIARES_RETRACCION !== 'undefined') {
            retraccionData = `Resolución 142/2024 (NOA 2008–2023): −${GLACIARES_RETRACCION.reduccion_hielo_descubierto_pct}% hielo descubierto | −${GLACIARES_RETRACCION.reduccion_manchones_nieve_pct}% manchones de nieve | ${GLACIARES_RETRACCION.subcuencas_actualizadas} subcuencas actualizadas`;
        }

        // 8. Litio
        let litioContextData = '';
        if (typeof LITIO_DATA !== 'undefined') {
            const enProd = LITIO_DATA.filter(l => l.estado === 'Producción');
            const enCons = LITIO_DATA.filter(l => l.estado === 'Construcción');
            const totalCap = LITIO_DATA.reduce((s, l) => s + (l.capacidad_tpa || 0), 0);
            const ctx = typeof LITIO_CONTEXTO !== 'undefined' ? LITIO_CONTEXTO : {};
            const proy = typeof LITIO_PROYECCIONES !== 'undefined'
                ? LITIO_PROYECCIONES.map(p => `${p.año}: ${p.produccion_ktpa} kt LCE`).join(' | ')
                : '';
            litioContextData = [
                `Argentina: 2° en reservas mundiales (${ctx.reservas_argentina_mt || 20} Mt LCE, ${ctx.reservas_mundo_pct || 22}% global)`,
                `En producción: ${enProd.map(l => `${l.nombre} (${l.capacidad_tpa?.toLocaleString()} t/año)`).join(', ')}`,
                `En construcción: ${enCons.map(l => `${l.nombre} → ${l.capacidad_tpa?.toLocaleString()} t/año`).join(', ')}`,
                `Capacidad total proyectada: ${totalCap.toLocaleString()} t/año`,
                `Proyecciones: ${proy}`,
                LITIO_DATA.map(l => `${l.nombre}|${l.provincia}|${l.tipo_yacimiento}|${l.compuesto}|${l.estado}|${l.capacidad_tpa || 'N/D'} t/año|${l.reservas_mt} Mt LCE`).join('\n'),
            ].join('\n');
        }

        // 9. ESG
        let esgContextData = '';
        if (typeof ESG_DATA !== 'undefined') {
            const tsm = typeof TSM_INFO !== 'undefined' ? TSM_INFO : {};
            const tot = typeof ESG_TOTALES !== 'undefined' ? ESG_TOTALES : {};
            esgContextData = [
                `TSM en Argentina: adoptado por CAEM en ${tsm.año_adopcion || 2016} | 1ra certificada: ${tsm.primera_mina_certificada || 'Veladero'} (${tsm.año_primera_certificacion || 2023})`,
                `Regalías: ~USD ${((tot.regalias_provinciales_total_usd || 0) / 1e6).toFixed(0)}M/año | Empleo directo: ${(tot.empleo_directo_total || 0).toLocaleString()} | Mujeres: ${tot.porcentaje_mujeres_sector_pct || 11}%`,
                ESG_DATA.map(e => `${e.proyecto}|${e.empresa}|${e.provincia}|USD ${((e.regalias_provinciales_usd || 0) / 1e6).toFixed(1)}M|${e.empleo_directo} empleados|${e.porcentaje_mujeres_pct}% mujeres|TSM:${e.tsm_status}`).join('\n'),
            ].join('\n');
        }

        // 10. CAPMIN
        let capminContextData = '';
        if (typeof CAPMIN_DATA !== 'undefined') {
            const info = typeof CAPMIN_INFO !== 'undefined' ? CAPMIN_INFO : {};
            capminContextData = [
                `CAPMIN: ${info.socios_aprox || 180}+ empresas | ~${info.pymes_en_directorio_pct || 65}% PyMEs`,
                CAPMIN_DATA.map(c => `${c.nombre}|${c.rubro}|${Array.isArray(c.provincias_activas) ? c.provincias_activas.join(', ') : c.provincias_activas}|${c.pyme ? 'PyME' : 'Gran empresa'}`).join('\n'),
            ].join('\n');
        }

        // 11. Proximity analysis — FIX #2: Use cached proximity, compute only once
        let proximityAnalysis = '';
        const proximityResults = getCachedProximity(activeRadius);
        if (proximityResults) {
            proximityAnalysis = proximityResults
                .filter(p => p.glaciersInRadius > 0)
                .map(p => {
                    const top5 = p.glaciersInRadiusList.slice(0, 5)
                        .map(g => `${g.nombre}(${g.distance_km}km)`)
                        .join(', ');
                    return `${p.project.nombre}(${p.project.mineral},${p.project.provincia})|glaciar_más_cercano:${p.nearestGlacier?.nombre}|dist:${p.nearestDistance}km|riesgo:${p.risk}|glaciares_en_radio:${p.glaciersInRadius}|cercanos:[${top5}]`;
                })
                .join('\n');
        }

        // 12. Cuencas hidrográficas summary (already inline in optimized glaciares)
        let cuencasResumen = '';
        if (typeof GLACIARES_DATA !== 'undefined') {
            const cuencaMap = {};
            GLACIARES_DATA.forEach(g => {
                if (!cuencaMap[g.cuenca]) cuencaMap[g.cuenca] = { count: 0, superficie: 0, provincias: new Set() };
                cuencaMap[g.cuenca].count++;
                cuencaMap[g.cuenca].superficie += g.superficie_km2;
                cuencaMap[g.cuenca].provincias.add(g.provincia);
            });
            cuencasResumen = Object.entries(cuencaMap)
                .sort((a, b) => b[1].superficie - a[1].superficie)
                .slice(0, 20) // Top 20 cuencas instead of all
                .map(([cuenca, d]) => `${cuenca}: ${d.superficie.toFixed(1)} km² | ${d.count} geoformas | ${[...d.provincias].join(', ')}`)
                .join('\n');
        }

        // 13. Derived metrics — FIX #2: Reuse cached proximity
        let derivedMetrics = '';
        if (typeof GLACIARES_STATS !== 'undefined' && typeof MINERIA_DATA !== 'undefined') {
            const mineralRisk = { 'Cobre': 0.9, 'Oro': 0.85, 'Plata': 0.7, 'Litio': 0.6, 'Uranio': 0.95, 'Potasio': 0.4, 'Plomo': 0.8, 'Hierro': 0.5, 'Carbón': 0.65 };
            const etapaRisk = { 'Producción': 1.0, 'Construcción': 0.8, 'Mantenimiento': 0.6, 'Factibilidad': 0.4, 'Prefactibilidad': 0.3, 'Exploración avanzada': 0.2, 'Evaluación económica preliminar': 0.1 };

            const provMetrics = Object.entries(GLACIARES_STATS).map(([prov, stats]) => {
                const minCount = MINERIA_DATA.filter(m => m.provincia === prov).length;
                const ratio = stats.total_geoformas > 0 ? (minCount / stats.total_geoformas * 1000).toFixed(2) : '0';
                return `${prov}: densidad=${(stats.total_geoformas / (stats.superficie_km2 || 1) * 100).toFixed(1)} geoformas/100km² | ratio_minería=${ratio} proyectos/1000geoformas | proyectos=${minCount}`;
            }).join('\n');

            let projectRiskScores = '';
            if (proximityResults) {
                projectRiskScores = proximityResults
                    .map(p => {
                        const proxScore = p.nearestDistance <= 10 ? 1.0 : p.nearestDistance <= 25 ? 0.7 : p.nearestDistance <= 50 ? 0.4 : 0.1;
                        const minScore = mineralRisk[p.project.mineral] || 0.5;
                        const etaScore = etapaRisk[p.project.estado] || 0.3;
                        const riskScore = ((proxScore * 0.5 + minScore * 0.3 + etaScore * 0.2) * 10).toFixed(1);
                        return `${p.project.nombre}(${p.project.provincia}): riesgo_ambiental=${riskScore}/10 | prox=${p.nearestDistance}km | mineral=${p.project.mineral} | etapa=${p.project.estado}`;
                    })
                    .sort((a, b) => parseFloat(b.split('=')[1]) - parseFloat(a.split('=')[1]))
                    .join('\n');
            }

            derivedMetrics = `MÉTRICAS POR PROVINCIA:\n${provMetrics}\n\nRISK SCORE POR PROYECTO (0-10, mayor=más riesgo):\n${projectRiskScores}`;
        }

        return {
            filtrosActivos: `Provincia: ${activeProvince} | Radio: ${activeRadius} km | Tipos: ${activeTypes.join(', ')}`,
            rankingProvinciasGlaciar: rankingProvincias,
            topGlaciares,
            todosLosGlaciares,
            resumenPorMineral: resumenMineral,
            todosLosProyectos,
            retraccionING2024: retraccionData,
            litioEspecializado: litioContextData,
            esgIndicadores: esgContextData,
            cadenaSuministros: capminContextData,
            proximidadReal: proximityAnalysis,
            cuencasHidrograficas: cuencasResumen,
            metricasDerivadas: derivedMetrics,
        };
    }

})();
