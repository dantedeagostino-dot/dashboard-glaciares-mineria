/**
 * Directorio de Proveedores Mineros — CAPMIN
 * Cámara Argentina de Proveedores Mineros (capmin.com.ar)
 *
 * Datos públicos del directorio CAPMIN.
 * +180 empresas proveedoras de bienes y servicios de alto valor agregado
 * para la industria minera argentina.
 *
 * Categorías de servicio:
 * - Seguridad y Salud Ocupacional
 * - Explosivos y Voladura
 * - Equipos y Maquinaria Pesada
 * - Laboratorio y Análisis
 * - Construcción e Infraestructura
 * - Tecnología y Sistemas
 * - Transporte y Logística
 * - Servicios Ambientales
 * - Consultoría e Ingeniería
 * - Energía y Utilities
 */

const CAPMIN_DATA = [
    // ─── Seguridad y Salud Ocupacional ───────────────────────────
    {
        id: "CP001", nombre: "3M Argentina S.A.", rubro: "Seguridad y Salud",
        productos: "Equipos de protección personal, respiradores, cascos, guantes",
        provincias_activas: ["San Juan", "Catamarca", "Jujuy", "Santa Cruz"],
        pyme: false, exportadora: false,
    },
    {
        id: "CP002", nombre: "Adecco Argentina S.A.", rubro: "Recursos Humanos",
        productos: "Gestión de personal temporario, selección, capacitación",
        provincias_activas: ["San Juan", "Mendoza", "Neuquén"],
        pyme: false, exportadora: false,
    },
    // ─── Explosivos y Voladura ───────────────────────────────────
    {
        id: "CP003", nombre: "EXSA Argentina S.A.", rubro: "Explosivos y Voladura",
        productos: "Explosivos industriales, accesorios de voladura, asesoramiento técnico",
        provincias_activas: ["San Juan", "Catamarca", "Santa Cruz", "Mendoza"],
        pyme: false, exportadora: false,
    },
    {
        id: "CP004", nombre: "Austin Powder Argentina", rubro: "Explosivos y Voladura",
        productos: "Emulsiones, ANFO, accesorios electrónicos de tiro, servicios de voladura",
        provincias_activas: ["Catamarca", "Jujuy", "San Juan"],
        pyme: false, exportadora: false,
    },
    // ─── Equipos y Maquinaria ─────────────────────────────────────
    {
        id: "CP005", nombre: "Algieri S.A.", rubro: "Equipos y Maquinaria",
        productos: "Reparación y mantenimiento de maquinaria pesada, equipos Komatsu / Caterpillar",
        provincias_activas: ["San Juan", "Mendoza"],
        pyme: true, exportadora: false,
    },
    {
        id: "CP006", nombre: "AIES S.A.", rubro: "Equipos y Maquinaria",
        productos: "Instrumentación industrial, sistemas de control, equipos de medición",
        provincias_activas: ["Catamarca", "Salta", "Jujuy"],
        pyme: true, exportadora: true,
    },
    {
        id: "CP007", nombre: "Ferreycorp Argentina (Ferreyros)", rubro: "Equipos y Maquinaria",
        productos: "Maquinaria Caterpillar, repuestos, soporte técnico 24/7",
        provincias_activas: ["San Juan", "Santa Cruz", "Mendoza", "Catamarca"],
        pyme: false, exportadora: false,
    },
    // ─── Laboratorio y Análisis ───────────────────────────────────
    {
        id: "CP008", nombre: "Bureau Veritas Argentina", rubro: "Laboratorio y Análisis",
        productos: "Análisis geoquímicos, ensayos de minerales, certificación ISO, auditorías",
        provincias_activas: ["Todas"],
        pyme: false, exportadora: false,
    },
    {
        id: "CP009", nombre: "SGS Argentina S.A.", rubro: "Laboratorio y Análisis",
        productos: "Análisis de muestras, ensayos metalúrgicos, certificación, inspección",
        provincias_activas: ["todas"],
        pyme: false, exportadora: false,
    },
    {
        id: "CP010", nombre: "Acme Analytics", rubro: "Laboratorio y Análisis",
        productos: "Análisis geoquímico de rocas, suelos y agua para exploración",
        provincias_activas: ["San Juan", "Catamarca", "Mendoza"],
        pyme: true, exportadora: true,
    },
    // ─── Construcción e Infraestructura ──────────────────────────
    {
        id: "CP011", nombre: "Abans Construcción", rubro: "Construcción e Infraestructura",
        productos: "Obras civiles, movimiento de tierra, plantas de procesamiento",
        provincias_activas: ["San Juan", "Catamarca"],
        pyme: true, exportadora: false,
    },
    {
        id: "CP012", nombre: "Techint / Tenaris", rubro: "Construcción e Infraestructura",
        productos: "Ingeniería, construcción de plantas, tuberías de acero, estructuras",
        provincias_activas: ["San Juan", "Catamarca", "Jujuy"],
        pyme: false, exportadora: true,
    },
    {
        id: "CP013", nombre: "Soreico S.A.", rubro: "Construcción e Infraestructura",
        productos: "Transporte, construcción, obras viales, campamentos mineros",
        provincias_activas: ["San Juan", "La Rioja"],
        pyme: true, exportadora: false,
    },
    // ─── Tecnología y Sistemas ────────────────────────────────────
    {
        id: "CP014", nombre: "Hexagon Mining", rubro: "Tecnología y Sistemas",
        productos: "Software de planificación minera, sistemas de gestión de flota, drones",
        provincias_activas: ["San Juan", "Catamarca", "Santa Cruz"],
        pyme: false, exportadora: false,
    },
    {
        id: "CP015", nombre: "Maptek Argentina", rubro: "Tecnología y Sistemas",
        productos: "Software Vulcan, Block Model, modelado 3D de minas",
        provincias_activas: ["San Juan", "Catamarca", "Mendoza"],
        pyme: false, exportadora: false,
    },
    // ─── Transporte y Logística ───────────────────────────────────
    {
        id: "CP016", nombre: "Acerías 4C S.A.", rubro: "Transporte y Logística",
        productos: "Transporte de carga pesada, camiones articulados, logística de insumos",
        provincias_activas: ["San Juan", "Catamarca", "Salta"],
        pyme: true, exportadora: false,
    },
    {
        id: "CP017", nombre: "DB Schenker Argentina", rubro: "Transporte y Logística",
        productos: "Logística internacional, transporte aéreo / marítimo / terrestre de minerales",
        provincias_activas: ["Todas"],
        pyme: false, exportadora: false,
    },
    // ─── Servicios Ambientales ────────────────────────────────────
    {
        id: "CP018", nombre: "Cicsa (Grupo Techint)", rubro: "Servicios Ambientales",
        productos: "Gestión ambiental, monitoreo de agua y aire, planes de cierre de mina",
        provincias_activas: ["San Juan", "Catamarca", "Santa Cruz"],
        pyme: false, exportadora: false,
    },
    {
        id: "CP019", nombre: "ERM Argentina", rubro: "Servicios Ambientales",
        productos: "Evaluación de impacto ambiental, ESG consulting, due diligence",
        provincias_activas: ["Todos"],
        pyme: false, exportadora: false,
    },
    // ─── Consultoría e Ingeniería ─────────────────────────────────
    {
        id: "CP020", nombre: "SRK Consulting Argentina", rubro: "Consultoría e Ingeniería",
        productos: "Estudios de factibilidad, geotécnica, hidrogeología, informes NI43-101",
        provincias_activas: ["San Juan", "Catamarca", "Jujuy", "Salta"],
        pyme: false, exportadora: true,
    },
    {
        id: "CP021", nombre: "Ausenco Argentina", rubro: "Consultoría e Ingeniería",
        productos: "Ingeniería EPCM, diseño de plantas metalúrgicas, gestión de proyectos",
        provincias_activas: ["San Juan", "Santa Cruz", "Catamarca"],
        pyme: false, exportadora: false,
    },
    // ─── Energía y Utilities ──────────────────────────────────────
    {
        id: "CP022", nombre: "Naturgy (ex Gas Natural Fenosa)", rubro: "Energía",
        productos: "Suministro de gas natural, energía para operaciones mineras",
        provincias_activas: ["Mendoza", "San Juan", "Neuquén"],
        pyme: false, exportadora: false,
    },
    {
        id: "CP023", nombre: "Pro-Energía S.A.", rubro: "Energía Renovable",
        productos: "Generación solar y eólica para campamentos y operaciones remotas",
        provincias_activas: ["Jujuy", "Salta", "Catamarca"],
        pyme: true, exportadora: false,
    },
];

/**
 * Resumen CAPMIN
 */
const CAPMIN_INFO = {
    nombre: "CAPMIN — Cámara Argentina de Proveedores Mineros",
    socios_aprox: 180,
    sede: "Cerrito 1070, Piso 5, CABA",
    contacto: "+54 11 4792 5555",
    web: "https://capmin.com.ar",
    mision: "Fomentar la participación de PyMEs argentinas de alto valor agregado en la cadena de valor minera nacional",
    provincias_representadas: ["San Juan", "Catamarca", "Mendoza", "Jujuy", "Salta", "Santa Cruz", "Chubut", "Neuquén", "La Rioja"],
    pymes_en_directorio_pct: 65,         // estimado
};
