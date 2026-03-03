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

    const systemInstruction = `Eres ColossusAI, un asistente de inteligencia artificial experto desarrollado por ColossusLab.tech, especializado en el Dashboard de Glaciares & Minería de Argentina.
Responde siempre en español argentino. Sé conciso y usa Markdown para estructurar respuestas.

CONTEXTO ACTUAL DEL DASHBOARD:
- Filtros Activos: ${context?.filters || 'Ninguno'}
- Estadísticas: ${context?.stats || 'No disponible'}
- Glaciares Visibles: ${context?.glaciersCount ?? 0}
- Proyectos Mineros Visibles: ${context?.miningCount ?? 0}
- Resumen Espacial: ${context?.alertSummary || 'No disponible'}

Responde basándote en el contexto y conocimientos de geografía, minería y glaciología. Si algo escapa al dashboard, indicalo cordialmente.`;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction,
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1024,
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
