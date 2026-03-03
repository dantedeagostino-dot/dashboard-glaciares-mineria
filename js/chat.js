/**
 * Chat Interface Module — ColossusAI
 * v2.0: Conversation memory · Full markdown · Auto-retry · Clear button
 */

(function () {
    'use strict';

    // ── Conversation history (in-memory, max 20 turns) ──────────
    const MAX_HISTORY = 20;
    let conversationHistory = [];

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
                // Remove all bubbles except the welcome message (first child)
                const bubbles = chatMessages.querySelectorAll('.chat-bubble');
                bubbles.forEach(b => b.remove());
                // Re-show suggestion chips
                const suggestions = document.getElementById('chatSuggestions');
                if (suggestions) suggestions.style.display = 'flex';
                chatInput.focus();
            });
        }

        // ── Suggestion chips ──
        const suggestions = document.getElementById('chatSuggestions');
        if (suggestions) {
            suggestions.querySelectorAll('.suggestion-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    chatInput.value = chip.innerText.replace(/^\S+\s/, '');
                    chatInput.focus();
                    suggestions.style.display = 'none';
                });
            });
            chatInput.addEventListener('input', () => {
                suggestions.style.display = chatInput.value.length > 0 ? 'none' : 'flex';
            });
        }

        // ── Submit ──
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;

            chatInput.value = '';
            if (suggestions) suggestions.style.display = 'none';
            appendMessage('user', message);

            // Add to history immediately
            conversationHistory.push({ role: 'user', content: message });

            const typingId = showTypingIndicator();
            const context = collectDashboardContext();

            // Try up to 2 times on failure
            let lastError = null;
            for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message,
                            context,
                            history: conversationHistory.slice(0, -1) // exclude current
                        })
                    });

                    removeTypingIndicator(typingId);

                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    const data = await response.json();
                    if (data.error) throw new Error(data.error);

                    const aiText = data.text;
                    appendMessage('ai', formatMarkdown(aiText));

                    // Save AI turn
                    conversationHistory.push({ role: 'model', content: aiText });

                    // Trim history to max
                    if (conversationHistory.length > MAX_HISTORY) {
                        conversationHistory = conversationHistory.slice(-MAX_HISTORY);
                    }
                    return; // success

                } catch (err) {
                    lastError = err;
                    if (attempt === 0) {
                        // Wait 1.5s then retry silently
                        await new Promise(r => setTimeout(r, 1500));
                    }
                }
            }

            // Both attempts failed
            removeTypingIndicator(typingId);
            // Remove the user turn from history since we couldn't get a response
            conversationHistory.pop();
            console.error('Chat error:', lastError);
            appendMessage('error', 'No se pudo conectar con ColossusAI. Por favor intentá de nuevo en unos segundos.');
        });
    }

    // ── Full Markdown renderer ─────────────────────────────────
    function formatMarkdown(text) {
        // Escape HTML entities first
        const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        let lines = text.split('\n');
        let html = '';
        let i = 0;

        while (i < lines.length) {
            const raw = lines[i];
            const line = raw.trim();

            // ── Headings ──
            if (/^### /.test(line)) {
                html += `<h4>${inlineMarkdown(line.slice(4))}</h4>`;
                i++; continue;
            }
            if (/^## /.test(line)) {
                html += `<h3>${inlineMarkdown(line.slice(3))}</h3>`;
                i++; continue;
            }
            if (/^# /.test(line)) {
                html += `<h2>${inlineMarkdown(line.slice(2))}</h2>`;
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

            // ── Unordered list ──
            if (/^[-*•] /.test(line)) {
                html += '<ul>';
                while (i < lines.length && /^[-*•] /.test(lines[i].trim())) {
                    html += `<li>${inlineMarkdown(lines[i].trim().slice(2))}</li>`;
                    i++;
                }
                html += '</ul>';
                continue;
            }

            // ── Ordered list ──
            if (/^\d+\. /.test(line)) {
                html += '<ol>';
                while (i < lines.length && /^\d+\. /.test(lines[i].trim())) {
                    html += `<li>${inlineMarkdown(lines[i].trim().replace(/^\d+\. /, ''))}</li>`;
                    i++;
                }
                html += '</ol>';
                continue;
            }

            // ── Empty line → paragraph break ──
            if (!line) { html += '<br>'; i++; continue; }

            // ── Normal paragraph ──
            html += `<p>${inlineMarkdown(line)}</p>`;
            i++;
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
        if (lines.length < 2) return lines.map(l => `<p>${l}</p>`).join('');
        const parseRow = row => row.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim());
        const headers = parseRow(lines[0]);
        const isAlignRow = line => /^\|[\s:-]+\|/.test(line);
        const body = lines.slice(isAlignRow(lines[1]) ? 2 : 1);

        let t = '<div class="ai-table-wrap"><table class="ai-table"><thead><tr>';
        t += headers.map(h => `<th>${inlineMarkdown(h)}</th>`).join('');
        t += '</tr></thead><tbody>';
        body.forEach(row => {
            const cells = parseRow(row);
            if (cells.length) {
                t += '<tr>' + cells.map(c => `<td>${inlineMarkdown(c)}</td>`).join('') + '</tr>';
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
        } else if (sender === 'error') {
            msgDiv.innerHTML = `
                <div class="bubble-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <div class="bubble-text"><p>${content}</p></div>
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

    // ── Context Gathering ───────────────────────────────────────
    function collectDashboardContext() {
        const state = typeof Filters !== 'undefined' ? Filters.state : {};
        const activeProvince = state.provincia || 'Todas';
        const activeRadius = state.proximityRadius || 25;

        // 1. Ranking provincial glaciares
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

        // 3. Glaciares — smart filtering by active province
        let todosLosGlaciares = '';
        if (typeof GLACIARES_DATA !== 'undefined') {
            if (activeProvince !== 'Todas') {
                // Send full detail for selected province only
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
                todosLosGlaciares = GLACIARES_DATA
                    .map(g => `${g.nombre}|${g.provincia}|${g.tipo}|${g.subtipo}|${g.cuenca}|${g.superficie_km2}km²|lat:${g.lat}|lng:${g.lng}`)
                    .join('\n');
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

        // 5. Proyectos mineros — smart filtering by active province
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

        // 11. Proximity analysis (pre-computed Haversine distances)
        let proximityAnalysis = '';
        if (typeof SpatialAnalysis !== 'undefined' && typeof GLACIARES_DATA !== 'undefined' && typeof MINERIA_DATA !== 'undefined') {
            const proximityResults = SpatialAnalysis.runProximityAnalysis(MINERIA_DATA, GLACIARES_DATA, activeRadius);
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

        // 12. Cuencas hidrográficas summary
        let cuencasResumen = '';
        if (typeof GLACIARES_DATA !== 'undefined') {
            const cuencaMap = {};
            GLACIARES_DATA.forEach(g => {
                if (!cuencaMap[g.cuenca]) cuencaMap[g.cuenca] = { count: 0, superficie: 0, provincias: new Set(), glaciares: [] };
                cuencaMap[g.cuenca].count++;
                cuencaMap[g.cuenca].superficie += g.superficie_km2;
                cuencaMap[g.cuenca].provincias.add(g.provincia);
                cuencaMap[g.cuenca].glaciares.push(g.nombre);
            });
            cuencasResumen = Object.entries(cuencaMap)
                .sort((a, b) => b[1].superficie - a[1].superficie)
                .map(([cuenca, d]) => `${cuenca}: ${d.superficie.toFixed(1)} km² | ${d.count} geoformas | Provincias: ${[...d.provincias].join(', ')} | Glaciares: ${d.glaciares.join(', ')}`)
                .join('\n');
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
        };
    }

})();
