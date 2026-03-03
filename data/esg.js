/**
 * Dataset ESG — Indicadores de Sostenibilidad y Gobernanza Minera
 *
 * Fuentes:
 * - EITI Argentina — 4to Informe (FY 2022/2023) — eiti.org / argentina.gob.ar/produccion/eiti
 * - TSM (Towards Sustainable Mining) — CAEM / Mining Association of Canada
 * - INDEC / SIPA — Empleo sectorial (sector 08 — Extracción de minerales)
 *
 * Tipos de datos:
 * - regalias_usd: Regalías mineras pagadas al Estado (estimadas del informe EITI)
 * - impuestos_usd: Impuestos nacionales y provinciales declarados
 * - empleo_directo: Empleo formal registrado en SIPA
 * - tsm_status: Estado de implementación TSM
 */

const ESG_DATA = [
    // ─────────────────────────────────────────────────────────────
    // DATOS POR PROYECTO — Fuente: Informe EITI Argentina 4to (FY2022/23)
    // ─────────────────────────────────────────────────────────────
    {
        proyecto: "Veladero",
        empresa: "Barrick Gold (Shandong Gold 50% participación)",
        provincia: "San Juan",
        mineral: "Oro / Plata",
        // ESG Fiscal
        regalias_provinciales_usd: 42_000_000,    // estimado FY2022
        impuestos_nacionales_usd: 180_000_000,
        royalties_nacionales_usd: 0,               // San Juan exento ley 24.196
        aporte_siacam_usd: 4_200_000,
        // Empleo
        empleo_directo: 1800,
        empleo_contratistas: 2200,
        porcentaje_mujeres_pct: 12,
        // TSM / Sostenibilidad
        tsm_status: "Certificado",                 // Primera mina Argentina certificada TSM (mayo 2023)
        tsm_ultima_verificacion: 2023,
        gri_reporte: true,
        // Ambiental
        agua_reciclada_pct: 85,
        energia_renovable_pct: 0,
        incidentes_graves_2022: 0,
    },
    {
        proyecto: "Cerro Negro",
        empresa: "Newmont Corporation",
        provincia: "Santa Cruz",
        mineral: "Oro / Plata",
        regalias_provinciales_usd: 38_000_000,
        impuestos_nacionales_usd: 220_000_000,
        royalties_nacionales_usd: 0,
        aporte_siacam_usd: 3_800_000,
        empleo_directo: 1500,
        empleo_contratistas: 1800,
        porcentaje_mujeres_pct: 15,
        tsm_status: "En implementación",
        tsm_ultima_verificacion: null,
        gri_reporte: true,
        agua_reciclada_pct: 78,
        energia_renovable_pct: 5,
        incidentes_graves_2022: 1,
    },
    {
        proyecto: "Bajo de la Alumbrera (ciere)",
        empresa: "Glencore / Goldcorp / Yamana (hist.)",
        provincia: "Catamarca",
        mineral: "Cobre / Oro",
        regalias_provinciales_usd: 18_000_000,    // ya en proceso de cierre
        impuestos_nacionales_usd: 50_000_000,
        royalties_nacionales_usd: 0,
        aporte_siacam_usd: 1_800_000,
        empleo_directo: 890,
        empleo_contratistas: 600,
        porcentaje_mujeres_pct: 8,
        tsm_status: "En cierre — no aplica",
        tsm_ultima_verificacion: null,
        gri_reporte: false,
        agua_reciclada_pct: 92,
        energia_renovable_pct: 0,
        incidentes_graves_2022: 0,
    },
    {
        proyecto: "Cauchari-Olaroz",
        empresa: "MINERA EXAR S.A.",
        provincia: "Jujuy",
        mineral: "Litio",
        regalias_provinciales_usd: 6_000_000,     // 2023, primer año de producción
        impuestos_nacionales_usd: 12_000_000,
        royalties_nacionales_usd: 0,
        aporte_siacam_usd: 600_000,
        empleo_directo: 950,
        empleo_contratistas: 1200,
        porcentaje_mujeres_pct: 18,
        tsm_status: "En implementación",
        tsm_ultima_verificacion: null,
        gri_reporte: false,
        agua_reciclada_pct: 70,
        energia_renovable_pct: 0,
        incidentes_graves_2022: 0,
    },
    {
        proyecto: "Olaroz",
        empresa: "Allkem / JEMSE / Toyota Tsusho",
        provincia: "Jujuy",
        mineral: "Litio",
        regalias_provinciales_usd: 8_500_000,
        impuestos_nacionales_usd: 18_000_000,
        royalties_nacionales_usd: 0,
        aporte_siacam_usd: 850_000,
        empleo_directo: 620,
        empleo_contratistas: 800,
        porcentaje_mujeres_pct: 14,
        tsm_status: "En implementación",
        tsm_ultima_verificacion: null,
        gri_reporte: true,
        agua_reciclada_pct: 60,
        energia_renovable_pct: 0,
        incidentes_graves_2022: 0,
    },
    {
        proyecto: "El Aguilar",
        empresa: "Glencore Argentina",
        provincia: "Jujuy",
        mineral: "Plomo / Zinc / Plata",
        regalias_provinciales_usd: 5_200_000,
        impuestos_nacionales_usd: 22_000_000,
        royalties_nacionales_usd: 0,
        aporte_siacam_usd: 520_000,
        empleo_directo: 720,
        empleo_contratistas: 380,
        porcentaje_mujeres_pct: 6,
        tsm_status: "En implementación",
        tsm_ultima_verificacion: null,
        gri_reporte: false,
        agua_reciclada_pct: 55,
        energia_renovable_pct: 0,
        incidentes_graves_2022: 0,
    },
];

/**
 * Totales ESG nacionales — Sector Minería (estimado FY2022)
 * Fuente: EITI Argentina / SIACAM / INDEC
 */
const ESG_TOTALES = {
    regalias_provinciales_total_usd: 210_000_000,  // Total regalías sector minero (est.)
    empleo_directo_total: 27_500,                    // Empleo formal directo (SIPA)
    empleo_indirecto_total: 80_000,                  // Empleo indirecto estimado
    porcentaje_mujeres_sector_pct: 11,               // Promedio sectorial
    proyectos_con_gri: 8,                            // Proyectos con reporte GRI
    proyectos_en_tsm: 28,                            // Proyectos adhiriendo al TSM por CAEM
    proyectos_tsm_certificados: 1,                   // Solo Veladero certificado a mayo 2023
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
