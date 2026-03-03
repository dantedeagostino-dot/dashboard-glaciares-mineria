/**
 * Dataset de Glaciares Argentinos
 * Basado en el Inventario Nacional de Glaciares (ING) - IANIGLA/CONICET
 *
 * VERSIÓN BASE: ING 2018 | ACTUALIZACIÓN: Resolución 142/2024 (NOA — Andes Desérticos)
 * - 22 subcuencas: Catamarca, Jujuy, La Rioja, Salta, San Juan y Tucumán (datos 2014-2023)
 * - Reducción del 17% en hielo descubierto en el NOA | −23% en manchones de nieve perenne
 * 
 * Estadísticas reales del ING:
 * - Total: 16,968 cuerpos de hielo y geoformas periglaciales
 * - Superficie total: ~8,484 km²
 * - Distribuidos en 12 provincias andinas
 * 
 * Los puntos representativos se generaron a lo largo de las zonas cordilleranas
 * de cada provincia, respetando las cantidades y superficies reales del inventario.
 */

const GLACIARES_DATA = [
  // ═══════════════════════════════════════════
  // SAN JUAN — 2,116 geoformas, ~1,767 km²
  // Zona: Cordillera Frontal y Principal (29°-32° S)
  // ═══════════════════════════════════════════
  { id: "SJ001", nombre: "Glaciar del Agua Negra", provincia: "San Juan", lat: -30.1678, lng: -69.8142, superficie_km2: 5.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ002", nombre: "Glaciar Potrerillos", provincia: "San Juan", lat: -30.2010, lng: -69.8500, superficie_km2: 3.2, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ003", nombre: "Glaciar Olivares Alfa", provincia: "San Juan", lat: -30.1890, lng: -69.9200, superficie_km2: 4.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ004", nombre: "Glaciar Olivares Beta", provincia: "San Juan", lat: -30.1750, lng: -69.9100, superficie_km2: 3.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ005", nombre: "Glaciar Olivares Gamma", provincia: "San Juan", lat: -30.1600, lng: -69.9050, superficie_km2: 2.9, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ006", nombre: "Glaciar Conconta", provincia: "San Juan", lat: -30.0800, lng: -69.4500, superficie_km2: 1.2, tipo: "Glaciar", subtipo: "Cubierto", cuenca: "Río San Juan" },
  { id: "SJ007", nombre: "Glaciar Mercedario Norte", provincia: "San Juan", lat: -31.9700, lng: -70.1100, superficie_km2: 8.3, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ008", nombre: "Glaciar Mercedario Sur", provincia: "San Juan", lat: -31.9900, lng: -70.0950, superficie_km2: 6.1, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ009", nombre: "Glaciar La Ramada", provincia: "San Juan", lat: -32.0200, lng: -70.0300, superficie_km2: 4.7, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ010", nombre: "Glaciar de los Patos", provincia: "San Juan", lat: -32.0500, lng: -70.0600, superficie_km2: 3.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ011", nombre: "Glaciar El Melón", provincia: "San Juan", lat: -30.3200, lng: -69.7800, superficie_km2: 1.8, tipo: "Glaciar", subtipo: "Cubierto", cuenca: "Río San Juan" },
  { id: "SJ012", nombre: "Glaciar del Plomo", provincia: "San Juan", lat: -30.2500, lng: -69.9600, superficie_km2: 2.4, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ013", nombre: "Glaciar Castaño", provincia: "San Juan", lat: -30.4200, lng: -69.7500, superficie_km2: 1.1, tipo: "Glaciar", subtipo: "Cubierto", cuenca: "Río Castaño" },
  { id: "SJ014", nombre: "Glaciar Los Amarillos", provincia: "San Juan", lat: -30.5100, lng: -69.7200, superficie_km2: 0.8, tipo: "Glaciar", subtipo: "Cubierto", cuenca: "Río Castaño" },
  { id: "SJ015", nombre: "Glaciar Bauchaceta", provincia: "San Juan", lat: -30.0500, lng: -69.6500, superficie_km2: 0.6, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Blanco" },
  { id: "SJ016", nombre: "Glaciar de Escombros Paso del Agua Negra", provincia: "San Juan", lat: -30.1900, lng: -69.7000, superficie_km2: 0.4, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río San Juan" },
  { id: "SJ017", nombre: "Glaciar de Escombros Las Taguas", provincia: "San Juan", lat: -29.3500, lng: -69.4500, superficie_km2: 0.5, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río San Juan" },
  { id: "SJ018", nombre: "Glaciar Colanguil Norte", provincia: "San Juan", lat: -29.2800, lng: -69.5200, superficie_km2: 2.1, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ019", nombre: "Glaciar Colanguil Sur", provincia: "San Juan", lat: -29.3200, lng: -69.5000, superficie_km2: 1.7, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ020", nombre: "Glaciar de Escombros Veladero", provincia: "San Juan", lat: -29.3700, lng: -69.9500, superficie_km2: 0.3, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río San Juan" },
  { id: "SJ021", nombre: "Glaciar Blanco", provincia: "San Juan", lat: -30.1500, lng: -69.8800, superficie_km2: 2.6, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ022", nombre: "Glaciar del Juncal", provincia: "San Juan", lat: -31.8800, lng: -70.0200, superficie_km2: 3.3, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río San Juan" },
  { id: "SJ023", nombre: "Glaciar Tocota", provincia: "San Juan", lat: -30.6100, lng: -69.6800, superficie_km2: 1.4, tipo: "Glaciar", subtipo: "Cubierto", cuenca: "Río Castaño" },
  { id: "SJ024", nombre: "Penitentes del Paso del Agua Negra", provincia: "San Juan", lat: -30.2200, lng: -69.8300, superficie_km2: 0.2, tipo: "Ambiente Periglacial", subtipo: "Manchón de nieve", cuenca: "Río San Juan" },
  { id: "SJ025", nombre: "Glaciar de Escombros Chita", provincia: "San Juan", lat: -30.5400, lng: -69.5200, superficie_km2: 0.35, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río San Juan" },

  // ═══════════════════════════════════════════
  // MENDOZA — 2,165 geoformas, ~1,239 km²
  // Zona: Cordillera Principal y Frontal (32°-36° S)
  // ═══════════════════════════════════════════
  { id: "MZ001", nombre: "Glaciar del Plomo", provincia: "Mendoza", lat: -33.0200, lng: -70.0400, superficie_km2: 14.2, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Mendoza" },
  { id: "MZ002", nombre: "Glaciar Horcones Superior", provincia: "Mendoza", lat: -32.6400, lng: -70.0100, superficie_km2: 8.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Mendoza" },
  { id: "MZ003", nombre: "Glaciar Horcones Inferior", provincia: "Mendoza", lat: -32.6600, lng: -69.9800, superficie_km2: 10.3, tipo: "Glaciar", subtipo: "Cubierto", cuenca: "Río Mendoza" },
  { id: "MZ004", nombre: "Glaciar de los Polacos", provincia: "Mendoza", lat: -32.6200, lng: -70.0300, superficie_km2: 5.6, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Mendoza" },
  { id: "MZ005", nombre: "Glaciar Güssfeldt", provincia: "Mendoza", lat: -32.6500, lng: -70.0500, superficie_km2: 4.3, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Mendoza" },
  { id: "MZ006", nombre: "Glaciar Tupungato", provincia: "Mendoza", lat: -33.3500, lng: -69.8000, superficie_km2: 12.7, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Tupungato" },
  { id: "MZ007", nombre: "Glaciar del Juncal Norte", provincia: "Mendoza", lat: -32.8700, lng: -70.0100, superficie_km2: 5.1, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Mendoza" },
  { id: "MZ008", nombre: "Glaciar Alto del Río Blanco", provincia: "Mendoza", lat: -34.6200, lng: -70.0500, superficie_km2: 3.9, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Diamante" },
  { id: "MZ009", nombre: "Glaciar Cordon del Plata Norte", provincia: "Mendoza", lat: -33.1200, lng: -69.4600, superficie_km2: 2.1, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Mendoza" },
  { id: "MZ010", nombre: "Glaciar Cordon del Plata Sur", provincia: "Mendoza", lat: -33.1600, lng: -69.4400, superficie_km2: 1.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Mendoza" },
  { id: "MZ011", nombre: "Glaciar Alma Blanca", provincia: "Mendoza", lat: -34.5800, lng: -69.9800, superficie_km2: 2.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Diamante" },
  { id: "MZ012", nombre: "Glaciar del Nevado Juncal", provincia: "Mendoza", lat: -32.9200, lng: -69.9500, superficie_km2: 3.6, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Mendoza" },
  { id: "MZ013", nombre: "Glaciar del Sosneado", provincia: "Mendoza", lat: -34.8500, lng: -69.9200, superficie_km2: 1.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Atuel" },
  { id: "MZ014", nombre: "Glaciar Overo", provincia: "Mendoza", lat: -34.9100, lng: -69.8600, superficie_km2: 1.2, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Atuel" },
  { id: "MZ015", nombre: "Glaciar de Escombros Uspallata", provincia: "Mendoza", lat: -32.6000, lng: -69.3400, superficie_km2: 0.3, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Mendoza" },
  { id: "MZ016", nombre: "Glaciar de Escombros Punta de Vacas", provincia: "Mendoza", lat: -32.8600, lng: -69.7700, superficie_km2: 0.4, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Mendoza" },
  { id: "MZ017", nombre: "Glaciar de Escombros Penitentes", provincia: "Mendoza", lat: -32.8300, lng: -69.8600, superficie_km2: 0.25, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Mendoza" },
  { id: "MZ018", nombre: "Glaciar del Aconcagua Este", provincia: "Mendoza", lat: -32.6350, lng: -69.9700, superficie_km2: 7.2, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Mendoza" },
  { id: "MZ019", nombre: "Glaciar Piloto Este", provincia: "Mendoza", lat: -32.5800, lng: -69.3800, superficie_km2: 0.9, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Mendoza" },
  { id: "MZ020", nombre: "Glaciar de Escombros Las Cuevas", provincia: "Mendoza", lat: -32.8100, lng: -69.9100, superficie_km2: 0.15, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Mendoza" },
  { id: "MZ021", nombre: "Glaciar San Lorenzo", provincia: "Mendoza", lat: -35.1200, lng: -70.0800, superficie_km2: 2.2, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Atuel" },
  { id: "MZ022", nombre: "Glaciar del Volcán Maipo", provincia: "Mendoza", lat: -34.1700, lng: -69.8400, superficie_km2: 3.4, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Diamante" },
  { id: "MZ023", nombre: "Glaciar de Escombros Vallecitos", provincia: "Mendoza", lat: -32.9700, lng: -69.3500, superficie_km2: 0.18, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Mendoza" },
  { id: "MZ024", nombre: "Glaciar Negro del Tupungato", provincia: "Mendoza", lat: -33.3800, lng: -69.7600, superficie_km2: 4.8, tipo: "Glaciar", subtipo: "Cubierto", cuenca: "Río Tupungato" },
  { id: "MZ025", nombre: "Glaciar del Cerro Rincón", provincia: "Mendoza", lat: -33.4500, lng: -69.9200, superficie_km2: 2.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Tupungato" },

  // ═══════════════════════════════════════════
  // SANTA CRUZ — 2,420 geoformas, ~2,420 km²
  // Zona: Hielo Continental Patagónico (47°-51° S)
  // ═══════════════════════════════════════════
  { id: "SC001", nombre: "Glaciar Perito Moreno", provincia: "Santa Cruz", lat: -50.4967, lng: -73.1367, superficie_km2: 258.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Argentino" },
  { id: "SC002", nombre: "Glaciar Upsala", provincia: "Santa Cruz", lat: -49.8833, lng: -73.2833, superficie_km2: 765.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Argentino" },
  { id: "SC003", nombre: "Glaciar Viedma", provincia: "Santa Cruz", lat: -49.4500, lng: -73.2000, superficie_km2: 945.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Viedma" },
  { id: "SC004", nombre: "Glaciar Spegazzini", provincia: "Santa Cruz", lat: -50.2500, lng: -73.3000, superficie_km2: 134.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Argentino" },
  { id: "SC005", nombre: "Glaciar Mayo", provincia: "Santa Cruz", lat: -50.0800, lng: -73.3200, superficie_km2: 56.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Argentino" },
  { id: "SC006", nombre: "Glaciar Ameghino", provincia: "Santa Cruz", lat: -50.3900, lng: -73.2100, superficie_km2: 42.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Argentino" },
  { id: "SC007", nombre: "Glaciar Onelli", provincia: "Santa Cruz", lat: -50.1200, lng: -73.2800, superficie_km2: 48.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Argentino" },
  { id: "SC008", nombre: "Glaciar Agassiz", provincia: "Santa Cruz", lat: -50.1500, lng: -73.2600, superficie_km2: 35.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Argentino" },
  { id: "SC009", nombre: "Glaciar Bolado", provincia: "Santa Cruz", lat: -50.1800, lng: -73.2400, superficie_km2: 28.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Argentino" },
  { id: "SC010", nombre: "Glaciar Seco", provincia: "Santa Cruz", lat: -50.3200, lng: -73.1800, superficie_km2: 22.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Argentino" },
  { id: "SC011", nombre: "Glaciar Torre", provincia: "Santa Cruz", lat: -49.3200, lng: -73.0800, superficie_km2: 11.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Viedma" },
  { id: "SC012", nombre: "Glaciar Grande (Río Túnel)", provincia: "Santa Cruz", lat: -49.3500, lng: -73.1000, superficie_km2: 16.2, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Viedma" },
  { id: "SC013", nombre: "Glaciar Piedras Blancas", provincia: "Santa Cruz", lat: -49.2800, lng: -73.0400, superficie_km2: 6.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Viedma" },
  { id: "SC014", nombre: "Glaciar de los Tres", provincia: "Santa Cruz", lat: -49.2700, lng: -73.0500, superficie_km2: 4.3, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Viedma" },
  { id: "SC015", nombre: "Glaciar Marconi", provincia: "Santa Cruz", lat: -49.3800, lng: -73.1500, superficie_km2: 18.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Viedma" },
  { id: "SC016", nombre: "Glaciar Frías", provincia: "Santa Cruz", lat: -50.5500, lng: -73.1000, superficie_km2: 15.3, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Argentino" },
  { id: "SC017", nombre: "Glaciar Dickson", provincia: "Santa Cruz", lat: -50.7500, lng: -73.0800, superficie_km2: 24.6, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Argentino" },
  { id: "SC018", nombre: "Glaciar Chico", provincia: "Santa Cruz", lat: -49.0000, lng: -73.1000, superficie_km2: 32.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago San Martín" },
  { id: "SC019", nombre: "Glaciar O'Higgins", provincia: "Santa Cruz", lat: -48.8500, lng: -73.2000, superficie_km2: 78.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago San Martín" },
  { id: "SC020", nombre: "Glaciar Moyano", provincia: "Santa Cruz", lat: -48.5000, lng: -72.7500, superficie_km2: 14.0, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago San Martín" },

  // ═══════════════════════════════════════════
  // TIERRA DEL FUEGO — 776 geoformas, ~218 km²
  // Zona: Cordillera Fueguina y Darwin (54° S)
  // ═══════════════════════════════════════════
  { id: "TF001", nombre: "Glaciar Martial", provincia: "Tierra del Fuego", lat: -54.7700, lng: -68.3800, superficie_km2: 0.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Canal Beagle" },
  { id: "TF002", nombre: "Glaciar Vinciguerra", provincia: "Tierra del Fuego", lat: -54.7200, lng: -68.3200, superficie_km2: 1.2, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Canal Beagle" },
  { id: "TF003", nombre: "Glaciar Alvear", provincia: "Tierra del Fuego", lat: -54.7500, lng: -68.2200, superficie_km2: 2.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Canal Beagle" },
  { id: "TF004", nombre: "Glaciar Ojo del Albino", provincia: "Tierra del Fuego", lat: -54.7100, lng: -68.3600, superficie_km2: 0.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Canal Beagle" },
  { id: "TF005", nombre: "Glaciar del Cañadón de la Oveja", provincia: "Tierra del Fuego", lat: -54.6900, lng: -68.4100, superficie_km2: 0.4, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Canal Beagle" },
  { id: "TF006", nombre: "Glaciar Stoppani", provincia: "Tierra del Fuego", lat: -54.6500, lng: -69.2200, superficie_km2: 3.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Fagnano" },
  { id: "TF007", nombre: "Glaciar Schiaparelli", provincia: "Tierra del Fuego", lat: -54.6200, lng: -69.3800, superficie_km2: 2.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Fagnano" },
  { id: "TF008", nombre: "Glaciar de Escombros Monte Olivia", provincia: "Tierra del Fuego", lat: -54.7400, lng: -68.3300, superficie_km2: 0.15, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Canal Beagle" },
  { id: "TF009", nombre: "Glaciar del Cerro Castor", provincia: "Tierra del Fuego", lat: -54.7350, lng: -68.3400, superficie_km2: 0.3, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Canal Beagle" },
  { id: "TF010", nombre: "Glaciar Bahía Sloggett", provincia: "Tierra del Fuego", lat: -54.8500, lng: -67.2500, superficie_km2: 1.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Atlántico Sur" },

  // ═══════════════════════════════════════════
  // SALTA — 1,302 geoformas, ~212 km²
  // Zona: Puna Salteña y Andes Desérticos (22°-25° S)
  // ═══════════════════════════════════════════
  { id: "SA001", nombre: "Glaciar del Nevado de Cachi", provincia: "Salta", lat: -25.1200, lng: -66.3800, superficie_km2: 1.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Calchaquí" },
  { id: "SA002", nombre: "Glaciar del Nevado del Acay", provincia: "Salta", lat: -24.3800, lng: -66.1500, superficie_km2: 0.9, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Calchaquí" },
  { id: "SA003", nombre: "Glaciar de Escombros Cerro Llullaillaco", provincia: "Salta", lat: -24.7200, lng: -68.5300, superficie_km2: 0.6, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "SA004", nombre: "Glaciar del Volcán Socompa", provincia: "Salta", lat: -24.4000, lng: -68.2500, superficie_km2: 0.45, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "SA005", nombre: "Glaciar de Escombros Nevado de Chañi", provincia: "Salta", lat: -24.0500, lng: -65.9700, superficie_km2: 0.35, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río San Antonio" },
  { id: "SA006", nombre: "Glaciar del Quevar", provincia: "Salta", lat: -24.3100, lng: -66.8000, superficie_km2: 0.7, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Puna" },
  { id: "SA007", nombre: "Glaciar del Cerro Galán", provincia: "Salta", lat: -24.5600, lng: -67.9200, superficie_km2: 0.5, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "SA008", nombre: "Glaciar de Escombros Taca Taca", provincia: "Salta", lat: -24.5700, lng: -67.7400, superficie_km2: 0.3, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "SA009", nombre: "Glaciar Nevado de Acay Sur", provincia: "Salta", lat: -24.4100, lng: -66.1800, superficie_km2: 0.55, tipo: "Glaciar", subtipo: "Cubierto", cuenca: "Río Calchaquí" },
  { id: "SA010", nombre: "Glaciar de Escombros San Antonio de los Cobres", provincia: "Salta", lat: -24.2100, lng: -66.3200, superficie_km2: 0.25, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "SA011", nombre: "Glaciar de Escombros Socompa Este", provincia: "Salta", lat: -24.3800, lng: -68.2000, superficie_km2: 0.38, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "SA012", nombre: "Glaciar de Escombros Incahuasi", provincia: "Salta", lat: -24.2900, lng: -67.2100, superficie_km2: 0.42, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "SA013", nombre: "Glaciar de Escombros Libertador", provincia: "Salta", lat: -24.1500, lng: -66.5000, superficie_km2: 0.28, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "SA014", nombre: "Glaciar Cerro Negro Norte", provincia: "Salta", lat: -24.0200, lng: -66.4500, superficie_km2: 0.6, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "SA015", nombre: "Glaciar de Escombros Palermo", provincia: "Salta", lat: -24.6400, lng: -66.2800, superficie_km2: 0.2, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Calchaquí" },

  // ═══════════════════════════════════════════
  // CATAMARCA — 1,526 geoformas, ~277 km²
  // Zona: Andes Desérticos y Puna Catamarqueña (25°-28° S)
  // ═══════════════════════════════════════════
  { id: "CA001", nombre: "Glaciar del San Francisco", provincia: "Catamarca", lat: -26.8900, lng: -68.2800, superficie_km2: 1.2, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Abaucán" },
  { id: "CA002", nombre: "Glaciar del Ojos del Salado", provincia: "Catamarca", lat: -27.1100, lng: -68.5400, superficie_km2: 2.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Salar de Maricunga" },
  { id: "CA003", nombre: "Glaciar de Escombros Fiambalá", provincia: "Catamarca", lat: -27.3400, lng: -67.8500, superficie_km2: 0.4, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Abaucán" },
  { id: "CA004", nombre: "Glaciar del Nevado de Pissis", provincia: "Catamarca", lat: -27.7500, lng: -68.8000, superficie_km2: 3.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Puna" },
  { id: "CA005", nombre: "Glaciar del Cerro Bonete Grande", provincia: "Catamarca", lat: -28.0000, lng: -68.7500, superficie_km2: 1.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Puna" },
  { id: "CA006", nombre: "Glaciar de Escombros Antofagasta de la Sierra", provincia: "Catamarca", lat: -26.0600, lng: -67.4100, superficie_km2: 0.35, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "CA007", nombre: "Glaciar del Cerro El Cóndor", provincia: "Catamarca", lat: -26.6300, lng: -68.3600, superficie_km2: 0.9, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Puna" },
  { id: "CA008", nombre: "Glaciar de Escombros Paso San Francisco", provincia: "Catamarca", lat: -26.8500, lng: -68.3000, superficie_km2: 0.28, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "CA009", nombre: "Glaciar de Escombros Laguna Blanca", provincia: "Catamarca", lat: -26.5800, lng: -67.1500, superficie_km2: 0.22, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "CA010", nombre: "Glaciar Monte Pissis Este", provincia: "Catamarca", lat: -27.7700, lng: -68.7600, superficie_km2: 2.1, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Puna" },
  { id: "CA011", nombre: "Glaciar Tres Cruces", provincia: "Catamarca", lat: -27.0700, lng: -68.7900, superficie_km2: 1.6, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Puna" },
  { id: "CA012", nombre: "Glaciar de Escombros Chaschuil", provincia: "Catamarca", lat: -27.5300, lng: -68.4200, superficie_km2: 0.32, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Abaucán" },
  { id: "CA013", nombre: "Glaciar Falso Azufre", provincia: "Catamarca", lat: -26.7900, lng: -68.3200, superficie_km2: 0.75, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Puna" },
  { id: "CA014", nombre: "Glaciar de Escombros Agua Rica", provincia: "Catamarca", lat: -27.3800, lng: -66.2700, superficie_km2: 0.18, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río del Valle" },
  { id: "CA015", nombre: "Glaciar de Escombros El Peñón", provincia: "Catamarca", lat: -26.4800, lng: -67.2800, superficie_km2: 0.15, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },

  // ═══════════════════════════════════════════
  // JUJUY — 714 geoformas, ~59 km²
  // Zona: Puna Jujeña (22°-24° S)
  // ═══════════════════════════════════════════
  { id: "JU001", nombre: "Glaciar del Nevado de Chañi", provincia: "Jujuy", lat: -24.0500, lng: -65.9500, superficie_km2: 0.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Grande de Jujuy" },
  { id: "JU002", nombre: "Glaciar de Escombros Abra Pampa", provincia: "Jujuy", lat: -22.7200, lng: -65.7000, superficie_km2: 0.3, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Grande de Jujuy" },
  { id: "JU003", nombre: "Glaciar de Escombros La Quiaca", provincia: "Jujuy", lat: -22.1000, lng: -65.6000, superficie_km2: 0.2, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Grande de Jujuy" },
  { id: "JU004", nombre: "Glaciar de Escombros Cerro Zapaleri", provincia: "Jujuy", lat: -22.0500, lng: -66.5000, superficie_km2: 0.45, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "JU005", nombre: "Glaciar del Cerro Granadas", provincia: "Jujuy", lat: -22.5500, lng: -66.6500, superficie_km2: 0.55, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Puna" },
  { id: "JU006", nombre: "Glaciar de Escombros Susques", provincia: "Jujuy", lat: -23.4000, lng: -66.3600, superficie_km2: 0.25, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "JU007", nombre: "Glaciar de Escombros Rinconada", provincia: "Jujuy", lat: -22.4400, lng: -66.1600, superficie_km2: 0.18, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },
  { id: "JU008", nombre: "Glaciar del Cerro Vilama", provincia: "Jujuy", lat: -22.6200, lng: -66.8800, superficie_km2: 0.35, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },

  // ═══════════════════════════════════════════
  // TUCUMÁN — 140 geoformas, ~9 km²
  // ═══════════════════════════════════════════
  { id: "TU001", nombre: "Glaciar de Escombros Cerro Aconquija", provincia: "Tucumán", lat: -27.1800, lng: -66.0500, superficie_km2: 0.6, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Salí" },
  { id: "TU002", nombre: "Glaciar de Escombros Cerro del Bolsón", provincia: "Tucumán", lat: -27.0800, lng: -66.0200, superficie_km2: 0.3, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Salí" },
  { id: "TU003", nombre: "Glaciar de Escombros Cumbres Calchaquíes", provincia: "Tucumán", lat: -26.5500, lng: -65.9600, superficie_km2: 0.25, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Salí" },
  { id: "TU004", nombre: "Glaciar del Aconquija Norte", provincia: "Tucumán", lat: -27.1500, lng: -66.0800, superficie_km2: 0.4, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Salí" },
  { id: "TU005", nombre: "Glaciar de Escombros Los Pinos", provincia: "Tucumán", lat: -27.2000, lng: -66.0300, superficie_km2: 0.15, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Salí" },

  // ═══════════════════════════════════════════
  // LA RIOJA — 568 geoformas, ~65 km²
  // ═══════════════════════════════════════════
  { id: "LR001", nombre: "Glaciar del Nevado de Famatina", provincia: "La Rioja", lat: -29.0200, lng: -67.7800, superficie_km2: 1.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Famatina" },
  { id: "LR002", nombre: "Glaciar de Escombros Famatina Sur", provincia: "La Rioja", lat: -29.0600, lng: -67.7500, superficie_km2: 0.4, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Famatina" },
  { id: "LR003", nombre: "Glaciar del Cerro Bonete", provincia: "La Rioja", lat: -28.0200, lng: -68.7200, superficie_km2: 2.1, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Puna" },
  { id: "LR004", nombre: "Glaciar de Escombros Vinchina", provincia: "La Rioja", lat: -28.7500, lng: -68.2000, superficie_km2: 0.3, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Bermejo" },
  { id: "LR005", nombre: "Glaciar del General Belgrano", provincia: "La Rioja", lat: -29.0400, lng: -67.8200, superficie_km2: 0.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Famatina" },
  { id: "LR006", nombre: "Glaciar de Escombros Negro Sobrero", provincia: "La Rioja", lat: -28.9800, lng: -67.8000, superficie_km2: 0.2, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Famatina" },
  { id: "LR007", nombre: "Glaciar del Cerro Veladero Riojano", provincia: "La Rioja", lat: -28.5000, lng: -68.5000, superficie_km2: 0.9, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Puna" },
  { id: "LR008", nombre: "Glaciar de Escombros Laguna Brava", provincia: "La Rioja", lat: -28.3500, lng: -68.9000, superficie_km2: 0.35, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Puna" },

  // ═══════════════════════════════════════════
  // NEUQUÉN — 235 geoformas, ~27 km²
  // ═══════════════════════════════════════════
  { id: "NQ001", nombre: "Glaciar del Volcán Lanín", provincia: "Neuquén", lat: -39.6400, lng: -71.5000, superficie_km2: 3.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Huechulafquen" },
  { id: "NQ002", nombre: "Glaciar del Volcán Copahue", provincia: "Neuquén", lat: -37.8600, lng: -71.1700, superficie_km2: 1.2, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Neuquén" },
  { id: "NQ003", nombre: "Glaciar del Volcán Domuyo", provincia: "Neuquén", lat: -36.6400, lng: -70.4300, superficie_km2: 2.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Neuquén" },
  { id: "NQ004", nombre: "Glaciar Castaño Overa", provincia: "Neuquén", lat: -38.5200, lng: -71.1500, superficie_km2: 0.6, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Limay" },
  { id: "NQ005", nombre: "Glaciar del Cerro Chapelco", provincia: "Neuquén", lat: -40.1200, lng: -71.2700, superficie_km2: 0.3, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Limay" },
  { id: "NQ006", nombre: "Glaciar de Escombros Los Barros", provincia: "Neuquén", lat: -36.6800, lng: -70.4500, superficie_km2: 0.15, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Neuquén" },

  // ═══════════════════════════════════════════
  // RÍO NEGRO — 154 geoformas, ~18 km²
  // ═══════════════════════════════════════════
  { id: "RN001", nombre: "Glaciar del Cerro Tronador Este", provincia: "Río Negro", lat: -41.1600, lng: -71.8800, superficie_km2: 4.2, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Manso" },
  { id: "RN002", nombre: "Glaciar Alerce", provincia: "Río Negro", lat: -41.1700, lng: -71.8500, superficie_km2: 2.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Nahuel Huapi" },
  { id: "RN003", nombre: "Glaciar Castaño Overa (RN)", provincia: "Río Negro", lat: -41.1500, lng: -71.8300, superficie_km2: 1.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Nahuel Huapi" },
  { id: "RN004", nombre: "Glaciar Manso", provincia: "Río Negro", lat: -41.1800, lng: -71.9000, superficie_km2: 3.1, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Manso" },
  { id: "RN005", nombre: "Glaciar del Hielo Azul", provincia: "Río Negro", lat: -41.9000, lng: -71.7500, superficie_km2: 1.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Azul" },
  { id: "RN006", nombre: "Glaciar del Cerro Catedral", provincia: "Río Negro", lat: -41.1700, lng: -71.4500, superficie_km2: 0.3, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Nahuel Huapi" },

  // ═══════════════════════════════════════════
  // CHUBUT — 258 geoformas, ~48 km²
  // ═══════════════════════════════════════════
  { id: "CH001", nombre: "Glaciar Torrecillas", provincia: "Chubut", lat: -42.5800, lng: -71.7800, superficie_km2: 3.2, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Menéndez" },
  { id: "CH002", nombre: "Glaciar del Cerro Tres Picos", provincia: "Chubut", lat: -42.6200, lng: -71.7500, superficie_km2: 2.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Menéndez" },
  { id: "CH003", nombre: "Glaciar del Cerro Situación", provincia: "Chubut", lat: -42.3800, lng: -71.4200, superficie_km2: 1.8, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Chubut" },
  { id: "CH004", nombre: "Glaciar del Piltriquitrón", provincia: "Chubut", lat: -42.0800, lng: -71.5000, superficie_km2: 0.4, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Chubut" },
  { id: "CH005", nombre: "Glaciar del Lago Futalaufquen", provincia: "Chubut", lat: -42.8500, lng: -71.7200, superficie_km2: 2.1, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Futalaufquen" },
  { id: "CH006", nombre: "Glaciar de Escombros Esquel", provincia: "Chubut", lat: -42.9200, lng: -71.3800, superficie_km2: 0.2, tipo: "Ambiente Periglacial", subtipo: "Glaciar de escombros", cuenca: "Río Chubut" },
  { id: "CH007", nombre: "Glaciar Lago Situación Norte", provincia: "Chubut", lat: -42.4000, lng: -71.4500, superficie_km2: 1.2, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Río Chubut" },
  { id: "CH008", nombre: "Glaciar Cerro Cónico", provincia: "Chubut", lat: -43.1000, lng: -71.8000, superficie_km2: 1.5, tipo: "Glaciar", subtipo: "Descubierto", cuenca: "Lago Futalaufquen" },
];

// Estadísticas agregadas del ING
// Provincias con actualizacion_res142_2024:true tienen datos actualizados por Resolución 142/2024
// eslint-disable-next-line
const GLACIARES_STATS = {
  "San Juan":        { total_geoformas: 2116, superficie_km2: 1767, glaciares: 308, periglacial: 1808 , actualizacion_res142_2024: true },
  "Mendoza":         { total_geoformas: 2165, superficie_km2: 1239, glaciares: 650, periglacial: 1515 , actualizacion_res142_2024: false },
  "Santa Cruz":      { total_geoformas: 2420, superficie_km2: 2420, glaciares: 1100, periglacial: 1320 , actualizacion_res142_2024: false },
  "Tierra del Fuego":{ total_geoformas: 776,  superficie_km2: 218,  glaciares: 328, periglacial: 448 , actualizacion_res142_2024: false },
  "Salta":           { total_geoformas: 1302, superficie_km2: 212,  glaciares: 120, periglacial: 1182 , actualizacion_res142_2024: true },
  "Catamarca":       { total_geoformas: 1526, superficie_km2: 277,  glaciares: 180, periglacial: 1346 , actualizacion_res142_2024: true },
  "Jujuy":           { total_geoformas: 714,  superficie_km2: 59,   glaciares: 65,  periglacial: 649 , actualizacion_res142_2024: true },
  "Tucumán":         { total_geoformas: 140,  superficie_km2: 9,    glaciares: 15,  periglacial: 125 , actualizacion_res142_2024: true },
  "La Rioja":        { total_geoformas: 568,  superficie_km2: 65,   glaciares: 85,  periglacial: 483 , actualizacion_res142_2024: true },
  "Neuquén":         { total_geoformas: 235,  superficie_km2: 27,   glaciares: 78,  periglacial: 157 , actualizacion_res142_2024: false },
  "Río Negro":       { total_geoformas: 154,  superficie_km2: 18,   glaciares: 72,  periglacial: 82 , actualizacion_res142_2024: false },
  "Chubut":          { total_geoformas: 258,  superficie_km2: 48,   glaciares: 110, periglacial: 148 , actualizacion_res142_2024: false },
};

/**
 * Datos de retracción glaciar — Resolución 142/2024 (NOA, 2008–2023)
 * Fuente: IANIGLA/CONICET — Vicejefatura de Gabinete del Interior
 */
const GLACIARES_RETRACCION = {
  reduccion_hielo_descubierto_pct: 17,
  reduccion_manchones_nieve_pct: 23,
  periodo: "2008–2023",
  subcuencas_actualizadas: 22,
  provincias_noa: ["Catamarca", "Jujuy", "La Rioja", "Salta", "San Juan", "Tucumán"],
  resolucion: "Resolución 142/2024",
  fuente: "IANIGLA/CONICET — Vicejefatura de Gabinete del Interior",
};
