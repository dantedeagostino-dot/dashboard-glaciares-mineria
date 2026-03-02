/**
 * GeoJSON simplificado de provincias argentinas con presencia de glaciares/minería
 * Puntos centrales para interacción del mapa
 */
const PROVINCIAS_CENTERS = {
    "Jujuy": { lat: -23.3, lng: -65.75, zoom: 8 },
    "Salta": { lat: -24.2, lng: -66.0, zoom: 7 },
    "Tucumán": { lat: -26.8, lng: -65.2, zoom: 9 },
    "Catamarca": { lat: -27.5, lng: -67.0, zoom: 8 },
    "La Rioja": { lat: -29.0, lng: -67.5, zoom: 8 },
    "San Juan": { lat: -30.5, lng: -69.5, zoom: 8 },
    "Mendoza": { lat: -34.0, lng: -69.5, zoom: 7 },
    "Neuquén": { lat: -38.5, lng: -70.5, zoom: 8 },
    "Río Negro": { lat: -40.8, lng: -68.0, zoom: 7 },
    "Chubut": { lat: -43.0, lng: -69.5, zoom: 7 },
    "Santa Cruz": { lat: -49.0, lng: -70.0, zoom: 7 },
    "Tierra del Fuego": { lat: -54.5, lng: -68.5, zoom: 8 },
};

/**
 * GeoJSON de provincias argentinas (bordes simplificados)
 * Solo las 12 provincias con presencia de glaciares
 */
const PROVINCIAS_GEOJSON = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { nombre: "Jujuy", id: "AR-Y" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-65.0, -21.78], [-66.7, -21.78], [-67.0, -22.1], [-67.3, -22.8], [-66.8, -23.4], [-66.5, -24.0], [-65.8, -24.5], [-65.0, -23.8], [-65.0, -21.78]]]
            }
        },
        {
            type: "Feature",
            properties: { nombre: "Salta", id: "AR-A" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-63.4, -22.0], [-65.0, -22.0], [-66.5, -22.0], [-68.5, -23.0], [-68.7, -24.5], [-68.3, -25.5], [-67.0, -26.0], [-65.5, -26.5], [-64.5, -26.0], [-63.8, -24.5], [-63.4, -22.0]]]
            }
        },
        {
            type: "Feature",
            properties: { nombre: "Tucumán", id: "AR-T" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-64.5, -26.0], [-65.5, -26.3], [-66.2, -26.5], [-66.3, -27.0], [-66.2, -27.5], [-65.5, -27.8], [-65.0, -27.5], [-64.5, -27.0], [-64.5, -26.0]]]
            }
        },
        {
            type: "Feature",
            properties: { nombre: "Catamarca", id: "AR-K" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-65.5, -26.5], [-67.0, -26.0], [-68.5, -25.5], [-69.0, -26.5], [-69.0, -28.0], [-68.5, -29.5], [-67.5, -29.5], [-66.5, -28.5], [-65.5, -28.0], [-65.5, -26.5]]]
            }
        },
        {
            type: "Feature",
            properties: { nombre: "La Rioja", id: "AR-F" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-66.5, -28.5], [-67.5, -28.5], [-68.5, -28.5], [-69.5, -29.0], [-69.5, -30.0], [-69.0, -31.0], [-67.5, -31.0], [-66.5, -30.0], [-66.0, -29.0], [-66.5, -28.5]]]
            }
        },
        {
            type: "Feature",
            properties: { nombre: "San Juan", id: "AR-J" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-67.5, -28.5], [-69.0, -28.5], [-70.0, -29.0], [-70.5, -30.0], [-70.5, -31.5], [-70.0, -32.5], [-69.0, -32.0], [-68.0, -31.5], [-67.5, -30.5], [-67.3, -29.5], [-67.5, -28.5]]]
            }
        },
        {
            type: "Feature",
            properties: { nombre: "Mendoza", id: "AR-M" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-67.0, -32.0], [-69.0, -32.0], [-70.0, -32.5], [-70.5, -33.0], [-70.5, -35.0], [-70.0, -36.5], [-69.5, -37.0], [-68.0, -37.5], [-67.0, -36.5], [-66.5, -35.0], [-66.5, -33.5], [-67.0, -32.0]]]
            }
        },
        {
            type: "Feature",
            properties: { nombre: "Neuquén", id: "AR-Q" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-68.0, -36.0], [-69.5, -36.5], [-70.5, -37.0], [-71.5, -37.5], [-71.5, -39.0], [-71.0, -40.0], [-70.5, -40.5], [-69.0, -40.0], [-68.0, -39.5], [-68.0, -36.0]]]
            }
        },
        {
            type: "Feature",
            properties: { nombre: "Río Negro", id: "AR-R" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-63.0, -39.0], [-68.0, -39.0], [-69.0, -39.5], [-70.5, -40.0], [-71.5, -40.5], [-72.0, -41.5], [-71.0, -42.0], [-65.0, -42.0], [-63.0, -41.0], [-63.0, -39.0]]]
            }
        },
        {
            type: "Feature",
            properties: { nombre: "Chubut", id: "AR-U" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-63.5, -42.0], [-71.0, -42.0], [-72.0, -42.5], [-72.0, -44.5], [-71.5, -45.5], [-71.0, -46.0], [-65.0, -46.0], [-63.5, -45.5], [-63.5, -42.0]]]
            }
        },
        {
            type: "Feature",
            properties: { nombre: "Santa Cruz", id: "AR-Z" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-65.0, -46.0], [-71.0, -46.0], [-72.0, -47.0], [-73.5, -49.0], [-73.0, -51.0], [-72.0, -52.0], [-69.0, -52.5], [-68.5, -52.0], [-65.5, -52.0], [-65.0, -51.0], [-65.0, -46.0]]]
            }
        },
        {
            type: "Feature",
            properties: { nombre: "Tierra del Fuego", id: "AR-V" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-65.0, -52.5], [-68.5, -52.5], [-69.5, -53.0], [-70.0, -54.0], [-69.5, -55.0], [-68.0, -55.5], [-66.5, -55.0], [-65.0, -54.5], [-65.0, -52.5]]]
            }
        }
    ]
};
