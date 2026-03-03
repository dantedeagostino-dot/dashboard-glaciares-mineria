// api/chat.js - Vercel Serverless Function
// Uses same SDK pattern as Open Arg project (@google/generative-ai)

const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message, context } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured.' });

    const systemInstruction = `Eres ColossusAI, un asistente de inteligencia artificial experto desarrollado por ColossusLab.tech.
Estás integrado en el Dashboard de Glaciares & Minería de Argentina.
Responde siempre en español argentino rioplatense. Sé directo y usa Markdown para estructurar respuestas.

Tu tarea es analizar y responder preguntas basándote DIRECTAMENTE en los datos de las bases de datos que se te proporcionan a continuación. NO digas que "el dashboard no especifica" ni que "necesitaría más información": los datos ESTÁN en este contexto, úsalos.

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
FILTROS ACTIVOS EN EL DASHBOARD:
${context?.filtrosActivos || 'Sin filtros'}
═══════════════════════════════════════════

INSTRUCCIONES:
- Usa los datos anteriores para responder con precisión y números reales.
- Si te preguntan por rankings (más grande, más chico, más cerca), calculá la respuesta desde los datos.
- Si te preguntan por glaciares de una provincia o cuenca específica, filtrá el registro completo.
- Si te preguntan por proyectos de un mineral o etapa, filtrá la lista de proyectos.
- Para preguntas de proximidad (minería cerca de glaciares), razoná con las provincias y cuencas compartidas.
- Para preguntas sobre retracción o cambio climático en glaciares, usá los datos de la Resolución 142/2024.
- Podés hacer análisis combinados (ej: qué glaciares de la cuenca del Río Mendoza tienen proyectos mineros cercanos).`;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction,
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 1500,
            },
        });

        const result = await model.generateContent(message);
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
