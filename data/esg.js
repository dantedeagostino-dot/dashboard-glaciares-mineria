/**
 * Dataset ESG — Indicadores de Sostenibilidad y Gobernanza Minera
 *
 * Fuentes:
 * - EITI Argentina — 4to Informe (FY 2022/2023) — eiti.org / argentina.gob.ar/produccion/eiti
 * - SIACAM — pago-de-impuestos-de-grandes-empresas-nacionales-2019-2023 (en millones de USD)
 * - SIACAM — indicadores-sustentabilidad: consumo agua, energía, emisiones GEI
 * - TSM (Towards Sustainable Mining) — CAEM / Mining Association of Canada
 * - INDEC / SIPA — Empleo sectorial (sector 08 — Extracción de minerales)
 *
 * Tipos de datos:
 * - impuestos_total_usd_2023: Total pagos fiscales 2023 (SIACAM oficial, en millones USD)
 * - regalias_usd_2023: Regalías y Canon 2023 (SIACAM oficial, en millones USD)
 * - consumo_agua_m3: Consumo anual de agua (reporte GRI, m³)
 * - consumo_energia_mwh: Consumo anual de energía (reporte GRI, MWh)
 * - emisiones_gei_tco2e: Emisiones anuales de GEI (reporte GRI, tCO2e)
 * - empleo_directo: Empleo formal registrado (estimado SIPA/EITI)
 * - tsm_status: Estado de implementación TSM
 */

const ESG_DATA = [
    // ─────────────────────────────────────────────────────────────
    // 18 PROYECTOS — Fuentes: SIACAM Tax 2023 + Sustentabilidad + EITI
    // ─────────────────────────────────────────────────────────────

    // ── Santa Cruz ─────────────────────────────────────────────
    {
        proyecto: "Cerro Vanguardia",
        empresa: "AngloGold Ashanti / Fomicruz",
        provincia: "Santa Cruz",
        mineral: "Oro / Plata",
        // Fiscal SIACAM 2023
        impuestos_total_usd_2023: 105.0,
        regalias_usd_2023: 12.28,
        derechos_exportacion_usd_2023: 37.57,
        // Sustentabilidad SIACAM (reporte GRI 2021)
        consumo_agua_m3: 1_466_485,
        consumo_energia_mwh: 489_337,
        emisiones_gei_tco2e: 95_827,
        // Empleo
        empleo_directo: 1400,
        empleo_contratistas: 1200,
        porcentaje_mujeres_pct: 10,
        // TSM / Gobernanza
        tsm_status: "En implementación",
        gri_reporte: true,
    },
    {
        proyecto: "Cerro Negro",
        empresa: "Oroplata S.A. (Newmont Corporation)",
        provincia: "Santa Cruz",
        mineral: "Oro / Plata",
        impuestos_total_usd_2023: 89.8,
        regalias_usd_2023: 15.14,
        derechos_exportacion_usd_2023: 48.86,
        consumo_agua_m3: 983_000,
        consumo_energia_mwh: 140_993,
        emisiones_gei_tco2e: 41_270,
        empleo_directo: 1500,
        empleo_contratistas: 1800,
        porcentaje_mujeres_pct: 15,
        tsm_status: "En implementación",
        gri_reporte: true,
    },
    {
        proyecto: "Cerro Moro",
        empresa: "Estelar Resources (Yamana Gold / Pan Am Silver)",
        provincia: "Santa Cruz",
        mineral: "Oro / Plata",
        impuestos_total_usd_2023: 37.7,
        regalias_usd_2023: 5.93,
        derechos_exportacion_usd_2023: 19.97,
        consumo_agua_m3: 441_000,
        consumo_energia_mwh: 160_673,
        emisiones_gei_tco2e: 39_207,
        empleo_directo: 850,
        empleo_contratistas: 600,
        porcentaje_mujeres_pct: 11,
        tsm_status: "En implementación",
        gri_reporte: true,
    },
    {
        proyecto: "Manantial Espejo",
        empresa: "Minera Triton (Pan American Silver)",
        provincia: "Santa Cruz",
        mineral: "Plata / Oro",
        impuestos_total_usd_2023: 3.0,
        regalias_usd_2023: 0.37,
        derechos_exportacion_usd_2023: 0.76,
        consumo_agua_m3: 353_767,
        consumo_energia_mwh: 221_830,
        emisiones_gei_tco2e: 49_420,
        empleo_directo: 400,
        empleo_contratistas: 300,
        porcentaje_mujeres_pct: 8,
        tsm_status: "En cierre — cerrado sept. 2024",
        gri_reporte: true,
    },
    {
        proyecto: "San José / Huevos Verdes",
        empresa: "Minera Santa Cruz S.A. (Pan American Silver)",
        provincia: "Santa Cruz",
        mineral: "Plata / Oro",
        impuestos_total_usd_2023: 36.5,
        regalias_usd_2023: 5.95,
        derechos_exportacion_usd_2023: 10.84,
        consumo_agua_m3: null,
        consumo_energia_mwh: null,
        emisiones_gei_tco2e: null,
        empleo_directo: 700,
        empleo_contratistas: 500,
        porcentaje_mujeres_pct: 9,
        tsm_status: "En implementación",
        gri_reporte: false,
    },
    {
        proyecto: "Don Nicolás",
        empresa: "Minera Don Nicolás S.A. (Cerrado Gold)",
        provincia: "Santa Cruz",
        mineral: "Oro",
        impuestos_total_usd_2023: 16.2,
        regalias_usd_2023: 2.86,
        derechos_exportacion_usd_2023: 7.58,
        consumo_agua_m3: null,
        consumo_energia_mwh: null,
        emisiones_gei_tco2e: null,
        empleo_directo: 350,
        empleo_contratistas: 200,
        porcentaje_mujeres_pct: null,
        tsm_status: "En implementación",
        gri_reporte: false,
    },
    {
        proyecto: "Patagonia Gold (Cap Oeste / COSE)",
        empresa: "Patagonia Gold S.A.",
        provincia: "Santa Cruz",
        mineral: "Oro / Plata",
        impuestos_total_usd_2023: 2.0,
        regalias_usd_2023: 0.26,
        derechos_exportacion_usd_2023: 0.31,
        consumo_agua_m3: null,
        consumo_energia_mwh: null,
        emisiones_gei_tco2e: null,
        empleo_directo: 150,
        empleo_contratistas: 100,
        porcentaje_mujeres_pct: null,
        tsm_status: "Sin información",
        gri_reporte: false,
    },
    {
        proyecto: "Martha / Joaquín",
        empresa: "Mansfield Minera S.A. (Pan American Silver)",
        provincia: "Santa Cruz",
        mineral: "Plata",
        impuestos_total_usd_2023: 24.9,
        regalias_usd_2023: 2.62,
        derechos_exportacion_usd_2023: 14.93,
        consumo_agua_m3: null,
        consumo_energia_mwh: null,
        emisiones_gei_tco2e: null,
        empleo_directo: 500,
        empleo_contratistas: 350,
        porcentaje_mujeres_pct: null,
        tsm_status: "En implementación",
        gri_reporte: false,
    },

    // ── San Juan ───────────────────────────────────────────────
    {
        proyecto: "Veladero",
        empresa: "Minera Andina del Sol (Barrick / Shandong Gold)",
        provincia: "San Juan",
        mineral: "Oro / Plata",
        impuestos_total_usd_2023: 102.9,
        regalias_usd_2023: 21.60,
        derechos_exportacion_usd_2023: 53.22,
        consumo_agua_m3: 1_428_000,
        consumo_energia_mwh: 1_146_111,
        emisiones_gei_tco2e: 286_000,
        empleo_directo: 1800,
        empleo_contratistas: 2200,
        porcentaje_mujeres_pct: 12,
        tsm_status: "Certificado",          // Primera mina Argentina TSM (mayo 2023)
        gri_reporte: true,
    },
    {
        proyecto: "Gualcamayo",
        empresa: "Minas Argentinas S.A. (Mineros S.A.)",
        provincia: "San Juan",
        mineral: "Oro",
        impuestos_total_usd_2023: 16.8,
        regalias_usd_2023: 2.87,
        derechos_exportacion_usd_2023: 6.18,
        consumo_agua_m3: 873_596,
        consumo_energia_mwh: 37_895,
        emisiones_gei_tco2e: null,
        empleo_directo: 620,
        empleo_contratistas: 400,
        porcentaje_mujeres_pct: null,
        tsm_status: "En implementación",
        gri_reporte: true,
    },

    // ── Jujuy ──────────────────────────────────────────────────
    {
        proyecto: "Cauchari-Olaroz",
        empresa: "Minera Exar S.A. (Ganfeng / Lithium Americas)",
        provincia: "Jujuy",
        mineral: "Litio",
        impuestos_total_usd_2023: 11.4,
        regalias_usd_2023: 0.60,
        derechos_exportacion_usd_2023: 1.57,
        consumo_agua_m3: null,
        consumo_energia_mwh: null,
        emisiones_gei_tco2e: null,
        empleo_directo: 950,
        empleo_contratistas: 1200,
        porcentaje_mujeres_pct: 18,
        tsm_status: "En implementación",
        gri_reporte: false,
    },
    {
        proyecto: "Olaroz",
        empresa: "Sales de Jujuy S.A. (Allkem / JEMSE / Toyota Tsusho)",
        provincia: "Jujuy",
        mineral: "Litio",
        impuestos_total_usd_2023: 106.9,
        regalias_usd_2023: 13.71,
        derechos_exportacion_usd_2023: 21.75,
        consumo_agua_m3: 627_677,
        consumo_energia_mwh: 169_991,
        emisiones_gei_tco2e: 39_041,
        empleo_directo: 620,
        empleo_contratistas: 800,
        porcentaje_mujeres_pct: 14,
        tsm_status: "En implementación",
        gri_reporte: true,
    },
    {
        proyecto: "Chinchillas-Pirquitas",
        empresa: "Mina Pirquitas S.A. (SSR Mining / Puna Operations)",
        provincia: "Jujuy",
        mineral: "Plata / Estaño",
        impuestos_total_usd_2023: 42.3,
        regalias_usd_2023: 7.61,
        derechos_exportacion_usd_2023: 11.12,
        consumo_agua_m3: null,
        consumo_energia_mwh: null,
        emisiones_gei_tco2e: null,
        empleo_directo: 500,
        empleo_contratistas: 400,
        porcentaje_mujeres_pct: null,
        tsm_status: "En implementación",
        gri_reporte: false,
    },
    {
        proyecto: "El Aguilar",
        empresa: "Compañía Minera Aguilar S.A. (Glencore)",
        provincia: "Jujuy",
        mineral: "Plomo / Zinc / Plata",
        impuestos_total_usd_2023: 4.2,
        regalias_usd_2023: 0.13,
        derechos_exportacion_usd_2023: 1.23,
        consumo_agua_m3: null,
        consumo_energia_mwh: null,
        emisiones_gei_tco2e: null,
        empleo_directo: 720,
        empleo_contratistas: 380,
        porcentaje_mujeres_pct: 6,
        tsm_status: "En implementación",
        gri_reporte: false,
    },

    // ── Salta ──────────────────────────────────────────────────
    {
        proyecto: "Puna Operation",
        empresa: "SSR Mining",
        provincia: "Salta",
        mineral: "Plata",
        impuestos_total_usd_2023: null,     // No en el tax CSV 2023
        regalias_usd_2023: null,
        derechos_exportacion_usd_2023: null,
        consumo_agua_m3: 1_054_531,
        consumo_energia_mwh: 266_790,
        emisiones_gei_tco2e: 58_711,
        empleo_directo: 600,
        empleo_contratistas: 500,
        porcentaje_mujeres_pct: null,
        tsm_status: "En implementación",
        gri_reporte: true,
    },
    {
        proyecto: "Lindero",
        empresa: "Fortuna Silver Mines",
        provincia: "Salta",
        mineral: "Oro",
        impuestos_total_usd_2023: null,
        regalias_usd_2023: null,
        derechos_exportacion_usd_2023: null,
        consumo_agua_m3: 271_150,
        consumo_energia_mwh: 69_548,
        emisiones_gei_tco2e: null,
        empleo_directo: 500,
        empleo_contratistas: 400,
        porcentaje_mujeres_pct: null,
        tsm_status: "En implementación",
        gri_reporte: false,
    },

    // ── Catamarca ──────────────────────────────────────────────
    {
        proyecto: "Bajo de la Alumbrera (cierre)",
        empresa: "Minera Alumbrera Limited (YMAD / Glencore)",
        provincia: "Catamarca",
        mineral: "Cobre / Oro",
        impuestos_total_usd_2023: 3.1,
        regalias_usd_2023: 0.001,
        derechos_exportacion_usd_2023: 0.002,
        consumo_agua_m3: null,
        consumo_energia_mwh: null,
        emisiones_gei_tco2e: null,
        empleo_directo: 890,
        empleo_contratistas: 600,
        porcentaje_mujeres_pct: 8,
        tsm_status: "En cierre — no aplica",
        gri_reporte: false,
    },
    {
        proyecto: "Fenix (Hombre Muerto)",
        empresa: "Minera del Altiplano S.A. (Livent / Arcadium → Rio Tinto)",
        provincia: "Catamarca",
        mineral: "Litio",
        impuestos_total_usd_2023: 30.2,
        regalias_usd_2023: 11.58,
        derechos_exportacion_usd_2023: 10.85,
        consumo_agua_m3: null,
        consumo_energia_mwh: null,
        emisiones_gei_tco2e: null,
        empleo_directo: 450,
        empleo_contratistas: 300,
        porcentaje_mujeres_pct: null,
        tsm_status: "En implementación",
        gri_reporte: false,
    },
];

/**
 * Totales ESG nacionales — Sector Minería (FY2023)
 * Fuente: SIACAM / EITI Argentina / INDEC
 */
const ESG_TOTALES = {
    // Fiscal — Suma del tax CSV 2023 (18 grandes empresas = USD 637.4M)
    impuestos_total_18_empresas_usd: 637.4,
    regalias_sector_total_usd: 210_000_000,        // Estimado total sector (EITI)
    // Empleo
    empleo_directo_total: 27_500,                    // Empleo formal directo (SIPA)
    empleo_indirecto_total: 80_000,                  // Empleo indirecto estimado
    porcentaje_mujeres_sector_pct: 11,               // Promedio sectorial
    // Sostenibilidad
    proyectos_con_gri: 10,                           // Proyectos con reporte GRI (de los 18)
    proyectos_en_tsm: 28,                            // Proyectos adhiriendo al TSM por CAEM
    proyectos_tsm_certificados: 1,                   // Solo Veladero certificado (mayo 2023)
    // Inversión
    inversiones_anunciadas_acum_usd: 23_117_965_000, // Acumulado dic-2019 a sep-2025 (SIACAM)
    aportes_eiti_total_usd: 21_000_000,             // Transparencia fiscal EITI
};

/**
 * Descripción del programa TSM en Argentina
 */
const TSM_INFO = {
    adoptado_por: "CAEM (Cámara Argentina de Empresarios Mineros)",
    año_adopcion: 2016,
    primer_pais_latam: true,
    primera_mina_certificada: "Veladero (Barrick/Shandong Gold)",
    año_primera_certificacion: 2023,
    areas_evaluadas: [
        "Gestión de relaves",
        "Manejo del agua",
        "Biodiversidad",
        "Cambio climático",
        "Relaciones con comunidades",
        "Salud y seguridad",
        "Gestión de crisis",
        "Prevención de trabajo infantil y forzado"
    ],
    descripcion: "TSM (Towards Sustainable Mining / Hacia una Minería Sustentable) es un programa de responsabilidad corporativa de la Mining Association of Canada (MAC) adoptado por CAEM en 2016. Cada empresa adhiere realizar autoevaluaciones anuales, verificadas externamente cada 3 años."
};
