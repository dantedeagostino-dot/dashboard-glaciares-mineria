/**
 * Spatial Analysis Engine
 * Haversine distance, proximity detection, overlap analysis
 */

const SpatialAnalysis = {
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

    /**
     * Find the nearest glacier to a mining project
     * @returns {object} { glacier, distance_km }
     */
    findNearestGlacier(project, glaciers) {
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
     * Find all glaciers within a given radius of a mining project
     * @param {object} project
     * @param {array} glaciers
     * @param {number} radiusKm
     * @returns {array} glaciers within radius with distance
     */
    findGlaciersInRadius(project, glaciers, radiusKm) {
        const results = [];
        for (const g of glaciers) {
            const d = this.haversineDistance(project.lat, project.lng, g.lat, g.lng);
            if (d <= radiusKm) {
                results.push({ ...g, distance_km: Math.round(d * 10) / 10 });
            }
        }
        return results.sort((a, b) => a.distance_km - b.distance_km);
    },

    /**
     * Run full proximity analysis
     * For each mining project, find nearest glacier and classify proximity
     */
    runProximityAnalysis(miningProjects, glaciers, radiusKm) {
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
     * For each glacier, find the nearest mining project and its mineral
     */
    mineralInGlacierZones(glaciers, miningProjects, radiusKm) {
        const mineralCounts = {};
        const glaciersWithMineral = [];

        for (const g of glaciers) {
            let nearestProject = null;
            let minDist = Infinity;

            for (const p of miningProjects) {
                const d = this.haversineDistance(g.lat, g.lng, p.lat, p.lng);
                if (d < minDist) {
                    minDist = d;
                    nearestProject = p;
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
     */
    getAggregateStats(glaciares, mineria, stats, radiusKm) {
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

        // Proximity analysis
        const proximity = this.runProximityAnalysis(mineria, glaciares, radiusKm);
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
