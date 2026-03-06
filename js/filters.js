/**
 * Filters Module - Dynamic filter management
 */

const Filters = {
    state: {
        provincia: '',
        tiposGlaciar: ['Glaciar', 'Ambiente Periglacial'],
        superficieMin: 0,
        tiposProyecto: ['Metalífero', 'No Metalífero'],
        minerales: ['Cobre', 'Oro', 'Plata', 'Litio', 'Uranio', 'Potasio', 'Hierro', 'Plomo', 'Carbón', 'Au aluvional', 'Manganeso', 'Estaño', 'Cesio', 'Arena', 'Suelos seleccionados/tosca/greda', 'Triturados pétreos', 'Arcillas', 'Granito', 'Feldespato', 'Turba', 'Caliza', 'Dolomía', 'Yeso', 'Cloruro de sodio', 'Conchilla y/o coquina', 'Arenas silíceas', 'Cuarcita', 'Boratos (B2O3)', 'Cuarzo', 'Elementos de Tierras Raras (óxidos) (REE)', 'Piedra laja', 'Pórfido', 'Perlita', 'Granulado volcánico', 'Asfaltita', 'Baritina', 'Sulfato de sodio', 'Basalto', 'Fluorita', 'Serpentinita', 'Carbonato de calcio', 'Pirofilita', 'Conglomerado calcáreo', 'Mica', 'Nb (óxido)', 'Relaves', 'Zeolita', 'Grafito'],
        etapas: ['Producción', 'Construcción', 'Factibilidad', 'Prefactibilidad', 'Exploración avanzada', 'Evaluación económica preliminar', 'Prospección', 'Exploración inicial', 'Cese de operaciones', 'Proceso de Cierre'],
        proximityRadius: 25,
    },

    listeners: [],
    _debounceTimer: null,

    /** Register callback for filter changes */
    onChange(callback) {
        this.listeners.push(callback);
    },

    /** Notify all listeners (debounced 150ms to prevent rapid-fire recalculations) */
    _notify() {
        clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
            this.listeners.forEach(cb => cb(this.state));
        }, 150);
    },

    /** Initialize filter event listeners */
    init() {
        // Province dropdown
        document.getElementById('filterProvincia').addEventListener('change', (e) => {
            this.state.provincia = e.target.value;
            this._notify();
        });

        // Surface range
        document.getElementById('filterSuperficie').addEventListener('input', (e) => {
            this.state.superficieMin = parseFloat(e.target.value);
            this._notify();
        });
    },

    /** Apply filters to glacier data */
    filterGlaciares(glaciares) {
        return glaciares.filter(g => {
            if (this.state.provincia && g.provincia !== this.state.provincia) return false;
            if (!this.state.tiposGlaciar.includes(g.tipo)) return false;
            if (g.superficie_km2 < this.state.superficieMin) return false;
            return true;
        });
    },

    /** Apply filters to mining data */
    filterMineria(mineria) {
        return mineria.filter(m => {
            if (this.state.provincia && m.provincia !== this.state.provincia) return false;
            if (!this.state.tiposProyecto.includes(m.tipo || 'Metalífero')) return false;
            if (!this.state.minerales.includes(m.mineral)) return false;
            if (!this.state.etapas.includes(m.estado)) return false;
            return true;
        });
    },

    /** Set province filter programmatically (from map click) */
    setProvincia(nombre) {
        this.state.provincia = nombre;
        document.getElementById('filterProvincia').value = nombre;
        this._notify();
    },

    /** Clear province filter */
    clearProvincia() {
        this.state.provincia = '';
        document.getElementById('filterProvincia').value = '';
        this._notify();
    },

    /** Reset all filters */
    resetAll() {
        this.state.provincia = '';
        this.state.tiposGlaciar = ['Glaciar', 'Ambiente Periglacial'];
        this.state.superficieMin = 0;
        this.state.tiposProyecto = ['Metalífero', 'No Metalífero'];
        this.state.minerales = ['Cobre', 'Oro', 'Plata', 'Litio', 'Uranio', 'Potasio', 'Hierro', 'Plomo', 'Carbón', 'Au aluvional', 'Manganeso', 'Estaño', 'Cesio', 'Arena', 'Suelos seleccionados/tosca/greda', 'Triturados pétreos', 'Arcillas', 'Granito', 'Feldespato', 'Turba', 'Caliza', 'Dolomía', 'Yeso', 'Cloruro de sodio', 'Conchilla y/o coquina', 'Arenas silíceas', 'Cuarcita', 'Boratos (B2O3)', 'Cuarzo', 'Elementos de Tierras Raras (óxidos) (REE)', 'Piedra laja', 'Pórfido', 'Perlita', 'Granulado volcánico', 'Asfaltita', 'Baritina', 'Sulfato de sodio', 'Basalto', 'Fluorita', 'Serpentinita', 'Carbonato de calcio', 'Pirofilita', 'Conglomerado calcáreo', 'Mica', 'Nb (óxido)', 'Relaves', 'Zeolita', 'Grafito'];
        this.state.etapas = ['Producción', 'Construcción', 'Factibilidad', 'Prefactibilidad', 'Exploración avanzada', 'Evaluación económica preliminar', 'Prospección', 'Exploración inicial', 'Cese de operaciones', 'Proceso de Cierre'];
        this.state.proximityRadius = 25;

        // Reset UI
        document.getElementById('filterProvincia').value = '';
        document.getElementById('filterSuperficie').value = 0;
        document.getElementById('filterSuperficieLabel').textContent = '≥ 0 km²';

        // Reset chips
        document.querySelectorAll('.chip').forEach(c => c.classList.add('active'));

        // Reset radius buttons
        document.querySelectorAll('.radius-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.radius-btn[data-radius="25"]').classList.add('active');

        this._notify();
    }
};

/* ── Global UI Helpers ──────────────────────────── */

function togglePanel(header) {
    header.classList.toggle('collapsed');
    const body = header.nextElementSibling;
    body.classList.toggle('collapsed');
}

function toggleChip(chip) {
    chip.classList.toggle('active');
    const group = chip.closest('.checkbox-group');
    const filterType = group.id;

    const activeValues = Array.from(group.querySelectorAll('.chip.active'))
        .map(c => c.dataset.value);

    if (filterType === 'filterTipoGlaciar') {
        Filters.state.tiposGlaciar = activeValues;
    } else if (filterType === 'filterTipoProyecto') {
        Filters.state.tiposProyecto = activeValues;
    } else if (filterType === 'filterMineral') {
        Filters.state.minerales = activeValues;
    } else if (filterType === 'filterEtapa') {
        Filters.state.etapas = activeValues;
    }

    Filters._notify();
}

function updateRangeLabel(input) {
    const label = document.getElementById(input.id + 'Label');
    label.textContent = `≥ ${input.value} km²`;
}

function setRadius(btn) {
    document.querySelectorAll('.radius-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Filters.state.proximityRadius = parseInt(btn.dataset.radius);
    Filters._notify();
}

function resetFilters() {
    Filters.resetAll();
}

function switchTab(btn) {
    const tabId = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function clearProvinceFilter() {
    Filters.clearProvincia();
    document.getElementById('provinceInfoBar').classList.add('hidden');
}
