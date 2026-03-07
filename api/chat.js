// api/chat.js - Vercel Serverless Function
// ColossusAI — with conversation memory + streaming support
const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async function handler(req, res) {
    const allowedOrigins = [
        'https://www.leydeglaciares.tech',
        'https://leydeglaciares.tech'
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message, context, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured.' });

    const systemInstruction = `Eres ColossusAI, un asistente de inteligencia artificial experto desarrollado por ColossusLab.tech.
Estás integrado en el Dashboard de Glaciares & Minería de Argentina.
Responde siempre en español argentino rioplatense. Sé directo y usa Markdown para estructurar respuestas.

Tu tarea es analizar y responder preguntas basándote DIRECTAMENTE en los datos de las bases de datos que se te proporcionan. NO digas que "el dashboard no especifica" ni que "necesitaría más información": los datos ESTÁN en este contexto, úsalos.

═══════════════════════════════════════════
BASE DE DATOS 1: GLACIARES (ING - IANIGLA/CONICET)
Total nacional: 16.968 geoformas, ~8.484 km² de superficie
═══════════════════════════════════════════

ACTUALIZACIÓN RESOLUCIÓN 142/2024 (NOA — Andes Desérticos):
${context?.retraccionING2024 || 'Resolución 142/2024: −17% hielo descubierto | −23% manchones de nieve perenne en NOA (2008–2023), 22 subcuencas'}
Provincias con datos actualizados: Catamarca, Jujuy, La Rioja, Salta, San Juan, Tucumán

RANKING PROVINCIAL POR SUPERFICIE (km²):
${context?.rankingProvinciasGlaciar || 'No disponible'}

TOP 10 GLACIARES MÁS GRANDES:
${context?.topGlaciares || 'No disponible'}

REGISTRO COMPLETO DE GLACIARES (nombre|provincia|tipo|subtipo|cuenca|superficie|lat|lng):
${context?.todosLosGlaciares || 'No disponible'}

═══════════════════════════════════════════
BASE DE DATOS 2: PROYECTOS MINEROS (SIACAM — Secretaría de Minería)
═══════════════════════════════════════════

RESUMEN POR MINERAL:
${context?.resumenPorMineral || 'No disponible'}

REGISTRO COMPLETO DE PROYECTOS (nombre|empresa|mineral|estado|provincia|lat|lng):
${context?.todosLosProyectos || 'No disponible'}

═══════════════════════════════════════════
MÓDULO LITIO — DATOS ESPECIALIZADOS:
${context?.litioEspecializado || 'Argentina: 2° en reservas globales de litio (20 Mt LCE, 22% mundial). Proyecciones: 120 kt LCE en 2025, 500 kt en 2030, 700 kt en 2035.'}
═══════════════════════════════════════════

═══════════════════════════════════════════
ESG — INDICADORES DE SOSTENIBILIDAD (SIACAM 2023 / EITI / TSM):
18 operaciones principales con datos oficiales SIACAM:
- Pagos fiscales 2023 en USD por empresa (Impuesto a Ganancias, Derechos de Exportación, Seg. Social, Regalías)
- Indicadores ambientales: consumo de agua (m³), energía (MWh), emisiones GEI (tCO2e) por proyecto
- TSM status, empleo directo, porcentaje mujeres
${context?.esgIndicadores || 'TSM adoptado por CAEM en 2016. Veladero: primera mina certificada TSM en Argentina (2023). Pagos fiscales 18 empresas: USD 637M (2023). Inversiones anunciadas desde dic-2019: USD 23.1B.'}
═══════════════════════════════════════════

═══════════════════════════════════════════
CADENA DE SUMINISTROS — DIRECTORIO CAPMIN:
${context?.cadenaSuministros || 'CAPMIN: 180+ empresas proveedoras. ~65% son PyMEs. Rubros: explosivos, equipos, laboratorio, transporte, ambiental, tecnología, energía.'}
═══════════════════════════════════════════

═══════════════════════════════════════════
ANÁLISIS DE PROXIMIDAD ESPACIAL (distancias reales Haversine pre-calculadas):
Radio actual del dashboard: ${context?.filtrosActivos || '25 km'}
Proyectos con glaciares dentro del radio (proyecto|glaciar_cercano|distancia|proximidad|cantidad):
${context?.proximidadReal || 'Sin datos de proximidad'}
═══════════════════════════════════════════

═══════════════════════════════════════════
CUENCAS HIDROGRÁFICAS (cuenca|superficie|geoformas|provincias|glaciares):
${context?.cuencasHidrograficas || 'No disponible'}
═══════════════════════════════════════════

═══════════════════════════════════════════
MARCO LEGAL ARGENTINO:
- Ley 26.639 (Régimen de Presupuestos Mínimos para la Preservación de Glaciares): prohíbe actividades que puedan afectar glaciares y ambiente periglacial, incluyendo exploración y explotación minera.
- Resolución 142/2024: Actualización del Inventario Nacional de Glaciares para los Andes Desérticos (NOA).
- Ley 24.585 (Protección Ambiental para la Actividad Minera): regula el impacto ambiental de la minería.
═══════════════════════════════════════════

═══════════════════════════════════════════
MÉTRICAS DERIVADAS (pre-calculadas):
${context?.metricasDerivadas || 'No disponible'}
═══════════════════════════════════════════

INSTRUCCIONES:
- Usá los datos anteriores para responder con precisión y números reales.
- **USÁS las distancias de proximidad pre-calculadas** cuando te pregunten sobre glaciares cerca de minería. NO adivines distancias.
- **Usá los ÍNDICES DE PROXIMIDAD pre-calculados** para preguntas sobre cercanía a glaciares. Son índices de 0-10 que combinan proximidad, tipo de mineral y etapa del proyecto. No implican evaluación de riesgo ambiental.
- Hacé análisis comparativos y rankings cuando sea útil (tablas Markdown si hay más de 3 items).
- Si tenés historial de conversación, considerá el contexto previo para dar respuestas coherentes.
- Para preguntas de retracción o cambio climático, usá los datos de la Resolución 142/2024.
- Podés hacer análisis combinados (glaciares + minería + ESG + litio + proveedores).
- Para preguntas sobre impuestos, regalías o contribución fiscal, usá los datos SIACAM 2023 por empresa.
- Para preguntas sobre impacto ambiental, usá consumo de agua (m³), energía (MWh) y emisiones GEI (tCO2e) de cada proyecto. Hacé comparaciones entre proyectos.
- Para preguntas sobre ríos o recursos hídricos, usá los datos de CUENCAS HIDROGRÁFICAS.
- Citá la Ley 26.639 y otras normas cuando sea relevante a preguntas legales o de conflicto.
- **GRÁFICOS**: Cuando tu respuesta incluye datos comparativos (≥3 items numéricos), SIEMPRE incluí un bloque de gráfico con este formato exacto:
  [CHART:bar|labels:Item1,Item2,Item3|values:10,20,30|title:Título del gráfico]
  Tipos soportados: bar, pie, doughnut. Usá bar para comparaciones, pie/doughnut para distribuciones porcentuales.
  Poné el bloque [CHART:...] en una línea propia, sin comillas ni backticks.`;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction,
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 8192,
            },
        });

        // Build history in Gemini format (max last 10 turns = 20 messages)
        const geminiHistory = history
            .slice(-20)
            .map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            }));

        // Start chat session with history
        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(message);
        const text = result.response.text();

        return res.status(200).json({ text });

    } catch (error) {
        console.error('Gemini error:', error?.message || error);
        return res.status(500).json({
            error: 'Error al conectar con la IA.',
            detail: error?.message
        });
    }
};
