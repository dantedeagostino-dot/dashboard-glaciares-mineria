// api/chat.js - Vercel Serverless Function
// ColossusAI — with conversation memory + streaming support
const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
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

REGISTRO COMPLETO DE GLACIARES (nombre|provincia|tipo|subtipo|cuenca|superficie):
${context?.todosLosGlaciares || 'No disponible'}

═══════════════════════════════════════════
BASE DE DATOS 2: PROYECTOS MINEROS (SIACAM — Secretaría de Minería)
═══════════════════════════════════════════

RESUMEN POR MINERAL:
${context?.resumenPorMineral || 'No disponible'}

REGISTRO COMPLETO DE PROYECTOS (nombre|empresa|mineral|estado|provincia):
${context?.todosLosProyectos || 'No disponible'}

═══════════════════════════════════════════
MÓDULO LITIO — DATOS ESPECIALIZADOS:
${context?.litioEspecializado || 'Argentina: 2° en reservas globales de litio (20 Mt LCE, 22% mundial). Proyecciones: 120 kt LCE en 2025, 500 kt en 2030, 700 kt en 2035.'}
═══════════════════════════════════════════

═══════════════════════════════════════════
ESG — INDICADORES DE SOSTENIBILIDAD (EITI / TSM / SIPA):
${context?.esgIndicadores || 'TSM adoptado por CAEM en 2016. Veladero: primera mina certificada TSM en Argentina (2023). Empleo directo sectorial: ~27.500 trabajadores. Regalías provinciales estimadas: ~USD 210M/año.'}
═══════════════════════════════════════════

═══════════════════════════════════════════
CADENA DE SUMINISTROS — DIRECTORIO CAPMIN:
${context?.cadenaSuministros || 'CAPMIN: 180+ empresas proveedoras. ~65% son PyMEs. Rubros: explosivos, equipos, laboratorio, transporte, ambiental, tecnología, energía.'}
═══════════════════════════════════════════

═══════════════════════════════════════════
FILTROS ACTIVOS EN EL DASHBOARD:
${context?.filtrosActivos || 'Sin filtros'}
═══════════════════════════════════════════

INSTRUCCIONES:
- Usá los datos anteriores para responder con precisión y números reales.
- Hacé análisis comparativos y rankings cuando sea útil (tablas Markdown si hay más de 3 items).
- Si tenés historial de conversación, considerá el contexto previo para dar respuestas coherentes.
- Para preguntas de retracción o cambio climático, usá los datos de la Resolución 142/2024.
- Podés hacer análisis combinados (glaciares + minería + ESG + litio + proveedores).`;

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
