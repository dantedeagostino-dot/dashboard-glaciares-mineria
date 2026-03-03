/**
 * Dataset Especializado de Litio — Argentina
 * Extiende los proyectos de litio del SIACAM con datos específicos del mineral
 *
 * Tipos de compuesto: Carbonato de Litio (Li2CO3) · Hidróxido de Litio (LiOH)
 * Tipos de yacimiento: Salar (salmueras) · Roca (spodumena, petalita)
 *
 * Fuentes:
 * - Secretaría de Minería de la Nación (SIACAM)
 * - USGS Mineral Resources Program (Lithium Statistics and Information)
 * - Benchmark Mineral Intelligence (proyecciones 2025-2035)
 */

const LITIO_DATA = [
    // ═══════════════════════════════════════════════════════
    // JUJUY — Triángulo del Litio (Puna salteño-jujeña)
    // ═══════════════════════════════════════════════════════
    {
        id: "LI001",
        nombre: "Cauchari-Olaroz",
        empresa: "MINERA EXAR S.A. (Lithium Americas + Ganfeng)",
        estado: "Producción",
        provincia: "Jujuy",
        lat: -23.74, lng: -66.76,
        tipo_yacimiento: "Salar",
        salar: "Salar de Olaroz-Cauchari",
        compuesto: "Carbonato",
        capacidad_tpa: 40000,         // toneladas por año de carbonato
        inicio_produccion: 2023,
        reservas_mt: 10.2,            // millones de toneladas de LCE
        concentracion_mg_l: 650,      // mg/L de Li en salmuera
    },
    {
        id: "LI002",
        nombre: "Olaroz",
        empresa: "Allkem (JEMSE / Toyota Tsusho)",
        estado: "Producción",
        provincia: "Jujuy",
        lat: -23.45, lng: -66.55,
        tipo_yacimiento: "Salar",
        salar: "Salar de Olaroz",
        compuesto: "Carbonato",
        capacidad_tpa: 25000,
        inicio_produccion: 2015,
        reservas_mt: 6.4,
        concentracion_mg_l: 690,
    },
    {
        id: "LI003",
        nombre: "Pozuelos-Pastos Grandes",
        empresa: "POSCO Argentina",
        estado: "Construcción",
        provincia: "Salta",
        lat: -22.30, lng: -66.45,
        tipo_yacimiento: "Salar",
        salar: "Salar de Pozuelos",
        compuesto: "Carbonato",
        capacidad_tpa: 25000,
        inicio_produccion: 2025,
        reservas_mt: 3.8,
        concentracion_mg_l: 580,
    },
    {
        id: "LI004",
        nombre: "Sal de Vida",
        empresa: "Allkem",
        estado: "Construcción",
        provincia: "Catamarca",
        lat: -26.0, lng: -67.0,
        tipo_yacimiento: "Salar",
        salar: "Salar del Hombre Muerto",
        compuesto: "Carbonato",
        capacidad_tpa: 32000,
        inicio_produccion: 2025,
        reservas_mt: 4.2,
        concentracion_mg_l: 430,
    },
    {
        id: "LI005",
        nombre: "Hombre Muerto (LICAR)",
        empresa: "LICAR S.A. (YPF Litio)",
        estado: "Factibilidad",
        provincia: "Catamarca",
        lat: -26.10, lng: -67.05,
        tipo_yacimiento: "Salar",
        salar: "Salar del Hombre Muerto",
        compuesto: "Carbonato",
        capacidad_tpa: 20000,
        inicio_produccion: null,
        reservas_mt: 3.1,
        concentracion_mg_l: 410,
    },
    {
        id: "LI006",
        nombre: "Mariana",
        empresa: "Ganfeng Lithium",
        estado: "Construcción",
        provincia: "Salta",
        lat: -24.0, lng: -67.5,
        tipo_yacimiento: "Salar",
        salar: "Salar de Llullaillaco",
        compuesto: "Carbonato",
        capacidad_tpa: 20000,
        inicio_produccion: 2025,
        reservas_mt: 2.6,
        concentracion_mg_l: 350,
    },
    {
        id: "LI007",
        nombre: "Sal de Jujuy",
        empresa: "Enirgi / JEMSE",
        estado: "Exploración avanzada",
        provincia: "Jujuy",
        lat: -24.2, lng: -66.7,
        tipo_yacimiento: "Salar",
        salar: "Salar de Jama",
        compuesto: "Carbonato",
        capacidad_tpa: null,
        inicio_produccion: null,
        reservas_mt: 1.8,
        concentracion_mg_l: 280,
    },
    {
        id: "LI008",
        nombre: "Centenario-Ratones",
        empresa: "Stellantis / Lithium Argentina",
        estado: "Construcción",
        provincia: "Salta",
        lat: -23.8, lng: -67.2,
        tipo_yacimiento: "Salar",
        salar: "Salar de Ratones",
        compuesto: "Carbonato",
        capacidad_tpa: 24000,
        inicio_produccion: 2026,
        reservas_mt: 2.2,
        concentracion_mg_l: 420,
    },
];

/**
 * Proyecciones de producción de litio en Argentina (LCE — Litio Carbonato Equivalente)
 * Fuente: estimaciones basadas en USGS/Benchmark Mineral Intelligence
 */
const LITIO_PROYECCIONES = [
    { año: 2023, produccion_ktpa: 25 },
    { año: 2024, produccion_ktpa: 45 },
    { año: 2025, produccion_ktpa: 120 },
    { año: 2026, produccion_ktpa: 220 },
    { año: 2027, produccion_ktpa: 310 },
    { año: 2028, produccion_ktpa: 390 },
    { año: 2030, produccion_ktpa: 500 },
    { año: 2035, produccion_ktpa: 700 },
];

/**
 * Contexto regional — Triángulo del Litio (Argentina, Bolivia, Chile)
 */
const LITIO_CONTEXTO = {
    reservas_argentina_mt: 20,          // millones de toneladas LCE (USGS 2024)
    reservas_mundo_pct: 22,              // % de las reservas globales
    posicion_reservas_mundial: 2,         // 2° lugar mundial en reservas
    posicion_produccion_mundial: 4,       // 4° productor mundial
    salares_principales: ["Olaroz-Cauchari", "Hombre Muerto", "Llullaillaco", "Rincón", "Pozuelos", "Jama", "Ratones"],
};
