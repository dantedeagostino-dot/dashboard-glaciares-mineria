/**
 * Charts Module - Chart.js based visualizations
 */

const DashboardCharts = {
    charts: {},

    // Chart.js defaults for dark theme
    defaults: {
        color: '#94a3b8',
        borderColor: 'rgba(148, 163, 184, 0.1)',
        font: { family: "'Inter', sans-serif", size: 11 },
    },

    init() {
        Chart.defaults.color = this.defaults.color;
        Chart.defaults.borderColor = this.defaults.borderColor;
        Chart.defaults.font.family = this.defaults.font.family;
        Chart.defaults.font.size = this.defaults.font.size;
        Chart.defaults.plugins.legend.labels.boxWidth = 10;
        Chart.defaults.plugins.legend.labels.padding = 8;
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
    },

    /** Destroy and recreate a chart */
    _updateChart(id, config) {
        if (this.charts[id]) {
            this.charts[id].destroy();
        }
        const ctx = document.getElementById(id);
        if (!ctx) return;
        this.charts[id] = new Chart(ctx, config);
    },

    /** Geoformas by Province (horizontal bar) */
    updateGlaciaresProvince(stats) {
        const entries = Object.entries(stats).sort((a, b) => b[1].total_geoformas - a[1].total_geoformas);
        const labels = entries.map(e => e[0]);
        const glaciares = entries.map(e => e[1].glaciares);
        const periglacial = entries.map(e => e[1].periglacial);

        this._updateChart('chartGlaciaresProvince', {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Glaciares',
                        data: glaciares,
                        backgroundColor: 'rgba(0, 212, 255, 0.7)',
                        borderColor: 'rgba(0, 212, 255, 1)',
                        borderWidth: 1,
                        borderRadius: 3,
                    },
                    {
                        label: 'Amb. Periglacial',
                        data: periglacial,
                        backgroundColor: 'rgba(167, 139, 250, 0.5)',
                        borderColor: 'rgba(167, 139, 250, 1)',
                        borderWidth: 1,
                        borderRadius: 3,
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { font: { size: 10 } } }
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: { color: 'rgba(148,163,184,0.06)' },
                        ticks: { font: { family: "'JetBrains Mono', monospace", size: 10 } }
                    },
                    y: {
                        stacked: true,
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });
    },

    /** Surface Area by Province */
    updateSuperficieProvince(stats) {
        const entries = Object.entries(stats).sort((a, b) => b[1].superficie_km2 - a[1].superficie_km2);
        const labels = entries.map(e => e[0]);
        const data = entries.map(e => e[1].superficie_km2);

        this._updateChart('chartSuperficieProvince', {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'km²',
                    data,
                    backgroundColor: data.map((v, i) => {
                        const hue = 195 - (i / data.length) * 30;
                        return `hsla(${hue}, 85%, 55%, 0.7)`;
                    }),
                    borderColor: data.map((v, i) => {
                        const hue = 195 - (i / data.length) * 30;
                        return `hsla(${hue}, 85%, 55%, 1)`;
                    }),
                    borderWidth: 1,
                    borderRadius: 3,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { color: 'rgba(148,163,184,0.06)' },
                        ticks: {
                            font: { family: "'JetBrains Mono', monospace", size: 10 },
                            callback: v => v.toLocaleString() + ' km²'
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });
    },

    /** Mining Projects by Province */
    updateMineriaProvince(projects) {
        const counts = {};
        projects.forEach(p => {
            counts[p.provincia] = (counts[p.provincia] || 0) + 1;
        });
        const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

        this._updateChart('chartMineriaProvince', {
            type: 'bar',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{
                    label: 'Proyectos',
                    data: entries.map(e => e[1]),
                    backgroundColor: 'rgba(245, 158, 11, 0.7)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    borderWidth: 1,
                    borderRadius: 3,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { color: 'rgba(148,163,184,0.06)' },
                        ticks: {
                            font: { family: "'JetBrains Mono', monospace", size: 10 },
                            stepSize: 2
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });
    },

    /** Mining projects by stage */
    updateMineriaEtapa(projects) {
        const counts = {};
        projects.forEach(p => {
            const short = p.estado.replace('Evaluación económica preliminar', 'Evaluación');
            counts[short] = (counts[short] || 0) + 1;
        });
        const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

        const colors = [
            '#27ae60', '#f39c12', '#3498db', '#9b59b6',
            '#e67e22', '#1abc9c', '#95a5a6', '#e74c3c'
        ];

        this._updateChart('chartMineriaEtapa', {
            type: 'doughnut',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{
                    data: entries.map(e => e[1]),
                    backgroundColor: colors.slice(0, entries.length).map(c => c + 'cc'),
                    borderColor: colors.slice(0, entries.length),
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '55%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { font: { size: 9 }, padding: 6 }
                    }
                }
            }
        });
    },

    /** Proximity chart - projects nearest to glaciers */
    updateProximidad(proximityData) {
        const top15 = proximityData.slice(0, 15);

        const bgColors = top15.map(p => {
            switch (p.risk) {
                case 'critical': return 'rgba(239, 68, 68, 0.7)';
                case 'high': return 'rgba(245, 158, 11, 0.7)';
                case 'medium': return 'rgba(59, 130, 246, 0.7)';
                default: return 'rgba(16, 185, 129, 0.5)';
            }
        });

        this._updateChart('chartProximidad', {
            type: 'bar',
            data: {
                labels: top15.map(p => p.project.nombre),
                datasets: [{
                    label: 'Distancia al glaciar más cercano (km)',
                    data: top15.map(p => p.nearestDistance),
                    backgroundColor: bgColors,
                    borderColor: bgColors.map(c => c.replace('0.7', '1').replace('0.5', '1')),
                    borderWidth: 1,
                    borderRadius: 3,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { color: 'rgba(148,163,184,0.06)' },
                        ticks: {
                            font: { family: "'JetBrains Mono', monospace", size: 10 },
                            callback: v => v + ' km'
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 9 } }
                    }
                }
            }
        });
    },

    /** Mineral in glacier zones - Doughnut */
    updateMineralGlaciar(mineralAnalysis) {
        const ranking = mineralAnalysis.ranking;
        if (!ranking.length) return;

        const mineralColorMap = {
            'Cobre': '#e67e22', 'Oro': '#f1c40f', 'Plata': '#bdc3c7',
            'Litio': '#00d2ff', 'Uranio': '#27ae60', 'Potasio': '#e74c3c',
            'Hierro': '#8b4513', 'Plomo': '#7f8c8d', 'Carbón': '#2c3e50',
            'Au aluvional': '#daa520'
        };

        this._updateChart('chartMineralGlaciar', {
            type: 'doughnut',
            data: {
                labels: ranking.map(r => r.mineral),
                datasets: [{
                    data: ranking.map(r => r.count),
                    backgroundColor: ranking.map(r => (mineralColorMap[r.mineral] || '#666') + 'cc'),
                    borderColor: ranking.map(r => mineralColorMap[r.mineral] || '#666'),
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '55%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { font: { size: 9 }, padding: 6 }
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => {
                                const r = ranking[ctx.dataIndex];
                                return `${r.mineral}: ${r.count} glaciares (${r.percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    /** Glaciers associated with each mineral (bar) */
    updateGlaciaresPorMineral(mineralAnalysis) {
        const ranking = mineralAnalysis.ranking;
        if (!ranking.length) return;

        const mineralColorMap = {
            'Cobre': '#e67e22', 'Oro': '#f1c40f', 'Plata': '#bdc3c7',
            'Litio': '#00d2ff', 'Uranio': '#27ae60', 'Potasio': '#e74c3c',
            'Hierro': '#8b4513', 'Plomo': '#7f8c8d', 'Carbón': '#2c3e50',
            'Au aluvional': '#daa520'
        };

        this._updateChart('chartGlaciaresPorMineral', {
            type: 'bar',
            data: {
                labels: ranking.map(r => r.mineral),
                datasets: [
                    {
                        label: 'Glaciares asociados',
                        data: ranking.map(r => r.count),
                        backgroundColor: ranking.map(r => (mineralColorMap[r.mineral] || '#666') + 'aa'),
                        borderColor: ranking.map(r => mineralColorMap[r.mineral] || '#666'),
                        borderWidth: 1,
                        borderRadius: 4,
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => {
                                const r = ranking[ctx.dataIndex];
                                return `${r.count} glaciares (${r.percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(148,163,184,0.06)' },
                        ticks: { font: { family: "'JetBrains Mono', monospace", size: 10 } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });
    },

    /** Mineral ranking horizontal bar with percentage */
    updateMineralRanking(mineralAnalysis) {
        const ranking = mineralAnalysis.ranking;
        if (!ranking.length) return;

        const mineralColorMap = {
            'Cobre': '#e67e22', 'Oro': '#f1c40f', 'Plata': '#bdc3c7',
            'Litio': '#00d2ff', 'Uranio': '#27ae60', 'Potasio': '#e74c3c',
            'Hierro': '#8b4513', 'Plomo': '#7f8c8d', 'Carbón': '#2c3e50',
            'Au aluvional': '#daa520'
        };

        this._updateChart('chartMineralRanking', {
            type: 'bar',
            data: {
                labels: ranking.map(r => `#${r.rank} ${r.mineral}`),
                datasets: [{
                    label: '% de glaciares',
                    data: ranking.map(r => r.percentage),
                    backgroundColor: ranking.map(r => (mineralColorMap[r.mineral] || '#666') + 'aa'),
                    borderColor: ranking.map(r => mineralColorMap[r.mineral] || '#666'),
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { color: 'rgba(148,163,184,0.06)' },
                        ticks: {
                            font: { family: "'JetBrains Mono', monospace", size: 10 },
                            callback: v => v + '%'
                        },
                        max: 100
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });
    },

    /** Update all charts with current data */
    updateAll(stats, filteredMineria, proximityData, mineralAnalysis) {
        this.updateGlaciaresProvince(stats);
        this.updateSuperficieProvince(stats);
        this.updateMineriaProvince(filteredMineria);
        this.updateMineriaEtapa(filteredMineria);
        this.updateProximidad(proximityData);
        this.updateMineralGlaciar(mineralAnalysis);
        this.updateGlaciaresPorMineral(mineralAnalysis);
        this.updateMineralRanking(mineralAnalysis);
    }
};
