/**
 * Main Application Module
 * Initializes the Leaflet map, binds data layers, handles interactions
 */

(function () {
    'use strict';

    // ── State ──────────────────────────────────────
    let map;
    let glaciarLayer, periglacialLayer, mineriaLayer, alertsLayer, provinciaLayer;
    let segeMarLayer; // SIGAM WMS — geological units (SEGEMAR)
    let glaciarPolygonLayer = null; // GeoJSON polygon outlines (loaded on demand)
    let currentProximityData = [];
    let currentMineralAnalysis = {};

    // ── Initialize ─────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        initMap();
        DashboardCharts.init();
        Filters.init();
        Filters.onChange(onFilterChange);
        loadAllData();
        setTimeout(() => {
            const overlay = document.getElementById('loadingOverlay');
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.style.display = 'none', 600);
        }, 800);
    });

    // ── Map Setup ──────────────────────────────────
    function initMap() {
        map = L.map('map', {
            center: [-38.5, -66.5],
            zoom: 4,
            minZoom: 3,
            maxZoom: 15,
            zoomControl: true,
            attributionControl: true
        });

        // Dark CartoDB base
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // IGN WMS overlay (transparent terrain labels)
        L.tileLayer.wms('https://wms.ign.gob.ar/geoserver/wms', {
            layers: 'capadeideprovincia',
            format: 'image/png',
            transparent: true,
            opacity: 0.25,
            attribution: 'IGN Argentina'
        }).addTo(map);

        // SIGAM — SEGEMAR Geological Units WMS (off by default, toggle via panel)
        segeMarLayer = L.tileLayer.wms('https://sigam.segemar.gov.ar/geoserver/wms', {
            layers: 'GeoMAP1M:NOA_unidad_geologica_1M,GeoMAP1M:Cuyo_unidad_geologica_1M',
            format: 'image/png',
            transparent: true,
            opacity: 0.35,
            attribution: 'SEGEMAR — SIGAM',
            crossOrigin: true
        }); // NOT added to map by default — user toggles it on

        // Custom label: Islas Malvinas (override English tile label)
        map.createPane('labelsOverride');
        map.getPane('labelsOverride').style.zIndex = 650;
        map.getPane('labelsOverride').style.pointerEvents = 'none';

        const malvinasLabel = L.marker([-51.75, -59.0], {
            pane: 'labelsOverride',
            interactive: false,
            icon: L.divIcon({
                className: 'malvinas-label',
                html: '<span style="color:#b0b8c4;font-family:\'Inter\',sans-serif;font-size:12px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;text-shadow:0 0 8px #0d1117,0 0 16px #0d1117,0 0 24px #0d1117,1px 1px 4px #0d1117,-1px -1px 4px #0d1117,2px 0 6px #0d1117,-2px 0 6px #0d1117,0 2px 6px #0d1117,0 -2px 6px #0d1117;">ISLAS MALVINAS</span>',
                iconSize: [140, 20],
                iconAnchor: [70, 10]
            })
        }).addTo(map);

        // Initialize layer groups — use MarkerCluster for glacier/periglacial (17,840 markers)
        glaciarLayer = L.markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            disableClusteringAtZoom: 13,
            iconCreateFunction: function (cluster) {
                const count = cluster.getChildCount();
                let size = 'small', r = 30;
                if (count > 100) { size = 'large'; r = 50; }
                else if (count > 20) { size = 'medium'; r = 40; }
                return L.divIcon({
                    html: `<div style="background:rgba(0,212,255,0.7);color:#fff;border-radius:50%;width:${r}px;height:${r}px;display:flex;align-items:center;justify-content:center;font-size:${r < 40 ? 11 : 13}px;font-weight:700;border:2px solid rgba(0,212,255,0.9);box-shadow:0 0 12px rgba(0,212,255,0.5);">${count}</div>`,
                    className: 'glacier-cluster glacier-cluster-' + size,
                    iconSize: L.point(r, r)
                });
            }
        }).addTo(map);
        periglacialLayer = L.markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            disableClusteringAtZoom: 13,
            iconCreateFunction: function (cluster) {
                const count = cluster.getChildCount();
                let size = 'small', r = 30;
                if (count > 100) { size = 'large'; r = 50; }
                else if (count > 20) { size = 'medium'; r = 40; }
                return L.divIcon({
                    html: `<div style="background:rgba(167,139,250,0.7);color:#fff;border-radius:50%;width:${r}px;height:${r}px;display:flex;align-items:center;justify-content:center;font-size:${r < 40 ? 11 : 13}px;font-weight:700;border:2px solid rgba(167,139,250,0.9);box-shadow:0 0 12px rgba(167,139,250,0.5);">${count}</div>`,
                    className: 'periglacial-cluster periglacial-cluster-' + size,
                    iconSize: L.point(r, r)
                });
            }
        }).addTo(map);
        mineriaLayer = L.layerGroup().addTo(map);
        alertsLayer = L.layerGroup().addTo(map);
        provinciaLayer = L.layerGroup().addTo(map);

        // Layer toggle events
        document.getElementById('layerGlaciares').addEventListener('change', e => {
            e.target.checked ? map.addLayer(glaciarLayer) : map.removeLayer(glaciarLayer);
        });
        document.getElementById('layerPeriglacial').addEventListener('change', e => {
            e.target.checked ? map.addLayer(periglacialLayer) : map.removeLayer(periglacialLayer);
        });
        document.getElementById('layerMineria').addEventListener('change', e => {
            e.target.checked ? map.addLayer(mineriaLayer) : map.removeLayer(mineriaLayer);
        });
        document.getElementById('layerAlertas').addEventListener('change', e => {
            e.target.checked ? map.addLayer(alertsLayer) : map.removeLayer(alertsLayer);
        });
        // SIGAM Geological layer toggle
        const segeMarToggle = document.getElementById('layerSegemar');
        if (segeMarToggle) {
            segeMarToggle.addEventListener('change', e => {
                if (e.target.checked) {
                    map.addLayer(segeMarLayer);
                } else {
                    map.removeLayer(segeMarLayer);
                }
            });
        }
        // Glacier polygon outlines toggle (loaded on demand)
        const polyToggle = document.getElementById('layerPoligonos');
        if (polyToggle) {
            polyToggle.addEventListener('change', e => {
                if (e.target.checked) {
                    if (glaciarPolygonLayer) {
                        map.addLayer(glaciarPolygonLayer);
                    } else {
                        loadGlacierPolygons();
                    }
                } else if (glaciarPolygonLayer) {
                    map.removeLayer(glaciarPolygonLayer);
                }
            });
        }
    }

    // ── Glacier Polygon GeoJSON Layer ──────────────
    const POLYGON_TYPE_COLORS = {
        'GD': '#00d4ff', // Glaciar Descubierto – cyan
        'GC': '#3b82f6', // Glaciar Cubierto – blue
        'GCGE': '#8b5cf6', // Glaciar Cubierto/Geoforma Periglaciar – purple
        'GEA': '#f59e0b', // Geoforma Ambiente Glaciar – amber
        'GEI': '#ec4899', // Geoforma Ambiente Periglaciar – pink
        'MN': '#e2e8f0', // Manchón de Nieve – white
    };
    const POLYGON_TYPE_NAMES = {
        'GD': 'Glaciar Descubierto', 'GC': 'Glaciar Cubierto',
        'GCGE': 'Glaciar Cubierto / Geoforma Periglaciar',
        'GEA': 'Geoforma de Ambiente Glaciar',
        'GEI': 'Geoforma de Ambiente Periglaciar', 'MN': 'Manchón de Nieve',
    };

    function loadGlacierPolygons() {
        const countEl = document.getElementById('countPoligonos');
        if (countEl) countEl.textContent = 'cargando…';

        fetch('data/glaciares_polygons.geojson')
            .then(r => r.json())
            .then(geojson => {
                glaciarPolygonLayer = L.geoJSON(geojson, {
                    style: function (feature) {
                        const tipo = feature.properties.t || 'MN';
                        const color = POLYGON_TYPE_COLORS[tipo] || '#00d4ff';
                        return {
                            color: color,
                            weight: 1.5,
                            opacity: 0.85,
                            fillColor: color,
                            fillOpacity: 0.25,
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        const p = feature.properties;
                        const tipoName = POLYGON_TYPE_NAMES[p.t] || p.t;
                        layer.bindPopup(`
                            <div class="popup-content">
                                <h4 class="glacier-title"><i class="fa-solid fa-draw-polygon" style="margin-right:6px"></i>${p.n}</h4>
                                <div class="popup-row"><span class="label">Tipo</span><span class="value">${tipoName}</span></div>
                                <div class="popup-row"><span class="label">Provincia</span><span class="value">${p.p}</span></div>
                                <div class="popup-row"><span class="label">Cuenca</span><span class="value">${p.c}</span></div>
                                <div class="popup-row"><span class="label">Superficie</span><span class="value">${p.a} km²</span></div>
                            </div>
                        `, { maxWidth: 300 });
                    }
                }).addTo(map);

                if (countEl) countEl.textContent = `${geojson.features.length.toLocaleString()} polígonos`;
            })
            .catch(err => {
                console.error('Error loading glacier polygons:', err);
                if (countEl) countEl.textContent = 'error al cargar';
            });
    }

    // ── Load Data ──────────────────────────────────
    function loadAllData() {
        // Add province boundaries
        addProvinceBoundaries();
        // First render
        onFilterChange(Filters.state);
    }

    // ── Province Boundaries ────────────────────────
    function addProvinceBoundaries() {
        L.geoJSON(PROVINCIAS_GEOJSON, {
            style: {
                color: 'rgba(0, 212, 255, 0.25)',
                weight: 1.5,
                fillColor: 'rgba(0, 212, 255, 0.03)',
                fillOpacity: 1
            },
            onEachFeature: (feature, layer) => {
                layer.on({
                    mouseover: (e) => {
                        e.target.setStyle({
                            fillColor: 'rgba(0, 212, 255, 0.08)',
                            color: 'rgba(0, 212, 255, 0.5)',
                            weight: 2
                        });
                    },
                    mouseout: (e) => {
                        e.target.setStyle({
                            fillColor: 'rgba(0, 212, 255, 0.03)',
                            color: 'rgba(0, 212, 255, 0.25)',
                            weight: 1.5
                        });
                    },
                    click: (e) => {
                        const nombre = feature.properties.nombre;
                        Filters.setProvincia(nombre);
                        showProvinceInfo(nombre);

                        // Zoom to province
                        if (PROVINCIAS_CENTERS[nombre]) {
                            const c = PROVINCIAS_CENTERS[nombre];
                            map.flyTo([c.lat, c.lng], c.zoom, { duration: 1 });
                        }
                    }
                });
            }
        }).addTo(provinciaLayer);
    }

    // ── Province Info Bar ──────────────────────────
    function showProvinceInfo(nombre) {
        const bar = document.getElementById('provinceInfoBar');
        bar.classList.remove('hidden');

        document.getElementById('provinceInfoName').textContent = nombre;

        const stats = GLACIARES_STATS[nombre];
        if (stats) {
            document.getElementById('provinceInfoGlaciares').textContent = stats.total_geoformas.toLocaleString();
            document.getElementById('provinceInfoSuperficie').textContent = stats.superficie_km2.toLocaleString();
        } else {
            document.getElementById('provinceInfoGlaciares').textContent = '0';
            document.getElementById('provinceInfoSuperficie').textContent = '0';
        }

        const minCount = MINERIA_DATA.filter(m => m.provincia === nombre).length;
        document.getElementById('provinceInfoMineria').textContent = minCount;

        // Count alerts in this province
        const alertCount = currentProximityData.filter(p =>
            p.project.provincia === nombre && p.glaciersInRadius > 0
        ).length;
        document.getElementById('provinceInfoAlertas').textContent = alertCount;
    }

    // ── Filter Change Handler ──────────────────────
    function onFilterChange(state) {
        const filteredGlaciares = Filters.filterGlaciares(GLACIARES_DATA);
        const filteredMineria = Filters.filterMineria(MINERIA_DATA);

        // Separate by type
        const glaciarsOnly = filteredGlaciares.filter(g => g.tipo === 'Glaciar');
        const periglacialOnly = filteredGlaciares.filter(g => g.tipo === 'Ambiente Periglacial');

        // Update map layers
        updateGlaciarMarkers(glaciarsOnly);
        updatePeriglacialMarkers(periglacialOnly);
        updateMineriaMarkers(filteredMineria);

        // Run spatial analysis
        const allGlaciares = filteredGlaciares;
        currentProximityData = SpatialAnalysis.runProximityAnalysis(filteredMineria, allGlaciares, state.proximityRadius);
        currentMineralAnalysis = SpatialAnalysis.mineralInGlacierZones(allGlaciares, filteredMineria, state.proximityRadius);

        // Update alerts
        updateAlerts(currentProximityData, state.proximityRadius);

        // Update counts
        const alertCount = currentProximityData.filter(p => p.glaciersInRadius > 0).length;
        document.getElementById('countGlaciares').textContent = `${glaciarsOnly.length} puntos`;
        document.getElementById('countPeriglacial').textContent = `${periglacialOnly.length} puntos`;
        document.getElementById('countMineria').textContent = `${filteredMineria.length} proyectos`;
        document.getElementById('countAlertas').textContent = `${alertCount} alertas`;

        // Update header stats
        const aggStats = SpatialAnalysis.getAggregateStats(allGlaciares, filteredMineria, GLACIARES_STATS, state.proximityRadius);
        document.getElementById('statTotalGlaciares').textContent = aggStats.totalGeoformas.toLocaleString();
        document.getElementById('statSuperficie').textContent = aggStats.totalSuperficie.toLocaleString();
        document.getElementById('statProyectos').textContent = filteredMineria.length;
        document.getElementById('statAlertas').textContent = alertCount;

        // Update metrics panel
        document.getElementById('metricGlaciaresTotal').textContent = aggStats.totalGlaciares.toLocaleString();
        document.getElementById('metricPeriglacialTotal').textContent = aggStats.totalPeriglacial.toLocaleString();
        document.getElementById('metricMineriaTotal').textContent = filteredMineria.length;
        document.getElementById('metricAlertasTotal').textContent = alertCount;
        document.getElementById('metricSupTotal').textContent = aggStats.totalSuperficie.toLocaleString();

        // Build stats object for charts (filtered if province selected)
        let chartStats = GLACIARES_STATS;
        if (state.provincia) {
            chartStats = {};
            if (GLACIARES_STATS[state.provincia]) {
                chartStats[state.provincia] = GLACIARES_STATS[state.provincia];
            }
        }

        // Update all charts
        DashboardCharts.updateAll(
            chartStats,
            filteredMineria,
            currentProximityData,
            currentMineralAnalysis
        );

        // Update province info bar if a province is selected
        if (state.provincia) {
            showProvinceInfo(state.provincia);
        }
    }

    // ── Glacier Markers ────────────────────────────
    function updateGlaciarMarkers(glaciars) {
        glaciarLayer.clearLayers();
        glaciars.forEach(g => {
            const marker = L.circleMarker([g.lat, g.lng], {
                radius: Math.max(3, Math.min(10, Math.sqrt(g.superficie_km2) * 2)),
                color: '#00d4ff',
                fillColor: '#00d4ff',
                fillOpacity: 0.6,
                weight: 1,
                className: 'glacier-marker'
            });

            marker.bindPopup(createGlacierPopup(g));
            marker.on('mouseover', function () { this.setStyle({ fillOpacity: 0.9, weight: 2 }); });
            marker.on('mouseout', function () { this.setStyle({ fillOpacity: 0.6, weight: 1 }); });
            glaciarLayer.addLayer(marker);
        });
    }

    // ── Periglacial Markers ────────────────────────
    function updatePeriglacialMarkers(periglaciars) {
        periglacialLayer.clearLayers();
        periglaciars.forEach(g => {
            const marker = L.circleMarker([g.lat, g.lng], {
                radius: Math.max(3, Math.min(8, Math.sqrt(g.superficie_km2) * 3)),
                color: '#a78bfa',
                fillColor: '#a78bfa',
                fillOpacity: 0.5,
                weight: 1,
            });

            marker.bindPopup(createGlacierPopup(g));
            marker.on('mouseover', function () { this.setStyle({ fillOpacity: 0.85, weight: 2 }); });
            marker.on('mouseout', function () { this.setStyle({ fillOpacity: 0.5, weight: 1 }); });
            periglacialLayer.addLayer(marker);
        });
    }

    // ── Mining Markers ─────────────────────────────
    function updateMineriaMarkers(projects) {
        mineriaLayer.clearLayers();
        projects.forEach(p => {
            const color = MINERAL_COLORS[p.mineral] || '#f59e0b';

            // Create a custom DivIcon for mining
            const icon = L.divIcon({
                className: 'mining-icon-wrapper',
                html: `<div style="
          width: 14px; height: 14px;
          background: ${color};
          border: 2px solid rgba(255,255,255,0.8);
          border-radius: 2px;
          transform: rotate(45deg);
          box-shadow: 0 0 8px ${color}80;
        "></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            });

            const marker = L.marker([p.lat, p.lng], { icon });
            marker.bindPopup(createMiningPopup(p));
            mineriaLayer.addLayer(marker);
        });
    }

    // ── Alert Rings ────────────────────────────────
    function updateAlerts(proximityData, radiusKm) {
        alertsLayer.clearLayers();
        const alertProjects = proximityData.filter(p => p.glaciersInRadius > 0);

        alertProjects.forEach(pd => {
            const color = pd.risk === 'critical' ? '#ef4444' :
                pd.risk === 'high' ? '#f59e0b' :
                    '#3b82f6';

            // Alert circle around mining project
            const circle = L.circle([pd.project.lat, pd.project.lng], {
                radius: radiusKm * 1000,
                color: color,
                fillColor: color,
                fillOpacity: 0.06,
                weight: 1.5,
                dashArray: '6, 4',
                className: 'proximity-alert-ring'
            });

            circle.bindPopup(createAlertPopup(pd));
            alertsLayer.addLayer(circle);

            // Draw line to nearest glacier
            if (pd.nearestGlacier) {
                const line = L.polyline(
                    [[pd.project.lat, pd.project.lng], [pd.nearestGlacier.lat, pd.nearestGlacier.lng]],
                    {
                        color: color,
                        weight: 1.5,
                        dashArray: '4, 6',
                        opacity: 0.6
                    }
                );
                alertsLayer.addLayer(line);
            }
        });
    }

    // ── Popup Builders ─────────────────────────────
    function createGlacierPopup(g) {
        const nearest = SpatialAnalysis.findNearestGlacier(
            { lat: g.lat, lng: g.lng },
            MINERIA_DATA
        );
        const nearestText = nearest.glacier
            ? `${nearest.glacier.nombre} (${nearest.distance_km} km)`
            : 'N/A';

        let alertHtml = '';
        if (nearest.distance_km <= Filters.state.proximityRadius) {
            alertHtml = `
        <div class="popup-alert">
          <i class="fa-solid fa-triangle-exclamation"></i>
          Proyecto minero a ${nearest.distance_km} km: ${nearest.glacier ? nearest.glacier.nombre : ''}
        </div>`;
        }

        const altitudHtml = g.altitud_max ? `
      <div class="popup-row"><span class="label">Altitud</span><span class="value">${g.altitud_min}–${g.altitud_max} m (media: ${g.altitud_media} m)</span></div>` : '';
        const slopeHtml = g.pendiente ? `
      <div class="popup-row"><span class="label">Pendiente</span><span class="value">${g.pendiente}° | Orient: ${g.orientacion || 'N/D'}</span></div>` : '';
        const subcuencaHtml = g.subcuenca ? `
      <div class="popup-row"><span class="label">Subcuenca</span><span class="value">${g.subcuenca}</span></div>` : '';

        return `<div class="popup-content">
      <h4 class="glacier-title"><i class="fa-solid fa-snowflake" style="margin-right:6px"></i>${g.nombre}</h4>
      <div class="popup-row"><span class="label">Tipo</span><span class="value">${g.tipo}</span></div>
      <div class="popup-row"><span class="label">Subtipo</span><span class="value">${g.subtipo}</span></div>
      <div class="popup-row"><span class="label">Provincia</span><span class="value">${g.provincia}</span></div>
      <div class="popup-row"><span class="label">Superficie</span><span class="value">${g.superficie_km2} km²</span></div>
      <div class="popup-row"><span class="label">Cuenca</span><span class="value">${g.cuenca}</span></div>
      ${subcuencaHtml}
      ${altitudHtml}
      ${slopeHtml}
      <div class="popup-row"><span class="label">Coordenadas</span><span class="value">${g.lat.toFixed(4)}, ${g.lng.toFixed(4)}</span></div>
      <div class="popup-row"><span class="label">Proy. minero cercano</span><span class="value">${nearestText}</span></div>
      ${alertHtml}
    </div>`;
    }

    function createMiningPopup(p) {
        const nearest = SpatialAnalysis.findNearestGlacier(p, GLACIARES_DATA);
        const nearestText = nearest.glacier
            ? `${nearest.glacier.nombre} (${nearest.distance_km} km)`
            : 'N/A';

        const glaciersNearby = SpatialAnalysis.findGlaciersInRadius(p, GLACIARES_DATA, Filters.state.proximityRadius);

        let alertHtml = '';
        if (glaciersNearby.length > 0) {
            alertHtml = `
        <div class="popup-alert">
          <i class="fa-solid fa-triangle-exclamation"></i>
          ${glaciersNearby.length} glaciar(es) dentro de ${Filters.state.proximityRadius} km
        </div>`;
        }

        return `<div class="popup-content">
      <h4 class="mining-title"><i class="fa-solid fa-gem" style="margin-right:6px"></i>${p.nombre}</h4>
      <div class="popup-row"><span class="label">Empresa</span><span class="value">${p.empresa}</span></div>
      <div class="popup-row"><span class="label">Mineral</span><span class="value" style="color: ${MINERAL_COLORS[p.mineral] || '#fff'}">${p.mineral}</span></div>
      <div class="popup-row"><span class="label">Etapa</span><span class="value">${p.estado}</span></div>
      <div class="popup-row"><span class="label">Provincia</span><span class="value">${p.provincia}</span></div>
      <div class="popup-row"><span class="label">Coordenadas</span><span class="value">${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}</span></div>
      <div class="popup-row"><span class="label">Glaciar más cercano</span><span class="value">${nearestText}</span></div>
      ${alertHtml}
    </div>`;
    }

    function createAlertPopup(pd) {
        const glaciersList = pd.glaciersInRadiusList.slice(0, 5)
            .map(g => `${g.nombre} (${g.distance_km} km)`)
            .join('<br>');

        return `<div class="popup-content">
      <h4 style="color: var(--danger)"><i class="fa-solid fa-triangle-exclamation" style="margin-right:6px"></i>Alerta de Proximidad</h4>
      <div class="popup-row"><span class="label">Proyecto</span><span class="value">${pd.project.nombre}</span></div>
      <div class="popup-row"><span class="label">Mineral</span><span class="value" style="color: ${MINERAL_COLORS[pd.project.mineral] || '#fff'}">${pd.project.mineral}</span></div>
      <div class="popup-row"><span class="label">Riesgo</span><span class="value" style="color: ${pd.risk === 'critical' ? '#ef4444' : pd.risk === 'high' ? '#f59e0b' : '#3b82f6'}">${pd.risk.toUpperCase()}</span></div>
      <div class="popup-row"><span class="label">Distancia mínima</span><span class="value">${pd.nearestDistance} km</span></div>
      <div class="popup-row"><span class="label">Glaciares en radio</span><span class="value">${pd.glaciersInRadius}</span></div>
      <div style="margin-top:8px; font-size:0.72rem; color: var(--text-muted)">
        <strong>Glaciares cercanos:</strong><br>${glaciersList}
      </div>
    </div>`;
    }

    // ── Mobile Navigation ──────────────────────────
    window.switchMobileView = function (btn) {
        // Update active class on buttons
        const navButtons = document.querySelectorAll('.mobile-nav .nav-btn');
        if (!navButtons.length) return; // Not in mobile view

        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Get target view ID
        const targetViewId = btn.getAttribute('data-view');

        // Hide all views
        document.getElementById('mapView').classList.remove('mobile-active');
        document.getElementById('sidebarView').classList.remove('mobile-active');
        document.getElementById('panelsView').classList.remove('mobile-active');

        // Show target view
        document.getElementById(targetViewId).classList.add('mobile-active');

        // Fix map rendering issues when unhiding
        if (targetViewId === 'mapView' && typeof map !== 'undefined') {
            setTimeout(() => map.invalidateSize(), 300);
        }

        // Window resize event helps Chart.js redraw properly
        window.dispatchEvent(new Event('resize'));
    };

})();
