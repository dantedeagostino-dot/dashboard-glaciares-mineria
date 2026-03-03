/**
 * js/esg.js — Populates the Sostenibilidad tab
 * Renders ESG project table and CAPMIN filterable directory
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initESGPanel();
    });

    function initESGPanel() {
        renderESGTable();
        renderCAPMIN();
    }

    // ── ESG Project Table ──────────────────────────────────────
    function renderESGTable() {
        const tbody = document.getElementById('esgProjectTbody');
        if (!tbody || typeof ESG_DATA === 'undefined') return;

        const tsmColor = {
            'Certificado': '#2ecc71',
            'En implementación': '#f39c12',
            'En cierre — no aplica': '#95a5a6',
        };

        tbody.innerHTML = ESG_DATA.map(p => {
            const regalias = p.regalias_provinciales_usd
                ? `USD ${(p.regalias_provinciales_usd / 1e6).toFixed(1)}M`
                : '—';
            const tsm = p.tsm_status || '—';
            const color = tsmColor[tsm] || '#aaa';
            const badge = `<span class="tsm-badge" style="background:${color}20;color:${color};border-color:${color}40">${tsm}</span>`;

            return `
                <tr>
                    <td><strong>${p.proyecto}</strong><br><small>${p.provincia}</small></td>
                    <td>${regalias}</td>
                    <td>${(p.empleo_directo || 0).toLocaleString('es-AR')}</td>
                    <td>${p.porcentaje_mujeres_pct || '—'}%</td>
                    <td>${badge}</td>
                </tr>
            `;
        }).join('');
    }

    // ── CAPMIN Directory ───────────────────────────────────────
    function renderCAPMIN() {
        const list = document.getElementById('capminList');
        const search = document.getElementById('capminSearch');
        const rubroSel = document.getElementById('capminRubroFilter');

        if (!list || typeof CAPMIN_DATA === 'undefined') return;

        // Populate rubro dropdown (unique values, sorted)
        const rubros = [...new Set(CAPMIN_DATA.map(c => c.rubro))].sort();
        rubros.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r;
            opt.textContent = r;
            rubroSel.appendChild(opt);
        });

        function render() {
            const q = search.value.toLowerCase().trim();
            const rub = rubroSel.value;

            const filtered = CAPMIN_DATA.filter(c => {
                const matchRubro = !rub || c.rubro === rub;
                const matchQ = !q ||
                    c.nombre.toLowerCase().includes(q) ||
                    c.rubro.toLowerCase().includes(q) ||
                    c.productos.toLowerCase().includes(q) ||
                    (Array.isArray(c.provincias_activas) && c.provincias_activas.join(',').toLowerCase().includes(q));
                return matchRubro && matchQ;
            });

            if (filtered.length === 0) {
                list.innerHTML = `<p class="capmin-empty">Sin resultados para la búsqueda.</p>`;
                return;
            }

            list.innerHTML = filtered.map(c => {
                const pymes = c.pyme
                    ? `<span class="capmin-tag pyme">PyME</span>`
                    : `<span class="capmin-tag grande">Gran empresa</span>`;
                const exp = c.exportadora
                    ? `<span class="capmin-tag export">Exportadora</span>`
                    : '';
                const provs = Array.isArray(c.provincias_activas)
                    ? c.provincias_activas.slice(0, 4).join(', ')
                    : c.provincias_activas;

                return `
                    <div class="capmin-card">
                        <div class="capmin-card-header">
                            <span class="capmin-nombre">${c.nombre}</span>
                            <div class="capmin-tags">${pymes}${exp}</div>
                        </div>
                        <div class="capmin-rubro">${c.rubro}</div>
                        <div class="capmin-productos">${c.productos}</div>
                        <div class="capmin-provs"><i class="fa-solid fa-location-dot"></i> ${provs}</div>
                    </div>
                `;
            }).join('');
        }

        search.addEventListener('input', render);
        rubroSel.addEventListener('change', render);
        render();
    }

})();
