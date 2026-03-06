/**
 * Spatial Analysis Engine — Optimized
 * Grid-based spatial index + memoization for O(1) cell lookups
 * instead of O(n*m) brute-force Haversine scans.
 */

const SpatialAnalysis = {
    // ── Internal State ─────────────────────────────
    _spatialIndex: null,     // Map<cellKey, glacier[]>
    _indexedGlaciers: null,  // reference equality check
    _cellSize: 0.5,          // degrees (~55km at -35° lat)
    _proximityCache: new Map(),
    _nearestCache: new Map(),

    // ── Core Math ──────────────────────────────────

    /** Haversine distance in km between two lat/lng points */
    haversineDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = this._toRad(lat2 - lat1);
        const dLng = this._toRad(lng2 - lng1);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(this._toRad(lat1)) * Math.cos(this._toRad(lat2)) *
            Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    },

    _toRad(deg) { return deg * Math.PI / 180; },

    // ── Spatial Index ──────────────────────────────

    /** Build grid-based spatial index for fast proximity queries */
    buildSpatialIndex(glaciers) {
        // Skip rebuild if same dataset (reference equality)
        if (this._indexedGlaciers === glaciers && this._spatialIndex) return;

        const index = new Map();
        for (const g of glaciers) {
            const key = this._getCellKey(g.lat, g.lng);
            if (!index.has(key)) index.set(key, []);
            index.get(key).push(g);
        }

        this._spatialIndex = index;
        this._indexedGlaciers = glaciers;
        this.clearCache();
    },

    /** Get the grid cell key for a point */
    _getCellKey(lat, lng) {
        const cellLat = Math.floor(lat / this._cellSize);
        const cellLng = Math.floor(lng / this._cellSize);
        return `${cellLat},${cellLng}`;
    },

    /** Get all glaciers in neighboring cells within radius */
    _getNearbyCandidates(lat, lng, radiusKm) {
        if (!this._spatialIndex) return [];

        // Convert radius to approximate cell range
        // At worst case (equator), 1° ≈ 111km. At -50° lat, 1° lng ≈ 71km
        const cellsNeeded = Math.ceil(radiusKm / (this._cellSize * 71)) + 1;
        const centerCellLat = Math.floor(lat / this._cellSize);
        const centerCellLng = Math.floor(lng / this._cellSize);

        const candidates = [];
        for (let dLat = -cellsNeeded; dLat <= cellsNeeded; dLat++) {
            for (let dLng = -cellsNeeded; dLng <= cellsNeeded; dLng++) {
                const key = `${centerCellLat + dLat},${centerCellLng + dLng}`;
                const cell = this._spatialIndex.get(key);
                if (cell) {
                    for (const g of cell) candidates.push(g);
                }
            }
        }
        return candidates;
    },

    /** Clear memoization caches (call when filters change) */
    clearCache() {
        this._proximityCache.clear();
        this._nearestCache.clear();
    },

    // ── Public API ─────────────────────────────────

    /**
     * Find the nearest glacier to a point (mining project or glacier)
     * Uses spatial index — scans only nearby cells instead of all glaciers
     * @returns {object} { glacier, distance_km }
     */
    findNearestGlacier(project, glaciers) {
        // Use spatial index if available and matches
        const useIndex = (this._indexedGlaciers === glaciers && this._spatialIndex);

        if (useIndex) {
            // Check cache
            const cacheKey = `${project.lat},${project.lng}`;
            if (this._nearestCache.has(cacheKey)) {
                return this._nearestCache.get(cacheKey);
            }

            // Progressive search: start narrow, expand if needed
            let nearest = null;
            let minDist = Infinity;

            // Start with nearby candidates (50km radius covers most cases)
            let searchRadius = 50;
            let candidates = this._getNearbyCandidates(project.lat, project.lng, searchRadius);

            // If no candidates nearby, expand search
            if (candidates.length === 0) {
                searchRadius = 200;
                candidates = this._getNearbyCandidates(project.lat, project.lng, searchRadius);
            }
            if (candidates.length === 0) {
                // Fallback: full scan (rare edge case)
                candidates = glaciers;
            }

            for (const g of candidates) {
                const d = this.haversineDistance(project.lat, project.lng, g.lat, g.lng);
                if (d < minDist) {
                    minDist = d;
                    nearest = g;
                }
            }

            const result = { glacier: nearest, distance_km: Math.round(minDist * 10) / 10 };
            this._nearestCache.set(cacheKey, result);
            return result;
        }

        // Fallback: brute force (no index)
        let nearest = null;
        let minDist = Infinity;
        for (const g of glaciers) {
            const d = this.haversineDistance(project.lat, project.lng, g.lat, g.lng);
            if (d < minDist) {
                minDist = d;
                nearest = g;
            }
        }
        return { glacier: nearest, distance_km: Math.round(minDist * 10) / 10 };
    },

    /**
     * Find all glaciers within a given radius of a point
     * Uses spatial index to avoid scanning distant glaciers
     */
    findGlaciersInRadius(project, glaciers, radiusKm) {
        const useIndex = (this._indexedGlaciers === glaciers && this._spatialIndex);

        // Check cache
        if (useIndex) {
            const cacheKey = `${project.lat},${project.lng},${radiusKm}`;
            if (this._proximityCache.has(cacheKey)) {
                return this._proximityCache.get(cacheKey);
            }
        }

        // Get candidates from spatial index or full list
        const candidates = useIndex
            ? this._getNearbyCandidates(project.lat, project.lng, radiusKm)
            : glaciers;

        const results = [];
        for (const g of candidates) {
            const d = this.haversineDistance(project.lat, project.lng, g.lat, g.lng);
            if (d <= radiusKm) {
                results.push({ ...g, distance_km: Math.round(d * 10) / 10 });
            }
        }
        results.sort((a, b) => a.distance_km - b.distance_km);

        if (useIndex) {
            const cacheKey = `${project.lat},${project.lng},${radiusKm}`;
            this._proximityCache.set(cacheKey, results);
        }

        return results;
    },

    /**
     * Run full proximity analysis
     * For each mining project, find nearest glacier and classify proximity
     */
    runProximityAnalysis(miningProjects, glaciers, radiusKm) {
        // Build/rebuild spatial index for glaciers
        this.buildSpatialIndex(glaciers);

        const results = [];
        for (const project of miningProjects) {
            const nearest = this.findNearestGlacier(project, glaciers);
            const inRadius = this.findGlaciersInRadius(project, glaciers, radiusKm);
            // Neutral proximity categories (no risk connotation)
            const proximityCategory = nearest.distance_km <= 10 ? 'inmediata' :
                nearest.distance_km <= 25 ? 'cercana' :
                    nearest.distance_km <= 50 ? 'media' : 'lejana';

            results.push({
                project,
                nearestGlacier: nearest.glacier,
                nearestDistance: nearest.distance_km,
                glaciersInRadius: inRadius.length,
                glaciersInRadiusList: inRadius,
                proximityCategory
            });
        }
        return results.sort((a, b) => a.nearestDistance - b.nearestDistance);
    },

    /**
     * Analyze what minerals are present near glaciers
     * Uses reverse spatial index: index mining projects, query per glacier
     */
    mineralInGlacierZones(glaciers, miningProjects, radiusKm) {
        // Build a temporary spatial index for mining projects
        const miningIndex = new Map();
        for (const p of miningProjects) {
            const key = this._getCellKey(p.lat, p.lng);
            if (!miningIndex.has(key)) miningIndex.set(key, []);
            miningIndex.get(key).push(p);
        }

        const cellsNeeded = Math.ceil(radiusKm / (this._cellSize * 71)) + 1;

        const mineralCounts = {};
        const glaciersWithMineral = [];

        for (const g of glaciers) {
            const centerCellLat = Math.floor(g.lat / this._cellSize);
            const centerCellLng = Math.floor(g.lng / this._cellSize);

            // Gather candidate mining projects from nearby cells
            let nearestProject = null;
            let minDist = Infinity;

            for (let dLat = -cellsNeeded; dLat <= cellsNeeded; dLat++) {
                for (let dLng = -cellsNeeded; dLng <= cellsNeeded; dLng++) {
                    const key = `${centerCellLat + dLat},${centerCellLng + dLng}`;
                    const cell = miningIndex.get(key);
                    if (!cell) continue;
                    for (const p of cell) {
                        const d = this.haversineDistance(g.lat, g.lng, p.lat, p.lng);
                        if (d < minDist) {
                            minDist = d;
                            nearestProject = p;
                        }
                    }
                }
            }

            if (nearestProject && minDist <= radiusKm) {
                const mineral = nearestProject.mineral;
                mineralCounts[mineral] = (mineralCounts[mineral] || 0) + 1;
                glaciersWithMineral.push({
                    glacier: g,
                    nearestMiningProject: nearestProject,
                    mineral: mineral,
                    distance_km: Math.round(minDist * 10) / 10
                });
            }
        }

        // Calculate percentages
        const total = glaciersWithMineral.length;
        const mineralPercentages = {};
        for (const [mineral, count] of Object.entries(mineralCounts)) {
            mineralPercentages[mineral] = {
                count,
                percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0
            };
        }

        // Sort by count for ranking
        const ranking = Object.entries(mineralPercentages)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([mineral, data], index) => ({
                rank: index + 1,
                mineral,
                ...data
            }));

        return {
            totalGlaciersAnalyzed: glaciers.length,
            glaciersWithNearbyMining: total,
            percentageWithMining: total > 0 ? Math.round((total / glaciers.length) * 1000) / 10 : 0,
            mineralCounts,
            mineralPercentages,
            ranking,
            details: glaciersWithMineral
        };
    },

    /**
     * Calculate aggregate stats using the ING statistics
     * OPTIMIZED: receives pre-computed proximity data to avoid duplicate calculation
     */
    getAggregateStats(glaciares, mineria, stats, radiusKm, precomputedProximity) {
        // Total from ING stats
        let totalGeoformas = 0;
        let totalSuperficie = 0;
        let totalGlaciares = 0;
        let totalPeriglacial = 0;

        for (const [prov, s] of Object.entries(stats)) {
            totalGeoformas += s.total_geoformas;
            totalSuperficie += s.superficie_km2;
            totalGlaciares += s.glaciares;
            totalPeriglacial += s.periglacial;
        }

        // Use pre-computed proximity if available, otherwise compute
        const proximity = precomputedProximity || this.runProximityAnalysis(mineria, glaciares, radiusKm);
        const proximityCount = proximity.filter(p => p.glaciersInRadius > 0).length;

        return {
            totalGeoformas,
            totalSuperficie,
            totalGlaciares,
            totalPeriglacial,
            totalProyectos: mineria.length,
            proximityCount,
            proximity
        };
    }
};
